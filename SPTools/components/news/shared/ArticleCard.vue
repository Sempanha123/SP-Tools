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

const {
  timeAgo,
  formatViews,
  getCategoryClasses,
} = useNewsData()

const imageLoaded = ref(false)
const imageFailed = ref(false)

const publisherName = computed(() => {
  return props.article.source?.trim() ||
    'SP-Tools News'
})

const articleUrl = computed(() => {
  return `/news/posts/${props.article.slug}`
})

const handleImageLoad = () => {
  imageLoaded.value = true
  imageFailed.value = false
}

const handleImageError = () => {
  imageLoaded.value = false
  imageFailed.value = true
}

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
  <article class="sp-card sp-card-interactive sp-luminous group h-full overflow-hidden rounded-[26px]">
    <NuxtLink :to="articleUrl" :aria-label="`Read article: ${article.title}`" class="grid h-full outline-none
      focus-visible:ring-2
      focus-visible:ring-accent
      focus-visible:ring-offset-2" :class="horizontal
        ? 'sm:grid-cols-[220px_minmax(0,1fr)]'
        : 'grid-rows-[auto_minmax(0,1fr)]'
        ">
      <!-- Article image -->

      <div class="relative overflow-hidden bg-surface-3" :class="horizontal
        ? 'aspect-[16/10] sm:aspect-auto sm:h-full sm:min-h-[240px]'
        : 'aspect-[16/10]'
        ">
        <!-- Loading state -->

        <div v-if="hasSourceImage && !imageLoaded && !imageFailed" class="sp-skeleton absolute inset-0" />

        <!-- Image fallback -->

        <div v-if="imageFailed" class="absolute inset-0 flex
          flex-col items-center justify-center
          bg-gradient-to-br from-surface-3 via-accent-soft to-surface-2
          px-5 text-center">
          <svg class="h-8 w-8 text-fg-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
            <path
              d="M4 5.75A1.75 1.75 0 0 1 5.75 4h12.5A1.75 1.75 0 0 1 20 5.75v12.5A1.75 1.75 0 0 1 18.25 20H5.75A1.75 1.75 0 0 1 4 18.25V5.75Z" />

            <circle cx="9" cy="9" r="1.5" />

            <path d="m5 17 4.5-4.5 3 3 2-2L19 18" />
          </svg>

          <p class="mt-2 text-[10px]
            font-semibold text-fg-muted">
            Image unavailable
          </p>
        </div>

        <img v-if="hasImage" :src="article.image ?? ''" :alt="article.title" loading="lazy"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105" :class="imageLoaded
            ? 'opacity-100'
            : 'opacity-0'
            " @load="imageLoaded = true" @error="imageFailed = true">

        <div v-else class="flex h-full min-h-48 items-center justify-center bg-surface-3 px-6 text-center">
          <div>
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface text-xl shadow-sm">
              📰
            </div>

            <p class="mt-3 text-sm font-medium text-fg-muted">
              No cover image
            </p>
          </div>
        </div>

        <!-- Image gradient -->

        <div class="pointer-events-none absolute inset-0
          bg-gradient-to-t from-slate-950/40
          via-transparent to-transparent" />

        <!-- Status badges -->

        <div class="absolute left-4 top-4
          flex flex-wrap gap-2">
          <span v-if="article.isBreaking" class="inline-flex items-center gap-1.5
            rounded-full bg-red-600
            px-3 py-1.5 text-[9px]
            font-bold uppercase tracking-wider
            text-white shadow-lg">
            <span class="relative flex h-1.5 w-1.5">
              <span class="absolute inline-flex
                h-full w-full animate-ping
                rounded-full bg-surface opacity-60" />

              <span class="relative inline-flex
                h-1.5 w-1.5 rounded-full bg-surface" />
            </span>

            Breaking
          </span>

          <span v-if="article.isLive" class="inline-flex items-center gap-1.5
            rounded-full bg-surface/90
            px-3 py-1.5 text-[9px]
            font-bold uppercase tracking-wider
            text-red-600 shadow-sm backdrop-blur">
            <span class="relative flex h-1.5 w-1.5">
              <span class="absolute inline-flex
                h-full w-full animate-ping
                rounded-full bg-red-500 opacity-50" />

              <span class="relative inline-flex
                h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>

            Live
          </span>
        </div>

        <!-- Hover arrow -->

        <div class="absolute bottom-4 right-4
          flex h-10 w-10 translate-y-2
          items-center justify-center
          rounded-xl border border-line/20
          bg-accent text-accent-fg/60 text-white
          opacity-0 backdrop-blur
          transition-all duration-300
          group-hover:translate-y-0
          group-hover:opacity-100">
          ↗
        </div>
      </div>

      <!-- Article details -->

      <div class="flex min-w-0 flex-col p-5
        sm:p-6">
        <!-- Category and region -->

        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-full border
            px-3 py-1 text-[9px]
            font-bold uppercase tracking-wider" :class="getCategoryClasses(
              article.category,
            )
              ">
            {{ article.categoryName }}
          </span>

          <span class="inline-flex items-center
            gap-1.5 text-[10px]
            text-fg-subtle">
            <span class="h-1 w-1 rounded-full
              bg-slate-300" />

            {{ article.region }}
          </span>
        </div>

        <!-- Title -->

        <h3 class="article-clamp-2 mt-4
          text-xl font-bold leading-snug
          tracking-[-0.025em]
          text-fg transition-colors
          group-hover:text-indigo-600">
          {{ article.title }}
        </h3>

        <!-- Excerpt -->

        <p class="article-clamp-3 mt-3
          text-sm leading-7 text-fg-muted">
          {{ article.excerpt }}
        </p>

        <!-- Footer -->

        <div class="mt-auto flex min-w-0
          items-end justify-between gap-4
          border-t border-line pt-5">
          <div class="min-w-0">
            <p class="truncate text-xs
              font-semibold text-fg-muted">
              {{ publisherName }}
            </p>

            <div class="mt-1 flex flex-wrap
              items-center gap-x-2 gap-y-1
              text-[10px] text-fg-subtle">
              <time :datetime="article.publishedAt">
                {{ timeAgo(article.publishedAt) }}
              </time>

              <span aria-hidden="true">·</span>

              <span>
                {{ article.readTime }}
              </span>

              <span aria-hidden="true">·</span>

              <span>
                {{ formatViews(article.views) }}
                views
              </span>
            </div>
          </div>

          <span aria-hidden="true" class="shrink-0 text-lg
            text-fg-subtle transition-all
            group-hover:translate-x-1
            group-hover:text-indigo-600">
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