<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

interface TrendingTag {
    name: string
    count: number
}

interface Props {
    mostRead: NewsArticle[]
    trendingTags: TrendingTag[]
}

const props = defineProps<Props>()

const {
    timeAgo,
    formatViews,
} = useNewsData()

const leadArticle = computed(() => {
    return props.mostRead[0] || null
})

const remainingArticles = computed(() => {
    return props.mostRead.slice(1, 6)
})

const tagToSlug = (tag: string) => {
    return tag
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}
</script>

<template>
    <aside class="min-w-0 space-y-6 lg:sticky lg:top-36">

        <!-- ===================================================== -->
        <!-- TRENDING SEARCHES -->
        <!-- ===================================================== -->

        <section class="overflow-hidden rounded-[28px]
      border border-slate-200 bg-white
      shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
            <header class="flex items-start justify-between gap-4
        border-b border-slate-100 px-6 py-5">
                <div>
                    <span class="text-[10px] font-bold uppercase
            tracking-[0.18em] text-indigo-600">
                        Explore more
                    </span>

                    <h2 class="mt-2 text-xl font-bold
            tracking-[-0.025em] text-slate-950">
                        Related topics
                    </h2>

                    <p class="mt-2 text-xs leading-5 text-slate-500">
                        Topics frequently appearing with
                    </p>
                </div>

                <div class="flex h-10 w-10 shrink-0
          items-center justify-center rounded-xl
          bg-indigo-50 font-bold text-indigo-600">
                    #
                </div>
            </header>

            <div class="p-5">
                <div v-if="trendingTags.length" class="flex flex-wrap gap-2">
                    <NuxtLink v-for="tag in trendingTags" :key="tag.name" :to="`/news/tag/${tagToSlug(tag.name)}`"
                        class="group inline-flex items-center gap-1.5
      rounded-full border border-slate-200
      bg-slate-50 px-3.5 py-2
      text-[10px] font-semibold text-slate-600
      transition-all duration-200
      hover:-translate-y-0.5
      hover:border-indigo-200
      hover:bg-indigo-50
      hover:text-indigo-600">
                        <span>
                            #{{ tag.name }}
                        </span>

                        <span class="rounded-full bg-white
        px-1.5 py-0.5 text-[8px]
        text-slate-400 shadow-sm
        group-hover:text-indigo-500">
                            {{ tag.count }}
                        </span>
                    </NuxtLink>
                </div>

                <div v-else class="rounded-2xl border border-dashed
    border-slate-200 bg-slate-50
    px-4 py-8 text-center">
                    <p class="text-sm font-bold text-slate-700">
                        No related topics
                    </p>

                    <p class="mt-2 text-xs leading-5 text-slate-500">
                        Change your search or remove some filters to discover more topics.
                    </p>
                </div>

                <NuxtLink to="/news" class="group mt-5 flex items-center
    justify-between rounded-xl bg-slate-50
    px-4 py-3 text-xs font-bold
    text-slate-600 transition-all
    hover:bg-indigo-50 hover:text-indigo-600">
                    Explore all coverage

                    <span class="transition-transform
      group-hover:translate-x-1">
                        →
                    </span>
                </NuxtLink>
            </div>
        </section>

        <!-- ===================================================== -->
        <!-- MOST READ -->
        <!-- ===================================================== -->

        <section class="overflow-hidden rounded-[28px]
      border border-slate-200 bg-white
      shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
            <!-- Dark header -->

            <header class="relative overflow-hidden
        bg-slate-950 px-6 py-6 text-white">
                <div class="pointer-events-none absolute
          -right-16 -top-16 h-44 w-44
          rounded-full bg-red-500/20 blur-3xl" />

                <div class="pointer-events-none absolute
          -bottom-20 left-4 h-40 w-40
          rounded-full bg-indigo-500/20 blur-3xl" />

                <div class="relative flex items-start justify-between gap-5">
                    <div>
                        <div class="inline-flex items-center gap-2
              text-[10px] font-bold uppercase
              tracking-[0.18em] text-red-300">
                            <span class="relative flex h-2 w-2">
                                <span class="absolute inline-flex h-full w-full
                  animate-ping rounded-full
                  bg-red-400 opacity-50" />

                                <span class="relative inline-flex h-2 w-2
                  rounded-full bg-red-500" />
                            </span>

                            Trending now
                        </div>

                        <h2 class="mt-3 text-2xl font-bold
              tracking-[-0.035em]">
                            Most-read stories
                        </h2>

                        <p class="mt-2 text-xs leading-5 text-slate-400">
                            The reports attracting the most attention.
                        </p>
                    </div>

                    <NuxtLink :to="{
                        path: '/news/search',
                        query: {
                            sort: 'popular',
                        },
                    }" aria-label="View popular stories" class="flex h-10 w-10 shrink-0
            items-center justify-center rounded-xl
            border border-white/10 bg-white/[0.07]
            text-white transition-all
            hover:bg-white/15">
                        ↗
                    </NuxtLink>
                </div>
            </header>

            <!-- Featured most-read story -->

            <div v-if="leadArticle" class="p-4">
                <NuxtLink :to="`/news/posts/${leadArticle.slug}`" class="group relative block min-h-[220px]
          overflow-hidden rounded-[22px] bg-slate-950">
                    <img v-if="leadArticle?.image" :src="leadArticle.image" :alt="leadArticle.title" loading="lazy"
                        class="absolute inset-0 h-full w-full
  object-cover transition-transform
  duration-700 group-hover:scale-105" />

                    <div v-else class="absolute inset-0 flex items-center
  justify-center bg-gradient-to-br
  from-slate-100 to-slate-300">
                        <span class="text-5xl" aria-hidden="true">
                            📰
                        </span>
                    </div>

                    <div class="absolute inset-0 bg-gradient-to-t
            from-slate-950 via-slate-950/45 to-transparent" />

                    <!-- Ranking and status -->

                    <div class="absolute left-4 top-4 flex items-center gap-2">
                        <span class="flex h-8 min-w-8 items-center
              justify-center rounded-xl bg-red-600
              px-2 text-xs font-bold text-white
              shadow-lg">
                            01
                        </span>

                        <span v-if="leadArticle.isBreaking" class="rounded-full bg-white/90
              px-3 py-1.5 text-[8px] font-bold
              uppercase tracking-wider text-red-600
              backdrop-blur">
                            Breaking
                        </span>

                        <span v-else-if="leadArticle.isLive" class="inline-flex items-center gap-1.5
              rounded-full bg-white/90
              px-3 py-1.5 text-[8px] font-bold
              uppercase tracking-wider text-red-600
              backdrop-blur">
                            <span class="h-1.5 w-1.5 rounded-full bg-red-500" />

                            Live
                        </span>
                    </div>

                    <!-- Story information -->

                    <div class="absolute inset-x-0 bottom-0 p-5">
                        <div class="flex items-center gap-2">
                            <span class="text-[9px] font-bold uppercase
                tracking-[0.15em] text-indigo-300">
                                {{ leadArticle.categoryName }}
                            </span>

                            <span class="text-[9px] text-slate-400">
                                {{ leadArticle.region }}
                            </span>
                        </div>

                        <h3 class="mt-2 text-lg font-bold leading-6
              text-white transition-colors
              group-hover:text-indigo-200">
                            {{ leadArticle.title }}
                        </h3>

                        <div class="mt-4 flex flex-wrap items-center
              gap-2 text-[10px] text-slate-300">
                            <time :datetime="leadArticle.publishedAt">
                                {{ timeAgo(leadArticle.publishedAt) }}
                            </time>

                            <span>•</span>

                            <span>
                                {{ formatViews(leadArticle.views) }} views
                            </span>

                            <span>•</span>

                            <span>
                                {{ leadArticle.readTime }}
                            </span>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <!-- Remaining ranked stories -->

            <div v-if="remainingArticles.length" class="divide-y divide-slate-100 px-4 pb-4">
                <NuxtLink v-for="(article, index) in remainingArticles" :key="article.id"
                    :to="`/news/posts/${article.slug}`" class="group grid grid-cols-[76px_minmax(0,1fr)]
          gap-4 py-4 first:pt-2">
                    <!-- Thumbnail -->

                    <div class="relative h-[76px] overflow-hidden
            rounded-2xl bg-slate-100">
                        <img v-if="article.image" :src="article.image" :alt="article.title" loading="lazy" class="h-full w-full object-cover
  transition-transform duration-500
  group-hover:scale-105" />

                        <div v-else class="flex h-full min-h-40 items-center
  justify-center bg-gradient-to-br
  from-slate-100 to-slate-200">
                            <span class="text-4xl" aria-hidden="true">
                                📰
                            </span>
                        </div>

                        <span class="absolute left-1.5 top-1.5
              flex h-6 min-w-6 items-center
              justify-center rounded-lg
              bg-slate-950/85 px-1.5
              text-[8px] font-bold text-white
              backdrop-blur">
                            {{ String(index + 2).padStart(2, '0') }}
                        </span>
                    </div>

                    <!-- Text -->

                    <div class="min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="text-[8px] font-bold uppercase
                tracking-[0.14em] text-indigo-600">
                                {{ article.categoryName }}
                            </span>

                            <span v-if="article.isBreaking" class="text-[8px] font-bold uppercase
                tracking-wider text-red-600">
                                Breaking
                            </span>
                        </div>

                        <h3 class="sidebar-story-title mt-1.5
              text-sm font-bold leading-5
              text-slate-800 transition-colors
              group-hover:text-indigo-600">
                            {{ article.title }}
                        </h3>

                        <div class="mt-2 flex flex-wrap items-center
              gap-2 text-[9px] text-slate-400">
                            <time :datetime="article.publishedAt">
                                {{ timeAgo(article.publishedAt) }}
                            </time>

                            <span>•</span>

                            <span>
                                {{ formatViews(article.views) }} views
                            </span>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <!-- Footer action -->

            <div class="border-t border-slate-100 p-4">
                <NuxtLink :to="{
                    path: '/news/search',
                    query: {
                        sort: 'popular',
                    },
                }" class="group flex w-full items-center
          justify-center gap-2 rounded-xl
          bg-slate-50 px-5 py-3
          text-xs font-bold text-slate-700
          transition-all hover:bg-indigo-50
          hover:text-indigo-600">
                    View all popular stories

                    <span class="transition-transform
            group-hover:translate-x-1">
                        →
                    </span>
                </NuxtLink>
            </div>
        </section>

        <!-- ===================================================== -->
        <!-- SEARCH HELP -->
        <!-- ===================================================== -->

        <section class="relative overflow-hidden rounded-[28px]
      bg-gradient-to-br from-slate-950
      via-slate-950 to-indigo-950
      p-6 text-white
      shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
            <div class="pointer-events-none absolute
        -right-16 -top-16 h-44 w-44
        rounded-full bg-indigo-500/25 blur-3xl" />

            <div class="relative">
                <div class="flex h-11 w-11 items-center
          justify-center rounded-2xl
          border border-white/10 bg-white/[0.08]
          text-indigo-300">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                    </svg>
                </div>

                <p class="mt-6 text-[9px] font-bold uppercase
          tracking-[0.17em] text-indigo-300">
                    Search tips
                </p>

                <h3 class="mt-2 text-lg font-bold">
                    Find better results
                </h3>

                <p class="mt-3 text-xs leading-6 text-slate-400">
                    Search by country, region, author, organization,
                    event or topic. Combine search terms with category,
                    region and date filters.
                </p>

                <div class="mt-5 grid grid-cols-2 gap-2
          text-[10px] font-semibold">
                    <NuxtLink :to="{
                        path: '/news/search',
                        query: { q: 'technology' },
                    }" class="rounded-xl border border-white/10
            bg-white/[0.05] px-3 py-2.5
            text-slate-300 transition-all
            hover:bg-white/10 hover:text-white">
                        Technology
                    </NuxtLink>

                    <NuxtLink :to="{
                        path: '/news/search',
                        query: { q: 'business' },
                    }" class="rounded-xl border border-white/10
            bg-white/[0.05] px-3 py-2.5
            text-slate-300 transition-all
            hover:bg-white/10 hover:text-white">
                        Business
                    </NuxtLink>

                    <NuxtLink :to="{
                        path: '/news/search',
                        query: { q: 'climate' },
                    }" class="rounded-xl border border-white/10
            bg-white/[0.05] px-3 py-2.5
            text-slate-300 transition-all
            hover:bg-white/10 hover:text-white">
                        Climate
                    </NuxtLink>

                    <NuxtLink :to="{
                        path: '/news/search',
                        query: { q: 'Asia' },
                    }" class="rounded-xl border border-white/10
            bg-white/[0.05] px-3 py-2.5
            text-slate-300 transition-all
            hover:bg-white/10 hover:text-white">
                        Asia
                    </NuxtLink>
                </div>
            </div>
        </section>
    </aside>
</template>

<style scoped>
.sidebar-story-title {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
</style>