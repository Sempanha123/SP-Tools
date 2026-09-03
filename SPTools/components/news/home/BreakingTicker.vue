<script setup lang="ts">
const { breakingArticles, timeAgo } = useNewsData()

const tickerArticles = computed(() => {
  if (!breakingArticles.value.length) {
    return []
  }

  return [
    ...breakingArticles.value,
    ...breakingArticles.value,
  ]
})
</script>

<template>
  <section
    v-if="tickerArticles.length"
    class="relative z-20 overflow-hidden
    border-b border-red-900/30 bg-slate-950 text-white"
  >
    <div class="mx-auto flex max-w-7xl items-stretch px-6">
      <div
        class="relative z-10 flex shrink-0 items-center
        gap-2 bg-red-600 px-4 py-3
        text-[10px] font-bold uppercase tracking-[0.18em]"
      >
        <span class="relative flex h-2 w-2">
          <span
            class="absolute inline-flex h-full w-full
            animate-ping rounded-full bg-white opacity-50"
          />

          <span
            class="relative inline-flex h-2 w-2
            rounded-full bg-white"
          />
        </span>

        Breaking
      </div>

      <div
        class="ticker-mask min-w-0 flex-1 overflow-hidden"
      >
        <div
          class="ticker-track flex h-full w-max
          items-center hover:[animation-play-state:paused]"
        >
          <NuxtLink
            v-for="(article, index) in tickerArticles"
            :key="`${article.id}-${index}`"
            :to="`/news/posts/${article.slug}`"
            class="flex shrink-0 items-center gap-3
            px-7 py-3 text-xs text-slate-300
            transition-colors hover:text-white"
          >
            <span class="font-semibold">
              {{ article.title }}
            </span>

            <span class="text-slate-600">
              •
            </span>

            <time
              :datetime="article.publishedAt"
              class="text-[10px] text-slate-500"
            >
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
  mask-image: linear-gradient(
    90deg,
    transparent,
    black 4%,
    black 96%,
    transparent
  );
}

.ticker-track {
  animation: news-ticker 42s linear infinite;
}

@keyframes news-ticker {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ticker-track {
    animation: none;
  }
}
</style>