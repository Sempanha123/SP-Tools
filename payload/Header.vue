<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

const props = defineProps<{ article: NewsArticle }>()

const imageLoaded = ref(false)
const imageFailed = ref(false)

const authorInitials = computed(() =>
  props.article.author
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(name => name.charAt(0).toUpperCase())
    .join(''),
)

const authorSlug = computed(() =>
  props.article.authorSlug
  || props.article.author
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-'),
)

const formattedDate = computed(() => {
  const date = new Date(props.article.publishedAt)
  return Number.isNaN(date.getTime())
    ? props.article.publishedAt
    : new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(date)
})

const formattedTime = computed(() => {
  const date = new Date(props.article.publishedAt)
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }).format(date)
})

const formattedViews = computed(() =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(props.article.views),
)

const tagToSlug = (tag: string) =>
  tag
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
</script>

<template>
  <header class="sp-news-post-header bg-surface px-4 pb-5 pt-5 sm:px-6 sm:pb-7 sm:pt-6">
    <div class="sp-news-reader-width">
      <div class="sp-news-post-hero sp-noise relative overflow-hidden rounded-[28px] border border-line">
        <div class="sp-quiet-grid pointer-events-none absolute inset-0 opacity-[.08]" />
        <div class="sp-news-post-aura pointer-events-none absolute inset-0" />

        <div class="relative px-5 pb-6 pt-5 sm:px-8 sm:pb-7 sm:pt-7 lg:px-10">
          <nav
            aria-label="Breadcrumb"
            class="flex min-w-0 flex-wrap items-center gap-2 text-[9px] font-semibold text-fg-subtle"
          >
            <NuxtLink to="/" class="transition hover:text-fg">Home</NuxtLink>
            <span>/</span>
            <NuxtLink to="/news" class="transition hover:text-fg">News</NuxtLink>
            <span>/</span>
            <NuxtLink
              :to="`/news/category/${article.category}`"
              class="transition hover:text-fg"
            >
              {{ article.categoryName }}
            </NuxtLink>
          </nav>

          <div class="mt-6 max-w-[900px]">
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-if="article.isBreaking"
                class="inline-flex items-center gap-2 rounded-full bg-danger px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.14em] text-white"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-white sp-pulse-soft" />
                Breaking
              </span>

              <span
                v-if="article.isLive"
                class="inline-flex items-center gap-2 rounded-full border border-danger/20 bg-danger-soft px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.14em] text-danger"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-danger sp-pulse-soft" />
                Live
              </span>

              <NuxtLink
                :to="`/news/category/${article.category}`"
                class="rounded-full border border-accent/15 bg-accent-soft px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.14em] text-accent transition hover:border-accent/25"
              >
                {{ article.categoryName }}
              </NuxtLink>

              <span class="rounded-full border border-line bg-surface-2/80 px-3 py-1.5 text-[8px] font-semibold text-fg-muted">
                {{ article.region }}
              </span>
            </div>

            <h1 class="mt-5 max-w-[900px] font-display text-[clamp(2.7rem,5.5vw,5.4rem)] font-[700] leading-[.92] tracking-[-.055em] text-fg">
              {{ article.title }}
            </h1>

            <p class="mt-5 max-w-[760px] text-[15px] leading-7 text-fg-muted sm:text-[17px] sm:leading-8">
              {{ article.excerpt }}
            </p>

            <div class="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <NuxtLink
                :to="`/news/author/${authorSlug}`"
                class="group flex min-w-0 items-center gap-3"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-accent to-accent-2 text-[10px] font-black text-white shadow-soft">
                  {{ authorInitials }}
                </div>

                <div class="min-w-0">
                  <p class="text-[8px] font-bold uppercase tracking-[.14em] text-fg-subtle">
                    Written by
                  </p>
                  <p class="mt-1 truncate text-[11px] font-bold text-fg transition group-hover:text-accent">
                    {{ article.author }}
                  </p>
                </div>
              </NuxtLink>

              <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-medium text-fg-subtle">
                <span>{{ formattedDate }}</span>
                <span v-if="formattedTime">{{ formattedTime }}</span>
                <span>{{ article.readTime }}</span>
                <span>{{ formattedViews }} views</span>
              </div>
            </div>

            <div v-if="article.tags.length" class="mt-4 flex flex-wrap gap-2">
              <NuxtLink
                v-for="tag in article.tags.slice(0, 4)"
                :key="tag"
                :to="`/news/tag/${tagToSlug(tag)}`"
                class="rounded-full border border-line bg-surface-2/70 px-3 py-1.5 text-[9px] font-semibold text-fg-subtle transition hover:border-accent/20 hover:text-accent"
              >
                #{{ tag }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <figure class="sp-news-post-cover relative mx-3 mb-3 overflow-hidden rounded-[22px] border border-line bg-surface-2 sm:mx-4 sm:mb-4">
          <div class="relative aspect-[16/8] max-h-[470px] min-h-[230px] overflow-hidden sm:min-h-[330px]">
            <div
              v-if="article.image && !imageLoaded && !imageFailed"
              class="sp-skeleton absolute inset-0"
            />

            <img
              v-if="article.image && !imageFailed"
              :src="article.image"
              :alt="article.title"
              class="absolute inset-0 h-full w-full object-cover transition duration-700"
              :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
              @load="imageLoaded = true"
              @error="imageFailed = true"
            >

            <div
              v-else
              class="absolute inset-0 flex items-center justify-center bg-surface-3"
            >
              <div class="text-center">
                <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] border border-line bg-elevated text-xl text-accent">
                  N
                </span>
                <p class="mt-3 text-[10px] font-semibold text-fg-subtle">
                  Story image unavailable
                </p>
              </div>
            </div>

            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          <figcaption
            v-if="article.imageCaption || article.imageCredit"
            class="flex flex-col justify-between gap-2 border-t border-line bg-surface-2/88 px-4 py-3 text-[9px] text-fg-subtle sm:flex-row"
          >
            <span>{{ article.imageCaption }}</span>
            <span v-if="article.imageCredit">{{ article.imageCredit }}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  </header>
</template>
