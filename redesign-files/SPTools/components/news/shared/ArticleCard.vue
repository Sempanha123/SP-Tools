<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

interface Props {
  article: NewsArticle
  horizontal?: boolean
}

const props = withDefaults(
  defineProps<Props>(),
  {
    horizontal: false,
  },
)

const { timeAgo, formatViews, getCategoryClasses } = useNewsData()

const imageLoaded = ref(false)
const imageFailed = ref(false)

const publisherName = computed(() =>
  props.article.source?.trim() || 'SP-Tools News',
)

const articleUrl = computed(() => `/news/posts/${props.article.slug}`)
const hasSourceImage = computed(() => Boolean(props.article.image?.trim()))
const hasImage = computed(() => hasSourceImage.value && !imageFailed.value)

watch(
  () => props.article.image,
  () => {
    imageLoaded.value = false
    imageFailed.value = false
  },
)
</script>

<template>
  <article class="group h-full overflow-hidden rounded-[16px] border border-line bg-elevated transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-soft">
    <NuxtLink
      :to="articleUrl"
      :aria-label="`Read article: ${article.title}`"
      class="grid h-full outline-none focus-visible:ring-4 focus-visible:ring-accent/12"
      :class="horizontal
        ? 'sm:grid-cols-[210px_minmax(0,1fr)]'
        : 'grid-rows-[auto_minmax(0,1fr)]'"
    >
      <div
        class="relative overflow-hidden bg-surface-3"
        :class="horizontal
          ? 'aspect-[16/10] sm:aspect-auto sm:h-full sm:min-h-[220px]'
          : 'aspect-[16/10]'"
      >
        <div v-if="hasSourceImage && !imageLoaded && !imageFailed" class="sp-skeleton absolute inset-0" />

        <img
          v-if="hasImage"
          :src="article.image ?? ''"
          :alt="article.title"
          loading="lazy"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
          @load="imageLoaded = true"
          @error="imageFailed = true"
        />

        <div v-else class="flex h-full min-h-44 items-center justify-center bg-surface-3 px-6 text-center">
          <div>
            <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-elevated text-lg" aria-hidden="true">📰</div>
            <p class="mt-2.5 text-[11px] font-medium text-fg-subtle">
              Cover image unavailable
            </p>
          </div>
        </div>

        <div class="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span v-if="article.isBreaking" class="rounded-lg bg-danger px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-white">
            Breaking
          </span>
          <span v-if="article.isLive" class="rounded-lg border border-white/25 bg-black/50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur">
            Live
          </span>
        </div>
      </div>

      <div class="flex min-w-0 flex-col p-4.5 sm:p-5">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="rounded-lg border px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em]"
            :class="getCategoryClasses(article.category)"
          >
            {{ article.categoryName }}
          </span>
          <span class="text-[10px] font-medium text-fg-subtle">{{ article.region }}</span>
        </div>

        <h3 class="article-clamp-2 mt-3.5 font-display text-[1.25rem] font-[650] leading-[1.13] tracking-[-0.028em] text-fg transition-colors group-hover:text-accent">
          {{ article.title }}
        </h3>

        <p class="article-clamp-3 mt-2.5 text-[13px] leading-6 text-fg-muted">
          {{ article.excerpt }}
        </p>

        <div class="mt-5 flex min-w-0 items-end justify-between gap-4 border-t border-line pt-4">
          <div class="min-w-0">
            <p class="truncate text-[11px] font-semibold text-fg-muted">
              {{ publisherName }}
            </p>
            <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-fg-subtle">
              <time :datetime="article.publishedAt">{{ timeAgo(article.publishedAt) }}</time>
              <span aria-hidden="true">·</span>
              <span>{{ article.readTime }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ formatViews(article.views) }} views</span>
            </div>
          </div>

          <span aria-hidden="true" class="shrink-0 text-base text-fg-subtle transition-all group-hover:translate-x-1 group-hover:text-accent">
            →
          </span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.article-clamp-2 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.article-clamp-3 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
