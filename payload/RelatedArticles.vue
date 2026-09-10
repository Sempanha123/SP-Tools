<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

interface Props {
  articles: NewsArticle[]
  categoryName: string
}

defineProps<Props>()
</script>

<template>
  <section
    v-if="articles.length"
    class="sp-news-related border-t border-line bg-surface-2 py-10 sm:py-12"
  >
    <div class="sp-news-reader-width">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span class="text-[9px] font-bold uppercase tracking-[0.17em] text-accent">
            Continue reading
          </span>

          <h2 class="mt-2 text-2xl font-bold tracking-[-0.035em] text-fg sm:text-3xl">
            More from
            <span class="text-fg-subtle">{{ categoryName }}.</span>
          </h2>
        </div>

        <NuxtLink
          to="/news"
          class="group inline-flex items-center gap-2 text-xs font-bold text-fg-muted transition hover:text-fg"
        >
          Browse all news
          <span class="transition-transform group-hover:translate-x-1">→</span>
        </NuxtLink>
      </div>

      <div class="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <NewsSharedArticleCard
          v-for="article in articles.slice(0, 3)"
          :key="article.id"
          :article="article"
        />
      </div>
    </div>
  </section>
</template>
