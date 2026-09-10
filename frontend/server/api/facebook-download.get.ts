import { load } from 'cheerio'

interface FacebookNuxtFormat {
  format: string
  url: string
  ext?: string
  height?: number | null
  filesize_mb?: number | null
}

interface FacebookNuxtResult {
  page_name: string | null
  title: string
  video_url: string | null
  thumbnail: string | null
  duration?: number | null
  formats: FacebookNuxtFormat[]
}

interface CacheEntry {
  expiresAt: number
  value: FacebookNuxtResult
}

const CACHE_TTL_MS = 3 * 60 * 1000
const RATE_WINDOW_MS = 60 * 1000
const RATE_LIMIT = 10

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

const DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
  + 'AppleWebKit/537.36 (KHTML, like Gecko) '
  + 'Chrome/131.0.0.0 Safari/537.36'

const MOBILE_UA =
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) '
  + 'AppleWebKit/537.36 (KHTML, like Gecko) '
  + 'Chrome/131.0.0.0 Mobile Safari/537.36'

const normaliseFacebookUrl = (
  input: unknown,
): string => {
  if (
    typeof input !== 'string'
    || !input.trim()
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'A Facebook URL is required.',
    })
  }

  let parsed: URL

  try {
    parsed = new URL(input.trim())
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Enter a valid Facebook URL.',
    })
  }

  if (
    parsed.protocol !== 'https:'
    && parsed.protocol !== 'http:'
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Only HTTP or HTTPS Facebook links are supported.',
    })
  }

  const hostname =
    parsed.hostname
      .toLowerCase()
      .replace(/\.$/, '')

  const allowed =
    hostname === 'facebook.com'
    || hostname.endsWith('.facebook.com')
    || hostname === 'fb.watch'
    || hostname === 'fb.com'
    || hostname.endsWith('.fb.com')

  if (!allowed) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'That link is not a Facebook URL.',
    })
  }

  parsed.protocol = 'https:'
  parsed.hash = ''

  return parsed.toString()
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

const cachedResult = (
  url: string,
): FacebookNuxtResult | null => {
  const entry =
    resultCache.get(url)

  if (!entry) return null

  if (Date.now() >= entry.expiresAt) {
    resultCache.delete(url)
    return null
  }

  return entry.value
}

const cacheResult = (
  url: string,
  value: FacebookNuxtResult,
) => {
  resultCache.set(url, {
    expiresAt:
      Date.now() + CACHE_TTL_MS,
    value,
  })

  if (resultCache.size > 200) {
    const firstKey =
      resultCache.keys().next()
        .value as
          | string
          | undefined

    if (firstKey) {
      resultCache.delete(firstKey)
    }
  }
}

const withFacebookHost = (
  input: string,
  hostname: string,
) => {
  const url =
    new URL(input)

  url.protocol = 'https:'
  url.hostname = hostname

  // web/www/mobile do not use the explicit ports users sometimes copy.
  url.port = ''

  return url.toString()
}

const candidateUrls = (
  original: string,
) => {
  const parsed =
    new URL(original)

  const host =
    parsed.hostname
      .toLowerCase()

  const candidates: string[] = []

  const add = (
    value: string,
  ) => {
    if (
      !candidates.includes(value)
    ) {
      candidates.push(value)
    }
  }

  // fb.watch is a short link. Let it resolve first.
  if (host === 'fb.watch') {
    add(original)
  }

  // Share/Reel URLs often behave better on web.facebook.com for
  // anonymous server-side requests, so try that before giving up.
  if (
    host.includes('facebook.com')
    || host === 'fb.com'
    || host.endsWith('.fb.com')
  ) {
    add(
      withFacebookHost(
        original,
        'web.facebook.com',
      ),
    )

    add(
      withFacebookHost(
        original,
        'www.facebook.com',
      ),
    )

    add(
      withFacebookHost(
        original,
        'm.facebook.com',
      ),
    )

    add(
      withFacebookHost(
        original,
        'mbasic.facebook.com',
      ),
    )
  }

  add(original)

  return candidates
}

const fetchAttempt = async (
  url: string,
  userAgent: string,
  timeoutMs = 15_000,
) => {
  const controller =
    new AbortController()

  const timeout =
    setTimeout(
      () => controller.abort(),
      timeoutMs,
    )

  try {
    return await fetch(
      url,
      {
        headers: {
          'user-agent':
            userAgent,
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'accept-language':
            'en-US,en;q=0.9',
          'cache-control':
            'no-cache',
          pragma:
            'no-cache',
          'upgrade-insecure-requests':
            '1',
          'sec-fetch-dest':
            'document',
          'sec-fetch-mode':
            'navigate',
          'sec-fetch-site':
            'none',
          'sec-fetch-user':
            '?1',
          cookie:
            'locale=en_US',
          referer:
            'https://www.facebook.com/',
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

const decodeJsonString = (
  raw: string,
): string => {
  try {
    return JSON.parse(
      `"${raw}"`,
    )
  } catch {
    return raw
      .replace(/\\\//g, '/')
      .replace(/\\u0025/gi, '%')
      .replace(/\\u0026/gi, '&')
      .replace(/\\u003a/gi, ':')
      .replace(/\\u003d/gi, '=')
      .replace(/&amp;/gi, '&')
  }
}

const normaliseMediaUrl = (
  raw: string,
): string => {
  const decoded =
    decodeJsonString(raw)
      .replace(/&amp;/gi, '&')
      .trim()

  try {
    const parsed =
      new URL(decoded)

    if (
      parsed.protocol !== 'https:'
      && parsed.protocol !== 'http:'
    ) {
      return ''
    }

    return parsed.toString()
  } catch {
    return ''
  }
}

const firstMeta = (
  $: ReturnType<typeof load>,
  selectors: string[],
): string => {
  for (const selector of selectors) {
    const value =
      $(selector)
        .first()
        .attr('content')
        ?.trim()

    if (value) return value
  }

  return ''
}

const collectJsonUrls = (
  html: string,
  keys: string[],
) => {
  const out: Array<{
    key: string
    url: string
  }> = []

  for (const key of keys) {
    const quoted =
      new RegExp(
        `"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`,
        'gi',
      )

    for (
      const match
      of html.matchAll(quoted)
    ) {
      const url =
        normaliseMediaUrl(
          match[1] || '',
        )

      if (url) {
        out.push({
          key,
          url,
        })
      }
    }
  }

  return out
}

const pageNameFromTitle = (
  title: string,
): string | null => {
  const clean =
    title
      .replace(
        /\s*\|\s*Facebook\s*$/i,
        '',
      )
      .trim()

  if (!clean) return null

  const separators = [
    ' - ',
    ' · ',
    ' on Facebook',
  ]

  for (const separator of separators) {
    const index =
      clean.indexOf(separator)

    if (index > 0) {
      const candidate =
        clean
          .slice(0, index)
          .trim()

      if (
        candidate
        && candidate.length <= 80
      ) {
        return candidate
      }
    }
  }

  return null
}

const parseFacebookHtml = (
  html: string,
): FacebookNuxtResult | null => {
  const $ =
    load(html)

  const title =
    firstMeta($, [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ])
    || $('title').first().text().trim()
    || 'Facebook video'

  const thumbnail =
    firstMeta($, [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ])
    || null

  const metaVideo =
    firstMeta($, [
      'meta[property="og:video:secure_url"]',
      'meta[property="og:video:url"]',
      'meta[property="og:video"]',
      'meta[name="twitter:player:stream"]',
    ])

  const candidates =
    collectJsonUrls(
      html,
      [
        'browser_native_hd_url',
        'playable_url_quality_hd',
        'progressive_url_hd',
        'hd_src_no_ratelimit',
        'hd_src',
        'browser_native_sd_url',
        'playable_url',
        'progressive_url',
        'sd_src_no_ratelimit',
        'sd_src',
      ],
    )

  if (metaVideo) {
    const media =
      normaliseMediaUrl(
        metaVideo,
      )

    if (media) {
      candidates.unshift({
        key: 'meta_video',
        url: media,
      })
    }
  }

  const seen =
    new Set<string>()

  // Facebook often repeats several signed CDN URLs for the same quality.
  // Keep one HD and one SD choice instead of showing many identical rows.
  const seenQuality =
    new Set<'hd' | 'sd'>()

  const formats:
    FacebookNuxtFormat[] = []

  for (const candidate of candidates) {
    if (
      !candidate.url
      || seen.has(candidate.url)
    ) {
      continue
    }

    seen.add(candidate.url)

    const key =
      candidate.key.toLowerCase()

    const isHd =
      key.includes('hd')
      || key.includes('quality_hd')

    const quality:
      'hd' | 'sd' =
        isHd ? 'hd' : 'sd'

    if (
      seenQuality.has(quality)
    ) {
      continue
    }

    seenQuality.add(quality)

    formats.push({
      format: quality,
      url:
        candidate.url,
      ext: 'mp4',

      // The HTML keys tell us HD/SD, but not a trustworthy exact
      // pixel height. Do not pretend every HD URL is exactly 720p.
      height: null,
      filesize_mb: null,
    })
  }

  formats.sort(
    (a, b) =>
      (b.height || 0)
      - (a.height || 0),
  )

  if (!formats.length) {
    return null
  }

  const durationMeta =
    Number.parseFloat(
      firstMeta($, [
        'meta[property="video:duration"]',
        'meta[property="og:video:duration"]',
      ])
      || '',
    )

  const durationMatch =
    html.match(
      /"playable_duration_in_ms"\s*:\s*(\d+)/i,
    )
    || html.match(
      /"duration"\s*:\s*(\d+(?:\.\d+)?)/i,
    )

  let duration: number | null = null

  if (
    Number.isFinite(durationMeta)
  ) {
    duration = durationMeta
  } else if (durationMatch?.[1]) {
    const value =
      Number(durationMatch[1])

    duration =
      durationMatch[0]
        .includes(
          'playable_duration_in_ms',
        )
        ? value / 1000
        : value
  }

  return {
    page_name:
      pageNameFromTitle(title),
    title:
      title
        .replace(
          /\s*\|\s*Facebook\s*$/i,
          '',
        )
        .trim()
      || 'Facebook video',
    video_url:
      formats[0]?.url
      || null,
    thumbnail,
    duration,
    formats,
  }
}

export default defineEventHandler(
  async event => {
    enforceRateLimit(event)

    const query =
      getQuery(event)

    const facebookUrl =
      normaliseFacebookUrl(
        query.url,
      )

    const cached =
      cachedResult(
        facebookUrl,
      )

    if (cached) {
      return cached
    }

    const attempts: string[] = []
    let sawLoginPage = false

    try {
      const urls =
        candidateUrls(
          facebookUrl,
        )

      const userAgents = [
        DESKTOP_UA,
        MOBILE_UA,
      ]

      for (const candidate of urls) {
        for (const userAgent of userAgents) {
          let response: Response

          try {
            response =
              await fetchAttempt(
                candidate,
                userAgent,
              )
          } catch (error) {
            attempts.push(
              `${new URL(candidate).hostname}: network/timeout`,
            )
            continue
          }

          attempts.push(
            `${new URL(candidate).hostname}: HTTP ${response.status}`,
          )

          // V30 stopped immediately here when Facebook returned 400.
          // V31 intentionally keeps trying alternate public Facebook hosts.
          if (!response.ok) {
            continue
          }

          const html =
            await response.text()

          const bodyText =
            load(html)('body')
              .text()
              .replace(/\s+/g, ' ')
              .slice(0, 8000)

          if (
            /log in|login|checkpoint|content isn't available|content is not available|you must log in/i
              .test(bodyText)
          ) {
            sawLoginPage = true
          }

          const parsed =
            parseFacebookHtml(
              html,
            )

          if (parsed) {
            cacheResult(
              facebookUrl,
              parsed,
            )

            return parsed
          }

          // When a short URL redirects to a canonical Facebook URL,
          // try that final URL as another candidate.
          if (
            response.url
            && response.url !== candidate
            && response.url.includes(
              'facebook.com',
            )
          ) {
            try {
              const canonical =
                normaliseFacebookUrl(
                  response.url,
                )

              for (
                const fallback
                of candidateUrls(
                  canonical,
                )
              ) {
                if (
                  !urls.includes(fallback)
                ) {
                  urls.push(fallback)
                }
              }
            } catch {
              // Ignore malformed redirect targets.
            }
          }
        }
      }

      throw new Error(
        sawLoginPage
          ? 'Facebook asked for a sign-in before exposing this video. Try another public Facebook video or Reel.'
          : 'Facebook did not expose a public downloadable video for this link. Try a direct public Reel, Watch, or video URL.',
      )
    } catch (error) {
      console.error(
        '[Facebook resolver]',
        error,
        attempts,
      )

      throw createError({
        statusCode: 502,
        statusMessage:
          error instanceof Error
            ? error.message
            : 'Could not resolve that Facebook video.',
      })
    }
  },
)
