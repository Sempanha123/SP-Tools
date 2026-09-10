<script setup lang="ts">
const { articles } = useNewsData()

type SortMode = 'latest' | 'popular'

const sortMode = ref<SortMode>('latest')
const selectedRegion = ref('all')
const visibleCount = ref(6)

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
  visibleCount.value = 6
})

const formatRegion = (region: string) =>
  region === 'all' ? 'All regions' : region

const clearFilters = () => {
  selectedRegion.value = 'all'
  sortMode.value = 'latest'
  visibleCount.value = 6
}
</script>

<template>
  <section class="min-w-0">
    <div class="flex flex-col justify-between gap-5 border-b border-line pb-5 sm:flex-row sm:items-end">
      <div>
        <div class="sp-kicker">
          <span class="h-1.5 w-1.5 rounded-full bg-accent" />
          Latest updates
        </div>
        <h2 class="mt-3 text-[1.9rem] font-[700] leading-[1.08] tracking-[-0.04em] text-fg sm:text-[2.25rem]">
          News as it happens
        </h2>
        <p class="mt-2.5 max-w-xl text-[13px] leading-6 text-fg-muted">
          New stories, breaking developments and analysis from around the world.
        </p>
      </div>

      <div class="inline-flex w-fit rounded-xl border border-line bg-elevated p-1">
        <button
          type="button"
          class="rounded-lg px-3.5 py-2 text-[11px] font-semibold transition"
          :class="sortMode === 'latest' ? 'bg-fg text-surface-2' : 'text-fg-muted hover:text-fg'"
          @click="sortMode = 'latest'"
        >
          Latest
        </button>
        <button
          type="button"
          class="rounded-lg px-3.5 py-2 text-[11px] font-semibold transition"
          :class="sortMode === 'popular' ? 'bg-fg text-surface-2' : 'text-fg-muted hover:text-fg'"
          @click="sortMode = 'popular'"
        >
          Popular
        </button>
      </div>
    </div>

    <div class="region-scroll mt-5 flex gap-1.5 overflow-x-auto pb-1">
      <button
        v-for="region in regionOptions"
        :key="region"
        type="button"
        class="shrink-0 rounded-lg border px-3 py-1.5 text-[10px] font-semibold transition"
        :class="selectedRegion === region
          ? 'border-accent/35 bg-accent-soft text-accent'
          : 'border-line bg-elevated text-fg-muted hover:border-line-strong hover:text-fg'"
        @click="selectedRegion = region"
      >
        {{ formatRegion(region) }}
      </button>
    </div>

    <div class="mt-5 flex items-center justify-between gap-4 text-[10px] text-fg-subtle">
      <p>{{ filteredArticles.length }} {{ filteredArticles.length === 1 ? 'story' : 'stories' }}</p>
      <button v-if="selectedRegion !== 'all'" type="button" class="font-semibold text-accent" @click="selectedRegion = 'all'">
        Clear region
      </button>
    </div>

    <div v-if="visibleArticles.length" class="mt-5 grid gap-4 md:grid-cols-2">
      <NewsSharedArticleCard
        v-for="article in visibleArticles"
        :key="article.id"
        :article="article"
      />
    </div>

    <div v-else class="mt-6 rounded-[16px] border border-line bg-elevated px-6 py-12 text-center">
      <div class="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-surface-3 text-fg-subtle">⌕</div>
      <h3 class="mt-4 text-lg font-[680] text-fg">No news found</h3>
      <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-fg-muted">
        No stories are currently available for {{ formatRegion(selectedRegion) }}.
      </p>
      <button type="button" class="mt-5 rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-accent-fg" @click="clearFilters">
        Show all stories
      </button>
    </div>

    <div v-if="canLoadMore" class="mt-8 text-center">
      <button
        type="button"
        class="rounded-xl border border-line bg-elevated px-5 py-2.5 text-xs font-semibold text-fg-muted transition hover:border-line-strong hover:bg-surface-3 hover:text-fg"
        @click="visibleCount += 4"
      >
        Load more stories
      </button>
    </div>
  </section>
</template>

<style scoped>
.region-scroll {
  scrollbar-width: none;
}
.region-scroll::-webkit-scrollbar {
  display: none;
}
</style>
