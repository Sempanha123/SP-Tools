<script setup lang="ts">
const { mostReadArticles, trendingTags, timeAgo, formatViews } = useNewsData()
const leadTrendingArticle = computed(() => mostReadArticles.value[0] || null)
const remainingTrendingArticles = computed(() => mostReadArticles.value.slice(1, 6))
const tagToSlug = (tag: string) => tag.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
</script>

<template>
  <aside class="min-w-0 space-y-4 lg:sticky lg:top-32">
    <!-- Most read / dark signal card -->
    <section class="sp-reveal sp-depth-hover relative overflow-hidden rounded-[23px] border border-white/10 bg-[#0a0f17] text-white shadow-pop">
      <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[.07]" />
      <div class="pointer-events-none absolute -right-20 -top-24 h-60 w-60 rounded-full bg-violet-500/24 blur-[78px]" />
      <div class="pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-cyan-400/12 blur-[72px]" />
      <header class="relative border-b border-white/10 p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[.16em] text-red-300"><span class="h-1.5 w-1.5 rounded-full bg-red-400 sp-glow-dot text-red-400"/> Most read</div>
            <h2 class="mt-2.5 font-display text-[1.7rem] font-[650] leading-none tracking-[-.045em] text-white">What readers follow</h2>
            <p class="mt-2 text-[10px] text-white/38">The strongest signals across today's desk.</p>
          </div>
          <NuxtLink :to="{ path: '/news/search', query: { sort: 'popular' } }" aria-label="View popular news" class="group flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-white/10 bg-white/[.06] text-white/55 transition hover:bg-white/[.1] hover:text-white"><span class="sp-hover-arrow">↗</span></NuxtLink>
        </div>
      </header>

      <NuxtLink v-if="leadTrendingArticle" :to="`/news/posts/${leadTrendingArticle.slug}`" class="group relative block border-b border-white/10 p-4">
        <div class="relative aspect-[16/10] overflow-hidden rounded-[16px] border border-white/10 bg-white/[.04]">
          <img v-if="leadTrendingArticle.image" :src="leadTrendingArticle.image" :alt="leadTrendingArticle.title" loading="lazy" class="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.045]" />
          <div v-else class="sp-dot-grid flex h-full items-center justify-center text-3xl text-white/60">📰</div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#080c13] via-black/20 to-transparent" />
          <span class="absolute left-3 top-3 flex h-8 min-w-8 items-center justify-center rounded-[10px] border border-white/15 bg-black/38 px-2 text-[9px] font-bold text-white backdrop-blur">01</span>
          <span class="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">↗</span>
        </div>
        <p class="mt-3 text-[8px] font-bold uppercase tracking-[0.14em] text-violet-300">{{ leadTrendingArticle.categoryName }}</p>
        <h3 class="mt-1.5 font-display text-[1.4rem] font-[640] leading-[1.1] tracking-[-.035em] text-white transition group-hover:text-violet-200">{{ leadTrendingArticle.title }}</h3>
        <div class="mt-3 flex flex-wrap items-center gap-2 text-[8px] text-white/35"><time :datetime="leadTrendingArticle.publishedAt">{{ timeAgo(leadTrendingArticle.publishedAt) }}</time><span>·</span><span>{{ formatViews(leadTrendingArticle.views) }} views</span></div>
      </NuxtLink>

      <div v-if="remainingTrendingArticles.length" class="relative divide-y divide-white/8 px-4">
        <NuxtLink v-for="(article, index) in remainingTrendingArticles" :key="article.id" :to="`/news/posts/${article.slug}`" class="group grid grid-cols-[34px_minmax(0,1fr)] gap-3 py-4">
          <span class="flex h-7 w-7 items-center justify-center rounded-lg border border-white/8 bg-white/[.055] text-[9px] font-bold tabular-nums text-white/35 transition group-hover:border-violet-400/25 group-hover:bg-violet-400/10 group-hover:text-violet-200">{{ String(index + 2).padStart(2, '0') }}</span>
          <div class="min-w-0"><p class="text-[7px] font-bold uppercase tracking-[.12em] text-violet-300/80">{{ article.categoryName }}</p><h3 class="trending-title mt-1 text-[12px] font-[640] leading-5 text-white/78 transition group-hover:text-white">{{ article.title }}</h3><div class="mt-1.5 flex gap-2 text-[8px] text-white/28"><time :datetime="article.publishedAt">{{ timeAgo(article.publishedAt) }}</time><span>·</span><span>{{ formatViews(article.views) }} views</span></div></div>
        </NuxtLink>
      </div>

      <div v-else class="relative p-5 text-center"><div class="sp-dot-grid rounded-[14px] border border-white/8 bg-white/[.04] px-4 py-8"><p class="text-[8px] font-bold uppercase tracking-[.14em] text-white/30">Signal pending</p><p class="mt-2 text-[11px] leading-5 text-white/45">Popular coverage will rank here when the feed is available.</p></div></div>
      <div class="relative border-t border-white/10 p-4"><NuxtLink :to="{ path: '/news/search', query: { sort: 'popular' } }" class="group flex h-10 w-full items-center justify-center gap-2 rounded-[12px] border border-white/8 bg-white/[.055] text-[10px] font-semibold text-white/55 transition hover:bg-white/[.09] hover:text-white">View popular stories <span class="sp-hover-arrow text-cyan-200">→</span></NuxtLink></div>
    </section>

    <!-- Trending topics -->
    <section class="sp-reveal sp-lens-card rounded-[21px] p-5">
      <div class="flex items-center justify-between"><div><div class="sp-kicker">Trending</div><h2 class="mt-2 text-[1.15rem] font-[700] text-fg">Topic radar</h2></div><span class="sp-border-flow flex h-10 w-10 items-center justify-center rounded-[12px] bg-elevated font-bold text-accent">#</span></div>
      <div class="mt-5 flex flex-wrap gap-1.5"><NuxtLink v-for="tag in trendingTags" :key="tag.name" :to="`/news/tag/${tagToSlug(tag.name)}`" class="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[9px] font-semibold text-fg-muted transition hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent-soft hover:text-accent">#{{ tag.name }}<span class="text-[8px] text-fg-subtle group-hover:text-accent">{{ tag.count }}</span></NuxtLink></div>
      <p v-if="!trendingTags.length" class="mt-4 rounded-[12px] bg-surface-3 px-3 py-3 text-[10px] leading-5 text-fg-subtle">Topic signals will appear when the feed reconnects.</p>
    </section>

    <!-- Standards -->
    <section class="sp-reveal relative overflow-hidden rounded-[21px] border border-line bg-surface-3 p-5">
      <div class="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-positive/10 blur-3xl" />
      <div class="relative flex items-start gap-3"><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-positive-soft text-positive">✓</span><div><p class="text-[8px] font-bold uppercase tracking-[.13em] text-fg-subtle">News standards</p><h3 class="mt-1.5 text-[14px] font-[690] text-fg">Clear context, visible signals</h3><p class="mt-1.5 text-[11px] leading-5 text-fg-muted">Stories surface sources, timestamps, categories and useful context.</p></div></div>
    </section>
  </aside>
</template>

<style scoped>
.trending-title { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
</style>
