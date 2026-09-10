export default defineEventHandler(
  event => {
    const url =
      getRequestURL(event)

    setHeader(
      event,
      'content-type',
      'text/plain; charset=utf-8',
    )

    setHeader(
      event,
      'cache-control',
      'public, max-age=3600',
    )

    return [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${url.origin}/sitemap.xml`,
      '',
    ].join('\n')
  },
)
