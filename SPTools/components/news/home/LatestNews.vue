<script setup lang="ts">
const {
  articles,
} = useNewsData()

type SortMode = 'latest' | 'popular'

const sortMode = ref<SortMode>('latest')
const selectedRegion = ref('all')
const visibleCount = ref(6)

/* =========================================================
   REGION OPTIONS
========================================================= */

const regionOptions = computed(() => {
  return [
    'all',
    ...Array.from(
      new Set(
        articles.value.map(
          article => article.region,
        ),
      ),
    ).sort(),
  ]
})

/* =========================================================
   FILTER AND SORT
========================================================= */

const filteredArticles = computed(() => {
  let result = [...articles.value]

  if (selectedRegion.value !== 'all') {
    const selected = selectedRegion.value
      .trim()
      .toLowerCase()

    result = result.filter((article) => {
      return (
        article.region
          .trim()
          .toLowerCase() === selected
      )
    })
  }

  if (sortMode.value === 'popular') {
    return result.sort(
      (a, b) => b.views - a.views,
    )
  }

  return result.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() -
      new Date(a.publishedAt).getTime(),
  )
})

const visibleArticles = computed(() => {
  return filteredArticles.value.slice(
    0,
    visibleCount.value,
  )
})

const canLoadMore = computed(() => {
  return (
    visibleCount.value <
    filteredArticles.value.length
  )
})

/* =========================================================
   WATCHERS
========================================================= */

watch(
  [selectedRegion, sortMode],
  () => {
    visibleCount.value = 6
  },
)

/* =========================================================
   HELPERS
========================================================= */

const formatRegion = (region: string) => {
  return region === 'all'
    ? 'All regions'
    : region
}

const clearFilters = () => {
  selectedRegion.value = 'all'
  sortMode.value = 'latest'
  visibleCount.value = 6
}
</script>

<template>
  <section class="min-w-0">
    <!-- Header -->

    <div
      class="flex flex-col justify-between gap-5
      border-b border-line pb-6
      sm:flex-row sm:items-end"
    >
      <div>
        <div
          class="inline-flex items-center gap-2
          text-[10px] font-bold uppercase
          tracking-[0.18em] text-indigo-600"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full
              animate-ping rounded-full
              bg-indigo-400 opacity-40"
            />

            <span
              class="relative inline-flex h-2 w-2
              rounded-full bg-indigo-600"
            />
          </span>

          Latest updates
        </div>

        <h2
          class="mt-3 text-3xl font-bold
          tracking-[-0.04em] text-fg
          sm:text-4xl"
        >
          News as it happens
        </h2>

        <p
          class="mt-3 max-w-xl text-sm
          leading-7 text-fg-subtle"
        >
          New stories, breaking updates and analysis
          from around the world.
        </p>
      </div>

      <!-- Sort buttons -->

      <div
        class="flex w-fit items-center rounded-xl
        border border-line bg-surface p-1"
      >
        <button
          type="button"
          class="rounded-lg px-4 py-2.5
          text-xs font-semibold transition-all"
          :class="
            sortMode === 'latest'
              ? 'bg-accent text-accent-fg text-white shadow-sm'
              : 'text-fg-subtle hover:text-fg'
          "
          @click="sortMode = 'latest'"
        >
          Latest
        </button>

        <button
          type="button"
          class="rounded-lg px-4 py-2.5
          text-xs font-semibold transition-all"
          :class="
            sortMode === 'popular'
              ? 'bg-accent text-accent-fg text-white shadow-sm'
              : 'text-fg-subtle hover:text-fg'
          "
          @click="sortMode = 'popular'"
        >
          Popular
        </button>
      </div>
    </div>

    <!-- Region filters -->

    <div
      class="region-scroll mt-6 flex gap-2
      overflow-x-auto pb-1"
    >
      <button
        v-for="region in regionOptions"
        :key="region"
        type="button"
        class="shrink-0 rounded-full border
        px-4 py-2 text-[10px] font-bold
        uppercase tracking-wider transition-all"
        :class="
          selectedRegion === region
            ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
            : 'border-line bg-surface text-fg-subtle hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600'
        "
        @click="selectedRegion = region"
      >
        {{ formatRegion(region) }}
      </button>
    </div>

    <!-- Result information -->

    <div
      class="mt-6 flex items-center
      justify-between gap-4"
    >
      <p class="text-xs text-fg-subtle">
        {{ filteredArticles.length }}
        {{
          filteredArticles.length === 1
            ? 'story available'
            : 'stories available'
        }}
      </p>

      <span
        v-if="selectedRegion !== 'all'"
        class="rounded-full bg-indigo-50
        px-3 py-1.5 text-[9px] font-bold
        uppercase tracking-wider text-indigo-600"
      >
        {{ selectedRegion }}
      </span>
    </div>

    <!-- Article grid -->

    <div
      v-if="visibleArticles.length"
      class="mt-6 grid gap-6 md:grid-cols-2"
    >
      <NewsSharedArticleCard
        v-for="article in visibleArticles"
        :key="article.id"
        :article="article"
      />
    </div>

    <!-- Empty state -->

    <div
      v-else
      class="mt-7 rounded-[28px]
      border border-dashed border-line-strong
      bg-surface px-6 py-16 text-center"
    >
      <div
        class="mx-auto flex h-14 w-14
        items-center justify-center
        rounded-2xl bg-surface-2
        text-xl text-fg-subtle"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <circle cx="11" cy="11" r="7" />

          <path d="m20 20-3.5-3.5" />
        </svg>
      </div>

      <h3
        class="mt-5 text-xl font-bold
        text-fg"
      >
        No news found
      </h3>

      <p
        class="mx-auto mt-2 max-w-md
        text-sm leading-6 text-fg-subtle"
      >
        No stories are currently available for
        {{ formatRegion(selectedRegion) }}.
      </p>

      <button
        type="button"
        class="mt-6 rounded-xl
        bg-accent text-accent-fg px-5 py-3
        text-xs font-bold text-white
        transition-all hover:bg-indigo-600"
        @click="clearFilters"
      >
        Show all stories
      </button>
    </div>

    <!-- Load more -->

    <div
      v-if="canLoadMore"
      class="mt-10 text-center"
    >
      <button
        type="button"
        class="rounded-2xl border
        border-line bg-surface
        px-7 py-3.5 text-sm font-bold
        text-fg-muted transition-all
        hover:-translate-y-0.5
        hover:border-indigo-300
        hover:text-indigo-600
        hover:shadow-lg"
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