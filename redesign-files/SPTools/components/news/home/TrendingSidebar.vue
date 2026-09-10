<script setup lang="ts">
const {
  mostReadArticles,
  trendingTags,
  timeAgo,
  formatViews,
} = useNewsData()

const leadTrendingArticle = computed(() => mostReadArticles.value[0] || null)
const remainingTrendingArticles = computed(() => mostReadArticles.value.slice(1, 6))

const tagToSlug = (tag: string) =>
  tag
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
</script>

<template>
  <aside class="min-w-0 space-y-4 lg:sticky lg:top-32">
    <section class="overflow-hidden rounded-[16px] border border-line bg-elevated">
      <header class="flex items-start justify-between gap-4 border-b border-line p-5">
        <div>
          <div class="sp-kicker">
            <span class="h-1.5 w-1.5 rounded-full bg-danger" />
            Most read
          </div>
          <h2 class="mt-2.5 text-[1.35rem] font-[700] tracking-[-0.035em] text-fg">
            What readers follow
          </h2>
        </div>

        <NuxtLink
          :to="{ path: '/news/search', query: { sort: 'popular' } }"
          aria-label="View popular news"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2 text-fg-muted transition hover:bg-surface-3 hover:text-fg"
        >
          ↗
        </NuxtLink>
      </header>

      <NuxtLink
        v-if="leadTrendingArticle"
        :to="`/news/posts/${leadTrendingArticle.slug}`"
        class="group block border-b border-line p-4"
      >
        <div class="relative aspect-[16/10] overflow-hidden rounded-[13px] bg-surface-3">
          <img
            v-if="leadTrendingArticle.image"
            :src="leadTrendingArticle.image"
            :alt="leadTrendingArticle.title"
            loading="lazy"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div v-else class="flex h-full items-center justify-center text-2xl" aria-hidden="true">📰</div>
          <span class="absolute left-3 top-3 rounded-lg bg-fg px-2 py-1 text-[9px] font-bold text-surface-2">
            01
          </span>
        </div>

        <p class="mt-3 text-[9px] font-bold uppercase tracking-[0.11em] text-accent">
          {{ leadTrendingArticle.categoryName }}
        </p>

        <h3 class="mt-1.5 font-display text-[1.15rem] font-[650] leading-[1.2] tracking-[-0.02em] text-fg transition group-hover:text-accent">
          {{ leadTrendingArticle.title }}
        </h3>

        <div class="mt-2.5 flex flex-wrap items-center gap-2 text-[9px] text-fg-subtle">
          <time :datetime="leadTrendingArticle.publishedAt">{{ timeAgo(leadTrendingArticle.publishedAt) }}</time>
          <span>·</span>
          <span>{{ formatViews(leadTrendingArticle.views) }} views</span>
        </div>
      </NuxtLink>

      <div v-if="remainingTrendingArticles.length" class="divide-y divide-line px-4">
        <NuxtLink
          v-for="(article, index) in remainingTrendingArticles"
          :key="article.id"
          :to="`/news/posts/${article.slug}`"
          class="group grid grid-cols-[28px_minmax(0,1fr)] gap-3 py-3.5"
        >
          <span class="pt-0.5 text-[11px] font-bold tabular-nums text-fg-subtle">
            {{ String(index + 2).padStart(2, '0') }}
          </span>
          <div class="min-w-0">
            <p class="text-[9px] font-bold uppercase tracking-[0.1em] text-accent">
              {{ article.categoryName }}
            </p>
            <h3 class="trending-title mt-1 text-[13px] font-[650] leading-5 text-fg transition group-hover:text-accent">
              {{ article.title }}
            </h3>
            <div class="mt-1.5 flex gap-2 text-[9px] text-fg-subtle">
              <time :datetime="article.publishedAt">{{ timeAgo(article.publishedAt) }}</time>
              <span>·</span>
              <span>{{ formatViews(article.views) }} views</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="border-t border-line p-4">
        <NuxtLink
          :to="{ path: '/news/search', query: { sort: 'popular' } }"
          class="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-surface-3 text-[11px] font-semibold text-fg-muted transition hover:text-fg"
        >
          View popular stories
          <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>
    </section>

    <section class="rounded-[16px] border border-line bg-elevated p-5">
      <div class="flex items-center justify-between">
        <div>
          <div class="sp-kicker">Trending</div>
          <h2 class="mt-2 text-lg font-[680] text-fg">Topics</h2>
        </div>
        <span class="text-lg font-bold text-accent">#</span>
      </div>

      <div class="mt-4 flex flex-wrap gap-1.5">
        <NuxtLink
          v-for="tag in trendingTags"
          :key="tag.name"
          :to="`/news/tag/${tagToSlug(tag.name)}`"
          class="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-[10px] font-semibold text-fg-muted transition hover:border-accent/30 hover:bg-accent-soft hover:text-accent"
        >
          #{{ tag.name }}
          <span class="text-[8px] text-fg-subtle">{{ tag.count }}</span>
        </NuxtLink>
      </div>
    </section>

    <section class="rounded-[16px] border border-line bg-surface-3 p-5">
      <div class="flex items-start gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-positive-soft text-positive">✓</span>
        <div>
          <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-fg-subtle">News standards</p>
          <h3 class="mt-1.5 text-[14px] font-[680] text-fg">Clear and transparent reporting</h3>
          <p class="mt-1.5 text-[12px] leading-5 text-fg-muted">
            Stories show sources, timestamps, categories and relevant context.
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
