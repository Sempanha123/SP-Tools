export interface YoutubeNuxtVideoOption {
  itag: number
  type: 'video'
  resolution: string
  fps: number
  video_codec: string
  container: string
  filesize_mb: number | string
  client: string
}

export interface YoutubeNuxtAudioOption {
  itag: number
  type: 'audio'
  abr: string
  audio_codec: string
  container: string
  filesize_mb: number | string
  client: string
}

export interface YoutubeNuxtOptions {
  video_id: string
  title: string
  channel_name: string
  thumbnail_url: string
  duration?: number | null
  video_options: YoutubeNuxtVideoOption[]
  audio_options: YoutubeNuxtAudioOption[]
}

const readYoutubeNuxtError = (
  error: unknown,
  fallback: string,
) => {
  const payload =
    error as {
      statusMessage?: string
      data?: {
        statusMessage?: string
        message?: string
      }
    }

  return (
    payload?.data?.statusMessage
    || payload?.data?.message
    || payload?.statusMessage
    || (
      error instanceof Error
        ? error.message
        : fallback
    )
  )
}

export const useYouTubeDownload = () => {
  const fetchYoutubeOptions =
    async (
      url: string,
      signal?: AbortSignal,
    ) => {
      try {
        return await $fetch<YoutubeNuxtOptions>(
          '/api/youtube-download/options',
          {
            query: { url },
            signal,
          },
        )
      } catch (error) {
        if (
          error instanceof Error
          && error.name === 'AbortError'
        ) {
          throw error
        }

        throw new Error(
          readYoutubeNuxtError(
            error,
            'Could not read that YouTube URL.',
          ),
        )
      }
    }

  const youtubeFileUrl = (
    videoId: string,
    itag: number,
    kind: 'video' | 'audio',
    client: string,
  ) => {
    const query =
      new URLSearchParams({
        id: videoId,
        itag: String(itag),
        kind,
        client,
      })

    return (
      '/api/youtube-download/file?'
      + query.toString()
    )
  }

  return {
    fetchYoutubeOptions,
    youtubeFileUrl,
  }
}
