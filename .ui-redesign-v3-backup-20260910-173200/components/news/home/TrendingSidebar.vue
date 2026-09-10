<script setup lang="ts">
const { mostReadArticles, trendingTags, timeAgo, formatViews } = useNewsData()
const leadTrendingArticle = computed(() => mostReadArticles.value[0] || null)
const remainingTrendingArticles = computed(() => mostReadArticles.value.slice(1, 6))
const tagToSlug = (tag: string) => tag.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
</script>

<template>
  <aside class="min-w-0 space-y-4 lg:sticky lg:top-32">
    <section class="sp-reveal overflow-hidden rounded-[20px] border border-line bg-elevated shadow-soft">
      <header class="relative overflow-hidden border-b border-line p-5">
        <div class="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-danger/10 blur-3xl" />
        <div class="relative flex items-start justify-between gap-4">
          <div>
            <div class="sp-kicker text-danger">Most read</div>
            <h2 class="mt-2.5 text-[1.45rem] font-[710] tracking-[-0.04em] text-fg">What readers follow</h2>
          </div>
          <NuxtLink :to="{ path: '/news/search', query: { sort: 'popular' } }" aria-label="View popular news" class="group flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-line bg-surface-2 text-fg-muted transition hover:border-line-strong hover:text-fg"><span class="sp-hover-arrow">↗</span></NuxtLink>
        </div>
      </header>

      <NuxtLink v-if="leadTrendingArticle" :to="`/news/posts/${leadTrendingArticle.slug}`" class="group block border-b border-line p-4">
        <div class="relative aspect-[16/10] overflow-hidden rounded-[15px] bg-surface-3">
          <img v-if="leadTrendingArticle.image" :src="leadTrendingArticle.image" :alt="leadTrendingArticle.title" loading="lazy" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]" />
          <div v-else class="sp-dot-grid flex h-full items-center justify-center text-3xl">📰</div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-transparent" />
          <span class="absolute left-3 top-3 flex h-8 min-w-8 items-center justify-center rounded-[10px] border border-white/15 bg-black/45 px-2 text-[9px] font-bold text-white backdrop-blur">01</span>
          <span class="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">↗</span>
        </div>
        <p class="mt-3 text-[9px] font-bold uppercase tracking-[0.12em] text-accent">{{ leadTrendingArticle.categoryName }}</p>
        <h3 class="mt-1.5 font-display text-[1.35rem] font-[650] leading-[1.12] tracking-[-0.03em] text-fg transition group-hover:text-accent">{{ leadTrendingArticle.title }}</h3>
        <div class="mt-3 flex flex-wrap items-center gap-2 text-[9px] text-fg-subtle"><time :datetime="leadTrendingArticle.publishedAt">{{ timeAgo(leadTrendingArticle.publishedAt) }}</time><span>·</span><span>{{ formatViews(leadTrendingArticle.views) }} views</span></div>
      </NuxtLink>

      <div v-if="remainingTrendingArticles.length" class="divide-y divide-line px-4">
        <NuxtLink v-for="(article, index) in remainingTrendingArticles" :key="article.id" :to="`/news/posts/${article.slug}`" class="group grid grid-cols-[34px_minmax(0,1fr)] gap-3 py-4">
          <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-3 text-[9px] font-bold tabular-nums text-fg-subtle transition group-hover:bg-accent-soft group-hover:text-accent">{{ String(index + 2).padStart(2, '0') }}</span>
          <div class="min-w-0">
            <p class="text-[8px] font-bold uppercase tracking-[.11em] text-accent">{{ article.categoryName }}</p>
            <h3 class="trending-title mt-1 text-[13px] font-[660] leading-5 text-fg transition group-hover:text-accent">{{ article.title }}</h3>
            <div class="mt-1.5 flex gap-2 text-[8px] text-fg-subtle"><time :datetime="article.publishedAt">{{ timeAgo(article.publishedAt) }}</time><span>·</span><span>{{ formatViews(article.views) }} views</span></div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="p-5 text-center">
        <div class="sp-dot-grid rounded-[14px] border border-line bg-surface-3/45 px-4 py-8">
          <p class="text-[10px] font-bold uppercase tracking-[.12em] text-fg-subtle">Waiting for stories</p>
          <p class="mt-2 text-[12px] leading-5 text-fg-muted">Popular coverage will rank here when the news feed is available.</p>
        </div>
      </div>

      <div class="border-t border-line p-4">
        <NuxtLink :to="{ path: '/news/search', query: { sort: 'popular' } }" class="group flex h-10 w-full items-center justify-center gap-2 rounded-[12px] bg-surface-3 text-[11px] font-semibold text-fg-muted transition hover:text-fg">View popular stories <span class="sp-hover-arrow text-accent">→</span></NuxtLink>
      </div>
    </section>

    <section class="sp-reveal rounded-[20px] border border-line bg-elevated p-5 shadow-xs">
      <div class="flex items-center justify-between">
        <div><div class="sp-kicker">Trending</div><h2 class="mt-2 text-lg font-[690] text-fg">Topics</h2></div>
        <span class="flex h-9 w-9 items-center justify-center rounded-[11px] bg-accent-soft font-bold text-accent">#</span>
      </div>
      <div class="mt-4 flex flex-wrap gap-1.5">
        <NuxtLink v-for="tag in trendingTags" :key="tag.name" :to="`/news/tag/${tagToSlug(tag.name)}`" class="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[9px] font-semibold text-fg-muted transition hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent-soft hover:text-accent">#{{ tag.name }}<span class="text-[8px] text-fg-subtle group-hover:text-accent">{{ tag.count }}</span></NuxtLink>
      </div>
      <p v-if="!trendingTags.length" class="mt-4 rounded-[12px] bg-surface-3 px-3 py-3 text-[10px] leading-5 text-fg-subtle">Trending topics will appear when the feed reconnects.</p>
    </section>

    <section class="sp-reveal relative overflow-hidden rounded-[20px] border border-line bg-surface-3 p-5">
      <div class="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-positive/10 blur-3xl" />
      <div class="relative flex items-start gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-positive-soft text-positive">✓</span>
        <div><p class="text-[9px] font-bold uppercase tracking-[.12em] text-fg-subtle">News standards</p><h3 class="mt-1.5 text-[14px] font-[680] text-fg">Clear and transparent reporting</h3><p class="mt-1.5 text-[11px] leading-5 text-fg-muted">Stories show sources, timestamps, categories and relevant context.</p></div>
      </div>
    </section>
  </aside>
</template>

<style scoped>
.trending-title { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
</style>
