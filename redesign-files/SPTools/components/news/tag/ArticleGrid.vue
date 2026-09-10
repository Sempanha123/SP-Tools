<script setup lang="ts">
import type { NewsArticle } from '~/types/news'
const props = defineProps<{ articles: NewsArticle[]; tagName: string }>()
type SortMode = 'latest' | 'popular'
const searchQuery = ref('')
const sortMode = ref<SortMode>('latest')
const visibleCount = ref(6)
const filteredArticles = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  const result = props.articles.filter(article => !keyword || [article.title, article.excerpt, article.categoryName, article.region, ...article.tags].join(' ').toLowerCase().includes(keyword))
  return [...result].sort((a,b) => sortMode.value === 'popular' ? b.views-a.views : new Date(b.publishedAt).getTime()-new Date(a.publishedAt).getTime())
})
const visibleArticles = computed(() => filteredArticles.value.slice(0, visibleCount.value))
const canLoadMore = computed(() => visibleCount.value < filteredArticles.value.length)
watch([searchQuery, sortMode], () => { visibleCount.value = 6 })
const clearSearch = () => { searchQuery.value=''; sortMode.value='latest' }
</script>

<template>
  <section id="tag-stories" class="scroll-mt-28">
    <div class="flex flex-col justify-between gap-5 border-b border-line pb-6 sm:flex-row sm:items-end">
      <div><p class="sp-kicker">Tagged coverage</p><h2 class="mt-3 text-3xl font-[760] tracking-[-.045em] text-fg">Stories around <span class="text-accent">#{{ tagName }}</span></h2><p class="mt-2 text-[12px] text-fg-subtle">{{ filteredArticles.length }} matching {{ filteredArticles.length === 1 ? 'story' : 'stories' }}</p></div>
      <div class="flex w-full gap-2 sm:w-auto"><div class="relative flex-1 sm:w-64"><span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle">⌕</span><input v-model="searchQuery" type="search" :placeholder="`Search #${tagName}…`" class="sp-input h-11 pl-9 text-[11px]"></div><div class="flex rounded-[12px] border border-line bg-surface-3 p-1"><button class="rounded-[9px] px-3 text-[10px] font-bold" :class="sortMode==='latest'?'bg-fg text-surface-2':'text-fg-muted'" @click="sortMode='latest'">Latest</button><button class="rounded-[9px] px-3 text-[10px] font-bold" :class="sortMode==='popular'?'bg-accent text-white':'text-fg-muted'" @click="sortMode='popular'">Popular</button></div></div>
    </div>
    <div v-if="visibleArticles.length" class="sp-stagger mt-7 grid gap-5 md:grid-cols-2"><NewsSharedArticleCard v-for="article in visibleArticles" :key="article.id" :article="article" /></div>
    <div v-else class="news-v4-panel mt-7 rounded-[22px] p-12 text-center"><span class="mx-auto flex h-12 w-12 items-center justify-center rounded-[14px] bg-surface-3 text-fg-subtle">⌕</span><h3 class="mt-4 text-xl font-bold text-fg">No matching stories</h3><p class="mt-2 text-sm text-fg-muted">No #{{ tagName }} stories match your current search.</p><button class="sp-btn sp-btn-secondary mt-5 px-4 py-2.5 text-xs" @click="clearSearch">Clear search</button></div>
    <div v-if="canLoadMore" class="mt-8 text-center"><button class="sp-btn sp-btn-secondary px-5 py-3 text-xs" @click="visibleCount += 4">Load more stories ↓</button></div>
  </section>
</template>
