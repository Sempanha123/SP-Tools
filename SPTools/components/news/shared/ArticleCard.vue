<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

interface Props { article: NewsArticle; horizontal?: boolean }
const props = withDefaults(defineProps<Props>(), { horizontal: false })
const { timeAgo, formatViews, getCategoryClasses } = useNewsData()
const imageLoaded = ref(false)
const imageFailed = ref(false)
const articleUrl = computed(() => `/news/posts/${props.article.slug}`)
const publisherName = computed(() => props.article.source?.trim() || 'SP-Tools News')
const hasSourceImage = computed(() => Boolean(props.article.image?.trim()))
const hasImage = computed(() => hasSourceImage.value && !imageFailed.value)
watch(() => props.article.image, () => { imageLoaded.value = false; imageFailed.value = false })
</script>

<template>
  <article class="sp-lens-card sp-depth-hover group h-full overflow-hidden rounded-[22px] border border-line bg-elevated shadow-soft">
    <NuxtLink :to="articleUrl" :aria-label="`Read article: ${article.title}`" class="grid h-full outline-none focus-visible:ring-2 focus-visible:ring-accent" :class="horizontal ? 'sm:grid-cols-[210px_minmax(0,1fr)]' : 'grid-rows-[auto_minmax(0,1fr)]'">
      <div class="relative overflow-hidden bg-surface-3" :class="horizontal ? 'aspect-[16/10] sm:aspect-auto sm:h-full sm:min-h-[230px]' : 'aspect-[16/10]'">
        <div v-if="hasSourceImage && !imageLoaded && !imageFailed" class="sp-skeleton absolute inset-0" />
        <img v-if="hasImage" :src="article.image ?? ''" :alt="article.title" loading="lazy" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]" :class="imageLoaded ? 'opacity-100' : 'opacity-0'" @load="imageLoaded = true" @error="imageFailed = true" />
        <div v-else class="sp-dot-grid flex h-full min-h-48 items-center justify-center bg-surface-3"><span class="flex h-12 w-12 items-center justify-center rounded-[15px] border border-line bg-elevated text-xl shadow-xs">📰</span></div>
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <div class="absolute left-3 top-3 flex flex-wrap gap-2">
          <span v-if="article.isBreaking" class="rounded-full bg-danger px-2.5 py-1 text-[8px] font-bold uppercase tracking-[.1em] text-white">Breaking</span>
          <span v-if="article.isLive" class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[.1em] text-white backdrop-blur"><span class="h-1.5 w-1.5 rounded-full bg-red-400"/>Live</span>
        </div>
        <span class="absolute bottom-3 right-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">↗</span>
      </div>

      <div class="flex min-w-0 flex-col p-5">
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-full border px-2.5 py-1 text-[8px] font-bold uppercase tracking-[.11em]" :class="getCategoryClasses(article.category)">{{ article.categoryName }}</span>
          <span class="text-[9px] font-medium text-fg-subtle">{{ article.region }}</span>
        </div>
        <h3 class="article-clamp-2 mt-4 text-[19px] font-[700] leading-[1.18] tracking-[-0.03em] text-fg transition group-hover:text-accent">{{ article.title }}</h3>
        <p class="article-clamp-3 mt-3 text-[12px] leading-6 text-fg-muted">{{ article.excerpt }}</p>
        <div class="mt-auto flex items-end justify-between gap-4 border-t border-line pt-4">
          <div class="min-w-0">
            <p class="truncate text-[10px] font-semibold text-fg-muted">{{ publisherName }}</p>
            <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-fg-subtle"><time :datetime="article.publishedAt">{{ timeAgo(article.publishedAt) }}</time><span>·</span><span>{{ article.readTime }}</span><span>·</span><span>{{ formatViews(article.views) }} views</span></div>
          </div>
          <span class="sp-hover-arrow shrink-0 text-fg-subtle">→</span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.article-clamp-2,.article-clamp-3{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical}.article-clamp-2{-webkit-line-clamp:2}.article-clamp-3{-webkit-line-clamp:3}
</style>
