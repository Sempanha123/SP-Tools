<script setup lang="ts">
import type { NewsAuthor } from '~/types/news'

const props = defineProps<{ author: NewsAuthor }>()
const { formatDate, formatDateTime, formatViews } = useNewsData()

const initials = computed(() => props.author.name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]?.toUpperCase()).join('') || 'A')
const role = computed(() => props.author.role?.trim() || 'News Author')
const bio = computed(() => props.author.bio?.trim() || `Read the latest reporting and analysis by ${props.author.name}.`)
</script>

<template>
  <section class="bg-surface px-4 pb-7 pt-6 sm:px-6 sm:pb-9 sm:pt-8">
    <div class="sp-container-wide">
      <div class="news-v4-ink sp-noise relative overflow-hidden rounded-[30px] border border-white/10 px-5 py-9 shadow-[0_35px_100px_rgba(8,12,18,.20)] sm:px-9 sm:py-11 lg:px-12 lg:py-13">
        <div class="sp-quiet-grid pointer-events-none absolute inset-0 opacity-[.1]" />
        <div class="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-500/15 blur-[90px]" />
        <div class="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-[90px]" />

        <div class="relative">
          <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-2 text-[9px] font-semibold text-white/30">
            <NuxtLink to="/" class="transition hover:text-white/70">Home</NuxtLink><span>/</span><NuxtLink to="/news" class="transition hover:text-white/70">News</NuxtLink><span>/</span><span class="text-violet-200">{{ author.name }}</span>
          </nav>

          <div class="mt-8 grid items-center gap-8 lg:grid-cols-[180px_minmax(0,1fr)_260px] lg:gap-10">
            <div class="sp-reveal-left">
              <div class="relative mx-auto h-36 w-36 lg:mx-0 lg:h-40 lg:w-40">
                <div class="absolute -inset-5 rounded-[38px] bg-gradient-to-br from-violet-500/22 to-cyan-400/12 blur-2xl" />
                <img v-if="author.avatar" :src="author.avatar" :alt="author.name" class="relative h-full w-full rounded-[30px] border border-white/12 object-cover shadow-2xl">
                <div v-else class="relative flex h-full w-full items-center justify-center rounded-[30px] border border-white/12 bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 font-display text-4xl font-bold text-white shadow-2xl">{{ initials }}</div>
                <span v-if="author.verified" class="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-[12px] border-4 border-[#090e16] bg-cyan-400 text-sm font-black text-[#081016]">✓</span>
              </div>
            </div>

            <div class="sp-reveal min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full border border-white/10 bg-white/[.055] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.16em] text-violet-200">SP-Tools editorial</span>
                <span v-if="author.verified" class="rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.14em] text-cyan-200">Verified</span>
              </div>
              <h1 class="mt-5 font-display text-[clamp(2.8rem,5.7vw,5.7rem)] font-[700] leading-[.88] tracking-[-.06em] text-white">{{ author.name }}</h1>
              <p class="mt-3 text-[12px] font-bold uppercase tracking-[.13em] text-cyan-200">{{ role }}</p>
              <p class="mt-5 max-w-2xl text-[13px] leading-6 text-white/52 sm:text-[15px] sm:leading-7">{{ bio }}</p>

              <div class="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[9px] text-white/32">
                <span v-if="author.location">● {{ author.location }}</span>
                <span v-if="author.joinedAt">Joined {{ formatDate(author.joinedAt) }}</span>
                <span v-if="author.latestPublishedAt">Latest {{ formatDateTime(author.latestPublishedAt) }}</span>
              </div>
            </div>

            <div class="sp-reveal grid grid-cols-2 gap-2.5 lg:grid-cols-1">
              <div class="rounded-[16px] border border-white/10 bg-white/[.045] p-4"><p class="text-[8px] uppercase tracking-[.13em] text-white/28">Published</p><p class="mt-2 font-display text-2xl font-bold text-white">{{ author.articlesCount.toLocaleString('en-US') }}</p><p class="mt-1 text-[9px] text-white/35">articles</p></div>
              <div class="rounded-[16px] border border-white/10 bg-white/[.045] p-4"><p class="text-[8px] uppercase tracking-[.13em] text-white/28">Audience</p><p class="mt-2 font-display text-2xl font-bold text-white">{{ formatViews(author.totalViews) }}</p><p class="mt-1 text-[9px] text-white/35">total views</p></div>
              <div class="col-span-2 rounded-[16px] border border-white/10 bg-white/[.045] p-4 lg:col-span-1"><div class="grid grid-cols-2 gap-4"><div><p class="text-[8px] uppercase tracking-[.13em] text-white/28">Topics</p><p class="mt-1 text-[13px] font-bold text-violet-200">{{ author.categories.length }}</p></div><div><p class="text-[8px] uppercase tracking-[.13em] text-white/28">Regions</p><p class="mt-1 text-[13px] font-bold text-cyan-200">{{ author.regions.length }}</p></div></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
