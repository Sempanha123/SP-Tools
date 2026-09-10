<script setup lang="ts">
import LatestNews from '~/components/news/home/LatestNews.vue'
import TrendingSidebar from '~/components/news/home/TrendingSidebar.vue'

const { loadHomeNews, refreshHomeNews, isLoading, errorMessage } = useNewsData()
await loadHomeNews()

useHead({
  title: 'World News, Breaking News and Global Updates | SP-Tools',
  meta: [
    { name: 'description', content: 'Follow breaking world news, international events, business, technology, science, climate, health and regional developments.' },
    { name: 'keywords', content: 'world news, breaking news, international news, latest news, global news, technology news, business news' },
    { property: 'og:title', content: 'World News, Breaking News and Global Updates | SP-Tools' },
    { property: 'og:description', content: 'Breaking stories, global developments and clear news updates from around the world.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})
</script>

<template>
  <main class="min-h-screen overflow-hidden bg-surface text-fg">
    <NewsHomeHero />

    <div v-if="errorMessage" class="sp-container-wide relative z-20 -mb-2 mt-5">
      <div class="flex flex-col gap-4 rounded-[16px] border border-danger/25 bg-danger-soft px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex min-w-0 items-start gap-3">
          <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-danger/10 text-danger">!</span>
          <div class="min-w-0">
            <p class="text-[12px] font-semibold text-fg">News feed temporarily unavailable</p>
            <p class="mt-1 truncate text-[10px] text-fg-muted">{{ errorMessage }}</p>
          </div>
        </div>
        <button type="button" class="sp-btn h-9 bg-danger px-4 text-[10px] text-white" :disabled="isLoading" @click="refreshHomeNews">{{ isLoading ? 'Retrying…' : 'Try again' }}</button>
      </div>
    </div>

    <NewsHomeBreakingTicker />
    <NewsHomeCategoryNav />
    <NewsHomeFeaturedNews />

    <section class="sp-prism-field relative border-b border-line bg-surface-2 py-[72px] sm:py-[88px]">
      <div class="pointer-events-none absolute -left-36 top-40 h-80 w-80 rounded-full bg-accent/7 blur-[110px]" />
      <div class="sp-container-wide relative">
        <div class="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_350px] xl:gap-9">
          <LatestNews />
          <TrendingSidebar />
        </div>
      </div>
    </section>

    <NewsHomeWorldRegions />
    <NewsHomeTopics />
    <NewsHomeNewsletter />
  </main>
</template>
