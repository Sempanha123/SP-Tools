<script setup lang="ts">
import type { NewsArticle } from '~/types/news'
const props = defineProps<{ article: NewsArticle }>()
const imageLoaded = ref(false)
const imageFailed = ref(false)
const authorInitials = computed(() => props.article.author.split(' ').filter(Boolean).slice(0,2).map(n => n.charAt(0).toUpperCase()).join(''))
const authorSlug = computed(() => props.article.authorSlug || props.article.author.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-'))
const formattedDate = computed(() => { const d=new Date(props.article.publishedAt); return Number.isNaN(d.getTime()) ? props.article.publishedAt : new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(d) })
const formattedViews = computed(() => new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1}).format(props.article.views))
const tagToSlug = (tag:string) => tag.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-')
</script>

<template>
  <header class="sp-editorial-article-header border-b border-line bg-surface">
    <div class="sp-editorial-shell py-8 sm:py-10 lg:py-12">
      <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-2 text-[9px] font-semibold text-fg-subtle">
        <NuxtLink to="/" class="hover:text-fg">Home</NuxtLink><span>/</span><NuxtLink to="/news" class="hover:text-fg">News</NuxtLink><span>/</span><NuxtLink :to="`/news/category/${article.category}`" class="hover:text-fg">{{ article.categoryName }}</NuxtLink>
      </nav>

      <div class="mt-7 max-w-[1040px]">
        <div class="flex flex-wrap items-center gap-2">
          <span v-if="article.isBreaking" class="rounded-full bg-danger px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.14em] text-white">Breaking</span>
          <span v-if="article.isLive" class="rounded-full border border-danger/20 bg-danger-soft px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.14em] text-danger">Live</span>
          <NuxtLink :to="`/news/category/${article.category}`" class="rounded-full border border-accent/15 bg-accent-soft px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.14em] text-accent">{{ article.categoryName }}</NuxtLink>
          <span class="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[8px] font-semibold text-fg-muted">{{ article.region }}</span>
        </div>

        <h1 class="mt-5 max-w-[1040px] font-display text-[clamp(3rem,6vw,6.2rem)] font-[700] leading-[.9] tracking-[-.058em] text-fg">{{ article.title }}</h1>
        <p class="mt-6 max-w-[820px] text-[17px] leading-8 text-fg-muted sm:text-[19px]">{{ article.excerpt }}</p>

        <div class="mt-7 flex flex-col gap-5 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <NuxtLink :to="`/news/author/${authorSlug}`" class="group flex min-w-0 items-center gap-3">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-fg text-[10px] font-black text-surface">{{ authorInitials }}</div>
            <div><p class="text-[8px] font-bold uppercase tracking-[.14em] text-fg-subtle">By</p><p class="mt-1 text-[12px] font-bold text-fg group-hover:text-accent">{{ article.author }}</p></div>
          </NuxtLink>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-[9px] font-medium text-fg-subtle">
            <span>{{ formattedDate }}</span><span>· {{ article.readTime }}</span><span>· {{ formattedViews }} views</span>
          </div>
        </div>

        <div v-if="article.tags.length" class="mt-4 flex flex-wrap gap-3">
          <NuxtLink v-for="tag in article.tags.slice(0,5)" :key="tag" :to="`/news/tag/${tagToSlug(tag)}`" class="text-[9px] font-semibold text-fg-subtle hover:text-accent">#{{ tag }}</NuxtLink>
        </div>
      </div>

      <figure class="mt-8 overflow-hidden rounded-[24px] border border-line bg-surface-2 shadow-soft sm:mt-10">
        <div class="relative aspect-[16/8] min-h-[250px] overflow-hidden sm:min-h-[360px] lg:max-h-[620px]">
          <div v-if="article.image && !imageLoaded && !imageFailed" class="sp-skeleton absolute inset-0" />
          <img v-if="article.image && !imageFailed" :src="article.image" :alt="article.title" class="absolute inset-0 h-full w-full object-cover transition duration-500" :class="imageLoaded ? 'opacity-100' : 'opacity-0'" @load="imageLoaded=true" @error="imageFailed=true">
          <div v-else class="absolute inset-0 flex items-center justify-center bg-surface-3"><span class="text-sm font-semibold text-fg-subtle">Story image unavailable</span></div>
        </div>
        <figcaption v-if="article.imageCaption || article.imageCredit" class="flex flex-col justify-between gap-2 border-t border-line px-4 py-3 text-[9px] text-fg-subtle sm:flex-row"><span>{{ article.imageCaption }}</span><span v-if="article.imageCredit">{{ article.imageCredit }}</span></figcaption>
      </figure>
    </div>
  </header>
</template>
