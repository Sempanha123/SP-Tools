export interface TikTokNuxtResult {
  success: boolean
  bg_url: string
  circle_img_url: string
  username: string
  caption: string
  MP4: string | null
  MP4_HD: string | null
  MP4_with_Watermark: string | null
}

const readTikTokNuxtError = (
  error: unknown,
): string => {
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
        : ''
    )
    || 'Could not resolve that TikTok video.'
  )
}

export const useTikTokDownload = () => {
  const fetchTikTok = async (
    url: string,
    signal?: AbortSignal,
  ) => {
    try {
      return await $fetch<TikTokNuxtResult>(
        '/api/tiktok-download',
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
        readTikTokNuxtError(error),
      )
    }
  }

  return {
    fetchTikTok,
  }
}
