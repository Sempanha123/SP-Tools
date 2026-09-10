<script setup lang="ts">
import type { CategoryNewsSort } from '~/composables/useNewsCategoryPage'

const {
  slug: categorySlug,
  articles: categoryArticles,
  featuredArticle,
  remainingArticles,
  categoryDetails,
  categoryName,
  categoryDescription,
  mostReadArticles,
  pagination,
  sort,
  searchQuery,
  region,
  pending,
  error,
  refresh,
  applyFilters,
  goToPage,
  clearFilters,
} = await useNewsCategoryPage()

const { timeAgo, formatViews } = useNewsData()
const searchInput = ref(searchQuery.value)
const regionInput = ref(region.value)
const sortInput = ref<CategoryNewsSort>(sort.value)
watch(searchQuery, value => { searchInput.value = value })
watch(region, value => { regionInput.value = value })
watch(sort, value => { sortInput.value = value })

const totalArticles = computed(() => pagination.value?.total ?? categoryArticles.value.length)
const currentPage = computed(() => pagination.value?.current_page ?? 1)
const lastPage = computed(() => pagination.value?.last_page ?? 1)
const visiblePages = computed(() => {
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(lastPage.value, currentPage.value + 2)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
const categoryIcon = computed(() => categoryDetails.value?.icon?.trim() || categoryName.value.charAt(0).toUpperCase() || 'N')
const categoryTags = computed(() => {
  const map = new Map<string, { name: string; slug: string; count: number }>()
  const slugify = (value: string) => value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
  for (const article of categoryArticles.value) {
    article.tags.forEach((name, index) => {
      const slug = article.tagSlugs?.[index] || slugify(name)
      const item = map.get(slug)
      if (item) item.count += 1
      else map.set(slug, { name, slug, count: 1 })
    })
  }
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 8)
})
const submitFilters = async () => applyFilters({ q: searchInput.value, region: regionInput.value, sort: sortInput.value })
const resetFilters = async () => { searchInput.value = ''; regionInput.value = ''; sortInput.value = 'latest'; await clearFilters() }

const pageTitle = computed(() => `${categoryName.value} News and Latest Updates | SP-Tools`)
useSeoMeta({ title: () => pageTitle.value, description: () => categoryDescription.value, ogTitle: () => pageTitle.value, ogDescription: () => categoryDescription.value, ogType: 'website', twitterCard: 'summary_large_image' })
useHead(() => ({ link: [{ rel: 'canonical', href: `/news/category/${categorySlug.value}` }] }))
</script>

<template>
  <main class="news-v4-shell min-h-screen overflow-hidden">
    <section v-if="pending" class="sp-container-wide py-20"><div class="sp-skeleton h-[420px] rounded-[30px]"/><div class="mt-8 grid gap-5 md:grid-cols-3"><div v-for="n in 6" :key="n" class="sp-skeleton h-80 rounded-[20px]"/></div></section>

    <section v-else-if="error" class="sp-container py-24 text-center"><div class="news-v4-panel rounded-[24px] p-8 sm:p-12"><p class="sp-kicker justify-center">News API</p><h1 class="mt-4 text-3xl font-bold text-fg">Category could not be loaded</h1><p class="mx-auto mt-3 max-w-xl text-sm leading-7 text-fg-muted">The category may be unavailable or the local news API is not reachable.</p><div class="mt-6 flex justify-center gap-3"><button class="sp-btn sp-btn-primary px-5 py-3 text-xs" @click="refresh">Try again</button><NuxtLink to="/news" class="sp-btn sp-btn-secondary px-5 py-3 text-xs">Back to news</NuxtLink></div></div></section>

    <template v-else>
      <section class="bg-surface px-4 pb-7 pt-6 sm:px-6 sm:pb-9 sm:pt-8">
        <div class="sp-container-wide">
          <div class="news-v4-ink sp-noise relative overflow-hidden rounded-[30px] border border-white/10 px-5 py-10 shadow-[0_35px_105px_rgba(8,12,18,.20)] sm:px-10 sm:py-13 lg:px-14">
            <div class="sp-quiet-grid pointer-events-none absolute inset-0 opacity-[.1]" />
            <div class="pointer-events-none absolute -right-32 -top-28 h-80 w-80 rounded-full bg-cyan-400/10 blur-[90px]" />
            <div class="pointer-events-none absolute -bottom-36 left-[18%] h-96 w-96 rounded-full bg-violet-500/15 blur-[100px]" />
            <div class="relative grid items-end gap-10 lg:grid-cols-[1fr_300px]">
              <div class="sp-reveal-left">
                <nav class="flex items-center gap-2 text-[9px] font-semibold text-white/30"><NuxtLink to="/" class="hover:text-white/70">Home</NuxtLink><span>/</span><NuxtLink to="/news" class="hover:text-white/70">News</NuxtLink><span>/</span><span class="text-violet-200">{{ categoryName }}</span></nav>
                <div class="mt-8 flex items-center gap-3"><span class="flex h-11 w-11 items-center justify-center rounded-[13px] border border-white/10 bg-white/[.06] text-lg text-cyan-200">{{ categoryIcon }}</span><p class="text-[9px] font-bold uppercase tracking-[.17em] text-cyan-200">Global desk · category</p></div>
                <h1 class="mt-5 max-w-4xl font-display text-[clamp(3.4rem,7vw,7rem)] font-[700] leading-[.84] tracking-[-.07em] text-white">{{ categoryName }}<span class="text-white/20">.</span></h1>
                <p class="mt-6 max-w-2xl text-[14px] leading-7 text-white/48 sm:text-[16px]">{{ categoryDescription }}</p>
              </div>
              <div class="sp-reveal rounded-[20px] border border-white/10 bg-white/[.05] p-4"><p class="text-[8px] font-bold uppercase tracking-[.14em] text-white/28">Desk snapshot</p><div class="mt-4 grid grid-cols-2 gap-2"><div class="rounded-[13px] border border-white/8 bg-black/15 p-3"><p class="text-[8px] uppercase text-white/25">Stories</p><p class="mt-1.5 font-display text-2xl font-bold text-white">{{ totalArticles }}</p></div><div class="rounded-[13px] border border-white/8 bg-black/15 p-3"><p class="text-[8px] uppercase text-white/25">Sort</p><p class="mt-1.5 text-[12px] font-bold capitalize text-violet-200">{{ sort }}</p></div></div><a href="#category-stories" class="mt-3 flex items-center justify-between rounded-[11px] bg-white px-3.5 py-2.5 text-[9px] font-bold text-[#10141d]">Open coverage <span>↓</span></a></div>
            </div>
          </div>
        </div>
      </section>

      <NewsHomeCategoryNav />

      <section class="relative border-b border-line bg-surface py-12 sm:py-16">
        <div class="sp-quiet-grid pointer-events-none inset-x-0 top-0 h-80 opacity-[.1]" />
        <div class="sp-container-wide relative">
          <form class="news-v4-panel grid gap-3 rounded-[20px] p-4 md:grid-cols-[minmax(0,1fr)_180px_150px_auto]" @submit.prevent="submitFilters">
            <input v-model="searchInput" type="search" :placeholder="`Search ${categoryName} coverage…`" class="sp-input h-12 text-sm">
            <input v-model="regionInput" type="text" placeholder="Region" class="sp-input h-12 text-sm">
            <select v-model="sortInput" class="sp-input h-12 text-sm" @change="submitFilters"><option value="latest">Latest</option><option value="popular">Popular</option><option value="oldest">Oldest</option></select>
            <button type="submit" class="sp-btn sp-btn-primary h-12 px-5 text-xs">Search →</button>
          </form>

          <div v-if="categoryTags.length" class="mt-4 flex gap-2 overflow-x-auto pb-1"><NuxtLink v-for="tag in categoryTags" :key="tag.slug" :to="`/news/tag/${tag.slug}`" class="shrink-0 rounded-full border border-line bg-surface-2 px-3 py-2 text-[9px] font-semibold text-fg-muted transition hover:border-accent/30 hover:text-accent">#{{ tag.name }} <span class="opacity-45">{{ tag.count }}</span></NuxtLink></div>

          <div id="category-stories" class="mt-9 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
            <div class="min-w-0">
              <div v-if="featuredArticle" class="mb-8">
                <p class="sp-kicker">Lead story</p>
                <NuxtLink :to="`/news/posts/${featuredArticle.slug}`" class="group mt-4 grid overflow-hidden rounded-[24px] border border-line bg-surface-2 shadow-soft lg:grid-cols-[1.08fr_.92fr]">
                  <div class="relative min-h-[300px] overflow-hidden bg-surface-3"><img v-if="featuredArticle.image" :src="featuredArticle.image" :alt="featuredArticle.title" class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"><div v-else class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(124,92,255,.12),transparent_32%),var(--sp-surface-soft)]"/></div>
                  <div class="flex flex-col justify-center p-6 sm:p-8"><p class="text-[9px] font-bold uppercase tracking-[.14em] text-accent">{{ featuredArticle.categoryName }} · {{ featuredArticle.region }}</p><h2 class="mt-4 font-display text-3xl font-bold leading-[1.02] tracking-[-.04em] text-fg sm:text-4xl">{{ featuredArticle.title }}</h2><p class="mt-4 text-sm leading-7 text-fg-muted">{{ featuredArticle.excerpt }}</p><div class="mt-5 flex gap-3 text-[9px] text-fg-subtle"><span>{{ timeAgo(featuredArticle.publishedAt) }}</span><span>·</span><span>{{ formatViews(featuredArticle.views) }} views</span></div></div>
                </NuxtLink>
              </div>

              <div v-if="remainingArticles.length" class="sp-stagger grid gap-5 md:grid-cols-2"><NewsSharedArticleCard v-for="article in remainingArticles" :key="article.id" :article="article" /></div>
              <div v-else class="news-v4-panel rounded-[22px] p-10 text-center"><h3 class="text-xl font-bold text-fg">No stories in this view</h3><p class="mt-2 text-sm text-fg-muted">Try clearing the search or region filter.</p><button class="sp-btn sp-btn-secondary mt-5 px-4 py-2.5 text-xs" @click="resetFilters">Clear filters</button></div>

              <div v-if="lastPage > 1" class="mt-9 flex flex-wrap gap-2"><button v-for="pageNumber in visiblePages" :key="pageNumber" class="flex h-10 w-10 items-center justify-center rounded-[11px] border text-xs font-bold" :class="pageNumber === currentPage ? 'border-accent bg-accent text-white' : 'border-line bg-surface-2 text-fg-muted'" @click="goToPage(pageNumber)">{{ pageNumber }}</button></div>
            </div>

            <aside class="space-y-5 lg:sticky lg:top-28">
              <section class="news-v4-ink overflow-hidden rounded-[22px] border border-white/10 p-5"><p class="text-[9px] font-bold uppercase tracking-[.14em] text-rose-300">Most read</p><h3 class="mt-2 font-display text-2xl font-bold text-white">Reader pulse.</h3><div class="mt-5 divide-y divide-white/8"><NuxtLink v-for="(article,index) in mostReadArticles.slice(0,5)" :key="article.id" :to="`/news/posts/${article.slug}`" class="grid grid-cols-[28px_1fr] gap-3 py-3"><span class="font-display text-xl text-white/22">0{{ index+1 }}</span><div><p class="line-clamp-2 text-[11px] font-semibold leading-5 text-white/68">{{ article.title }}</p><p class="mt-1 text-[8px] text-white/28">{{ formatViews(article.views) }} views</p></div></NuxtLink></div></section>
              <section class="news-v4-panel rounded-[22px] p-5"><p class="sp-kicker">About this desk</p><p class="mt-3 text-[12px] leading-6 text-fg-muted">{{ categoryDescription }}</p><NuxtLink to="/news/search" class="mt-4 flex items-center justify-between rounded-[11px] bg-surface-3 px-3.5 py-3 text-[10px] font-bold text-fg">Search all news <span>→</span></NuxtLink></section>
            </aside>
          </div>
        </div>
      </section>

      <NewsHomeNewsletter />
    </template>
  </main>
</template>
