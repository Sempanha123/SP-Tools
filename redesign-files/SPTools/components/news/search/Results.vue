<script setup lang="ts">
import type { NewsArticle } from '~/types/news'
interface Props { articles: NewsArticle[]; totalResults: number; query: string; currentPage: number; totalPages: number }
defineProps<Props>()
const emit = defineEmits<{ (event: 'changePage', page: number): void; (event: 'clearFilters'): void }>()
</script>

<template>
  <section id="search-results" class="scroll-mt-32">
    <div class="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
      <div>
        <p class="sp-kicker">Search results</p>
        <h2 class="mt-3 text-3xl font-[760] tracking-[-.045em] text-fg sm:text-4xl">
          <template v-if="query.trim()">Results for <span class="text-fg-subtle">“{{ query.trim() }}”</span></template>
          <template v-else>Browse the <span class="text-fg-subtle">news desk.</span></template>
        </h2>
        <p class="mt-2 text-[12px] text-fg-subtle">{{ totalResults }} {{ totalResults === 1 ? 'article' : 'articles' }} found</p>
      </div>
      <span v-if="totalPages > 1" class="w-fit rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.12em] text-fg-subtle">Page {{ currentPage }} / {{ totalPages }}</span>
    </div>

    <div v-if="articles.length" class="sp-stagger mt-7 grid gap-5 md:grid-cols-2">
      <NewsSharedArticleCard v-for="article in articles" :key="article.id" :article="article" />
    </div>

    <div v-else class="news-v4-panel sp-reveal relative mt-7 overflow-hidden rounded-[24px] px-6 py-16 text-center sm:py-20">
      <div class="sp-quiet-grid pointer-events-none absolute inset-0 opacity-[.12]" />
      <div class="relative">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-[17px] border border-line bg-surface-3 text-lg text-fg-subtle shadow-soft">⌕</div>
        <p class="mt-5 text-[9px] font-bold uppercase tracking-[.16em] text-accent">Desk is quiet</p>
        <h3 class="mt-2 text-2xl font-[740] tracking-[-.04em] text-fg">No matching stories yet.</h3>
        <p class="mx-auto mt-3 max-w-md text-[13px] leading-6 text-fg-muted">Broaden the query or clear a filter. When the API returns matching coverage, it appears here in the same editorial grid.</p>
        <button type="button" class="sp-btn sp-btn-secondary mt-6 px-5 py-3 text-[11px]" @click="emit('clearFilters')">Clear all filters <span>↗</span></button>
      </div>
    </div>

    <div v-if="totalPages > 1" class="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button type="button" class="sp-btn sp-btn-secondary h-10 px-4 text-[11px]" :disabled="currentPage === 1" @click="emit('changePage', currentPage - 1)">← Previous</button>
      <button v-for="page in totalPages" :key="page" type="button" class="flex h-10 w-10 items-center justify-center rounded-[11px] border text-[11px] font-bold transition" :class="currentPage === page ? 'border-accent bg-accent text-accent-fg shadow-soft' : 'border-line bg-surface-2 text-fg-muted hover:border-accent/30 hover:text-accent'" @click="emit('changePage', page)">{{ page }}</button>
      <button type="button" class="sp-btn sp-btn-secondary h-10 px-4 text-[11px]" :disabled="currentPage === totalPages" @click="emit('changePage', currentPage + 1)">Next →</button>
    </div>
  </section>
</template>
