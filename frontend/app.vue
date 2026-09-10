<script setup lang="ts">
/**
 * Root component.
 *
 * The `dark` class is applied to <html> here (not in a client plugin) so the
 * server-rendered HTML already carries it — no flash of light theme on load.
 */
const { isDark } = useTheme()

useHead({
  htmlAttrs: {
    lang: 'en',
    class: computed(() => (isDark.value ? 'dark' : '')),
  },
  bodyAttrs: {
    class: 'min-h-screen bg-surface text-fg',
  },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: '',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:opsz,wght@6..72,500;6..72,600;6..72,700&display=swap',
    },
  ],
})

useSeoMeta({
  titleTemplate: (title) => (title ? `${title}` : 'SP-Tools'),
  ogSiteName: 'SP-Tools',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <SiteBrandSeo />
  <NuxtLayout />
</template>
