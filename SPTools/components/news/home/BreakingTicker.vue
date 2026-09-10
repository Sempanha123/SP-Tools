<script setup lang="ts">
const { breakingArticles, timeAgo } = useNewsData()
const tickerArticles = computed(() => breakingArticles.value.length ? [...breakingArticles.value, ...breakingArticles.value] : [])
</script>

<template>
  <section v-if="tickerArticles.length" class="relative z-20 overflow-hidden border-b border-white/10 bg-[#090e16] text-white">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/55 to-cyan-300/45" />
    <div class="sp-container-wide flex min-h-12 items-stretch">
      <div class="relative z-10 flex shrink-0 items-center gap-2.5 border-r border-white/10 pr-4 text-[9px] font-bold uppercase tracking-[0.16em] text-white">
        <span class="relative flex h-2 w-2"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-40"/><span class="relative h-2 w-2 rounded-full bg-red-400 sp-glow-dot text-red-400"/></span>
        Live desk
        <span class="hidden rounded-full border border-white/10 bg-white/[.055] px-2 py-1 text-[7px] tracking-[.12em] text-white/40 sm:inline-flex">Breaking</span>
      </div>
      <div class="sp-marquee-mask min-w-0 flex-1 overflow-hidden">
        <div class="ticker-track flex h-12 w-max items-center hover:[animation-play-state:paused]">
          <NuxtLink v-for="(article,index) in tickerArticles" :key="`${article.id}-${index}`" :to="`/news/posts/${article.slug}`" class="group flex shrink-0 items-center gap-3 px-6 text-[11px] text-white/62 transition hover:text-white">
            <span class="font-semibold">{{ article.title }}</span><span class="h-1 w-1 rounded-full bg-violet-300/70"/><time :datetime="article.publishedAt" class="text-[8px] uppercase tracking-[.08em] text-white/34">{{ timeAgo(article.publishedAt) }}</time><span class="sp-hover-arrow text-cyan-200/0 transition group-hover:text-cyan-200/80">↗</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ticker-track{animation:news-ticker 36s linear infinite}@keyframes news-ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media(prefers-reduced-motion:reduce){.ticker-track{animation:none}}
</style>
