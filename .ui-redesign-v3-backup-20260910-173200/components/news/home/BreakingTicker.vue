<script setup lang="ts">
const { breakingArticles, timeAgo } = useNewsData()
const tickerArticles = computed(() => breakingArticles.value.length ? [...breakingArticles.value, ...breakingArticles.value] : [])
</script>

<template>
  <section v-if="tickerArticles.length" class="relative z-20 overflow-hidden border-b border-line bg-fg text-surface-2">
    <div class="sp-container-wide flex items-stretch">
      <div class="relative z-10 flex shrink-0 items-center gap-2 border-r border-white/10 pr-4 text-[9px] font-bold uppercase tracking-[0.15em] text-white">
        <span class="relative flex h-2 w-2"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-40"/><span class="relative h-2 w-2 rounded-full bg-red-400"/></span>Breaking
      </div>
      <div class="sp-marquee-mask min-w-0 flex-1 overflow-hidden">
        <div class="ticker-track flex h-11 w-max items-center hover:[animation-play-state:paused]">
          <NuxtLink v-for="(article,index) in tickerArticles" :key="`${article.id}-${index}`" :to="`/news/posts/${article.slug}`" class="flex shrink-0 items-center gap-3 px-5 text-[11px] text-white/70 transition hover:text-white"><span class="font-semibold">{{ article.title }}</span><span class="text-white/35">·</span><time :datetime="article.publishedAt" class="text-[9px] text-white/45">{{ timeAgo(article.publishedAt) }}</time></NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ticker-track{animation:news-ticker 38s linear infinite}@keyframes news-ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media(prefers-reduced-motion:reduce){.ticker-track{animation:none}}
</style>
