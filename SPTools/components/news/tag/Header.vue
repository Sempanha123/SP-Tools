<script setup lang="ts">
interface Props { tagName: string; articleCount: number; latestPublishedAt?: string }
const props = withDefaults(defineProps<Props>(), { latestPublishedAt: '' })
const { timeAgo } = useNewsData()
const articleLabel = computed(() => props.articleCount === 1 ? '1 story' : `${props.articleCount} stories`)
</script>

<template>
  <header class="bg-surface px-4 pb-7 pt-6 sm:px-6 sm:pb-9 sm:pt-8">
    <div class="sp-container-wide">
      <div class="news-v4-ink sp-noise relative overflow-hidden rounded-[30px] border border-white/10 px-5 py-10 shadow-[0_32px_95px_rgba(8,12,18,.18)] sm:px-10 sm:py-13 lg:px-14">
        <div class="sp-quiet-grid pointer-events-none absolute inset-0 opacity-[.10]" />
        <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/16 blur-[85px]" />
        <div class="pointer-events-none absolute -bottom-32 left-[20%] h-80 w-80 rounded-full bg-cyan-400/10 blur-[90px]" />

        <div class="relative grid items-end gap-9 lg:grid-cols-[1fr_330px]">
          <div class="sp-reveal-left">
            <nav class="flex flex-wrap items-center gap-2 text-[9px] font-semibold text-white/30"><NuxtLink to="/" class="hover:text-white/70">Home</NuxtLink><span>/</span><NuxtLink to="/news" class="hover:text-white/70">News</NuxtLink><span>/</span><span class="text-violet-200">{{ tagName }}</span></nav>
            <p class="mt-8 text-[9px] font-bold uppercase tracking-[.17em] text-cyan-200">Topic signal</p>
            <h1 class="mt-4 max-w-4xl font-display text-[clamp(3rem,7vw,6.8rem)] font-[700] leading-[.84] tracking-[-.065em] text-white"><span class="text-white/22">#</span>{{ tagName }}</h1>
            <p class="mt-6 max-w-2xl text-[13px] leading-6 text-white/48 sm:text-[15px] sm:leading-7">Reporting, analysis and developing stories connected to this topic—kept in one focused editorial stream.</p>
          </div>

          <div class="sp-reveal rounded-[22px] border border-white/10 bg-white/[.05] p-4 backdrop-blur-xl sm:p-5">
            <div class="flex items-center justify-between"><p class="text-[8px] font-bold uppercase tracking-[.14em] text-white/28">Topic intelligence</p><span class="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/[.06] text-violet-200">#</span></div>
            <div class="mt-4 grid grid-cols-2 gap-2"><div class="rounded-[13px] border border-white/8 bg-black/15 p-3"><p class="text-[8px] uppercase tracking-[.12em] text-white/25">Coverage</p><p class="mt-1.5 text-[13px] font-bold text-white">{{ articleLabel }}</p></div><div class="rounded-[13px] border border-white/8 bg-black/15 p-3"><p class="text-[8px] uppercase tracking-[.12em] text-white/25">Status</p><p class="mt-1.5 text-[13px] font-bold text-emerald-300">Live index</p></div></div>
            <p v-if="latestPublishedAt" class="mt-3 text-[9px] text-white/30">Updated {{ timeAgo(latestPublishedAt) }}</p>
            <a href="#tag-stories" class="mt-4 flex items-center justify-between rounded-[12px] bg-white px-4 py-3 text-[10px] font-bold text-[#10141d] transition hover:-translate-y-0.5">Explore stories <span>↓</span></a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
