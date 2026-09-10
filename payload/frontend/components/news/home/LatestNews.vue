<script setup lang="ts">
const { articles } = useNewsData()

type SortMode = 'latest' | 'popular'
const sortMode = ref<SortMode>('latest')
const selectedRegion = ref('all')
const visibleCount = ref(10)

const regionOptions = computed(() => [
  'all',
  ...Array.from(new Set(articles.value.map(article => article.region))).sort(),
])

const filteredArticles = computed(() => {
  let result = [...articles.value]

  if (selectedRegion.value !== 'all') {
    const selected = selectedRegion.value.trim().toLowerCase()
    result = result.filter(article => article.region.trim().toLowerCase() === selected)
  }

  if (sortMode.value === 'popular') {
    return result.sort((a, b) => b.views - a.views)
  }

  return result.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
})

const visibleArticles = computed(() => filteredArticles.value.slice(0, visibleCount.value))
const canLoadMore = computed(() => visibleCount.value < filteredArticles.value.length)

watch([selectedRegion, sortMode], () => {
  visibleCount.value = 10
})

const formatRegion = (region: string) => region === 'all' ? 'All regions' : region

const clearFilters = () => {
  selectedRegion.value = 'all'
  sortMode.value = 'latest'
  visibleCount.value = 10
}
</script>

<template>
  <section class="min-w-0">
    <div class="sp-reveal flex flex-col justify-between gap-5 border-b border-line pb-5 sm:flex-row sm:items-end">
      <div>
        <div class="sp-kicker">Latest updates</div>
        <h2 class="mt-3 text-[clamp(2.1rem,4vw,3.25rem)] font-[720] leading-[1] tracking-[-.052em] text-fg">
          News as it happens
        </h2>
        <p class="mt-3 max-w-xl text-[13px] leading-6 text-fg-muted">
          Scan the newest reporting quickly, then open the stories that matter.
        </p>
      </div>

      <div class="inline-flex w-fit rounded-[13px] border border-line bg-elevated p-1 shadow-xs">
        <button
          type="button"
          class="rounded-[9px] px-4 py-2 text-[11px] font-semibold transition"
          :class="sortMode === 'latest' ? 'bg-fg text-surface-2 shadow-xs' : 'text-fg-muted hover:bg-surface-3 hover:text-fg'"
          @click="sortMode = 'latest'"
        >
          Latest
        </button>
        <button
          type="button"
          class="rounded-[9px] px-4 py-2 text-[11px] font-semibold transition"
          :class="sortMode === 'popular' ? 'bg-fg text-surface-2 shadow-xs' : 'text-fg-muted hover:bg-surface-3 hover:text-fg'"
          @click="sortMode = 'popular'"
        >
          Popular
        </button>
      </div>
    </div>

    <div class="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="region-scroll flex gap-1.5 overflow-x-auto pb-1">
        <button
          v-for="region in regionOptions"
          :key="region"
          type="button"
          class="shrink-0 rounded-full border px-3.5 py-2 text-[10px] font-semibold transition"
          :class="
            selectedRegion === region
              ? 'border-accent/30 bg-accent-soft text-accent'
              : 'border-line bg-elevated text-fg-muted hover:border-line-strong hover:text-fg'
          "
          @click="selectedRegion = region"
        >
          {{ formatRegion(region) }}
        </button>
      </div>

      <p class="shrink-0 text-[10px] font-medium text-fg-subtle">
        {{ filteredArticles.length }} {{ filteredArticles.length === 1 ? 'story' : 'stories' }}
      </p>
    </div>

    <div v-if="visibleArticles.length" class="sp-news-latest-grid sp-stagger mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <NewsSharedArticleCard
        v-for="(article, index) in visibleArticles"
        :key="article.id"
        :article="article"
        :horizontal="index === 0"
        :class="index === 0 ? 'md:col-span-2 xl:col-span-3' : ''"
      />
    </div>

    <div v-else class="sp-reveal sp-lens-card relative mt-7 overflow-hidden rounded-[24px] px-6 py-14 text-center shadow-lift sm:py-[72px]">
      <div class="relative mx-auto max-w-md">
        <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-[17px] border border-line bg-surface-3 text-fg-subtle shadow-xs">⌕</span>
        <p class="mt-5 text-[10px] font-bold uppercase tracking-[.14em] text-accent">Desk is quiet</p>
        <h3 class="mt-2 text-[22px] font-[700] tracking-[-.035em] text-fg">No stories in this view yet.</h3>
        <button type="button" class="sp-btn sp-btn-secondary mt-6 h-10 px-4 text-xs" @click="clearFilters">
          Show all stories
        </button>
      </div>
    </div>

    <div v-if="canLoadMore" class="mt-9 text-center">
      <button type="button" class="sp-btn sp-btn-secondary h-11 px-5 text-xs" @click="visibleCount += 6">
        Load more stories <span aria-hidden="true">↓</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.region-scroll { scrollbar-width: none; }
.region-scroll::-webkit-scrollbar { display: none; }
</style>
