/**
 * Client for the FastAPI media service (u2net-project).
 *
 * Every tool page goes through here rather than hardcoding a host, so the
 * endpoint is configured once via NUXT_PUBLIC_MEDIA_API_BASE.
 */

export interface UpscaleOptions {
  scale: 2 | 4
  signal?: AbortSignal
  onProgress?: (percent: number) => void
}

export interface TikTokResult {
  success: boolean
  bg_url: string
  circle_img_url: string
  username: string
  caption: string
  MP4: string | null
  MP4_HD: string | null
  MP4_with_Watermark: string | null
}

export interface FacebookFormat {
  format: string
  url: string
  ext?: string
  height?: number | null
  filesize_mb?: number | null
}

export interface FacebookResult {
  page_name: string | null
  title: string
  video_url: string | null
  thumbnail: string | null
  duration?: number | null
  formats: FacebookFormat[]
}

export interface YoutubeVideoOption {
  itag: number
  type: 'video'
  resolution: string
  fps: number
  video_codec: string
  container: string
  filesize_mb: number | string
}

export interface YoutubeAudioOption {
  itag: number
  type: 'audio'
  abr: string
  audio_codec: string
  filesize_mb: number | string
}

export interface YoutubeOptions {
  title: string
  channel_name: string
  thumbnail_url: string
  duration?: number | null
  video_options: YoutubeVideoOption[]
  audio_options: YoutubeAudioOption[]
}

/** Normalises FastAPI / network errors into a readable sentence. */
const toMessage = (error: unknown, fallback: string): string => {
  const payload = (error as { data?: { detail?: string; error?: string } })?.data

  if (payload?.detail) return payload.detail
  if (payload?.error) return payload.error

  const status = (error as { status?: number; statusCode?: number })?.status
    ?? (error as { statusCode?: number })?.statusCode

  if (status === 404) return 'The media service endpoint was not found.'
  if (status === 413) return 'That file is too large to process.'
  if (status === 429) return 'Too many requests. Please wait a moment.'
  if (status && status >= 500) {
    return 'The media service failed while processing your request.'
  }

  if (error instanceof Error && error.name === 'AbortError') {
    return 'Request cancelled.'
  }

  if (error instanceof TypeError) {
    return 'Could not reach the media service. Is it running?'
  }

  return error instanceof Error ? error.message : fallback
}

export const useMediaApi = () => {
  const config = useRuntimeConfig()
  const baseURL = String(config.public.mediaApiBase).replace(/\/+$/, '')

  /**
   * XHR rather than fetch: we need real upload progress, which fetch cannot
   * report. Resolves with the produced image blob.
   */
  const postImage = (
    path: string,
    formData: FormData,
    options: { signal?: AbortSignal; onProgress?: (percent: number) => void } = {},
  ): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open('POST', `${baseURL}${path}`)
      request.responseType = 'blob'

      request.upload.onprogress = (event) => {
        if (!event.lengthComputable || !options.onProgress) return
        options.onProgress(Math.round((event.loaded / event.total) * 100))
      }

      request.onload = async () => {
        if (request.status >= 200 && request.status < 300) {
          const blob = request.response as Blob

          // FastAPI returns JSON (not an image) when the model errors.
          if (blob.type.includes('application/json')) {
            try {
              const parsed = JSON.parse(await blob.text())
              reject(new Error(parsed.error || parsed.detail || 'Processing failed.'))
            } catch {
              reject(new Error('Processing failed.'))
            }
            return
          }

          resolve(blob)
          return
        }

        reject(
          new Error(
            request.status === 413
              ? 'That image is too large to process.'
              : `Processing failed (HTTP ${request.status}).`,
          ),
        )
      }

      request.onerror = () =>
        reject(new Error('Could not reach the media service. Is it running?'))
      request.ontimeout = () => reject(new Error('The request timed out.'))

      options.signal?.addEventListener('abort', () => request.abort())
      request.onabort = () => reject(new Error('Request cancelled.'))

      request.send(formData)
    })

  const removeBackground = (
    file: File,
    options: { signal?: AbortSignal; onProgress?: (p: number) => void } = {},
  ) => {
    const formData = new FormData()
    formData.append('file', file)
    return postImage('/remove-bg/', formData, options)
  }

  const upscaleImage = (file: File, options: UpscaleOptions) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('scale', String(options.scale))
    return postImage('/upscale', formData, options)
  }

  const fetchTikTok = async (url: string, signal?: AbortSignal) => {
    try {
      return await $fetch<TikTokResult>('/tiktok-download', {
        baseURL,
        query: { url },
        signal,
      })
    } catch (error) {
      throw new Error(toMessage(error, 'Could not fetch that TikTok video.'))
    }
  }

  const fetchFacebook = async (url: string, signal?: AbortSignal) => {
    try {
      return await $fetch<FacebookResult>('/facebook-download', {
        baseURL,
        query: { url },
        signal,
      })
    } catch (error) {
      throw new Error(toMessage(error, 'Could not fetch that Facebook video.'))
    }
  }

  const fetchYoutubeOptions = async (url: string, signal?: AbortSignal) => {
    try {
      return await $fetch<YoutubeOptions>('/youtube-download/options', {
        baseURL,
        query: { url },
        signal,
      })
    } catch (error) {
      throw new Error(toMessage(error, 'Could not read that YouTube URL.'))
    }
  }

  /** Direct-download URLs — handed to the browser, never fetched by JS. */
  const youtubeVideoUrl = (url: string, itag: number) =>
    `${baseURL}/youtube-download/download?url=${encodeURIComponent(url)}&itag=${itag}`

  const youtubeAudioUrl = (url: string, itag: number) =>
    `${baseURL}/youtube-download/audio?url=${encodeURIComponent(url)}&itag=${itag}`

  const proxyUrl = (url: string, filename?: string) => {
    const query = new URLSearchParams({ url })
    if (filename) query.set('filename', filename)
    return `${baseURL}/download-proxy?${query.toString()}`
  }

  return {
    baseURL,
    removeBackground,
    upscaleImage,
    fetchTikTok,
    fetchFacebook,
    fetchYoutubeOptions,
    youtubeVideoUrl,
    youtubeAudioUrl,
    proxyUrl,
  }
}
