const MAX_ACTIVE_DOWNLOADS = 4
const RATE_WINDOW_MS = 60 * 1000
const RATE_LIMIT = 12
const MAX_BYTES = 250 * 1024 * 1024

let activeDownloads = 0

const rateBuckets =
  new Map<
    string,
    {
      startedAt: number
      count: number
    }
  >()

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
  + 'AppleWebKit/537.36 (KHTML, like Gecko) '
  + 'Chrome/131.0.0.0 Safari/537.36'

const allowedSourceHost = (
  hostname: string,
) => {
  const host =
    hostname
      .toLowerCase()
      .replace(/\.$/, '')

  return (
    host === 'facebook.com'
    || host.endsWith('.facebook.com')
    || host === 'fbcdn.net'
    || host.endsWith('.fbcdn.net')
    || host === 'fbsbx.com'
    || host.endsWith('.fbsbx.com')
    || host === 'fb.com'
    || host.endsWith('.fb.com')
  )
}

const normaliseSourceUrl = (
  input: unknown,
) => {
  if (
    typeof input !== 'string'
    || !input.trim()
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'A Facebook media URL is required.',
    })
  }

  let parsed: URL

  try {
    parsed =
      new URL(input.trim())
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage:
        'The Facebook media URL is invalid.',
    })
  }

  if (
    parsed.protocol !== 'https:'
    || !allowedSourceHost(
      parsed.hostname,
    )
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'That media host is not allowed.',
    })
  }

  parsed.hash = ''

  return parsed.toString()
}

const safeFilename = (
  input: unknown,
) => {
  const value =
    String(
      input || 'facebook-video.mp4',
    )
      .normalize('NFKD')
      .replace(
        /[^\w\s.-]+/g,
        '',
      )
      .trim()
      .replace(
        /\s+/g,
        '-',
      )
      .replace(
        /-+/g,
        '-',
      )
      .slice(0, 100)

  const base =
    value || 'facebook-video.mp4'

  return /\.[a-z0-9]{2,5}$/i
    .test(base)
      ? base
      : `${base}.mp4`
}

const enforceRateLimit = (
  event: Parameters<
    typeof getRequestIP
  >[0],
) => {
  const ip =
    getRequestIP(
      event,
      {
        xForwardedFor: true,
      },
    )
    || 'unknown'

  const now = Date.now()
  const bucket =
    rateBuckets.get(ip)

  if (
    !bucket
    || now - bucket.startedAt
      >= RATE_WINDOW_MS
  ) {
    rateBuckets.set(ip, {
      startedAt: now,
      count: 1,
    })

    return
  }

  bucket.count += 1

  if (
    bucket.count > RATE_LIMIT
  ) {
    throw createError({
      statusCode: 429,
      statusMessage:
        'Too many downloads. Please wait a moment and try again.',
    })
  }

  if (
    rateBuckets.size > 2000
  ) {
    for (
      const [key, value]
      of rateBuckets
    ) {
      if (
        now - value.startedAt
        >= RATE_WINDOW_MS
      ) {
        rateBuckets.delete(key)
      }
    }
  }
}

export default defineEventHandler(
  async event => {
    enforceRateLimit(event)

    if (
      activeDownloads
      >= MAX_ACTIVE_DOWNLOADS
    ) {
      throw createError({
        statusCode: 503,
        statusMessage:
          'The download service is busy. Please try again shortly.',
      })
    }

    const query =
      getQuery(event)

    const source =
      normaliseSourceUrl(
        query.source,
      )

    const filename =
      safeFilename(
        query.filename,
      )

    activeDownloads += 1

    try {
      const controller =
        new AbortController()

      const timeout =
        setTimeout(
          () => controller.abort(),
          25_000,
        )

      let upstream: Response

      try {
        // V33 intentionally uses one normal GET.
        // Download-manager range requests against localhost are not forwarded.
        upstream =
          await fetch(
            source,
            {
              headers: {
                'user-agent':
                  USER_AGENT,
                accept:
                  'video/mp4,video/*;q=0.9,*/*;q=0.8',
                referer:
                  'https://www.facebook.com/',
              },
              redirect:
                'follow',
              signal:
                controller.signal,
            },
          )
      } finally {
        clearTimeout(timeout)
      }

      if (!upstream.ok) {
        throw createError({
          statusCode: 502,
          statusMessage:
            `Facebook media returned HTTP ${upstream.status}.`,
        })
      }

      if (!upstream.body) {
        throw createError({
          statusCode: 502,
          statusMessage:
            'Facebook returned an empty media stream.',
        })
      }

      const upstreamLength =
        Number(
          upstream.headers.get(
            'content-length',
          )
          || 0,
        )

      if (
        upstreamLength
        && upstreamLength
          > MAX_BYTES
      ) {
        try {
          await upstream.body.cancel()
        } catch {
          // No additional action needed.
        }

        throw createError({
          statusCode: 413,
          statusMessage:
            'That Facebook video is too large for this download service.',
        })
      }

      setResponseStatus(
        event,
        200,
      )

      setHeader(
        event,
        'content-type',
        upstream.headers.get(
          'content-type',
        )
        || 'video/mp4',
      )

      if (upstreamLength) {
        setHeader(
          event,
          'content-length',
          String(
            upstreamLength,
          ),
        )
      }

      setHeader(
        event,
        'content-disposition',
        `attachment; filename="${filename}"`,
      )

      setHeader(
        event,
        'cache-control',
        'private, no-store',
      )

      // Do not advertise range support. The page fetches this endpoint once,
      // converts it to a Blob, then starts a browser-native Blob download.
      setHeader(
        event,
        'accept-ranges',
        'none',
      )

      return await sendStream(
        event,
        upstream.body,
      )
    } catch (error) {
      if (
        error instanceof Error
        && error.name
          === 'AbortError'
      ) {
        throw createError({
          statusCode: 504,
          statusMessage:
            'The Facebook download timed out while starting.',
        })
      }

      throw error
    } finally {
      activeDownloads =
        Math.max(
          0,
          activeDownloads - 1,
        )
    }
  },
)
