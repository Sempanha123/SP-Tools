import { Innertube } from 'youtubei.js'

const MAX_BYTES =
  220 * 1024 * 1024

const MAX_ACTIVE_DOWNLOADS = 4
const RATE_WINDOW_MS = 60 * 1000
const RATE_LIMIT = 8

const ALLOWED_CLIENTS =
  new Set([
    'ANDROID',
    'TV_EMBEDDED',
    'WEB',
  ])

let activeDownloads = 0

const rateBuckets =
  new Map<
    string,
    {
      startedAt: number
      count: number
    }
  >()

let youtubePromise:
  ReturnType<typeof Innertube.create>
  | null = null

const getYoutube = () => {
  if (!youtubePromise) {
    youtubePromise =
      Innertube.create().catch(
        error => {
          youtubePromise = null
          throw error
        },
      )
  }

  return youtubePromise
}

const enforceRateLimit = (
  event: Parameters<typeof getRequestIP>[0],
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

  if (bucket.count > RATE_LIMIT) {
    throw createError({
      statusCode: 429,
      statusMessage:
        'Too many downloads. Please wait a moment and try again.',
    })
  }
}

const cleanVideoId = (
  input: unknown,
) => {
  const id =
    String(input || '')
      .replace(
        /[^A-Za-z0-9_-]/g,
        '',
      )
      .slice(0, 32)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'A YouTube video ID is required.',
    })
  }

  return id
}

const cleanItag = (
  input: unknown,
) => {
  const value =
    Number.parseInt(
      String(input || ''),
      10,
    )

  if (
    !Number.isFinite(value)
    || value <= 0
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'A valid YouTube stream ID is required.',
    })
  }

  return value
}

const cleanClient = (
  input: unknown,
) => {
  const client =
    String(
      input || 'WEB',
    ).toUpperCase()

  return ALLOWED_CLIENTS.has(client)
    ? client
    : 'WEB'
}

const contentLength = (
  format: any,
): number => {
  const value =
    Number(
      format?.content_length
      ?? format?.contentLength
      ?? 0,
    )

  return Number.isFinite(value)
    ? value
    : 0
}

const mimeParts = (
  format: any,
) => {
  const mime =
    String(
      format?.mime_type
      ?? format?.mimeType
      ?? 'application/octet-stream',
    )

  const media =
    mime.match(
      /^([a-z]+)\/([a-z0-9.+-]+)/i,
    )

  const major =
    media?.[1]?.toLowerCase()
    || ''

  let container =
    media?.[2]?.toLowerCase()
    || 'bin'

  if (
    major === 'audio'
    && container === 'mp4'
  ) {
    container = 'm4a'
  }

  return {
    mime:
      mime.split(';')[0]
      || 'application/octet-stream',
    container,
  }
}

const safeFilename = (
  value: string,
) => {
  const clean =
    value
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
      .slice(0, 80)

  return clean || 'youtube'
}

const resolveFormatUrl = async (
  format: any,
  youtube: Awaited<
    ReturnType<typeof getYoutube>
  >,
) => {
  if (format?.url) {
    return String(format.url)
  }

  if (
    typeof format?.decipher
    === 'function'
  ) {
    return String(
      await format.decipher(
        youtube.session.player,
      ),
    )
  }

  throw new Error(
    'Could not resolve this YouTube stream.',
  )
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

    const videoId =
      cleanVideoId(query.id)

    const itag =
      cleanItag(query.itag)

    const kind =
      query.kind === 'audio'
        ? 'audio'
        : 'video'

    const client =
      cleanClient(query.client)

    activeDownloads += 1

    try {
      const youtube =
        await getYoutube()

      // Use the same InnerTube client that produced the option.
      const info =
        await youtube.getBasicInfo(
          videoId,
          {
            client,
          } as any,
        )

      const streaming =
        (info as any)
          .streaming_data

      const muxed =
        Array.isArray(
          streaming?.formats,
        )
          ? streaming.formats
          : []

      const adaptive =
        Array.isArray(
          streaming?.adaptive_formats,
        )
          ? streaming.adaptive_formats
          : []

      const allowed =
        kind === 'audio'
          ? adaptive.filter(
              (format: any) =>
                String(
                  format?.mime_type
                  ?? format?.mimeType
                  ?? '',
                )
                  .toLowerCase()
                  .startsWith('audio/'),
            )
          : muxed

      const format =
        allowed.find(
          (candidate: any) =>
            Number(candidate?.itag)
            === itag,
        )

      if (!format) {
        throw createError({
          statusCode: 404,
          statusMessage:
            'That YouTube stream is no longer available. Refresh the options and try again.',
        })
      }

      const bytes =
        contentLength(format)

      if (
        bytes
        && bytes > MAX_BYTES
      ) {
        throw createError({
          statusCode: 413,
          statusMessage:
            'That stream is too large for this download service.',
        })
      }

      const streamUrl =
        await resolveFormatUrl(
          format,
          youtube,
        )

      const controller =
        new AbortController()

      const timeout =
        setTimeout(
          () => controller.abort(),
          20_000,
        )

      let upstream: Response

      try {
        upstream =
          await fetch(
            streamUrl,
            {
              headers: {
                'user-agent':
                  'Mozilla/5.0',
              },
              redirect: 'follow',
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
            `YouTube returned HTTP ${upstream.status} for this stream.`,
        })
      }

      if (!upstream.body) {
        throw createError({
          statusCode: 502,
          statusMessage:
            'YouTube returned an empty stream.',
        })
      }

      const upstreamLength =
        Number(
          upstream.headers.get(
            'content-length',
          )
          || 0,
        )

      const contentRangeHeader =
        upstream.headers.get(
          'content-range',
        )

      const totalFromRange =
        Number(
          contentRangeHeader
            ?.match(
              /\/(\d+)$/,
            )?.[1]
          || 0,
        )

      const effectiveBytes =
        totalFromRange
        || upstreamLength
        || bytes

      if (
        effectiveBytes
        && effectiveBytes > MAX_BYTES
      ) {
        try {
          await upstream.body.cancel()
        } catch {
          // Nothing else to do.
        }

        throw createError({
          statusCode: 413,
          statusMessage:
            'That stream is too large for this download service.',
        })
      }

      const {
        mime,
        container,
      } = mimeParts(format)

      const basic =
        (info as any)
          .basic_info
        || {}

      const suffix =
        kind === 'audio'
          ? 'audio'
          : String(
              format?.quality_label
              || format?.height
              || itag,
            )
              .replace(
                /[^A-Za-z0-9_-]/g,
                '',
              )

      const filename =
        `${safeFilename(
          String(
            basic?.title
            || 'youtube',
          ),
        )}-${suffix}.${container}`

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
        || mime,
      )

      const contentLengthHeader =
        upstream.headers.get(
          'content-length',
        )

      if (contentLengthHeader) {
        setHeader(
          event,
          'content-length',
          contentLengthHeader,
        )
      }

      setHeader(
        event,
        'accept-ranges',
        'none',
      )


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

      return await sendStream(
        event,
        upstream.body,
      )
    } finally {
      activeDownloads =
        Math.max(
          0,
          activeDownloads - 1,
        )
    }
  },
)
