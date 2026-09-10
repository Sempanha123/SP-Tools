<script setup lang="ts">
const requestUrl =
  useRequestURL()

const origin =
  requestUrl.origin

const logoUrl =
  `${origin}/brand/sp-tools-mark-512.png`

const socialImage =
  `${origin}/brand/sp-tools-og.png`

const graph = {
  '@context':
    'https://schema.org',
  '@graph': [
    {
      '@type':
        'Organization',
      '@id':
        `${origin}/#organization`,
      name:
        'SP-Tools',
      url:
        origin,
      logo: {
        '@type':
          'ImageObject',
        url:
          logoUrl,
        width: 512,
        height: 512,
      },
    },
    {
      '@type':
        'WebSite',
      '@id':
        `${origin}/#website`,
      url:
        origin,
      name:
        'SP-Tools',
      description:
        'Free AI image tools, media downloaders, and global news in one browser workspace.',
      publisher: {
        '@id':
          `${origin}/#organization`,
      },
      inLanguage:
        'en',
    },
  ],
}

useSeoMeta({
  ogSiteName:
    'SP-Tools',
  ogImage:
    socialImage,
  ogImageAlt:
    'SP-Tools — free AI tools, downloaders and news',
  twitterCard:
    'summary_large_image',
  twitterImage:
    socialImage,
})

useHead({
  script: [
    {
      type:
        'application/ld+json',
      key:
        'sp-tools-brand-schema',
      innerHTML:
        JSON.stringify(graph),
    },
  ],
})
</script>

<template>
  <span
    class="hidden"
    aria-hidden="true"
  />
</template>
