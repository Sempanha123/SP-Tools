export interface FacebookNuxtFormat {
  format: string
  url: string
  ext?: string
  height?: number | null
  filesize_mb?: number | null
}

export interface FacebookNuxtResult {
  page_name: string | null
  title: string
  video_url: string | null
  thumbnail: string | null
  duration?: number | null
  formats: FacebookNuxtFormat[]
}

const readFacebookNuxtError = (
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

export const useFacebookDownload = () => {
  const fetchFacebook = async (
    url: string,
    signal?: AbortSignal,
  ) => {
    try {
      return await $fetch<FacebookNuxtResult>(
        '/api/facebook-download',
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
        readFacebookNuxtError(
          error,
          'Could not resolve that Facebook video.',
        ),
      )
    }
  }

  const facebookFileUrl = (
    source: string,
    filename: string,
  ) => {
    const query =
      new URLSearchParams({
        source,
        filename,
      })

    return (
      '/api/facebook-download/file?'
      + query.toString()
    )
  }

  return {
    fetchFacebook,
    facebookFileUrl,
  }
}
