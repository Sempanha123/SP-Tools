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
    class="border-t border-slate-100
    bg-slate-50 py-24 sm:py-28"
  >
    <div class="mx-auto max-w-7xl px-6">
      <div
        class="flex flex-col justify-between gap-5
        sm:flex-row sm:items-end"
      >
        <div>
          <span
            class="text-xs font-bold uppercase
            tracking-[0.2em] text-indigo-600"
          >
            Continue reading
          </span>

          <h2
            class="mt-4 text-4xl font-bold
            tracking-[-0.04em] sm:text-5xl"
          >
            More from
            <span class="text-slate-400">
              {{ categoryName }}.
            </span>
          </h2>
        </div>

        <NuxtLink
          to="/news"
          class="group inline-flex items-center gap-2
          text-sm font-bold text-slate-800"
        >
          Browse all news

          <span
            class="transition-transform
            group-hover:translate-x-1"
          >
            →
          </span>
        </NuxtLink>
      </div>

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        <NewsSharedArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
        />
      </div>
    </div>
  </section>
</template>