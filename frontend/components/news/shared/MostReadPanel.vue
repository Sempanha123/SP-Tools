<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

const props = withDefaults(
  defineProps<{
    articles: NewsArticle[]
    currentArticleId?: NewsArticle['id'] | null
    kicker?: string
    title?: string
    subtitle?: string
    limit?: number
    showFooter?: boolean
  }>(),
  {
    currentArticleId: null,
    kicker: 'Trending now',
    title: 'Most read',
    subtitle: 'Popular stories readers are opening now.',
    limit: 5,
    showFooter: true,
  },
)

const { timeAgo, formatViews } = useNewsData()

const rankedArticles = computed(() =>
  props.articles
    .filter(
      article =>
        props.currentArticleId === null
        || article.id !== props.currentArticleId,
    )
    .slice(0, props.limit),
)

const leadArticle = computed(
  () => rankedArticles.value[0] ?? null,
)

const remainingArticles = computed(
  () => rankedArticles.value.slice(1),
)
</script>

<template>
  <section class="sp-v26-mostread overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
    <header class="sp-v26-mostread-header relative overflow-hidden px-6 py-6 text-white">
      <div class="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-20 -left-14 h-40 w-40 rounded-full bg-indigo-500/16 blur-3xl" />

      <div class="relative flex items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-red-300">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-50" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            {{ kicker }}
          </div>

          <h2 class="mt-3 text-2xl font-bold tracking-[-0.035em] text-white">
            {{ title }}
          </h2>

          <p class="mt-2 max-w-[260px] text-xs leading-5 text-white/55">
            {{ subtitle }}
          </p>
        </div>

        <NuxtLink
          :to="{ path: '/news/search', query: { sort: 'popular' } }"
          aria-label="View popular stories"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-white/65 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.12] hover:text-white"
        >
          ↗
        </NuxtLink>
      </div>
    </header>

    <template v-if="leadArticle">
      <div class="p-4">
        <NuxtLink
          :to="`/news/posts/${leadArticle.slug}`"
          class="group relative block min-h-[200px] overflow-hidden rounded-[22px] bg-accent"
        >
          <img
            v-if="leadArticle.image"
            :src="leadArticle.image"
            :alt="leadArticle.title"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          >

          <div
            v-else
            class="sp-v26-image-fallback absolute inset-0 flex items-center justify-center"
          >
            <span class="text-5xl font-black text-white/55">N</span>
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />

          <span class="absolute left-4 top-4 flex h-8 min-w-8 items-center justify-center rounded-xl bg-red-600 px-2 text-xs font-bold text-white shadow-lg">
            01
          </span>

          <div class="absolute inset-x-0 bottom-0 p-5">
            <span class="text-[8px] font-bold uppercase tracking-[0.14em] text-indigo-300">
              {{ leadArticle.categoryName }}
            </span>

            <h3 class="mt-2 line-clamp-2 text-base font-bold leading-6 text-white transition-colors group-hover:text-indigo-200">
              {{ leadArticle.title }}
            </h3>

            <div class="mt-3 flex items-center gap-2 text-[9px] text-white/55">
              <time :datetime="leadArticle.publishedAt">
                {{ timeAgo(leadArticle.publishedAt) }}
              </time>
              <span>•</span>
              <span>{{ formatViews(leadArticle.views) }} views</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div
        v-if="remainingArticles.length"
        class="divide-y divide-line px-4 pb-4"
      >
        <NuxtLink
          v-for="(article, index) in remainingArticles"
          :key="article.id"
          :to="`/news/posts/${article.slug}`"
          class="group grid grid-cols-[68px_minmax(0,1fr)] gap-3 py-4 first:pt-2"
        >
          <div class="relative h-[68px] overflow-hidden rounded-2xl bg-surface-2">
            <img
              v-if="article.image"
              :src="article.image"
              :alt="article.title"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            >

            <div
              v-else
              class="sp-v26-image-fallback flex h-full items-center justify-center"
            >
              <span class="text-sm font-black text-accent">
                {{ String(index + 2).padStart(2, '0') }}
              </span>
            </div>

            <span class="absolute left-1.5 top-1.5 flex h-6 min-w-6 items-center justify-center rounded-lg bg-slate-950/85 px-1.5 text-[8px] font-bold text-white backdrop-blur">
              {{ String(index + 2).padStart(2, '0') }}
            </span>
          </div>

          <div class="min-w-0 self-center">
            <span class="text-[8px] font-bold uppercase tracking-[0.13em] text-indigo-600 dark:text-indigo-300">
              {{ article.categoryName }}
            </span>

            <h3 class="mt-1.5 line-clamp-2 text-xs font-bold leading-5 text-fg transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
              {{ article.title }}
            </h3>

            <p class="mt-1.5 text-[8px] text-fg-subtle">
              {{ timeAgo(article.publishedAt) }}
              ·
              {{ formatViews(article.views) }}
              views
            </p>
          </div>
        </NuxtLink>
      </div>

      <div
        v-if="showFooter"
        class="border-t border-line p-4"
      >
        <NuxtLink
          :to="{ path: '/news/search', query: { sort: 'popular' } }"
          class="group flex h-10 w-full items-center justify-center gap-2 rounded-[12px] border border-line bg-surface-2 text-[10px] font-semibold text-fg-muted transition hover:border-accent/25 hover:bg-accent-soft hover:text-accent"
        >
          View popular stories
          <span class="transition-transform group-hover:translate-x-1">→</span>
        </NuxtLink>
      </div>
    </template>

    <div v-else class="p-5 text-center">
      <div class="rounded-[16px] border border-dashed border-line bg-surface-2 px-4 py-8">
        <p class="text-[9px] font-bold uppercase tracking-[.14em] text-fg-subtle">
          Signal pending
        </p>
        <p class="mt-2 text-[11px] leading-5 text-fg-muted">
          Popular coverage will appear when ranking data is available.
        </p>
      </div>
    </div>
  </section>
</template>
