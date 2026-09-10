import { Innertube } from 'youtubei.js'

interface YoutubeNuxtVideoOption {
  itag: number
  type: 'video'
  resolution: string
  fps: number
  video_codec: string
  container: string
  filesize_mb: number | string
  client: string
}

interface YoutubeNuxtAudioOption {
  itag: number
  type: 'audio'
  abr: string
  audio_codec: string
  container: string
  filesize_mb: number | string
  client: string
}

interface YoutubeNuxtOptions {
  video_id: string
  title: string
  channel_name: string
  thumbnail_url: string
  duration?: number | null
  video_options: YoutubeNuxtVideoOption[]
  audio_options: YoutubeNuxtAudioOption[]
}

interface CacheEntry {
  expiresAt: number
  value: YoutubeNuxtOptions
}

const CACHE_TTL_MS = 2 * 60 * 1000
const RATE_WINDOW_MS = 60 * 1000
const RATE_LIMIT = 10
const MAX_BYTES = 300 * 1024 * 1024

// YouTube can expose a different set of progressive (video+audio) formats
// depending on the InnerTube client. V34 tries several documented clients.
const CLIENTS = [
  'ANDROID',
  'TV_EMBEDDED',
  'WEB',
] as const

const resultCache =
  new Map<string, CacheEntry>()

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
        'Too many requests. Please wait a moment and try again.',
    })
  }
}

const extractVideoId = (
  input: unknown,
): string => {
  if (
    typeof input !== 'string'
    || !input.trim()
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'A YouTube URL is required.',
    })
  }

  let parsed: URL

  try {
    parsed = new URL(input.trim())
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Enter a valid YouTube URL.',
    })
  }

  const hostname =
    parsed.hostname
      .toLowerCase()
      .replace(/^www\./, '')

  const allowed =
    hostname === 'youtube.com'
    || hostname.endsWith('.youtube.com')
    || hostname === 'youtu.be'
    || hostname === 'youtube-nocookie.com'
    || hostname.endsWith('.youtube-nocookie.com')

  if (!allowed) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'That link is not a YouTube URL.',
    })
  }

  let id = ''

  if (hostname === 'youtu.be') {
    id =
      parsed.pathname
        .split('/')
        .filter(Boolean)[0]
      || ''
  } else {
    id =
      parsed.searchParams.get('v')
      || ''

    if (!id) {
      const parts =
        parsed.pathname
          .split('/')
          .filter(Boolean)

      if (
        [
          'shorts',
          'embed',
          'live',
        ].includes(parts[0] || '')
      ) {
        id = parts[1] || ''
      }
    }
  }

  id =
    id
      .replace(
        /[^A-Za-z0-9_-]/g,
        '',
      )
      .slice(0, 32)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Could not find a YouTube video ID in that URL.',
    })
  }

  return id
}

const contentLength = (
  format: any,
): number => {
  const raw =
    format?.content_length
    ?? format?.contentLength
    ?? 0

  const value =
    Number(raw)

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
      ?? '',
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
    || 'mp4'

  if (
    major === 'audio'
    && container === 'mp4'
  ) {
    container = 'm4a'
  }

  const codecs =
    mime.match(
      /codecs="([^"]+)"/i,
    )?.[1]
    || ''

  return {
    mime,
    container,
    codecs,
  }
}

const thumbnailUrl = (
  basic: any,
): string => {
  const value =
    basic?.thumbnail

  if (Array.isArray(value)) {
    return (
      value[value.length - 1]?.url
      || value[0]?.url
      || ''
    )
  }

  if (
    value
    && Array.isArray(value?.thumbnails)
  ) {
    const list =
      value.thumbnails

    return (
      list[list.length - 1]?.url
      || list[0]?.url
      || ''
    )
  }

  return (
    value?.url
    || ''
  )
}

const sizeMb = (
  bytes: number,
): number | string => {
  if (!bytes) return 0

  return Number(
    (
      bytes
      / 1024
      / 1024
    ).toFixed(2),
  )
}

const heightOf = (
  value: string,
) =>
  Number.parseInt(
    value.replace(/\D+/g, ''),
    10,
  )
  || 0

const bitrateOf = (
  value: string,
) =>
  Number.parseInt(
    value.replace(/\D+/g, ''),
    10,
  )
  || 0

const getInfoForClient = async (
  youtube: Awaited<
    ReturnType<typeof getYoutube>
  >,
  videoId: string,
  client: string,
) => {
  try {
    return await youtube.getBasicInfo(
      videoId,
      {
        client,
      } as any,
    )
  } catch (error) {
    console.warn(
      `[YouTube options] ${client} client failed`,
      error,
    )
    return null
  }
}

export default defineEventHandler(
  async event => {
    enforceRateLimit(event)

    const query =
      getQuery(event)

    const videoId =
      extractVideoId(query.url)

    const cached =
      resultCache.get(videoId)

    if (
      cached
      && Date.now() < cached.expiresAt
    ) {
      return cached.value
    }

    try {
      const youtube =
        await getYoutube()

      const infos: Array<{
        client: string
        info: any
      }> = []

      // Resolve clients in sequence so this stays friendly to a small VPS.
      // Stop early once we have progressive video formats, but always keep
      // the first successful response for metadata/audio.
      for (const client of CLIENTS) {
        const info =
          await getInfoForClient(
            youtube,
            videoId,
            client,
          )

        if (!info) continue

        infos.push({
          client,
          info,
        })

        const formats =
          (info as any)
            .streaming_data
            ?.formats

        if (
          Array.isArray(formats)
          && formats.length
        ) {
          // We already found real video+audio formats. One additional client
          // is unnecessary for normal use.
          break
        }
      }

      if (!infos.length) {
        throw new Error(
          'YouTube did not return video information for this URL.',
        )
      }

      const primary =
        infos[0]!.info

      const status =
        (primary as any)
          .playability_status

      const statusValue =
        String(
          status?.status
          || '',
        )

      if (
        statusValue
        && statusValue !== 'OK'
      ) {
        throw new Error(
          status?.reason
          || 'This YouTube video is not available for download.',
        )
      }

      const videoCandidates:
        YoutubeNuxtVideoOption[] = []

      const audioCandidates:
        YoutubeNuxtAudioOption[] = []

      for (
        const entry
        of infos
      ) {
        const streaming =
          (entry.info as any)
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

        // Only "formats" are used for the Video tab. These are progressive
        // streams where video and audio are already together.
        for (
          const format
          of muxed
        ) {
          const itag =
            Number(format?.itag)

          if (!itag) continue

          const bytes =
            contentLength(format)

          if (
            bytes
            && bytes > MAX_BYTES
          ) {
            continue
          }

          const {
            mime,
            container,
            codecs,
          } = mimeParts(format)

          if (
            !mime
              .toLowerCase()
              .startsWith('video/')
          ) {
            continue
          }

          const resolution =
            String(
              format?.quality_label
              || (
                format?.height
                  ? `${format.height}p`
                  : format?.quality
              )
              || 'Video',
            )

          videoCandidates.push({
            itag,
            type: 'video',
            resolution,
            fps:
              Number(
                format?.fps
                || 0,
              ),
            video_codec:
              codecs
              || 'video+audio',
            container,
            filesize_mb:
              sizeMb(bytes),
            client:
              entry.client,
          })
        }

        for (
          const format
          of adaptive
        ) {
          const {
            mime,
            container,
            codecs,
          } = mimeParts(format)

          if (
            !mime
              .toLowerCase()
              .startsWith('audio/')
          ) {
            continue
          }

          const itag =
            Number(format?.itag)

          if (!itag) continue

          const bytes =
            contentLength(format)

          if (
            bytes
            && bytes > MAX_BYTES
          ) {
            continue
          }

          const bitrate =
            Number(
              format?.average_bitrate
              || format?.bitrate
              || 0,
            )

          const abr =
            bitrate
              ? `${Math.max(
                  1,
                  Math.round(
                    bitrate / 1000,
                  ),
                )} kbps`
              : String(
                  format?.audio_quality
                  || 'Audio',
                )

          audioCandidates.push({
            itag,
            type: 'audio',
            abr,
            audio_codec:
              codecs
              || 'audio',
            container,
            filesize_mb:
              sizeMb(bytes),
            client:
              entry.client,
          })
        }
      }

      // One row per actual resolution. Prefer MP4, then higher FPS.
      const videoByResolution =
        new Map<
          string,
          YoutubeNuxtVideoOption
        >()

      for (
        const option
        of videoCandidates
      ) {
        const key =
          option.resolution
            .toLowerCase()

        const current =
          videoByResolution.get(key)

        const optionScore =
          (
            option.container === 'mp4'
              ? 10000
              : 0
          )
          + option.fps

        const currentScore =
          current
            ? (
                (
                  current.container === 'mp4'
                    ? 10000
                    : 0
                )
                + current.fps
              )
            : -1

        if (
          !current
          || optionScore > currentScore
        ) {
          videoByResolution.set(
            key,
            option,
          )
        }
      }

      const videoOptions =
        [
          ...videoByResolution.values(),
        ].sort(
          (a, b) =>
            heightOf(b.resolution)
            - heightOf(a.resolution)
            || b.fps - a.fps,
        )

      // V33 showed many identical 129 kbps entries. Collapse duplicate
      // bitrate/container combinations.
      const audioByQuality =
        new Map<
          string,
          YoutubeNuxtAudioOption
        >()

      for (
        const option
        of audioCandidates
      ) {
        const key =
          `${option.abr}|${option.container}`

        if (
          !audioByQuality.has(key)
        ) {
          audioByQuality.set(
            key,
            option,
          )
        }
      }

      const audioOptions =
        [
          ...audioByQuality.values(),
        ].sort(
          (a, b) =>
            bitrateOf(b.abr)
            - bitrateOf(a.abr),
        )

      if (
        !videoOptions.length
        && !audioOptions.length
      ) {
        throw new Error(
          'No ready-to-download YouTube streams were found for this video.',
        )
      }

      const basic =
        (primary as any)
          .basic_info
        || {}

      const channel =
        basic?.channel

      const result:
        YoutubeNuxtOptions = {
          video_id: videoId,
          title:
            String(
              basic?.title
              || 'YouTube video',
            ),
          channel_name:
            String(
              channel?.name
              || basic?.author
              || 'YouTube',
            ),
          thumbnail_url:
            thumbnailUrl(basic)
            || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          duration:
            Number(
              basic?.duration
              || 0,
            )
            || null,
          video_options:
            videoOptions,
          audio_options:
            audioOptions,
        }

      resultCache.set(
        videoId,
        {
          expiresAt:
            Date.now()
            + CACHE_TTL_MS,
          value: result,
        },
      )

      if (
        resultCache.size > 200
      ) {
        const firstKey =
          resultCache.keys().next()
            .value as
              | string
              | undefined

        if (firstKey) {
          resultCache.delete(firstKey)
        }
      }

      return result
    } catch (error) {
      console.error(
        '[YouTube options]',
        error,
      )

      throw createError({
        statusCode: 502,
        statusMessage:
          error instanceof Error
            ? error.message
            : 'Could not read that YouTube URL.',
      })
    }
  },
)
