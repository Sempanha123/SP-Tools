<script setup lang="ts">
const {
  query,
  selectedCategory,
  selectedRegion,
  dateRange,
  sortMode,
  currentPage,

  categoryOptions,
  regionOptions,

  paginatedArticles,
  resultCount,
  totalPages,

  activeFilters,
  mostReadArticles,
  searchTrendingTags,

  pending,
  error,
  refresh,

  applySearch,
  changePage,
  removeFilter,
  clearAllFilters,
} = await useNewsSearch()

/* =========================================================
   SEARCH SUBMIT
========================================================= */

const submitSearch =
  async (): Promise<void> => {
    await applySearch()

    if (!import.meta.client) {
      return
    }

    await nextTick()

    document
      .getElementById(
        'search-results',
      )
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
  }

const retrySearch =
  async (): Promise<void> => {
    await refresh()
  }

/* =========================================================
   SEO
========================================================= */

const pageTitle = computed(() => {
  const searchValue =
    query.value.trim()

  if (searchValue) {
    return (
      `Search results for `
      + `“${searchValue}”`
      + ' | SP-Tools News'
    )
  }

  return (
    'Search World News'
    + ' | SP-Tools News'
  )
})

const pageDescription = computed(() => {
  const searchValue =
    query.value.trim()

  if (searchValue) {
    return (
      'Search news articles, '
      + 'reports and updates '
      + `related to ${searchValue}.`
    )
  }

  return (
    'Search breaking news, world events, '
    + 'business, technology, science, '
    + 'climate, health and regional coverage.'
  )
})

const canonicalUrl = computed(() => {
  const searchValue =
    query.value.trim()

  if (!searchValue) {
    return '/news/search'
  }

  return (
    '/news/search?q='
    + encodeURIComponent(
      searchValue,
    )
  )
})

useSeoMeta({
  title: () =>
    pageTitle.value,

  description: () =>
    pageDescription.value,

  ogTitle: () =>
    pageTitle.value,

  ogDescription: () =>
    pageDescription.value,

  ogType: 'website',

  twitterTitle: () =>
    pageTitle.value,

  twitterDescription: () =>
    pageDescription.value,

  twitterCard:
    'summary_large_image',
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href:
        canonicalUrl.value,
    },
  ],
}))
</script>

<template>
    <main class="min-h-screen overflow-hidden bg-white text-slate-950">
        <!-- ===================================================== -->
        <!-- SEARCH HERO -->
        <!-- ===================================================== -->

        <NewsSearchHero v-model="query" :result-count="resultCount" @submit="submitSearch" />

        <!-- ===================================================== -->
        <!-- CATEGORY NAVIGATION -->
        <!-- ===================================================== -->

        <NewsHomeCategoryNav />

        <!-- ===================================================== -->
        <!-- SEARCH CONTENT -->
        <!-- ===================================================== -->

        <section class="border-y border-slate-100
      bg-slate-50 py-16 sm:py-20 lg:py-24">
            <div class="mx-auto max-w-7xl px-6">

                <!-- Filters -->

                <NewsSearchControls :categories="categoryOptions" :regions="regionOptions"
                    :selected-category="selectedCategory" :selected-region="selectedRegion" :date-range="dateRange"
                    :sort-mode="sortMode" :active-filters="activeFilters"
                    @update:selected-category="selectedCategory = $event"
                    @update:selected-region="selectedRegion = $event" @update:date-range="dateRange = $event"
                    @update:sort-mode="sortMode = $event" @remove-filter="removeFilter" @clear-all="clearAllFilters" />

                <!-- Results and sidebar -->

                <div class="mt-10 grid items-start gap-8
          lg:grid-cols-[minmax(0,1fr)_370px]
          xl:gap-10">
                    <!-- Search results -->

                    <div class="min-w-0">
                        <NewsSearchResults :articles="paginatedArticles" :total-results="resultCount" :query="query"
                            :current-page="currentPage" :total-pages="totalPages" @change-page="changePage"
                            @clear-filters="clearAllFilters" />
                    </div>

                    <!-- Search sidebar -->

                    <div class="min-w-0">
                        <NewsSearchSidebar
                        :most-read="mostReadArticles"
                        :trending-tags="searchTrendingTags"
                        />
                    </div>
                </div>
            </div>
        </section>

        <!-- ===================================================== -->
        <!-- REGIONAL DISCOVERY -->
        <!-- ===================================================== -->

        <NewsHomeWorldRegions />

        <!-- ===================================================== -->
        <!-- NEWSLETTER -->
        <!-- ===================================================== -->

        <NewsHomeNewsletter />
    </main>
</template>