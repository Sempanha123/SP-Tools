import { load } from 'cheerio'

interface TikTokResult {
  success: boolean
  bg_url: string
  circle_img_url: string
  username: string
  caption: string
  MP4: string | null
  MP4_HD: string | null
  MP4_with_Watermark: string | null
}

interface CacheEntry {
  expiresAt: number
  value: TikTokResult
}

const MUSICALDOWN_HOME =
  'https://musicaldown.com/'

const CACHE_TTL_MS =
  5 * 60 * 1000

const RATE_WINDOW_MS =
  60 * 1000

const RATE_LIMIT =
  12

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

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
  + 'AppleWebKit/537.36 (KHTML, like Gecko) '
  + 'Chrome/131.0.0.0 Safari/537.36'

const normaliseTikTokUrl = (
  input: unknown,
): string => {
  if (
    typeof input !== 'string'
    || !input.trim()
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'A TikTok URL is required.',
    })
  }

  let parsed: URL

  try {
    parsed = new URL(
      input.trim(),
    )
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Enter a valid TikTok URL.',
    })
  }

  if (
    parsed.protocol !== 'https:'
    && parsed.protocol !== 'http:'
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Only HTTP or HTTPS TikTok links are supported.',
    })
  }

  const hostname =
    parsed.hostname
      .toLowerCase()
      .replace(/\.$/, '')

  const allowed =
    hostname === 'tiktok.com'
    || hostname.endsWith(
      '.tiktok.com',
    )

  if (!allowed) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'That link is not a TikTok URL.',
    })
  }

  parsed.hash = ''

  return parsed.toString()
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
    bucket.count
    > RATE_LIMIT
  ) {
    throw createError({
      statusCode: 429,
      statusMessage:
        'Too many requests. Please wait a moment and try again.',
    })
  }

  // Prevent an unbounded map on a long-running process.
  if (rateBuckets.size > 2000) {
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

const cachedResult = (
  url: string,
): TikTokResult | null => {
  const entry =
    resultCache.get(url)

  if (!entry) {
    return null
  }

  if (
    Date.now()
    >= entry.expiresAt
  ) {
    resultCache.delete(url)
    return null
  }

  return entry.value
}

const cacheResult = (
  url: string,
  value: TikTokResult,
) => {
  resultCache.set(url, {
    expiresAt:
      Date.now()
      + CACHE_TTL_MS,
    value,
  })

  if (
    resultCache.size > 200
  ) {
    const firstKey =
      resultCache.keys().next()
        .value as
          | string
          | undefined

    if (firstKey) {
      resultCache.delete(
        firstKey,
      )
    }
  }
}

const fetchWithTimeout = async (
  url: string,
  init: RequestInit = {},
  timeoutMs = 15_000,
) => {
  const controller =
    new AbortController()

  const timeout =
    setTimeout(
      () =>
        controller.abort(),
      timeoutMs,
    )

  try {
    return await fetch(
      url,
      {
        ...init,
        signal:
          controller.signal,
        redirect: 'follow',
      },
    )
  } finally {
    clearTimeout(timeout)
  }
}

const cookieHeaderFrom = (
  headers: Headers,
): string => {
  const enhanced =
    headers as Headers & {
      getSetCookie?:
        () => string[]
    }

  const cookies =
    enhanced.getSetCookie?.()
    ?? (
      headers.get('set-cookie')
        ? [
            headers.get(
              'set-cookie',
            )!,
          ]
        : []
    )

  return cookies
    .map(
      cookie =>
        cookie
          .split(';', 1)[0]
          ?.trim(),
    )
    .filter(Boolean)
    .join('; ')
}

const absoluteHttpUrl = (
  value:
    | string
    | undefined,
  base: string,
): string => {
  if (!value) return ''

  try {
    const parsed =
      new URL(value, base)

    if (
      parsed.protocol !== 'http:'
      && parsed.protocol
        !== 'https:'
    ) {
      return ''
    }

    return parsed.toString()
  } catch {
    return ''
  }
}

const pickForm = (
  html: string,
) => {
  const $ = load(html)

  let form =
    $('form#submit-form')
      .first()

  if (!form.length) {
    form =
      $('form[action*="download"]')
        .first()
  }

  return {
    $,
    form,
  }
}

export default defineEventHandler(
  async event => {
    enforceRateLimit(event)

    const query =
      getQuery(event)

    const tiktokUrl =
      normaliseTikTokUrl(
        query.url,
      )

    const cached =
      cachedResult(
        tiktokUrl,
      )

    if (cached) {
      return cached
    }

    try {
      // Step 1:
      // Open MusicallyDown so we get the
      // current form fields/tokens and cookies.
      const homeResponse =
        await fetchWithTimeout(
          MUSICALDOWN_HOME,
          {
            headers: {
              'user-agent':
                USER_AGENT,
              accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'accept-language':
                'en-US,en;q=0.9',
              'cache-control':
                'no-cache',
            },
          },
        )

      if (
        !homeResponse.ok
      ) {
        throw new Error(
          `MusicallyDown homepage returned HTTP ${homeResponse.status}.`,
        )
      }

      const homeHtml =
        await homeResponse.text()

      const homeUrl =
        homeResponse.url
        || MUSICALDOWN_HOME

      const {
        $: home$,
        form,
      } = pickForm(
        homeHtml,
      )

      if (!form.length) {
        throw new Error(
          'The MusicallyDown download form could not be found. Their page structure may have changed.',
        )
      }

      // Step 2:
      // Copy all current form inputs.
      const formData =
        new URLSearchParams()

      const inputs =
        form
          .find('input')
          .toArray()

      const namedInputs =
        inputs.filter(
          input =>
            Boolean(
              home$(input).attr(
                'name',
              ),
            ),
        )

      if (
        !namedInputs.length
      ) {
        throw new Error(
          'The MusicallyDown form did not contain usable input fields.',
        )
      }

      // Prefer an obvious URL/text input.
      // If the page does not expose one,
      // use the first named input exactly
      // like the original Python version.
      const urlInput =
        namedInputs.find(
          input => {
            const element =
              home$(input)

            const type =
              (
                element.attr(
                  'type',
                )
                || ''
              ).toLowerCase()

            const name =
              (
                element.attr(
                  'name',
                )
                || ''
              ).toLowerCase()

            const placeholder =
              (
                element.attr(
                  'placeholder',
                )
                || ''
              ).toLowerCase()

            return (
              type === 'url'
              || type === 'text'
              || name.includes(
                'url',
              )
              || placeholder.includes(
                'tiktok',
              )
            )
          },
        )
        ?? namedInputs[0]

      for (
        const input
        of namedInputs
      ) {
        const element =
          home$(input)

        const name =
          element.attr(
            'name',
          )

        if (!name) continue

        formData.set(
          name,
          input === urlInput
            ? tiktokUrl
            : (
                element.attr(
                  'value',
                )
                || ''
              ),
        )
      }

      const formAction =
        form.attr('action')
        || '/download'

      const postUrl =
        new URL(
          formAction,
          homeUrl,
        ).toString()

      const cookieHeader =
        cookieHeaderFrom(
          homeResponse.headers,
        )

      // Step 3:
      // Submit the same form back to
      // MusicallyDown.
      const postResponse =
        await fetchWithTimeout(
          postUrl,
          {
            method: 'POST',
            headers: {
              'user-agent':
                USER_AGENT,
              accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'accept-language':
                'en-US,en;q=0.9',
              'content-type':
                'application/x-www-form-urlencoded',
              origin:
                new URL(
                  homeUrl,
                ).origin,
              referer:
                homeUrl,
              ...(cookieHeader
                ? {
                    cookie:
                      cookieHeader,
                  }
                : {}),
            },
            body:
              formData.toString(),
          },
        )

      if (
        !postResponse.ok
      ) {
        throw new Error(
          `MusicallyDown download page returned HTTP ${postResponse.status}.`,
        )
      }

      const resultHtml =
        await postResponse.text()

      const $ =
        load(resultHtml)

      const videoHeader =
        $('div.video-header')
          .first()

      const style =
        videoHeader.attr(
          'style',
        )
        || ''

      const backgroundMatch =
        style.match(
          /background-image\s*:\s*url\(\s*(['"]?)(.*?)\1\s*\)/i,
        )

      const bgUrl =
        absoluteHttpUrl(
          backgroundMatch?.[2],
          postResponse.url
            || postUrl,
        )

      const circleImgUrl =
        absoluteHttpUrl(
          videoHeader
            .find('img')
            .first()
            .attr('src'),
          postResponse.url
            || postUrl,
        )

      const username =
        videoHeader
          .find(
            'h2.video-author',
          )
          .first()
          .text()
          .trim()

      const caption =
        videoHeader
          .find(
            'p.video-desc',
          )
          .first()
          .text()
          .trim()

      const links: {
        mp4: string | null
        mp4_hd: string | null
        mp4_watermark:
          string | null
      } = {
        mp4: null,
        mp4_hd: null,
        mp4_watermark: null,
      }

      $('a.download').each(
        (_, element) => {
          const anchor =
            $(element)

          const eventName =
            (
              anchor.attr(
                'data-event',
              )
              || ''
            ).toLowerCase()

          const label =
            anchor
              .text()
              .replace(
                /\s+/g,
                ' ',
              )
              .trim()
              .toLowerCase()

          const href =
            absoluteHttpUrl(
              anchor.attr(
                'href',
              ),
              postResponse.url
                || postUrl,
            )

          if (!href) {
            return
          }

          if (
            eventName
              === 'mp4_download_click'
          ) {
            links.mp4 =
              href

            return
          }

          if (
            eventName
              === 'hd_download_click'
          ) {
            links.mp4_hd =
              href

            return
          }

          if (
            eventName
              === 'watermark_download_click'
          ) {
            links.mp4_watermark =
              href

            return
          }

          // Small fallback in case the
          // data-event names change but
          // button text remains descriptive.
          if (
            !links.mp4_hd
            && label.includes('hd')
          ) {
            links.mp4_hd =
              href

            return
          }

          if (
            !links.mp4_watermark
            && label.includes(
              'watermark',
            )
            && !label.includes(
              'without',
            )
            && !label.includes(
              'no watermark',
            )
          ) {
            links.mp4_watermark =
              href

            return
          }

          if (
            !links.mp4
            && (
              label.includes(
                'without watermark',
              )
              || label.includes(
                'no watermark',
              )
              || label.includes(
                'mp4',
              )
            )
          ) {
            links.mp4 =
              href
          }
        },
      )

      if (
        !links.mp4
        && !links.mp4_hd
        && !links.mp4_watermark
      ) {
        throw new Error(
          'No downloadable video links were found. The post may be private, unavailable, or the resolver page changed.',
        )
      }

      const result: TikTokResult = {
        success: true,
        bg_url:
          bgUrl,
        circle_img_url:
          circleImgUrl,
        username,
        caption,
        MP4:
          links.mp4,
        MP4_HD:
          links.mp4_hd,
        MP4_with_Watermark:
          links.mp4_watermark,
      }

      cacheResult(
        tiktokUrl,
        result,
      )

      return result
    } catch (error) {
      if (
        error instanceof Error
        && error.name
          === 'AbortError'
      ) {
        throw createError({
          statusCode: 504,
          statusMessage:
            'The TikTok resolver timed out. Please try again.',
        })
      }

      console.error(
        '[TikTok resolver]',
        error,
      )

      throw createError({
        statusCode: 502,
        statusMessage:
          error instanceof Error
            ? error.message
            : 'Could not resolve that TikTok video.',
      })
    }
  },
)
