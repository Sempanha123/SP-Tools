<script setup lang="ts">
import type {
  NewsArticle,
} from '~/types/news'

type SortMode =
  | 'latest'
  | 'popular'

interface Props {
  articles: NewsArticle[]
  authorName: string
}

const props = defineProps<Props>()

const searchQuery = ref('')
const sortMode = ref<SortMode>('latest')
const selectedCategory = ref('all')

/* =========================================================
   CATEGORY OPTIONS
========================================================= */

const categoryOptions = computed<string[]>(() => {
  const categories = props.articles
    .map(article =>
      article.categoryName?.trim(),
    )
    .filter(
      (category): category is string =>
        Boolean(category),
    )

  return [
    'all',
    ...Array.from(
      new Set(categories),
    ).sort(
      (first, second) =>
        first.localeCompare(second),
    ),
  ]
})

/* =========================================================
   FILTERED ARTICLES
========================================================= */

const filteredArticles = computed<NewsArticle[]>(() => {
  const query = searchQuery.value
    .trim()
    .toLowerCase()

  let results = props.articles.filter(
    article => {
      const title =
        article.title?.toLowerCase()
        ?? ''

      const excerpt =
        article.excerpt?.toLowerCase()
        ?? ''

      const author =
        article.author?.toLowerCase()
        ?? ''

      const source =
        article.source?.toLowerCase()
        ?? ''

      const region =
        article.region?.toLowerCase()
        ?? ''

      const tags =
        article.tags ?? []

      const matchesSearch =
        !query
        || title.includes(query)
        || excerpt.includes(query)
        || author.includes(query)
        || source.includes(query)
        || region.includes(query)
        || tags.some(tag =>
          tag.toLowerCase().includes(query),
        )

      const matchesCategory =
        selectedCategory.value === 'all'
        || article.categoryName
        === selectedCategory.value

      return (
        matchesSearch
        && matchesCategory
      )
    },
  )

  if (sortMode.value === 'popular') {
    results = [...results].sort(
      (first, second) =>
        second.views - first.views,
    )
  } else {
    results = [...results].sort(
      (first, second) => {
        const firstDate = new Date(
          first.publishedAt,
        ).getTime()

        const secondDate = new Date(
          second.publishedAt,
        ).getTime()

        return secondDate - firstDate
      },
    )
  }

  return results
})

/* =========================================================
   FILTER STATE
========================================================= */

const hasActiveFilters = computed(() => {
  return Boolean(
    searchQuery.value.trim()
    || selectedCategory.value !== 'all'
    || sortMode.value !== 'latest',
  )
})

const clearFilters = (): void => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  sortMode.value = 'latest'
}
</script>

<template>
  <section id="author-stories" class="scroll-mt-32">
    <!-- Header -->

    <div class="flex flex-col justify-between
      gap-6 border-b border-line
      pb-7 xl:flex-row xl:items-end">
      <div>
        <span class="text-xs font-bold uppercase
          tracking-[0.18em] text-indigo-600">
          Author archive
        </span>

        <h2 class="mt-3 text-3xl font-bold
          tracking-[-0.035em]">
          Articles by

          <span class="text-fg-subtle">
            {{ authorName }}
          </span>
        </h2>

        <p class="mt-3 text-sm text-fg-subtle">
          {{ filteredArticles.length }}

          {{
            filteredArticles.length === 1
              ? 'article on this page'
              : 'articles on this page'
          }}
        </p>
      </div>

      <!-- Search and sorting -->

      <div class="flex w-full flex-col gap-3
        sm:flex-row xl:w-auto">
        <div class="relative sm:w-72">
          <svg class="pointer-events-none absolute
            left-4 top-1/2 h-4 w-4
            -translate-y-1/2 text-fg-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            aria-hidden="true">
            <circle cx="11" cy="11" r="7" />

            <path d="m20 20-3.5-3.5" />
          </svg>

          <input v-model="searchQuery" type="search" placeholder="Search author articles..." class="h-12 w-full rounded-xl
            border border-line bg-surface
            pl-11 pr-4 text-sm outline-none
            transition-all
            placeholder:text-fg-subtle
            focus:border-indigo-400
            focus:ring-4
            focus:ring-indigo-500/10">
        </div>

        <div class="flex items-center rounded-xl
          border border-line bg-surface p-1">
          <button type="button" class="flex-1 rounded-lg px-4 py-2.5
            text-xs font-semibold transition-all" :class="sortMode === 'latest'
                ? 'bg-accent text-accent-fg text-white shadow-sm'
                : 'text-fg-subtle hover:text-fg'
              " @click="sortMode = 'latest'">
            Latest
          </button>

          <button type="button" class="flex-1 rounded-lg px-4 py-2.5
            text-xs font-semibold transition-all" :class="sortMode === 'popular'
                ? 'bg-accent text-accent-fg text-white shadow-sm'
                : 'text-fg-subtle hover:text-fg'
              " @click="sortMode = 'popular'">
            Popular
          </button>
        </div>
      </div>
    </div>

    <!-- Category filters -->

    <div v-if="categoryOptions.length > 1" class="author-category-scroll mt-6
      flex gap-2 overflow-x-auto pb-1">
      <button v-for="category in categoryOptions" :key="category" type="button" class="shrink-0 rounded-full border
        px-4 py-2 text-[10px] font-bold
        uppercase tracking-wider
        transition-all" :class="selectedCategory === category
            ? 'border-indigo-600 bg-indigo-600 text-white'
            : 'border-line bg-surface text-fg-subtle hover:border-indigo-200 hover:text-indigo-600'
          " @click="
          selectedCategory = category
          ">
        {{
          category === 'all'
            ? 'All categories'
            : category
        }}
      </button>
    </div>

    <!-- Active filters -->

    <div v-if="hasActiveFilters" class="mt-5 flex flex-wrap
      items-center gap-3">
      <span class="text-xs font-medium
        text-fg-subtle">
        Showing filtered results
      </span>

      <button type="button" class="text-xs font-bold
        text-red-600 transition-colors
        hover:text-red-800" @click="clearFilters">
        Clear filters
      </button>
    </div>

    <!-- Articles -->

    <div v-if="filteredArticles.length" class="mt-8 grid gap-6 md:grid-cols-2">
      <NewsSharedArticleCard v-for="article in filteredArticles" :key="article.id" :article="article" />
    </div>

    <!-- Empty state -->

    <div v-else class="mt-8 rounded-[28px]
      border border-dashed
      border-line-strong bg-surface
      px-6 py-16 text-center">
      <div class="mx-auto flex h-14 w-14
        items-center justify-center
        rounded-2xl bg-surface-2
        text-xl">
        ⌕
      </div>

      <h3 class="mt-5 text-xl font-bold">
        No articles found
      </h3>

      <p class="mx-auto mt-2 max-w-md
        text-sm leading-6 text-fg-subtle">
        No articles by {{ authorName }}
        matched your current search
        and category filters.
      </p>

      <button v-if="hasActiveFilters" type="button" class="mt-6 rounded-xl
        bg-accent text-accent-fg px-5 py-3
        text-xs font-bold text-white" @click="clearFilters">
        Clear filters
      </button>
    </div>
  </section>
</template>

<style scoped>
.author-category-scroll {
  scrollbar-width: none;
}

.author-category-scroll::-webkit-scrollbar {
  display: none;
}
</style>