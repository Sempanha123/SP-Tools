<script setup lang="ts">
import type {
    TagNewsSort,
} from '~/composables/useNewsTagPage'

const {
    tagName,
    tagDescription,

    articles: tagArticles,
    leadArticle: featuredArticle,
    remainingArticles,

    relatedTags,
    mostReadArticles: mostReadInTag,

    pagination,

    page,
    sort,
    searchQuery,
    region,

    pending,
    error,
    refresh,

    applyFilters,
    goToPage,
    clearFilters,
} = await useNewsTagPage()

const {
    timeAgo,
    formatViews,
} = useNewsData()

const latestPublishedAt = computed(() => {
    return (
        featuredArticle.value?.publishedAt
        ?? ''
    )
})

const relatedTagItems = computed(() => {
    return relatedTags.value.map(tag => ({
        name: tag.name,
        slug: tag.slug,
        count: tag.articlesCount,
    }))
})

const retryLoad = async (): Promise<void> => {
    await refresh()
}

const createTagSlug = (
    value: string,
): string => {
    return value
        .trim()
        .toLowerCase()
        .normalize('NFKD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}

const featuredTagLinks = computed(() => {
    const currentArticle =
        featuredArticle.value

    if (!currentArticle) {
        return []
    }

    return currentArticle.tags
        .slice(0, 2)
        .map((name, index) => ({
            name,

            slug:
                currentArticle.tagSlugs?.[index]
                || createTagSlug(name),
        }))
})
</script>

<template>
    <main class="min-h-screen overflow-hidden
    bg-surface text-fg">
        <!-- Tag hero -->

        <NewsTagHeader :tag-name="tagName" :article-count="tagArticles.length"
            :latest-published-at="latestPublishedAt" />

        <!-- Category navigation -->

        <NewsHomeCategoryNav />

        <!-- ===================================================== -->
        <!-- FEATURED TAG STORY -->
        <!-- ===================================================== -->

        <section v-if="featuredArticle" class="bg-surface py-16 sm:py-20 lg:py-24">
            <div class="mx-auto max-w-7xl px-6">
                <div class="mb-7 flex flex-col
          justify-between gap-4
          sm:flex-row sm:items-end">
                    <div>
                        <div class="inline-flex items-center gap-2
              text-[10px] font-bold uppercase
              tracking-[0.18em] text-red-600">
                            <span class="h-px w-7 bg-red-500" />

                            Lead story
                        </div>

                        <h2 class="mt-3 text-3xl font-bold
              tracking-[-0.04em]
              text-fg">
                            Featured under
                            <span class="text-indigo-500">
                                #{{ tagName }}
                            </span>
                        </h2>
                    </div>

                    <div class="inline-flex w-fit items-center
            gap-2 rounded-full border
            border-line bg-surface-2
            px-4 py-2 text-[10px]
            font-semibold text-fg-subtle">
                        <span class="h-1.5 w-1.5 rounded-full
              bg-emerald-500" />

                        Latest tagged report
                    </div>
                </div>

                <div class="grid items-stretch gap-6
          lg:grid-cols-[minmax(0,1fr)_300px]">
                    <!-- Featured card -->

                    <NuxtLink :to="`/news/posts/${featuredArticle.slug}`" class="group relative min-h-[430px]
            overflow-hidden rounded-[32px]
            bg-accent text-accent-fg shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
                        <img v-if="featuredArticle.image" :src="featuredArticle.image" :alt="featuredArticle.title"
                            class="absolute inset-0 h-full w-full
              object-cover transition-transform
              duration-700 group-hover:scale-105" />

                        <div v-else class="absolute inset-0
  flex items-center justify-center
  bg-gradient-to-br
  from-slate-800 via-slate-900
  to-indigo-950">
                            <div class="text-center text-white/60">
                                <svg class="mx-auto h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    stroke-width="1.5" aria-hidden="true">
                                    <rect x="3" y="4" width="18" height="16" rx="2" />

                                    <circle cx="8.5" cy="9" r="1.5" />

                                    <path d="m3 16 5-5 4 4 3-3 6 6" />
                                </svg>

                                <p class="mt-3 text-xs font-bold
      uppercase tracking-wider">
                                    No cover image
                                </p>
                            </div>
                        </div>

                        <div class="absolute inset-0
              bg-gradient-to-t from-slate-950
              via-slate-950/55 to-slate-950/5" />

                        <div class="absolute inset-x-0 top-0
              flex items-start justify-between
              gap-4 p-6">
                            <div class="flex flex-wrap gap-2">
                                <span v-if="featuredArticle.isBreaking" class="rounded-full bg-red-600
                  px-3 py-1.5 text-[9px]
                  font-bold uppercase
                  tracking-wider text-white">
                                    Breaking
                                </span>

                                <span v-if="featuredArticle.isLive" class="inline-flex items-center gap-1.5
                  rounded-full bg-surface/90
                  px-3 py-1.5 text-[9px]
                  font-bold uppercase
                  tracking-wider text-red-600
                  backdrop-blur">
                                    <span class="h-1.5 w-1.5
                    rounded-full bg-red-500" />

                                    Live
                                </span>
                            </div>

                            <span class="flex h-11 w-11
                items-center justify-center
                rounded-2xl border
                border-line/15 bg-surface/10
                text-white backdrop-blur
                transition-transform
                group-hover:translate-x-1">
                                ↗
                            </span>
                        </div>

                        <div class="absolute inset-x-0 bottom-0
              max-w-4xl p-7 sm:p-9">
                            <div class="flex flex-wrap gap-2">
                                <span class="rounded-full bg-indigo-600
                  px-3 py-1.5 text-[9px]
                  font-bold uppercase
                  tracking-wider text-white">
                                    {{ featuredArticle.categoryName }}
                                </span>

                                <NuxtLink v-for="tag in featuredTagLinks" :key="tag.slug" :to="`/news/tag/${tag.slug}`"
                                    class="relative z-20 rounded-full
  border border-line/15
  bg-surface/10 px-3 py-1.5
  text-[9px] font-semibold
  text-white backdrop-blur
  transition-colors
  hover:bg-surface/20" @click.stop>
                                    #{{ tag.name }}
                                </NuxtLink>
                            </div>

                            <h3 class="mt-5 max-w-3xl
                text-3xl font-bold leading-tight
                tracking-[-0.045em] text-white
                sm:text-4xl">
                                {{ featuredArticle.title }}
                            </h3>

                            <p class="mt-4 max-w-2xl
                text-sm leading-7 text-fg-subtle">
                                {{ featuredArticle.excerpt }}
                            </p>

                            <div class="mt-6 flex flex-wrap
                items-center gap-3
                text-[10px] text-fg-subtle">
                                <time :datetime="featuredArticle.publishedAt">
                                    {{ timeAgo(featuredArticle.publishedAt) }}
                                </time>

                                <span>•</span>

                                <span>
                                    {{ featuredArticle.readTime }}
                                </span>

                                <span>•</span>

                                <span>
                                    {{ formatViews(featuredArticle.views) }}
                                    views
                                </span>
                            </div>
                        </div>
                    </NuxtLink>

                    <!-- Featured information -->

                    <div class="grid gap-4 sm:grid-cols-3
            lg:grid-cols-1">
                        <div class="rounded-[26px]
              border border-line
              bg-surface-2 p-6">
                            <span class="text-[9px] font-bold
                uppercase tracking-[0.16em]
                text-indigo-600">
                                Tagged stories
                            </span>

                            <p class="mt-3 text-4xl font-bold
                tracking-[-0.04em]
                text-fg">
                                {{ tagArticles.length }}
                            </p>

                            <p class="mt-2 text-xs
                leading-5 text-fg-subtle">
                                Reports currently connected
                                to #{{ tagName }}.
                            </p>
                        </div>

                        <div class="rounded-[26px]
              border border-line
              bg-surface p-6">
                            <span class="text-[9px] font-bold
                uppercase tracking-[0.16em]
                text-emerald-600">
                                Latest update
                            </span>

                            <p class="mt-3 text-xl font-bold
                text-fg">
                                {{ timeAgo(featuredArticle.publishedAt) }}
                            </p>

                            <p class="mt-2 text-xs
                leading-5 text-fg-subtle">
                                New reports are ordered
                                by publication time.
                            </p>
                        </div>

                        <div class="relative overflow-hidden
              rounded-[26px] bg-accent text-accent-fg
              p-6 text-white">
                            <div class="pointer-events-none
                absolute -right-12 -top-12
                h-32 w-32 rounded-full
                bg-indigo-500/30 blur-3xl" />

                            <div class="relative">
                                <span class="text-[9px] font-bold
                  uppercase tracking-[0.16em]
                  text-indigo-300">
                                    Explore coverage
                                </span>

                                <p class="mt-3 text-lg
                  font-bold leading-6">
                                    Discover connected reports
                                    and developing stories.
                                </p>

                                <a href="#tag-stories" class="mt-5 inline-flex
                  items-center gap-2 rounded-xl
                  bg-surface px-4 py-2.5
                  text-[10px] font-bold
                  text-fg">
                                    Browse stories

                                    <span>↓</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===================================================== -->
        <!-- TAG ARTICLES -->
        <!-- ===================================================== -->

        <section id="tag-stories" class="scroll-mt-32 border-y
      border-line bg-surface-2
      py-16 sm:py-20 lg:py-24">
            <div class="mx-auto max-w-7xl px-6">
                <div class="grid items-start gap-8
          lg:grid-cols-[minmax(0,1fr)_360px]
          xl:gap-10">
                    <div class="min-w-0">
                        <NewsTagArticleGrid :articles="remainingArticles" :tag-name="tagName" />
                    </div>

                    <div class="min-w-0">
                        <NewsTagRelatedTags :current-tag="tagName" :related-tags="relatedTagItems"
                            :most-read="mostReadInTag" />
                    </div>
                </div>
            </div>
        </section>

        <!-- Topic discovery -->

        <NewsHomeTopics />

        <!-- Newsletter -->

        <NewsHomeNewsletter />
    </main>
</template>