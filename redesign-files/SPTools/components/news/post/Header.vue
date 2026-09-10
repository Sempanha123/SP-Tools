<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

const props = defineProps<{ article: NewsArticle }>()
const imageLoaded = ref(false)
const imageFailed = ref(false)

const authorInitials = computed(() => props.article.author.split(' ').filter(Boolean).slice(0, 2).map(name => name.charAt(0).toUpperCase()).join(''))
const authorSlug = computed(() => props.article.authorSlug || props.article.author.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'))
const formattedDate = computed(() => {
  const date = new Date(props.article.publishedAt)
  return Number.isNaN(date.getTime()) ? props.article.publishedAt : new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date)
})
const formattedTime = computed(() => {
  const date = new Date(props.article.publishedAt)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date)
})
const formattedViews = computed(() => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(props.article.views))
const tagToSlug = (tag: string) => tag.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
</script>

<template>
  <header class="bg-surface px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
    <div class="sp-container-wide">
      <div class="news-v4-ink sp-noise relative overflow-hidden rounded-[30px] border border-white/10 shadow-[0_38px_110px_rgba(8,12,18,.20)]">
        <div class="sp-quiet-grid pointer-events-none absolute inset-0 opacity-[.09]" />
        <div class="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-violet-500/14 blur-[90px]" />
        <div class="pointer-events-none absolute -right-28 top-[25%] h-72 w-72 rounded-full bg-cyan-400/9 blur-[90px]" />

        <div class="relative px-5 pb-6 pt-6 sm:px-9 sm:pb-8 sm:pt-8 lg:px-12">
          <nav aria-label="Breadcrumb" class="flex min-w-0 flex-wrap items-center gap-2 text-[9px] font-semibold text-white/28">
            <NuxtLink to="/" class="hover:text-white/70">Home</NuxtLink><span>/</span>
            <NuxtLink to="/news" class="hover:text-white/70">News</NuxtLink><span>/</span>
            <NuxtLink :to="`/news/category/${article.category}`" class="hover:text-white/70">{{ article.categoryName }}</NuxtLink><span>/</span>
            <span class="max-w-[220px] truncate text-white/42 sm:max-w-md">{{ article.title }}</span>
          </nav>

          <div class="mt-7 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-12">
            <div class="sp-reveal-left min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span v-if="article.isBreaking" class="inline-flex items-center gap-2 rounded-full bg-rose-500 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.14em] text-white"><span class="h-1.5 w-1.5 rounded-full bg-white sp-pulse-soft"/> Breaking</span>
                <span v-if="article.isLive" class="inline-flex items-center gap-2 rounded-full border border-rose-300/15 bg-rose-400/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.14em] text-rose-200"><span class="h-1.5 w-1.5 rounded-full bg-rose-300 sp-pulse-soft"/> Live</span>
                <NuxtLink :to="`/news/category/${article.category}`" class="rounded-full border border-white/10 bg-white/[.055] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.14em] text-violet-200 transition hover:bg-white/[.09]">{{ article.categoryName }}</NuxtLink>
                <span class="rounded-full border border-white/10 bg-white/[.035] px-3 py-1.5 text-[8px] font-semibold text-white/44">{{ article.region }}</span>
              </div>

              <h1 class="mt-6 max-w-5xl font-display text-[clamp(2.9rem,6.2vw,6.4rem)] font-[700] leading-[.88] tracking-[-.065em] text-white">{{ article.title }}</h1>
              <p class="mt-6 max-w-3xl text-[14px] leading-7 text-white/52 sm:text-[17px] sm:leading-8">{{ article.excerpt }}</p>

              <div v-if="article.tags.length" class="mt-6 flex flex-wrap gap-2">
                <NuxtLink v-for="tag in article.tags.slice(0, 5)" :key="tag" :to="`/news/tag/${tagToSlug(tag)}`" class="rounded-full border border-white/9 bg-white/[.035] px-3 py-1.5 text-[9px] font-semibold text-white/42 transition hover:border-violet-300/22 hover:text-violet-200">#{{ tag }}</NuxtLink>
              </div>
            </div>

            <div class="sp-reveal rounded-[20px] border border-white/10 bg-white/[.05] p-4 backdrop-blur-xl">
              <p class="text-[8px] font-bold uppercase tracking-[.15em] text-cyan-200">Story overview</p>
              <dl class="mt-3 divide-y divide-white/8">
                <div class="flex items-center justify-between gap-4 py-2.5"><dt class="text-[9px] text-white/30">Reading</dt><dd class="text-[9px] font-bold text-white/72">{{ article.readTime }}</dd></div>
                <div class="flex items-center justify-between gap-4 py-2.5"><dt class="text-[9px] text-white/30">Views</dt><dd class="text-[9px] font-bold text-white/72">{{ formattedViews }}</dd></div>
                <div class="flex items-center justify-between gap-4 py-2.5"><dt class="text-[9px] text-white/30">Region</dt><dd class="text-[9px] font-bold text-white/72">{{ article.region }}</dd></div>
                <div class="flex items-center justify-between gap-4 py-2.5"><dt class="text-[9px] text-white/30">Source</dt><dd class="max-w-[120px] truncate text-[9px] font-bold text-white/72">{{ article.source }}</dd></div>
              </dl>
              <a href="#article-content" class="mt-3 flex items-center justify-between rounded-[11px] bg-white px-3.5 py-2.5 text-[9px] font-bold text-[#10141d] transition hover:-translate-y-0.5">Start reading <span>↓</span></a>
            </div>
          </div>

          <div class="mt-7 flex flex-col justify-between gap-5 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
            <NuxtLink :to="`/news/author/${authorSlug}`" class="group flex min-w-0 items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-violet-500 to-cyan-400 text-[10px] font-black text-white shadow-lg">{{ authorInitials }}</div>
              <div class="min-w-0"><p class="text-[8px] font-bold uppercase tracking-[.14em] text-white/25">Written by</p><p class="mt-1 truncate text-[11px] font-bold text-white/78 transition group-hover:text-white">{{ article.author }}</p></div>
            </NuxtLink>
            <div class="flex flex-wrap gap-x-5 gap-y-2 text-[9px] text-white/30"><span>{{ formattedDate }}</span><span>{{ formattedTime }}</span><span>{{ article.readTime }}</span><span>{{ formattedViews }} views</span></div>
          </div>
        </div>

        <figure class="relative mx-3 mb-3 overflow-hidden rounded-[24px] border border-white/10 bg-white/[.035] sm:mx-4 sm:mb-4">
          <div class="relative min-h-[280px] overflow-hidden sm:min-h-[430px] lg:min-h-[560px]">
            <div v-if="article.image && !imageLoaded && !imageFailed" class="sp-skeleton absolute inset-0" />
            <img v-if="article.image && !imageFailed" :src="article.image" :alt="article.title" class="absolute inset-0 h-full w-full object-cover transition duration-700" :class="imageLoaded ? 'opacity-100' : 'opacity-0'" @load="imageLoaded = true" @error="imageFailed = true">
            <div v-else class="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(124,92,255,.14),transparent_28%),#0b1018]"><div class="text-center"><span class="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] border border-white/10 bg-white/[.05] text-xl text-violet-200">N</span><p class="mt-3 text-[10px] font-semibold text-white/35">Story image unavailable</p></div></div>
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>
          <figcaption v-if="article.imageCaption || article.imageCredit" class="flex flex-col justify-between gap-2 border-t border-white/10 bg-black/18 px-4 py-3 text-[9px] text-white/32 sm:flex-row"><span>{{ article.imageCaption }}</span><span v-if="article.imageCredit">{{ article.imageCredit }}</span></figcaption>
        </figure>
      </div>
    </div>
  </header>
</template>
