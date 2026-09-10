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
  <header class="sp-v19-article-header relative overflow-hidden border-b border-line bg-surface">
    <div class="sp-v19-hero-aura pointer-events-none absolute inset-0" />
    <div class="sp-v19-hero-grid pointer-events-none absolute inset-0" />

    <div class="sp-v19-shell relative py-8 sm:py-10 lg:py-14">
      <nav
        aria-label="Breadcrumb"
        class="sp-v19-enter flex flex-wrap items-center gap-2 text-[9px] font-semibold text-fg-subtle"
      >
        <NuxtLink to="/" class="transition hover:text-fg">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/news" class="transition hover:text-fg">News</NuxtLink>
        <span>/</span>
        <NuxtLink
          :to="`/news/category/${article.category}`"
          class="transition hover:text-accent"
        >
          {{ article.categoryName }}
        </NuxtLink>
      </nav>

      <div class="mt-7 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
        <div class="min-w-0">
          <div class="sp-v19-enter sp-v19-enter-1 flex flex-wrap items-center gap-2">
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
              class="sp-v19-category-chip"
            >
              {{ article.categoryName }}
            </NuxtLink>

            <span class="text-[9px] font-semibold uppercase tracking-[.11em] text-fg-subtle">
              {{ article.region }}
            </span>
          </div>

          <h1 class="sp-v19-enter sp-v19-enter-2 mt-5 max-w-[1020px] font-display text-[clamp(3.05rem,6vw,6.5rem)] font-[700] leading-[.88] tracking-[-.062em] text-fg">
            {{ article.title }}
          </h1>

          <p class="sp-v19-enter sp-v19-enter-3 mt-6 max-w-[820px] text-[17px] leading-8 text-fg-muted sm:text-[19px]">
            {{ article.excerpt }}
          </p>
        </div>

        <aside class="sp-v19-enter sp-v19-enter-3 hidden border-l border-line pl-5 lg:block">
          <p class="text-[8px] font-bold uppercase tracking-[.16em] text-fg-subtle">
            Story details
          </p>

          <dl class="mt-4 space-y-3">
            <div>
              <dt class="text-[8px] uppercase tracking-[.12em] text-fg-subtle">
                Published
              </dt>
              <dd class="mt-1 text-[11px] font-bold text-fg">
                {{ formattedDate }}
              </dd>
            </div>

            <div>
              <dt class="text-[8px] uppercase tracking-[.12em] text-fg-subtle">
                Reading time
              </dt>
              <dd class="mt-1 text-[11px] font-bold text-fg">
                {{ article.readTime }}
              </dd>
            </div>

            <div>
              <dt class="text-[8px] uppercase tracking-[.12em] text-fg-subtle">
                Views
              </dt>
              <dd class="mt-1 text-[11px] font-bold text-fg">
                {{ formattedViews }}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <div class="sp-v19-enter sp-v19-enter-4 mt-7 flex flex-col gap-5 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <NuxtLink
          :to="`/news/author/${authorSlug}`"
          class="group flex min-w-0 items-center gap-3"
        >
          <div class="sp-v19-author-avatar">
            {{ authorInitials }}
          </div>

          <div class="min-w-0">
            <p class="text-[8px] font-bold uppercase tracking-[.14em] text-fg-subtle">
              Written by
            </p>

            <p class="mt-1 truncate text-[12px] font-bold text-fg transition group-hover:text-accent">
              {{ article.author }}
            </p>
          </div>
        </NuxtLink>

        <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-[9px] font-medium text-fg-subtle lg:hidden">
          <span>{{ formattedDate }}</span>
          <span v-if="formattedTime">· {{ formattedTime }}</span>
          <span>· {{ article.readTime }}</span>
          <span>· {{ formattedViews }} views</span>
        </div>
      </div>

      <div
        v-if="article.tags.length"
        class="sp-v19-enter sp-v19-enter-4 mt-4 flex flex-wrap gap-2"
      >
        <NuxtLink
          v-for="tag in article.tags.slice(0, 5)"
          :key="tag"
          :to="`/news/tag/${tagToSlug(tag)}`"
          class="sp-v19-tag"
        >
          #{{ tag }}
        </NuxtLink>
      </div>

      <figure class="sp-v19-enter sp-v19-enter-5 sp-v19-cover mt-8 overflow-hidden rounded-[28px] border border-line bg-surface-2 sm:mt-10">
        <div class="relative aspect-[16/8] min-h-[260px] overflow-hidden sm:min-h-[380px] lg:max-h-[640px]">
          <div
            v-if="article.image && !imageLoaded && !imageFailed"
            class="sp-skeleton absolute inset-0"
          />

          <img
            v-if="article.image && !imageFailed"
            :src="article.image"
            :alt="article.title"
            class="absolute inset-0 h-full w-full object-cover transition duration-700"
            :class="imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.015]'"
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

          <div class="sp-v19-cover-shade pointer-events-none absolute inset-0" />
        </div>

        <figcaption
          v-if="article.imageCaption || article.imageCredit"
          class="sp-v19-caption"
        >
          <span>{{ article.imageCaption }}</span>
          <span v-if="article.imageCredit">{{ article.imageCredit }}</span>
        </figcaption>
      </figure>
    </div>
  </header>
</template>
