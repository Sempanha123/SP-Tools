<script setup lang="ts">
const {
  query, selectedCategory, selectedRegion, dateRange, sortMode, currentPage,
  categoryOptions, regionOptions, paginatedArticles, resultCount, totalPages,
  activeFilters, mostReadArticles, searchTrendingTags,
  pending, error, refresh, applySearch, changePage, removeFilter, clearAllFilters,
} = await useNewsSearch()

const submitSearch = async (): Promise<void> => {
  await applySearch()
  if (!import.meta.client) return
  await nextTick()
  document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const pageTitle = computed(() => query.value.trim() ? `Search results for “${query.value.trim()}” | SP-Tools News` : 'Search World News | SP-Tools News')
const pageDescription = computed(() => query.value.trim() ? `Search news articles, reports and updates related to ${query.value.trim()}.` : 'Search breaking news, world events, business, technology, science, climate, health and regional coverage.')
const canonicalUrl = computed(() => query.value.trim() ? `/news/search?q=${encodeURIComponent(query.value.trim())}` : '/news/search')

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogType: 'website',
  twitterTitle: () => pageTitle.value,
  twitterDescription: () => pageDescription.value,
  twitterCard: 'summary_large_image',
})
useHead(() => ({ link: [{ rel: 'canonical', href: canonicalUrl.value }] }))
</script>

<template>
  <main class="news-v4-shell min-h-screen overflow-hidden">
    <NewsSearchHero v-model="query" :result-count="resultCount" @submit="submitSearch" />
    <NewsHomeCategoryNav />

    <section class="relative border-y border-line bg-surface py-14 sm:py-18 lg:py-20">
      <div class="sp-quiet-grid pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[.10]" />
      <div class="sp-container-wide relative">
        <div v-if="error" class="mb-5 flex flex-col gap-3 rounded-[16px] border border-danger/20 bg-danger-soft px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div><p class="text-[12px] font-bold text-fg">News search is temporarily unavailable</p><p class="mt-1 text-[10px] text-fg-muted">The interface is ready, but the API request did not complete.</p></div>
          <button type="button" class="sp-btn sp-btn-secondary px-4 py-2.5 text-[10px]" @click="refresh()">Try again</button>
        </div>

        <NewsSearchControls
          :categories="categoryOptions" :regions="regionOptions"
          :selected-category="selectedCategory" :selected-region="selectedRegion"
          :date-range="dateRange" :sort-mode="sortMode" :active-filters="activeFilters"
          @update:selected-category="selectedCategory = $event"
          @update:selected-region="selectedRegion = $event"
          @update:date-range="dateRange = $event"
          @update:sort-mode="sortMode = $event"
          @remove-filter="removeFilter" @clear-all="clearAllFilters"
        />

        <div v-if="pending" class="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div class="space-y-4"><div class="sp-skeleton h-14 rounded-xl"/><div class="grid gap-5 md:grid-cols-2"><div v-for="n in 4" :key="n" class="sp-skeleton h-80 rounded-[20px]"/></div></div>
          <div class="sp-skeleton h-96 rounded-[22px]"/>
        </div>

        <div v-else class="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px] xl:gap-10">
          <NewsSearchResults :articles="paginatedArticles" :total-results="resultCount" :query="query" :current-page="currentPage" :total-pages="totalPages" @change-page="changePage" @clear-filters="clearAllFilters" />
          <NewsSearchSidebar :most-read="mostReadArticles" :trending-tags="searchTrendingTags" />
        </div>
      </div>
    </section>

    <NewsHomeWorldRegions />
    <NewsHomeNewsletter />
  </main>
</template>
