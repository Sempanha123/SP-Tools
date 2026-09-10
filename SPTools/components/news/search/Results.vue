<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

interface Props {
    articles: NewsArticle[]
    totalResults: number
    query: string
    currentPage: number
    totalPages: number
}

defineProps<Props>()

const emit = defineEmits<{
    (
        event: 'changePage',
        page: number,
    ): void

    (
        event: 'clearFilters',
    ): void
}>()
</script>

<template>
    <section id="search-results" class="scroll-mt-32">
        <!-- Heading -->

        <div class="flex flex-col
      justify-between gap-4
      border-b border-line
      pb-7 sm:flex-row
      sm:items-end">
            <div>
                <span class="text-xs font-bold
          uppercase tracking-[0.18em]
          text-indigo-600">
                    Search results
                </span>

                <h2 class="mt-3 text-3xl
          font-bold
          tracking-[-0.035em]
          text-fg">
                    <template v-if="query.trim()">
                        Results for

                        <span class="text-fg-subtle">
                            “{{ query.trim() }}”
                        </span>
                    </template>

                    <template v-else>
                        Browse all

                        <span class="text-fg-subtle">
                            available stories
                        </span>
                    </template>
                </h2>

                <p class="mt-3 text-sm
          text-fg-subtle">
                    {{ totalResults }}

                    {{
                        totalResults === 1
                            ? 'article found'
                            : 'articles found'
                    }}
                </p>
            </div>

            <div v-if="
                totalPages > 1
            " class="rounded-full
        border border-line
        bg-surface px-4 py-2
        text-[10px] font-bold
        uppercase tracking-wider
        text-fg-subtle">
                Page {{ currentPage }}
                of {{ totalPages }}
            </div>
        </div>

        <!-- Articles -->

        <div v-if="articles.length" class="mt-8 grid
      gap-6 md:grid-cols-2">
            <NewsSharedArticleCard v-for="article in articles" :key="article.id" :article="article" />
        </div>

        <!-- Empty state -->

        <div v-else class="mt-8
      rounded-[30px]
      border border-dashed
      border-line-strong
      bg-surface px-6 py-20
      text-center">
            <div class="mx-auto flex
        h-16 w-16
        items-center justify-center
        rounded-2xl
        bg-surface-2
        text-2xl text-fg-subtle">
                ⌕
            </div>

            <h3 class="mt-6
        text-2xl font-bold
        text-fg">
                No matching stories
            </h3>

            <p class="mx-auto mt-3
        max-w-md text-sm
        leading-7 text-fg-subtle">
                Try a broader search
                term, select another
                category, change the
                date range, or remove
                some active filters.
            </p>

            <button type="button" class="mt-7
        rounded-xl
        bg-accent text-accent-fg
        px-6 py-3
        text-xs font-bold
        text-white
        transition-all
        hover:bg-indigo-600" @click="
            emit('clearFilters')
            ">
                Clear all filters
            </button>
        </div>

        <!-- Pagination -->

        <div v-if="
            totalPages > 1
        " class="mt-12 flex
      flex-wrap items-center
      justify-center gap-2">
            <button type="button" class="flex h-11
        items-center
        justify-center
        rounded-xl border
        border-line
        bg-surface px-4
        text-xs font-semibold
        text-fg-muted
        transition-all
        hover:border-indigo-200
        hover:text-indigo-600
        disabled:cursor-not-allowed
        disabled:opacity-40" :disabled="currentPage === 1
            " @click="
                emit(
                    'changePage',
                    currentPage - 1,
                )
                ">
                ← Previous
            </button>

            <button v-for="page in totalPages" :key="page" type="button" class="flex h-11 w-11
        items-center
        justify-center
        rounded-xl border
        text-xs font-bold
        transition-all" :class="currentPage === page
            ? 'border-accent bg-accent text-accent-fg'
            : 'border-line bg-surface text-fg-muted hover:border-indigo-300 hover:text-indigo-600'
            " @click="
                emit(
                    'changePage',
                    page,
                )
                ">
                {{ page }}
            </button>

            <button type="button" class="flex h-11
        items-center
        justify-center
        rounded-xl border
        border-line
        bg-surface px-4
        text-xs font-semibold
        text-fg-muted
        transition-all
        hover:border-indigo-200
        hover:text-indigo-600
        disabled:cursor-not-allowed
        disabled:opacity-40" :disabled="currentPage ===
            totalPages
            " @click="
                emit(
                    'changePage',
                    currentPage + 1,
                )
                ">
                Next →
            </button>
        </div>
    </section>
</template>