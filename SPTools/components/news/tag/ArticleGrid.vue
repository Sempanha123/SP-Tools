<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

interface Props {
  articles: NewsArticle[]
  tagName: string
}

const props = defineProps<Props>()

type SortMode = 'latest' | 'popular'

const searchQuery = ref('')
const sortMode = ref<SortMode>('latest')
const visibleCount = ref(6)

const filteredArticles = computed(() => {
  const keyword = searchQuery.value
    .trim()
    .toLowerCase()

  let result = [...props.articles]

  if (keyword) {
    result = result.filter((article) => {
      const searchableText = [
        article.title,
        article.excerpt,
        article.categoryName,
        article.region,
        ...article.tags,
      ]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(keyword)
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

watch(
  [searchQuery, sortMode],
  () => {
    visibleCount.value = 6
  },
)

const clearSearch = () => {
  searchQuery.value = ''
  sortMode.value = 'latest'
}
</script>

<template>
  <section class="min-w-0">
    <!-- Heading -->

    <div>
      <div
        class="inline-flex items-center gap-2
        text-[10px] font-bold uppercase
        tracking-[0.18em] text-indigo-600"
      >
        <span
          class="h-px w-7 bg-indigo-500"
        />

        Tagged coverage
      </div>

      <div
        class="mt-3 flex flex-col
        justify-between gap-5
        sm:flex-row sm:items-end"
      >
        <div>
          <h2
            class="text-3xl font-bold
            tracking-[-0.04em]
            text-slate-950"
          >
            Latest stories about

            <span class="text-indigo-500">
              #{{ tagName }}
            </span>
          </h2>

          <p
            class="mt-3 text-sm
            text-slate-500"
          >
            {{ filteredArticles.length }}
            {{
              filteredArticles.length === 1
                ? 'article matches'
                : 'articles match'
            }}
            this topic.
          </p>
        </div>
      </div>
    </div>

    <!-- Controls -->

    <div
      class="mt-7 flex flex-col gap-3
      rounded-2xl border
      border-slate-200 bg-white p-2
      shadow-[0_10px_30px_rgba(15,23,42,0.04)]
      sm:flex-row sm:items-center"
    >
      <div
        class="relative min-w-0 flex-1"
      >
        <svg
          class="pointer-events-none
          absolute left-4 top-1/2
          h-4 w-4 -translate-y-1/2
          text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>

        <input
          v-model="searchQuery"
          type="search"
          :placeholder="`Search #${tagName} stories...`"
          class="h-11 w-full rounded-xl
          border-0 bg-slate-50
          pl-11 pr-4 text-xs
          text-slate-700 outline-none
          ring-0 placeholder:text-slate-400
          focus:bg-indigo-50"
        />
      </div>

      <div
        class="flex items-center
        rounded-xl bg-slate-100 p-1"
      >
        <button
          type="button"
          class="flex-1 rounded-lg
          px-4 py-2.5 text-[10px]
          font-bold transition-all"
          :class="
            sortMode === 'latest'
              ? 'bg-slate-950 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-950'
          "
          @click="sortMode = 'latest'"
        >
          Latest
        </button>

        <button
          type="button"
          class="flex-1 rounded-lg
          px-4 py-2.5 text-[10px]
          font-bold transition-all"
          :class="
            sortMode === 'popular'
              ? 'bg-slate-950 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-950'
          "
          @click="sortMode = 'popular'"
        >
          Popular
        </button>
      </div>
    </div>

    <!-- Cards -->

    <div
      v-if="visibleArticles.length"
      class="mt-7 grid gap-6
      md:grid-cols-2"
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
      border border-dashed
      border-slate-300 bg-white
      px-6 py-16 text-center"
    >
      <div
        class="mx-auto flex h-14 w-14
        items-center justify-center
        rounded-2xl bg-slate-100
        text-slate-500"
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
        text-slate-950"
      >
        No matching stories
      </h3>

      <p
        class="mx-auto mt-2 max-w-md
        text-sm leading-6
        text-slate-500"
      >
        No #{{ tagName }} stories match
        your current search.
      </p>

      <button
        type="button"
        class="mt-6 rounded-xl
        bg-slate-950 px-5 py-3
        text-xs font-bold text-white
        transition-colors
        hover:bg-indigo-600"
        @click="clearSearch"
      >
        Clear search
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
        border-slate-200 bg-white
        px-7 py-3.5 text-xs
        font-bold text-slate-700
        transition-all
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