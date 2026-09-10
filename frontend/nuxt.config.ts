export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap'],

  css: ['~/assets/css/main.css'],

  app: {
    pageTransition: { name: 'sp-page', mode: 'out-in' },
    layoutTransition: { name: 'sp-page', mode: 'out-in' },

    head: {
      viewport: 'width=device-width, initial-scale=1',
      // Keep browser chrome neutral so the page theme is not forced purple.
      meta: [
        { name: 'theme-color', content: '#101117', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#080b11', media: '(prefers-color-scheme: dark)' },
        { name: 'color-scheme', content: 'light dark' },
      ],
    },
  },

  site: {
    url: 'https://spconflix.com',
    name: 'SP-Tools',
  },

  sitemap: {
    sitemapName: 'sitemap.xml',
    exclude: ['/news/search'],
  },

  runtimeConfig: {
    public: {
      newsApiBase:
        process.env.NUXT_PUBLIC_NEWS_API_BASE ||
        'http://127.0.0.1:8000/api/v1',

      mediaApiBase:
        process.env.NUXT_PUBLIC_MEDIA_API_BASE || 'http://127.0.0.1:8001',
    },
  },

  typescript: {
    strict: true,
  },

  compatibilityDate: '2025-07-01',
})
