<script setup lang="ts">
const { findTool } = useTools()

const {
  upscaleImageBrowser,
} = useBrowserImageAI()

const tool =
  findTool('image-upscaler')!

useSeoMeta({
  title:
    'AI Image Upscaler — Free Browser 2× / 4× Upscaling | SP-Tools',
  description:
    'Upscale images 2× or 4× with AI and download a sharper, larger result.',
  ogTitle:
    'AI Image Upscaler | SP-Tools',
  ogDescription:
    'Increase image resolution with 2× or 4× AI upscaling.',
})

type Stage =
  | 'idle'
  | 'loading-model'
  | 'processing'
  | 'done'
  | 'error'

const stage = ref<Stage>('idle')
const scale = ref<2 | 4>(2)
const progress = ref(0)
const statusMessage = ref('')
const errorMessage = ref('')
const originalUrl = ref('')
const resultUrl = ref('')
const originalName = ref('')
const elapsedMs = ref(0)

const sourceFile =
  ref<File | null>(null)

const sourceSize =
  ref<{
    width: number
    height: number
  } | null>(null)

const resultSize =
  ref<{
    width: number
    height: number
  } | null>(null)

const resultBytes = ref(0)

let controller:
  AbortController | null = null

let timer:
  ReturnType<typeof setInterval> | null =
    null

const isBusy = computed(
  () =>
    stage.value === 'loading-model'
    || stage.value === 'processing',
)

const revoke = () => {
  if (originalUrl.value) {
    URL.revokeObjectURL(
      originalUrl.value,
    )
  }

  if (resultUrl.value) {
    URL.revokeObjectURL(
      resultUrl.value,
    )
  }
}

const reset = () => {
  controller?.abort()

  if (timer) {
    clearInterval(timer)
  }

  revoke()

  stage.value = 'idle'
  progress.value = 0
  statusMessage.value = ''
  errorMessage.value = ''
  originalUrl.value = ''
  resultUrl.value = ''
  originalName.value = ''
  elapsedMs.value = 0
  sourceFile.value = null
  sourceSize.value = null
  resultSize.value = null
  resultBytes.value = 0
}

onUnmounted(() => {
  controller?.abort()

  if (timer) {
    clearInterval(timer)
  }

  revoke()
})

const measure = (
  url: string,
) =>
  new Promise<{
    width: number
    height: number
  }>((resolve, reject) => {
    const image = new Image()

    image.onload = () =>
      resolve({
        width:
          image.naturalWidth,
        height:
          image.naturalHeight,
      })

    image.onerror = () =>
      reject(
        new Error(
          'Could not read that image.',
        ),
      )

    image.src = url
  })

const validatePixelBudget = (
  size: {
    width: number
    height: number
  } | null,
  requestedScale: 2 | 4,
) => {
  if (!size) return

  const megaPixels =
    (
      size.width
      * size.height
    ) / 1_000_000

  const limit =
    requestedScale === 4
      ? 1.5
      : 4.5

  if (megaPixels > limit) {
    throw new Error(
      requestedScale === 4
        ? `For browser-safe 4× processing, use an image up to about ${limit} MP. This image is ${megaPixels.toFixed(1)} MP. Try 2× instead.`
        : `This image is ${megaPixels.toFixed(1)} MP. For reliable browser processing, use an image up to about ${limit} MP.`,
    )
  }
}

const run = async (
  file: File,
) => {
  controller =
    new AbortController()

  stage.value =
    'loading-model'

  progress.value = 0
  statusMessage.value =
    `Preparing ${scale.value}× browser upscaler…`

  errorMessage.value = ''

  if (resultUrl.value) {
    URL.revokeObjectURL(
      resultUrl.value,
    )

    resultUrl.value = ''
  }

  resultSize.value = null
  resultBytes.value = 0

  try {
    validatePixelBudget(
      sourceSize.value,
      scale.value,
    )
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'That image is too large.'

    stage.value = 'error'
    return
  }

  const startedAt =
    Date.now()

  if (timer) {
    clearInterval(timer)
  }

  timer = setInterval(() => {
    elapsedMs.value =
      Date.now() - startedAt
  }, 100)

  try {
    const result =
      await upscaleImageBrowser(
        file,
        {
          scale:
            scale.value,

          signal:
            controller.signal,

          onProgress: event => {
            stage.value =
              event.phase

            progress.value =
              event.percent

            statusMessage.value =
              event.message
          },
        },
      )

    if (controller.signal.aborted) {
      return
    }

    resultUrl.value =
      URL.createObjectURL(
        result.blob,
      )

    resultBytes.value =
      result.blob.size

    resultSize.value =
      await measure(
        resultUrl.value,
      )

    stage.value = 'done'
  } catch (error) {
    if (
      error instanceof Error
      && error.name === 'AbortError'
    ) {
      return
    }

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Upscaling failed.'

    stage.value = 'error'
  } finally {
    if (timer) {
      clearInterval(timer)
    }

    elapsedMs.value =
      Date.now() - startedAt
  }
}

const process = async (
  file: File,
) => {
  revoke()

  sourceFile.value = file

  originalName.value =
    file.name.replace(
      /\.[^.]+$/,
      '',
    )

  originalUrl.value =
    URL.createObjectURL(file)

  try {
    sourceSize.value =
      await measure(
        originalUrl.value,
      )
  } catch {
    sourceSize.value = null
  }

  await run(file)
}

const changeScale = async (
  next: 2 | 4,
) => {
  if (
    scale.value === next
    || isBusy.value
  ) {
    return
  }

  const previous =
    scale.value

  scale.value = next
  errorMessage.value = ''

  try {
    validatePixelBudget(
      sourceSize.value,
      next,
    )
  } catch (error) {
    scale.value = previous

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'That scale is too large for this image.'

    return
  }

  if (
    sourceFile.value
    && stage.value === 'done'
  ) {
    await run(
      sourceFile.value,
    )
  }
}

const onDropzoneError = (
  problem: string,
) => {
  errorMessage.value = problem
  stage.value = 'error'
}

const download = () => {
  if (!resultUrl.value) return

  const link =
    document.createElement('a')

  link.href =
    resultUrl.value

  link.download =
    `${originalName.value || 'image'}-${scale.value}x.png`

  link.click()
}

const elapsedLabel =
  computed(
    () =>
      `${(
        elapsedMs.value
        / 1000
      ).toFixed(1)}s`,
  )

const sizeLabel = (
  size: {
    width: number
    height: number
  } | null,
) =>
  size
    ? `${size.width} × ${size.height}`
    : '—'

const bytesLabel =
  computed(() => {
    if (!resultBytes.value) {
      return '—'
    }

    const mb =
      resultBytes.value
      / 1024
      / 1024

    return mb >= 1
      ? `${mb.toFixed(1)} MB`
      : `${Math.round(
          resultBytes.value
          / 1024,
        )} KB`
  })

const inputMegapixels =
  computed(() => {
    if (!sourceSize.value) {
      return null
    }

    return (
      sourceSize.value.width
      * sourceSize.value.height
      / 1_000_000
    )
  })

const faqs = [
  {
    question:
      'How much can I enlarge an image?',
    answer:
      'Choose 2× or 4×. 2× is the best default for most images, while 4× produces a larger result and takes longer.',
  },
  {
    question:
      'Why can 4× take longer?',
    answer:
      '4× creates many more pixels than 2×, so larger images need more processing time.',
  },
  {
    question:
      'What image formats are supported?',
    answer:
      'JPG, PNG and WEBP inputs are supported.',
  },
  {
    question:
      'What format do I download?',
    answer:
      'The processed result is downloaded as a high-quality image.',
  },
]
</script>

<template>
  <div>
    <ToolHero
      eyebrow="AI Image Upscaler"
      title="Upscale images in your browser"
      :description="tool.description"
      :features="tool.features"
      :accent="tool.accent"
    />

    <section class="sp-container py-12 sm:py-16">
      <UiAlert
        v-if="errorMessage"
        tone="danger"
        title="Check this image"
        class="mb-6"
      >
        {{ errorMessage }}

        <template #action>
          <UiButton
            size="sm"
            variant="secondary"
            @click="reset"
          >
            Start over
          </UiButton>
        </template>
      </UiAlert>

      <div
        class="mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <span
          class="text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle"
        >
          Scale factor
        </span>

        <div
          class="inline-flex rounded-xl border border-line bg-surface-2 p-1"
          role="group"
          aria-label="Upscale factor"
        >
          <button
            v-for="option in ([2, 4] as const)"
            :key="option"
            type="button"
            class="rounded-lg px-5 py-2 text-sm font-semibold transition-colors"
            :class="
              scale === option
                ? 'bg-accent text-accent-fg shadow-glow'
                : 'text-fg-muted hover:text-fg'
            "
            :disabled="isBusy"
            :aria-pressed="
              scale === option
            "
            @click="
              changeScale(option)
            "
          >
            {{ option }}×
          </button>
        </div>
      </div>

      <div
        v-if="
          stage === 'idle'
          || stage === 'error'
        "
      >
        <ToolDropzone
          hint="JPG, PNG or WEBP · processed in your browser"
          :max-size-mb="10"
          @file="process"
          @error="onDropzoneError"
        />

        <div class="mx-auto mt-5 max-w-2xl rounded-[14px] border border-line bg-surface-2 px-4 py-3 text-center">
          <p class="text-[10px] font-semibold leading-5 text-fg-muted">
            2× is recommended for most images. 4× works best with smaller source images.
          </p>
        </div>
      </div>

      <div
        v-else-if="isBusy"
        class="sp-panel px-6 py-14 text-center"
      >
        <div
          class="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-accent border-t-transparent"
        />

        <p
          class="mt-6 text-base font-semibold text-fg"
        >
          {{
            stage === 'loading-model'
              ? `Preparing ${scale}× upscaler…`
              : `Upscaling to ${scale}×…`
          }}
        </p>

        <p
          class="mx-auto mt-1.5 max-w-lg text-sm text-fg-muted"
        >
          {{ statusMessage }}
        </p>

        <div
          class="mx-auto mt-6 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-surface-3"
        >
          <div
            class="h-full rounded-full bg-accent transition-[width] duration-200"
            :style="{
              width: `${Math.max(
                3,
                progress,
              )}%`,
            }"
          />
        </div>

        <p
          class="mx-auto mt-4 max-w-md text-[10px] leading-5 text-fg-subtle"
        >
          {{
            scale === 4
              ? '4× can take longer on larger images.'
              : 'Please keep this tab open while your image is processed.'
          }}
        </p>

        <UiButton
          variant="ghost"
          size="sm"
          class="mt-5"
          @click="reset"
        >
          Cancel
        </UiButton>
      </div>

      <div
        v-else-if="stage === 'done'"
        class="grid gap-6 lg:grid-cols-[1.6fr_1fr]"
      >
        <ToolCompareSlider
          :before="originalUrl"
          :after="resultUrl"
          before-label="Original"
          :after-label="`${scale}× upscaled`"
        />

        <div
          class="sp-card flex flex-col p-6"
        >
          <UiBadge
            tone="positive"
            dot
          >
            Done in {{ elapsedLabel }}
          </UiBadge>

          <h2
            class="mt-4 font-display text-2xl font-bold text-fg"
          >
            Upscaled {{ scale }}×
          </h2>

          <p
            class="mt-2 text-sm leading-6 text-fg-muted"
          >
            Your upscaled image is ready to compare and download.
          </p>

          <div class="mt-6 space-y-2.5">
            <UiButton
              block
              @click="download"
            >
              Download upscaled image
            </UiButton>

            <UiButton
              variant="secondary"
              block
              @click="
                changeScale(
                  scale === 2
                    ? 4
                    : 2,
                )
              "
            >
              Try
              {{
                scale === 2
                  ? '4'
                  : '2'
              }}× instead
            </UiButton>

            <UiButton
              variant="ghost"
              block
              @click="reset"
            >
              Upscale another image
            </UiButton>
          </div>

          <dl
            class="mt-6 space-y-2 border-t border-line pt-5 text-xs"
          >
            <div
              class="flex justify-between gap-4"
            >
              <dt class="text-fg-subtle">
                Original
              </dt>

              <dd
                class="font-semibold text-fg"
              >
                {{ sizeLabel(sourceSize) }}
              </dd>
            </div>

            <div
              class="flex justify-between gap-4"
            >
              <dt class="text-fg-subtle">
                Input size
              </dt>

              <dd
                class="font-semibold text-fg"
              >
                {{
                  inputMegapixels
                    ? `${inputMegapixels.toFixed(2)} MP`
                    : '—'
                }}
              </dd>
            </div>

            <div
              class="flex justify-between gap-4"
            >
              <dt class="text-fg-subtle">
                Upscaled
              </dt>

              <dd
                class="font-semibold text-accent"
              >
                {{ sizeLabel(resultSize) }}
              </dd>
            </div>

            <div
              class="flex justify-between gap-4"
            >
              <dt class="text-fg-subtle">
                File size
              </dt>

              <dd
                class="font-semibold text-fg"
              >
                {{ bytesLabel }}
              </dd>
            </div>

          </dl>
        </div>
      </div>
    </section>

    <ToolFaq :items="faqs" />
    <ToolRelatedTools exclude="image-upscaler" />
  </div>
</template>
