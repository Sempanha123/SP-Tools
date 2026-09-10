<script setup lang="ts">
import type { NewsArticle } from '~/types/news'
interface TrendingTag { name: string; count: number }
interface Props { mostRead: NewsArticle[]; trendingTags: TrendingTag[] }
const props = defineProps<Props>()
const { timeAgo, formatViews } = useNewsData()
const leadArticle = computed(() => props.mostRead[0] || null)
const remainingArticles = computed(() => props.mostRead.slice(1, 5))
const tagToSlug = (tag: string) => tag.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
</script>

<template>
  <aside class="min-w-0 space-y-5 lg:sticky lg:top-28">
    <section class="news-v4-panel overflow-hidden rounded-[22px]">
      <header class="flex items-start justify-between gap-4 border-b border-line px-5 py-5">
        <div><p class="sp-kicker">Topic radar</p><h2 class="mt-2 text-xl font-[730] tracking-[-.03em] text-fg">Related signals</h2><p class="mt-1.5 text-[11px] leading-5 text-fg-muted">Frequent topics in current coverage.</p></div>
        <span class="flex h-9 w-9 items-center justify-center rounded-[11px] bg-accent-soft text-sm font-black text-accent">#</span>
      </header>
      <div class="p-5">
        <div v-if="trendingTags.length" class="flex flex-wrap gap-2">
          <NuxtLink v-for="tag in trendingTags" :key="tag.name" :to="`/news/tag/${tagToSlug(tag.name)}`" class="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-3 px-3 py-2 text-[10px] font-semibold text-fg-muted transition hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent-soft hover:text-accent">#{{ tag.name }} <span class="opacity-45">{{ tag.count }}</span></NuxtLink>
        </div>
        <div v-else class="rounded-[16px] border border-dashed border-line bg-surface-3 px-4 py-7 text-center"><p class="text-[12px] font-bold text-fg">No related topics</p><p class="mt-2 text-[10px] leading-5 text-fg-subtle">Change the query or filters to reveal topic signals.</p></div>
      </div>
    </section>

    <section class="news-v4-ink sp-noise relative overflow-hidden rounded-[24px] border border-white/10 shadow-[0_28px_75px_rgba(8,12,18,.22)]">
      <header class="relative border-b border-white/10 px-5 py-5">
        <p class="text-[9px] font-bold uppercase tracking-[.16em] text-rose-300">● Most read</p>
        <h2 class="mt-2 font-display text-[28px] font-[700] leading-none tracking-[-.045em] text-white">What readers follow.</h2>
      </header>

      <div v-if="leadArticle" class="p-3.5">
        <NuxtLink :to="`/news/posts/${leadArticle.slug}`" class="group relative block min-h-[210px] overflow-hidden rounded-[17px] border border-white/10 bg-white/[.04]">
          <img v-if="leadArticle.image" :src="leadArticle.image" :alt="leadArticle.title" class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
          <div class="absolute inset-x-0 bottom-0 p-4"><p class="text-[8px] font-bold uppercase tracking-[.14em] text-violet-200">{{ leadArticle.categoryName }}</p><h3 class="mt-2 text-[15px] font-bold leading-5 text-white">{{ leadArticle.title }}</h3><p class="mt-2 text-[9px] text-white/42">{{ timeAgo(leadArticle.publishedAt) }} · {{ formatViews(leadArticle.views) }} views</p></div>
        </NuxtLink>
      </div>

      <div v-if="remainingArticles.length" class="divide-y divide-white/8 px-4 pb-3">
        <NuxtLink v-for="(article,index) in remainingArticles" :key="article.id" :to="`/news/posts/${article.slug}`" class="group grid grid-cols-[28px_1fr] gap-3 py-3.5"><span class="font-display text-xl text-white/24">0{{ index + 2 }}</span><div><p class="line-clamp-2 text-[11px] font-semibold leading-5 text-white/72 transition group-hover:text-white">{{ article.title }}</p><p class="mt-1 text-[8px] text-white/28">{{ timeAgo(article.publishedAt) }}</p></div></NuxtLink>
      </div>

      <div v-if="!mostRead.length" class="p-5"><div class="rounded-[16px] border border-dashed border-white/10 bg-white/[.035] px-4 py-7 text-center"><p class="text-[11px] font-semibold text-white/60">Popular coverage will appear when the feed is available.</p></div></div>

      <div class="border-t border-white/10 p-3.5"><NuxtLink :to="{ path:'/news/search', query:{sort:'popular'} }" class="group flex items-center justify-between rounded-[12px] bg-white/[.055] px-4 py-3 text-[10px] font-bold text-white/64 transition hover:bg-white/[.085] hover:text-white">View popular stories <span class="transition group-hover:translate-x-1">→</span></NuxtLink></div>
    </section>

    <section class="relative overflow-hidden rounded-[22px] border border-line bg-gradient-to-br from-surface-2 to-surface-3 p-5">
      <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
      <div class="relative"><span class="flex h-9 w-9 items-center justify-center rounded-[11px] border border-line bg-elevated text-accent">⌕</span><p class="mt-5 text-[9px] font-bold uppercase tracking-[.15em] text-accent">Search craft</p><h3 class="mt-2 text-[16px] font-bold text-fg">Find better results</h3><p class="mt-2 text-[11px] leading-5 text-fg-muted">Combine a subject with a region, author or date window for a cleaner signal.</p><div class="mt-4 grid grid-cols-2 gap-2"><NuxtLink v-for="term in ['Technology','Business','Climate','Asia']" :key="term" :to="{path:'/news/search',query:{q:term}}" class="rounded-[10px] border border-line bg-elevated px-3 py-2 text-[9px] font-semibold text-fg-muted transition hover:border-accent/25 hover:text-accent">{{ term }}</NuxtLink></div></div>
    </section>
  </aside>
</template>
