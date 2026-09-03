export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap'],

  css: ['~/assets/css/main.css'],

  app: {
    pageTransition: { name: 'sp-page', mode: 'out-in' },
    layoutTransition: { name: 'sp-page', mode: 'out-in' },

    head: {
      viewport: 'width=device-width, initial-scale=1',
      meta: [{ name: 'theme-color', content: '#6d5ef0' }],
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
      /**
       * Laravel news API. Everything under /api/v1.
       */
      newsApiBase:
        process.env.NUXT_PUBLIC_NEWS_API_BASE ||
        'http://127.0.0.1:8000/api/v1',

      /**
       * FastAPI media service (u2net-project): background removal, upscaling
       * and the video downloaders. This is a *different* service from the
       * Laravel API above — do not point them at the same port.
       */
      mediaApiBase:
        process.env.NUXT_PUBLIC_MEDIA_API_BASE || 'http://127.0.0.1:8001',
    },
  },

  typescript: {
    strict: true,
  },

  compatibilityDate: '2025-07-01',
})
