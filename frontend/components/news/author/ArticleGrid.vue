<script setup lang="ts">
import type { NewsArticle } from '~/types/news'
type SortMode = 'latest' | 'popular'
const props = defineProps<{ articles: NewsArticle[]; authorName: string }>()
const searchQuery = ref('')
const sortMode = ref<SortMode>('latest')
const selectedCategory = ref('all')
const categoryOptions = computed(() => ['all', ...Array.from(new Set(props.articles.map(a => a.categoryName?.trim()).filter((x): x is string => Boolean(x)))).sort()])
const filteredArticles = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const result = props.articles.filter(article => {
    const text = [article.title, article.excerpt, article.author, article.source, article.region, ...article.tags].join(' ').toLowerCase()
    return (!q || text.includes(q)) && (selectedCategory.value === 'all' || article.categoryName === selectedCategory.value)
  })
  return [...result].sort((a,b) => sortMode.value === 'popular' ? b.views-a.views : new Date(b.publishedAt).getTime()-new Date(a.publishedAt).getTime())
})
const hasActiveFilters = computed(() => Boolean(searchQuery.value.trim() || selectedCategory.value !== 'all' || sortMode.value !== 'latest'))
const clearFilters = () => { searchQuery.value=''; selectedCategory.value='all'; sortMode.value='latest' }
</script>

<template>
  <section id="author-stories" class="scroll-mt-28">
    <div class="flex flex-col justify-between gap-6 border-b border-line pb-6 xl:flex-row xl:items-end">
      <div><p class="sp-kicker">Author archive</p><h2 class="mt-3 text-3xl font-[760] tracking-[-.045em] text-fg">Reporting by <span class="text-fg-subtle">{{ authorName }}</span></h2><p class="mt-2 text-[12px] text-fg-subtle">{{ filteredArticles.length }} {{ filteredArticles.length === 1 ? 'article' : 'articles' }} in this view</p></div>
      <div class="flex w-full flex-col gap-2 sm:flex-row xl:w-auto"><input v-model="searchQuery" type="search" placeholder="Search this author…" class="sp-input h-11 text-[11px] sm:w-64"><div class="flex rounded-[12px] border border-line bg-surface-3 p-1"><button class="rounded-[9px] px-3 text-[10px] font-bold" :class="sortMode==='latest'?'bg-fg text-surface-2':'text-fg-muted'" @click="sortMode='latest'">Latest</button><button class="rounded-[9px] px-3 text-[10px] font-bold" :class="sortMode==='popular'?'bg-accent text-white':'text-fg-muted'" @click="sortMode='popular'">Popular</button></div></div>
    </div>

    <div v-if="categoryOptions.length > 1" class="mt-5 flex gap-2 overflow-x-auto pb-1"><button v-for="category in categoryOptions" :key="category" class="shrink-0 rounded-full border px-3 py-2 text-[9px] font-bold transition" :class="selectedCategory===category?'border-accent/25 bg-accent-soft text-accent':'border-line bg-surface-2 text-fg-muted hover:border-accent/20 hover:text-fg'" @click="selectedCategory=category">{{ category==='all'?'All categories':category }}</button><button v-if="hasActiveFilters" class="shrink-0 px-2 text-[9px] font-bold text-danger" @click="clearFilters">Clear</button></div>

    <div v-if="filteredArticles.length" class="sp-stagger mt-7 grid gap-5 md:grid-cols-2"><NewsSharedArticleCard v-for="article in filteredArticles" :key="article.id" :article="article" /></div>
    <div v-else class="news-v4-panel mt-7 rounded-[22px] p-12 text-center"><span class="mx-auto flex h-12 w-12 items-center justify-center rounded-[14px] bg-surface-3 text-fg-subtle">⌕</span><h3 class="mt-4 text-xl font-bold text-fg">No articles found</h3><p class="mt-2 text-sm text-fg-muted">Nothing by {{ authorName }} matches the current filters.</p><button v-if="hasActiveFilters" class="sp-btn sp-btn-secondary mt-5 px-4 py-2.5 text-xs" @click="clearFilters">Clear filters</button></div>
  </section>
</template>
