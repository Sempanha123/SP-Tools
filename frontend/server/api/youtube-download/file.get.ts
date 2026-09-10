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
      Innertube.create({
        retrieve_player: true,
        enable_session_cache: true,
      }).catch(
        error => {
          youtubePromise = null
          throw error
        },
      )
  }

  return youtubePromise
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

const hasResolvableMediaUrl = (
  format: any,
) =>
  Boolean(
    format?.url
    || format?.signature_cipher
    || format?.signatureCipher
    || format?.cipher,
  )

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
    !format?.signature_cipher
    && !format?.signatureCipher
    && !format?.cipher
  ) {
    throw new Error(
      'This YouTube stream does not expose a downloadable URL.',
    )
  }

  if (
    typeof format?.decipher
    === 'function'
  ) {
    const value =
      await format.decipher(
        youtube.session.player,
      )

    if (value) {
      return String(value)
    }
  }

  throw new Error(
    'Could not decipher this YouTube stream URL.',
  )
}

const fetchMedia = async (
  url: string,
) => {
  const controller =
    new AbortController()

  const timeout =
    setTimeout(
      () => controller.abort(),
      25_000,
    )

  try {
    return await fetch(
      url,
      {
        headers: {
          'user-agent':
            'Mozilla/5.0',
          accept:
            '*/*',
          origin:
            'https://www.youtube.com',
          referer:
            'https://www.youtube.com/',
        },
        redirect: 'follow',
        signal:
          controller.signal,
      },
    )
  } finally {
    clearTimeout(timeout)
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

    const videoId =
      cleanVideoId(query.id)

    const itag =
      cleanItag(query.itag)

    const kind =
      query.kind === 'audio'
        ? 'audio'
        : 'video'

    const requestedClient =
      cleanClient(query.client)

    activeDownloads += 1

    try {
      const youtube =
        await getYoutube()

      // The options route stores the client that produced the selected
      // downloadable format. If that response changed between resolve and
      // click, retry compatible clients before failing.
      const clients =
        [
          requestedClient,
          'WEB',
          'TV_EMBEDDED',
          'ANDROID',
        ].filter(
          (
            value,
            index,
            values,
          ) =>
            values.indexOf(value)
            === index,
        )

      let selected:
        {
          info: any
          format: any
          client: string
        }
        | null = null

      for (
        const client
        of clients
      ) {
        try {
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

          const pool =
            kind === 'audio'
              ? (
                  Array.isArray(
                    streaming
                      ?.adaptive_formats,
                  )
                    ? streaming
                        .adaptive_formats
                    : []
                ).filter(
                  (format: any) =>
                    String(
                      format?.mime_type
                      ?? format?.mimeType
                      ?? '',
                    )
                      .toLowerCase()
                      .startsWith(
                        'audio/',
                      ),
                )
              : (
                  Array.isArray(
                    streaming?.formats,
                  )
                    ? streaming.formats
                    : []
                )

          const format =
            pool.find(
              (
                candidate: any,
              ) =>
                Number(
                  candidate?.itag,
                ) === itag
                && hasResolvableMediaUrl(
                  candidate,
                ),
            )

          if (format) {
            selected = {
              info,
              format,
              client,
            }
            break
          }
        } catch (error) {
          console.warn(
            `[YouTube file] ${client} lookup failed`,
            error,
          )
        }
      }

      if (!selected) {
        throw createError({
          statusCode: 404,
          statusMessage:
            'That YouTube stream is no longer available. Refresh the formats and try again.',
        })
      }

      const bytes =
        contentLength(
          selected.format,
        )

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
          selected.format,
          youtube,
        )

      const upstream =
        await fetchMedia(
          streamUrl,
        )

      if (!upstream.ok) {
        throw new Error(
          `YouTube returned HTTP ${upstream.status} for this ${kind} stream.`,
        )
      }

      if (!upstream.body) {
        throw new Error(
          `YouTube returned an empty ${kind} stream.`,
        )
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
          // No additional action required.
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
      } = mimeParts(
        selected.format,
      )

      const basic =
        selected.info?.basic_info
        || {}

      const suffix =
        kind === 'audio'
          ? (
              selected.format
                ?.average_bitrate
              || selected.format
                ?.bitrate
              || 'audio'
            )
          : String(
              selected.format
                ?.quality_label
              || selected.format
                ?.height
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

      if (upstreamLength) {
        setHeader(
          event,
          'content-length',
          String(upstreamLength),
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
        error
        && typeof error === 'object'
        && 'statusCode' in error
      ) {
        throw error
      }

      console.error(
        '[YouTube file]',
        {
          videoId,
          itag,
          kind,
          requestedClient,
          error,
        },
      )

      throw createError({
        statusCode: 502,
        statusMessage:
          error instanceof Error
            ? error.message
            : 'Could not start that YouTube download.',
      })
    } finally {
      activeDownloads =
        Math.max(
          0,
          activeDownloads - 1,
        )
    }
  },
)
