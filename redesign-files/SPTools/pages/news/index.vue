<script setup lang="ts">
import LatestNews from '~/components/news/home/LatestNews.vue'
import TrendingSidebar from '~/components/news/home/TrendingSidebar.vue'

const {
  loadHomeNews,
  refreshHomeNews,
  isLoading,
  errorMessage,
} = useNewsData()

await loadHomeNews()

useHead({
  title: 'World News, Breaking News and Global Updates | SP-Tools',
  meta: [
    {
      name: 'description',
      content:
        'Follow breaking world news, international events, business, technology, science, climate, health and regional developments.',
    },
    {
      name: 'keywords',
      content:
        'world news, breaking news, international news, latest news, global news, technology news, business news',
    },
    {
      property: 'og:title',
      content: 'World News, Breaking News and Global Updates | SP-Tools',
    },
    {
      property: 'og:description',
      content:
        'Breaking stories, global developments and clear news updates from around the world.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
  ],
})
</script>

<template>
  <main class="min-h-screen overflow-hidden bg-surface text-fg">
    <NewsHomeHero />

    <div v-if="errorMessage" class="sp-container mt-5">
      <div class="flex flex-col gap-4 rounded-[14px] border border-danger/25 bg-danger-soft p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-semibold text-fg">News could not be loaded</p>
          <p class="mt-1 text-xs text-fg-muted">{{ errorMessage }}</p>
        </div>

        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-xl bg-danger px-4 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isLoading"
          @click="refreshHomeNews"
        >
          {{ isLoading ? 'Loading...' : 'Try again' }}
        </button>
      </div>
    </div>

    <NewsHomeBreakingTicker />
    <NewsHomeCategoryNav />
    <NewsHomeFeaturedNews />

    <section class="border-y border-line bg-surface-2 py-12 sm:py-14">
      <div class="sp-container">
        <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
          <div class="min-w-0">
            <LatestNews />
          </div>
          <div class="min-w-0">
            <TrendingSidebar />
          </div>
        </div>
      </div>
    </section>

    <NewsHomeWorldRegions />
    <NewsHomeTopics />
    <NewsHomeNewsletter />
  </main>
</template>
