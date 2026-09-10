<script setup lang="ts">
import type { NewsArticle } from '~/types/news'
interface TrendingTag { name: string; count: number }
interface Props { mostRead: NewsArticle[]; trendingTags: TrendingTag[] }
const props = defineProps<Props>()
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

    <NewsSharedMostReadPanel
      :articles="mostRead"
      subtitle="Popular stories across current coverage."
    />

    <section class="relative overflow-hidden rounded-[22px] border border-line bg-gradient-to-br from-surface-2 to-surface-3 p-5">
      <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
      <div class="relative"><span class="flex h-9 w-9 items-center justify-center rounded-[11px] border border-line bg-elevated text-accent">⌕</span><p class="mt-5 text-[9px] font-bold uppercase tracking-[.15em] text-accent">Search craft</p><h3 class="mt-2 text-[16px] font-bold text-fg">Find better results</h3><p class="mt-2 text-[11px] leading-5 text-fg-muted">Combine a subject with a region, author or date window for a cleaner signal.</p><div class="mt-4 grid grid-cols-2 gap-2"><NuxtLink v-for="term in ['Technology','Business','Climate','Asia']" :key="term" :to="{path:'/news/search',query:{q:term}}" class="rounded-[10px] border border-line bg-elevated px-3 py-2 text-[9px] font-semibold text-fg-muted transition hover:border-accent/25 hover:text-accent">{{ term }}</NuxtLink></div></div>
    </section>
  </aside>
</template>
