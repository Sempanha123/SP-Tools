<script setup lang="ts">
const { breakingArticles, timeAgo } = useNewsData()

const tickerArticles = computed(() => {
  if (!breakingArticles.value.length) return []
  return [...breakingArticles.value, ...breakingArticles.value]
})
</script>

<template>
  <section v-if="tickerArticles.length" class="relative z-20 overflow-hidden border-b border-line bg-surface-2">
    <div class="sp-container flex items-stretch">
      <div class="relative z-10 flex shrink-0 items-center gap-2 border-r border-line pr-4 text-[10px] font-bold uppercase tracking-[0.14em] text-danger">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-30" />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-danger" />
        </span>
        Breaking
      </div>

      <div class="ticker-mask min-w-0 flex-1 overflow-hidden">
        <div class="ticker-track flex h-10 w-max items-center hover:[animation-play-state:paused]">
          <NuxtLink
            v-for="(article, index) in tickerArticles"
            :key="`${article.id}-${index}`"
            :to="`/news/posts/${article.slug}`"
            class="flex shrink-0 items-center gap-3 px-5 text-[12px] text-fg-muted transition hover:text-fg"
          >
            <span class="font-semibold">{{ article.title }}</span>
            <span class="text-fg-subtle">·</span>
            <time :datetime="article.publishedAt" class="text-[10px] text-fg-subtle">
              {{ timeAgo(article.publishedAt) }}
            </time>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ticker-mask {
  mask-image: linear-gradient(90deg, transparent, black 4%, black 96%, transparent);
}

.ticker-track {
  animation: news-ticker 42s linear infinite;
}

@keyframes news-ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .ticker-track { animation: none; }
}
</style>
