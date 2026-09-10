<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

const props = defineProps<{
  articles: NewsArticle[]
  categorySlug: string
}>()

const { timeAgo } = useNewsData()

const gridClass = computed(() => {
  const count = props.articles.length

  if (count <= 1) {
    return 'grid-cols-1'
  }

  if (count === 2) {
    return 'md:grid-cols-2'
  }

  return 'md:grid-cols-2 xl:grid-cols-3'
})
</script>

<template>
  <section
    v-if="articles.length"
    class="sp-continue-reading border-y border-line bg-surface-2 py-12 print:hidden"
  >
    <div class="sp-continue-reading-width">
      <div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="text-[9px] font-bold uppercase tracking-[.17em] text-accent">
            Continue reading
          </p>

          <h2 class="mt-2 text-[clamp(2.15rem,3.5vw,3rem)] font-[800] leading-[.96] tracking-[-.052em] text-fg">
            More from this category
          </h2>
        </div>

        <NuxtLink
          :to="`/news/category/${categorySlug}`"
          class="group inline-flex items-center gap-2 text-[11px] font-bold text-fg-muted transition hover:text-accent"
        >
          View category
          <span class="transition-transform group-hover:translate-x-1">→</span>
        </NuxtLink>
      </div>

      <div class="grid gap-5" :class="gridClass">
        <NuxtLink
          v-for="article in articles.slice(0, 3)"
          :key="article.id"
          :to="`/news/posts/${article.slug}`"
          class="sp-continue-card group overflow-hidden rounded-[24px] border border-line bg-elevated shadow-soft transition hover:-translate-y-1 hover:border-accent/20 hover:shadow-lift"
        >
          <div class="relative aspect-[16/9] overflow-hidden bg-surface-3">
            <img
              v-if="article.image"
              :src="article.image"
              :alt="article.title"
              loading="lazy"
              class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
            >

            <div v-else class="flex h-full items-center justify-center text-2xl text-fg-subtle">
              N
            </div>

            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          <div class="p-6">
            <div class="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[.12em] text-accent">
              <span>{{ article.categoryName }}</span>
              <span class="text-fg-subtle">·</span>
              <span class="text-fg-subtle">{{ timeAgo(article.publishedAt) }}</span>
            </div>

            <h3 class="sp-continue-title mt-3 text-[20px] font-[790] leading-[1.24] tracking-[-.032em] text-fg transition group-hover:text-accent">
              {{ article.title }}
            </h3>

            <p class="mt-3 line-clamp-3 text-[12px] leading-6 text-fg-muted">
              {{ article.excerpt }}
            </p>

            <span class="mt-5 inline-flex items-center gap-2 text-[10px] font-bold text-fg-muted">
              Read story
              <span class="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
