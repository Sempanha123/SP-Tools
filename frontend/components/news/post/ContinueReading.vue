<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

defineProps<{
  articles: NewsArticle[]
  categorySlug: string
}>()

const { timeAgo } = useNewsData()
</script>

<template>
  <section class="sp-v19-continue border-t border-line bg-surface py-14 print:hidden sm:py-16 lg:py-20">
    <div class="sp-v19-shell">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="sp-v19-kicker">
            Continue reading
          </p>

          <h2 class="mt-2 max-w-3xl text-[clamp(2.1rem,4vw,3.5rem)] font-[800] leading-[.96] tracking-[-.055em] text-fg">
            More from this category
          </h2>
        </div>

        <NuxtLink
          :to="`/news/category/${categorySlug}`"
          class="group inline-flex items-center gap-2 text-[10px] font-bold text-fg-subtle transition hover:text-accent"
        >
          View category
          <span class="transition-transform group-hover:translate-x-1">→</span>
        </NuxtLink>
      </div>

      <div class="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="(article, index) in articles.slice(0, 3)"
          :key="article.id"
          :to="`/news/posts/${article.slug}`"
          class="sp-v19-related-card group"
        >
          <div class="sp-v19-related-image">
            <img
              v-if="article.image"
              :src="article.image"
              :alt="article.title"
              loading="lazy"
              class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
            >

            <span class="sp-v19-related-index">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
          </div>

          <div class="pt-4">
            <p class="text-[8px] font-bold uppercase tracking-[.12em] text-accent">
              {{ article.categoryName }} · {{ timeAgo(article.publishedAt) }}
            </p>

            <h3 class="mt-2 text-[21px] font-[780] leading-[1.18] tracking-[-.032em] text-fg transition group-hover:text-accent">
              {{ article.title }}
            </h3>

            <p class="mt-3 line-clamp-2 text-[12px] leading-6 text-fg-muted">
              {{ article.excerpt }}
            </p>

            <span class="mt-4 inline-flex items-center gap-2 text-[10px] font-bold text-fg-muted">
              Read story
              <span class="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
