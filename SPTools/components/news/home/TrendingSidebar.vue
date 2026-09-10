<script setup lang="ts">
const {
  mostReadArticles,
  trendingTags,
  timeAgo,
  formatViews,
} = useNewsData()

const leadTrendingArticle = computed(() => {
  return mostReadArticles.value[0] || null
})

const remainingTrendingArticles = computed(() => {
  return mostReadArticles.value.slice(1, 6)
})

const tagToSlug = (tag: string) => {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
</script>

<template>
  <aside class="min-w-0 space-y-6 lg:sticky lg:top-36">

    <!-- ===================================================== -->
    <!-- MOST READ -->
    <!-- ===================================================== -->

    <section class="overflow-hidden rounded-[28px]
      border border-line bg-surface
      shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
      <!-- Header -->

      <header class="relative overflow-hidden
        border-b border-line/10
        bg-accent text-accent-fg px-6 py-6 text-white">
        <div class="pointer-events-none absolute
          -right-16 -top-16 h-44 w-44
          rounded-full bg-red-500/20 blur-3xl" />

        <div class="pointer-events-none absolute
          -bottom-20 left-5 h-40 w-40
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
              tracking-[-0.03em]">
              Most-read stories
            </h2>

            <p class="mt-2 text-xs leading-5 text-fg-subtle">
              Popular reports readers are following now.
            </p>
          </div>

          <NuxtLink :to="{
            path: '/news/search',
            query: {
              sort: 'popular',
            },
          }" aria-label="View popular news" class="flex h-10 w-10 shrink-0
            items-center justify-center rounded-xl
            border border-line/10 bg-surface/[0.07]
            text-white transition-all
            hover:bg-surface/15">
            ↗
          </NuxtLink>
        </div>
      </header>

      <!-- Main trending story -->

      <div v-if="leadTrendingArticle" class="p-4">
        <NuxtLink :to="`/news/posts/${leadTrendingArticle.slug}`" class="group relative block min-h-[230px]
          overflow-hidden rounded-[22px] bg-accent text-accent-fg">
          <img v-if="leadTrendingArticle.image" :src="leadTrendingArticle.image" :alt="leadTrendingArticle.title"
            loading="lazy" class="absolute inset-0 h-full w-full
  object-cover transition-transform
  duration-700 group-hover:scale-105" />

          <div v-else class="absolute inset-0 flex items-center
  justify-center bg-gradient-to-br
  from-slate-100 to-slate-300">
            <div class="text-center">
              <span class="text-5xl" aria-hidden="true">
                📰
              </span>

              <p class="mt-3 text-sm font-semibold text-fg-subtle">
                No cover image
              </p>
            </div>
          </div>

          <div class="absolute inset-0
            bg-gradient-to-t from-slate-950
            via-slate-950/45 to-transparent" />

          <div class="absolute left-4 top-4
            flex items-center gap-2">
            <span class="flex h-8 min-w-8 items-center
              justify-center rounded-xl bg-red-600
              px-2 text-xs font-bold text-white
              shadow-lg">
              01
            </span>

            <span v-if="leadTrendingArticle.isBreaking" class="rounded-full bg-surface/90
              px-3 py-1.5 text-[8px] font-bold
              uppercase tracking-wider text-red-600
              backdrop-blur">
              Breaking
            </span>
          </div>

          <div class="absolute inset-x-0 bottom-0 p-5">
            <span class="text-[9px] font-bold uppercase
              tracking-[0.15em] text-indigo-300">
              {{ leadTrendingArticle.categoryName }}
            </span>

            <h3 class="mt-2 text-lg font-bold leading-6
              text-white transition-colors
              group-hover:text-indigo-200">
              {{ leadTrendingArticle.title }}
            </h3>

            <div class="mt-4 flex flex-wrap items-center
              gap-2 text-[10px] text-fg-subtle">
              <time :datetime="leadTrendingArticle.publishedAt">
                {{ timeAgo(leadTrendingArticle.publishedAt) }}
              </time>

              <span>•</span>

              <span>
                {{ formatViews(leadTrendingArticle.views) }} views
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Remaining stories -->

      <div v-if="remainingTrendingArticles.length" class="divide-y divide-line px-4 pb-4">
        <NuxtLink v-for="(article, index) in remainingTrendingArticles" :key="article.id"
          :to="`/news/posts/${article.slug}`" class="group grid grid-cols-[72px_minmax(0,1fr)]
          gap-4 py-4 first:pt-2">
          <!-- Thumbnail -->

          <div class="relative h-[72px] overflow-hidden
            rounded-2xl bg-surface-2">
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
              bg-accent text-accent-fg/85 px-1.5
              text-[8px] font-bold text-white
              backdrop-blur">
              {{ String(index + 2).padStart(2, '0') }}
            </span>
          </div>

          <!-- Content -->

          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[8px] font-bold uppercase
                tracking-[0.14em] text-indigo-600">
                {{ article.categoryName }}
              </span>

              <span v-if="article.isLive" class="inline-flex items-center gap-1
                text-[8px] font-bold uppercase
                tracking-wider text-red-600">
                <span class="h-1.5 w-1.5 rounded-full bg-red-500" />

                Live
              </span>
            </div>

            <h3 class="trending-title mt-1.5
              text-sm font-bold leading-5
              text-fg transition-colors
              group-hover:text-indigo-600">
              {{ article.title }}
            </h3>

            <div class="mt-2 flex flex-wrap items-center
              gap-2 text-[9px] text-fg-subtle">
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

      <div class="border-t border-line p-4">
        <NuxtLink :to="{
          path: '/news/search',
          query: {
            sort: 'popular',
          },
        }" class="group flex w-full items-center
          justify-center gap-2 rounded-xl
          bg-surface-2 px-5 py-3
          text-xs font-bold text-fg-muted
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
    <!-- TRENDING TOPICS -->
    <!-- ===================================================== -->

    <section class="rounded-[28px]
      border border-line bg-surface p-6
      shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div class="flex items-start justify-between gap-4">
        <div>
          <span class="text-[10px] font-bold uppercase
            tracking-[0.18em] text-indigo-600">
            Popular topics
          </span>

          <h2 class="mt-2 text-xl font-bold text-fg">
            Trending tags
          </h2>

          <p class="mt-2 text-xs leading-5 text-fg-subtle">
            Topics appearing across today's coverage.
          </p>
        </div>

        <div class="flex h-10 w-10 shrink-0
          items-center justify-center rounded-xl
          bg-indigo-50 font-bold text-indigo-600">
          #
        </div>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <NuxtLink v-for="tag in trendingTags" :key="tag.name" :to="`/news/tag/${tagToSlug(tag.name)}`" class="group inline-flex items-center gap-1.5
          rounded-full border border-line
          bg-surface-2 px-3.5 py-2
          text-[10px] font-semibold text-fg-muted
          transition-all hover:-translate-y-0.5
          hover:border-indigo-200
          hover:bg-indigo-50
          hover:text-indigo-600">
          <span>#{{ tag.name }}</span>

          <span class="rounded-full bg-surface
            px-1.5 py-0.5 text-[8px]
            text-fg-subtle shadow-sm
            group-hover:text-indigo-500">
            {{ tag.count }}
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- ===================================================== -->
    <!-- NEWS STANDARDS -->
    <!-- ===================================================== -->

    <section class="relative overflow-hidden rounded-[28px]
      bg-gradient-to-br from-slate-950
      via-slate-950 to-indigo-950
      p-6 text-white
      shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
      <div class="pointer-events-none absolute
        -right-16 -top-16 h-44 w-44
        rounded-full bg-indigo-500/25 blur-3xl" />

      <div class="relative flex items-start gap-4">
        <div class="flex h-11 w-11 shrink-0
          items-center justify-center rounded-2xl
          border border-line/10 bg-surface/[0.08]
          text-emerald-300">
          ✓
        </div>

        <div>
          <p class="text-[9px] font-bold uppercase
            tracking-[0.17em] text-indigo-300">
            News standards
          </p>

          <h3 class="mt-2 text-base font-bold">
            Clear and transparent reporting
          </h3>

          <p class="mt-2 text-xs leading-6 text-fg-subtle">
            Stories include visible sources, authors,
            publication times, categories and relevant topics.
          </p>
        </div>
      </div>
    </section>
  </aside>
</template>

<style scoped>
.trending-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>