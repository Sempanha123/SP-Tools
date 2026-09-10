/**
 * SP-Tools V27 — browser-side image AI.
 *
 * Heavy AI inference runs in the visitor's browser, not on the SP-Tools VPS.
 * Nothing in this file sends the selected image to the SP-Tools backend.
 *
 * Background removal:
 *   Transformers.js + onnx-community/ormbg-ONNX
 *   WebGPU + fp16 when available, otherwise WASM + q8.
 *
 * Upscaling:
 *   UpscalerJS + @upscalerjs/esrgan-slim 2x / 4x.
 *
 * All heavy libraries are dynamically imported only after the user chooses
 * an image, so normal SSR/page rendering stays lightweight.
 */

export type BrowserAiPhase =
  | 'loading-model'
  | 'processing'

export type BrowserAiBackend =
  | 'webgpu'
  | 'wasm'
  | 'browser-ai'

export interface BrowserAiProgress {
  phase: BrowserAiPhase
  percent: number
  message: string
}

export interface BrowserBackgroundResult {
  blob: Blob
  backend: 'webgpu' | 'wasm'
  model: string
}

export interface BrowserUpscaleResult {
  blob: Blob
  backend: 'browser-ai'
  model: string
}

export interface BrowserBackgroundOptions {
  signal?: AbortSignal
  onProgress?: (event: BrowserAiProgress) => void
}

export interface BrowserUpscaleOptions {
  scale: 2 | 4
  signal?: AbortSignal
  onProgress?: (event: BrowserAiProgress) => void
}

interface BackgroundRuntime {
  pipe: any
  backend: 'webgpu' | 'wasm'
}

const BACKGROUND_MODEL =
  'onnx-community/ormbg-ONNX'

const UPSCALER_MODEL =
  '@upscalerjs/esrgan-slim'

let backgroundRuntimePromise:
  Promise<BackgroundRuntime> | null = null

const backgroundProgressListeners =
  new Set<(percent: number) => void>()

const upscalerPromises =
  new Map<2 | 4, Promise<any>>()

const abortError = () =>
  new DOMException(
    'Processing cancelled.',
    'AbortError',
  )

const throwIfAborted = (
  signal?: AbortSignal,
) => {
  if (signal?.aborted) {
    throw abortError()
  }
}

const emitBackgroundModelProgress = (
  percent: number,
) => {
  const value = Math.max(
    0,
    Math.min(100, Math.round(percent)),
  )

  backgroundProgressListeners.forEach(
    listener => listener(value),
  )
}

const browserHasWebGpu = (): boolean => {
  if (
    typeof navigator === 'undefined'
    || typeof window === 'undefined'
  ) {
    return false
  }

  const candidate =
    navigator as Navigator & {
      gpu?: unknown
    }

  return Boolean(
    candidate.gpu
    && window.isSecureContext,
  )
}

const parseModelProgress = (
  info: any,
): number | null => {
  if (
    info?.status === 'progress_total'
    && typeof info.progress === 'number'
  ) {
    return info.progress
  }

  if (
    info?.status === 'progress'
    && typeof info.progress === 'number'
  ) {
    return info.progress
  }

  if (info?.status === 'ready') {
    return 100
  }

  return null
}

const createBackgroundRuntime =
  async (): Promise<BackgroundRuntime> => {
    if (!import.meta.client) {
      throw new Error(
        'Browser AI can only run in the browser.',
      )
    }

    const {
      pipeline,
    } = await import(
      '@huggingface/transformers'
    )

    const progress_callback = (
      info: any,
    ) => {
      const percent =
        parseModelProgress(info)

      if (percent !== null) {
        emitBackgroundModelProgress(
          percent,
        )
      }
    }

    if (browserHasWebGpu()) {
      try {
        const pipe = await pipeline(
          'background-removal',
          BACKGROUND_MODEL,
          {
            device: 'webgpu',
            dtype: 'fp16',
            progress_callback,
          } as any,
        )

        return {
          pipe,
          backend: 'webgpu',
        }
      } catch (error) {
        console.warn(
          '[SP-Tools V27] WebGPU background model failed; falling back to WASM.',
          error,
        )
      }
    }

    const pipe = await pipeline(
      'background-removal',
      BACKGROUND_MODEL,
      {
        dtype: 'q8',
        progress_callback,
      } as any,
    )

    return {
      pipe,
      backend: 'wasm',
    }
  }

const getBackgroundRuntime =
  async (
    onProgress?: (
      event: BrowserAiProgress,
    ) => void,
  ): Promise<BackgroundRuntime> => {
    const listener = (percent: number) => {
      onProgress?.({
        phase: 'loading-model',
        percent,
        message:
          percent < 100
            ? 'Loading the AI model into your browser…'
            : 'AI model ready.',
      })
    }

    backgroundProgressListeners.add(
      listener,
    )

    try {
      onProgress?.({
        phase: 'loading-model',
        percent: 1,
        message:
          'Preparing the background-removal model…',
      })

      if (!backgroundRuntimePromise) {
        backgroundRuntimePromise =
          createBackgroundRuntime().catch(
            error => {
              backgroundRuntimePromise =
                null
              throw error
            },
          )
      }

      const runtime =
        await backgroundRuntimePromise

      onProgress?.({
        phase: 'loading-model',
        percent: 100,
        message: 'AI model ready.',
      })

      return runtime
    } finally {
      backgroundProgressListeners.delete(
        listener,
      )
    }
  }

const createUpscaler = async (
  scale: 2 | 4,
) => {
  if (!import.meta.client) {
    throw new Error(
      'Browser AI can only run in the browser.',
    )
  }

  const [
    upscalerModule,
    modelModule,
  ] = await Promise.all([
    import('upscaler'),
    scale === 2
      ? import(
          '@upscalerjs/esrgan-slim/2x'
        )
      : import(
          '@upscalerjs/esrgan-slim/4x'
        ),
  ])

  const Upscaler =
    upscalerModule.default

  const model =
    modelModule.default

  return new Upscaler({
    model,
    warmupSizes: {
      patchSize: 64,
    },
  })
}

const getUpscaler = async (
  scale: 2 | 4,
) => {
  let promise =
    upscalerPromises.get(scale)

  if (!promise) {
    promise =
      createUpscaler(scale).catch(
        error => {
          upscalerPromises.delete(scale)
          throw error
        },
      )

    upscalerPromises.set(
      scale,
      promise,
    )
  }

  return await promise
}

const dataUrlToBlob = async (
  dataUrl: string,
): Promise<Blob> => {
  const response = await fetch(dataUrl)

  if (!response.ok) {
    throw new Error(
      'Could not create the processed image.',
    )
  }

  return await response.blob()
}

const normaliseError = (
  error: unknown,
  fallback: string,
): Error => {
  if (
    error instanceof DOMException
    && error.name === 'AbortError'
  ) {
    return error
  }

  if (
    error instanceof Error
    && error.name === 'AbortError'
  ) {
    return error
  }

  if (error instanceof Error) {
    const message =
      error.message.toLowerCase()

    if (
      message.includes('memory')
      || message.includes(
        'allocation'
      )
      || message.includes('tensor')
    ) {
      return new Error(
        'This image is too large for the available browser memory. Try 2× or use a smaller image.',
      )
    }

    return error
  }

  return new Error(fallback)
}

export const useBrowserImageAI = () => {
  const removeBackgroundBrowser =
    async (
      file: File,
      options:
        BrowserBackgroundOptions = {},
    ): Promise<BrowserBackgroundResult> => {
      if (!import.meta.client) {
        throw new Error(
          'Background removal must run in the browser.',
        )
      }

      throwIfAborted(options.signal)

      try {
        const runtime =
          await getBackgroundRuntime(
            options.onProgress,
          )

        throwIfAborted(options.signal)

        options.onProgress?.({
          phase: 'processing',
          percent: 0,
          message:
            'Removing the background on this device…',
        })

        const sourceUrl =
          URL.createObjectURL(file)

        try {
          const output =
            await runtime.pipe(
              sourceUrl,
            )

          throwIfAborted(
            options.signal,
          )

          const image =
            Array.isArray(output)
              ? output[0]
              : output

          if (
            !image
            || typeof image.toBlob
              !== 'function'
          ) {
            throw new Error(
              'The background model returned an unsupported result.',
            )
          }

          options.onProgress?.({
            phase: 'processing',
            percent: 92,
            message:
              'Encoding transparent PNG…',
          })

          const blob =
            await image.toBlob()

          throwIfAborted(
            options.signal,
          )

          options.onProgress?.({
            phase: 'processing',
            percent: 100,
            message: 'Done.',
          })

          return {
            blob:
              blob.type === 'image/png'
                ? blob
                : new Blob(
                    [await blob.arrayBuffer()],
                    {
                      type: 'image/png',
                    },
                  ),
            backend:
              runtime.backend,
            model: BACKGROUND_MODEL,
          }
        } finally {
          URL.revokeObjectURL(
            sourceUrl,
          )
        }
      } catch (error) {
        throw normaliseError(
          error,
          'Background removal failed in this browser.',
        )
      }
    }

  const upscaleImageBrowser =
    async (
      file: File,
      options: BrowserUpscaleOptions,
    ): Promise<BrowserUpscaleResult> => {
      if (!import.meta.client) {
        throw new Error(
          'Upscaling must run in the browser.',
        )
      }

      throwIfAborted(options.signal)

      try {
        options.onProgress?.({
          phase: 'loading-model',
          percent: 5,
          message: `Loading the ${options.scale}× upscaler…`,
        })

        const upscaler =
          await getUpscaler(
            options.scale,
          )

        throwIfAborted(
          options.signal,
        )

        options.onProgress?.({
          phase: 'loading-model',
          percent: 100,
          message: `${options.scale}× model ready.`,
        })

        options.onProgress?.({
          phase: 'processing',
          percent: 0,
          message: `Upscaling to ${options.scale}× on this device…`,
        })

        const sourceUrl =
          URL.createObjectURL(file)

        try {
          const output =
            await upscaler.upscale(
              sourceUrl,
              {
                patchSize: 64,
                progress: (
                  fraction: number,
                ) => {
                  throwIfAborted(
                    options.signal,
                  )

                  options.onProgress?.({
                    phase:
                      'processing',
                    percent: Math.round(
                      Math.max(
                        0,
                        Math.min(
                          1,
                          fraction,
                        ),
                      ) * 100,
                    ),
                    message:
                      `Upscaling to ${options.scale}× on this device…`,
                  })
                },
              },
            )

          throwIfAborted(
            options.signal,
          )

          if (
            typeof output !== 'string'
          ) {
            throw new Error(
              'The upscaler returned an unsupported result.',
            )
          }

          options.onProgress?.({
            phase: 'processing',
            percent: 98,
            message:
              'Encoding the upscaled image…',
          })

          const blob =
            await dataUrlToBlob(
              output,
            )

          throwIfAborted(
            options.signal,
          )

          options.onProgress?.({
            phase: 'processing',
            percent: 100,
            message: 'Done.',
          })

          return {
            blob,
            backend: 'browser-ai',
            model:
              `${UPSCALER_MODEL}/${options.scale}x`,
          }
        } finally {
          URL.revokeObjectURL(
            sourceUrl,
          )
        }
      } catch (error) {
        throw normaliseError(
          error,
          'Upscaling failed in this browser.',
        )
      }
    }

  const capabilities = computed(() => ({
    webgpu:
      import.meta.client
      && browserHasWebGpu(),
    secureContext:
      import.meta.client
      && window.isSecureContext,
  }))

  return {
    capabilities,
    removeBackgroundBrowser,
    upscaleImageBrowser,
  }
}
