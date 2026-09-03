<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

interface Props {
  article: NewsArticle
}

const props = defineProps<Props>()

const imageLoaded = ref(false)
const imageFailed = ref(false)

/* =========================================================
   AUTHOR
========================================================= */

const authorInitials = computed(() => {
  return props.article.author
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(name =>
      name.charAt(0).toUpperCase(),
    )
    .join('')
})

const authorSlug = computed(() => {
  return props.article.author
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
})

/* =========================================================
   DATE
========================================================= */

const formattedDate = computed(() => {
  const date =
    new Date(props.article.publishedAt)

  if (Number.isNaN(date.getTime())) {
    return props.article.publishedAt
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
  ).format(date)
})

const formattedTime = computed(() => {
  const date =
    new Date(props.article.publishedAt)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      hour: 'numeric',
      minute: '2-digit',
    },
  ).format(date)
})

/* =========================================================
   VIEWS
========================================================= */

const formattedViews = computed(() => {
  return new Intl.NumberFormat(
    'en-US',
    {
      notation: 'compact',
      maximumFractionDigits: 1,
    },
  ).format(props.article.views)
})

/* =========================================================
   HELPERS
========================================================= */

const tagToSlug = (tag: string) => {
  return tag
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const handleImageLoad = () => {
  imageLoaded.value = true
  imageFailed.value = false
}

const handleImageError = () => {
  imageLoaded.value = false
  imageFailed.value = true
}
</script>

<template>
  <header class="relative overflow-hidden
    bg-white pb-10 pt-32
    sm:pb-14 sm:pt-40">
    <!-- Background decoration -->

    <div class="pointer-events-none
      absolute inset-x-0 top-0 h-[520px]
      overflow-hidden">
      <div class="absolute -left-40 -top-40
        h-[450px] w-[450px]
        rounded-full bg-indigo-100/70
        blur-[120px]" />

      <div class="absolute -right-40 top-0
        h-[420px] w-[420px]
        rounded-full bg-cyan-100/60
        blur-[120px]" />

      <div class="absolute inset-0 opacity-[0.35]" style="
          background-image:
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image:
            linear-gradient(to bottom, black, transparent);
        " />
    </div>

    <div class="relative mx-auto max-w-7xl px-6">
      <!-- Breadcrumb -->

      <nav aria-label="Breadcrumb" class="flex flex-wrap items-center
        gap-2 text-[10px] font-medium
        text-slate-400">
        <NuxtLink to="/" class="transition-colors
          hover:text-indigo-600">
          Home
        </NuxtLink>

        <span>/</span>

        <NuxtLink to="/news" class="transition-colors
          hover:text-indigo-600">
          News
        </NuxtLink>

        <span>/</span>

        <NuxtLink :to="`/news/category/${article.category}`" class="transition-colors
          hover:text-indigo-600">
          {{ article.categoryName }}
        </NuxtLink>

        <span>/</span>

        <span class="max-w-[240px] truncate
          text-slate-600 sm:max-w-md">
          {{ article.title }}
        </span>
      </nav>

      <!-- Article heading -->

      <div class="mt-10 grid items-end gap-10
        lg:grid-cols-[minmax(0,1fr)_250px]">
        <div class="min-w-0">
          <!-- Badges -->

          <div class="flex flex-wrap items-center gap-2">
            <span v-if="article.isBreaking" class="inline-flex items-center
              gap-2 rounded-full bg-red-600
              px-3.5 py-2 text-[9px]
              font-bold uppercase
              tracking-[0.15em] text-white
              shadow-[0_8px_24px_rgba(220,38,38,0.25)]">
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex
                  h-full w-full animate-ping
                  rounded-full bg-white
                  opacity-60" />

                <span class="relative inline-flex
                  h-2 w-2 rounded-full
                  bg-white" />
              </span>

              Breaking
            </span>

            <span v-if="article.isLive" class="inline-flex items-center
              gap-2 rounded-full
              border border-red-200
              bg-red-50 px-3.5 py-2
              text-[9px] font-bold uppercase
              tracking-[0.15em] text-red-600">
              <span class="h-2 w-2 rounded-full
                bg-red-500" />

              Live
            </span>

            <NuxtLink :to="`/news/category/${article.category}`" class="rounded-full
              border border-indigo-200
              bg-indigo-50 px-3.5 py-2
              text-[9px] font-bold uppercase
              tracking-[0.15em] text-indigo-600
              transition-all
              hover:border-indigo-300
              hover:bg-indigo-100">
              {{ article.categoryName }}
            </NuxtLink>

            <span class="rounded-full
              border border-slate-200
              bg-white px-3.5 py-2
              text-[9px] font-semibold
              text-slate-500">
              {{ article.region }}
            </span>
          </div>

          <!-- Title -->

          <h1 class="mt-7 max-w-5xl
            text-4xl font-bold leading-[1.05]
            tracking-[-0.055em]
            text-slate-950
            sm:text-5xl lg:text-6xl">
            {{ article.title }}
          </h1>

          <!-- Excerpt -->

          <p class="mt-6 max-w-3xl
            text-base leading-8 text-slate-500
            sm:text-lg">
            {{ article.excerpt }}
          </p>

          <!-- Tags -->

          <div v-if="article.tags.length" class="mt-7 flex flex-wrap gap-2">
            <NuxtLink v-for="tag in article.tags.slice(0, 5)" :key="tag" :to="`/news/tag/${tagToSlug(tag)}`" class="rounded-full
              border border-slate-200
              bg-white px-3 py-1.5
              text-[9px] font-semibold
              text-slate-500 transition-all
              hover:-translate-y-0.5
              hover:border-indigo-200
              hover:bg-indigo-50
              hover:text-indigo-600">
              #{{ tag }}
            </NuxtLink>
          </div>
        </div>

        <!-- Article quick information -->

        <div class="hidden rounded-[26px]
          border border-slate-200
          bg-white/80 p-5
          shadow-[0_16px_45px_rgba(15,23,42,0.06)]
          backdrop-blur lg:block">
          <p class="text-[9px] font-bold uppercase
            tracking-[0.17em] text-indigo-600">
            Story overview
          </p>

          <dl class="mt-4 divide-y
            divide-slate-100">
            <div class="flex items-center
              justify-between gap-4 py-3">
              <dt class="text-[10px]
                text-slate-400">
                Reading time
              </dt>

              <dd class="text-[10px]
                font-bold text-slate-700">
                {{ article.readTime }}
              </dd>
            </div>

            <div class="flex items-center
              justify-between gap-4 py-3">
              <dt class="text-[10px]
                text-slate-400">
                Views
              </dt>

              <dd class="text-[10px]
                font-bold text-slate-700">
                {{ formattedViews }}
              </dd>
            </div>

            <div class="flex items-center
              justify-between gap-4 py-3">
              <dt class="text-[10px]
                text-slate-400">
                Region
              </dt>

              <dd class="text-[10px]
                font-bold text-slate-700">
                {{ article.region }}
              </dd>
            </div>

            <div class="flex items-center
              justify-between gap-4 py-3">
              <dt class="text-[10px]
                text-slate-400">
                Source
              </dt>

              <dd class="max-w-[120px] truncate
                text-[10px] font-bold
                text-slate-700">
                {{ article.source }}
              </dd>
            </div>
          </dl>

          <a href="#article-content" class="mt-4 flex w-full
            items-center justify-center
            gap-2 rounded-xl
            bg-slate-950 px-4 py-3
            text-[10px] font-bold
            text-white transition-all
            hover:bg-indigo-600">
            Start reading

            <span>↓</span>
          </a>
        </div>
      </div>

      <!-- Author and metadata -->

      <div class="mt-10 flex flex-col
        justify-between gap-6
        border-y border-slate-200
        py-5 sm:flex-row sm:items-center">
        <!-- Author -->

        <NuxtLink :to="`/news/author/${authorSlug}`" class="group flex min-w-0
          items-center gap-3">
          <div class="flex h-12 w-12 shrink-0
            items-center justify-center
            rounded-2xl bg-gradient-to-br
            from-indigo-600 to-violet-600
            text-xs font-bold text-white
            shadow-[0_10px_28px_rgba(79,70,229,0.25)]">
            {{ authorInitials }}
          </div>

          <div class="min-w-0">
            <p class="text-[9px] font-bold
              uppercase tracking-[0.15em]
              text-slate-400">
              Written by
            </p>

            <p class="mt-1 truncate
              text-sm font-bold
              text-slate-800
              transition-colors
              group-hover:text-indigo-600">
              {{ article.author }}
            </p>

            <p class="mt-0.5 text-[10px]
              text-slate-400">
              SP-Tools News contributor
            </p>
          </div>
        </NuxtLink>

        <!-- Metadata -->

        <div class="grid grid-cols-2 gap-x-7
          gap-y-4 sm:flex sm:flex-wrap
          sm:items-center sm:justify-end">
          <div>
            <p class="text-[8px] font-bold
              uppercase tracking-[0.14em]
              text-slate-400">
              Published
            </p>

            <time :datetime="article.publishedAt" class="mt-1 block text-[10px]
              font-semibold text-slate-700">
              {{ formattedDate }}
            </time>
          </div>

          <div>
            <p class="text-[8px] font-bold
              uppercase tracking-[0.14em]
              text-slate-400">
              Time
            </p>

            <p class="mt-1 text-[10px]
              font-semibold text-slate-700">
              {{ formattedTime }}
            </p>
          </div>

          <div>
            <p class="text-[8px] font-bold
              uppercase tracking-[0.14em]
              text-slate-400">
              Reading
            </p>

            <p class="mt-1 text-[10px]
              font-semibold text-slate-700">
              {{ article.readTime }}
            </p>
          </div>

          <div>
            <p class="text-[8px] font-bold
              uppercase tracking-[0.14em]
              text-slate-400">
              Audience
            </p>

            <p class="mt-1 text-[10px]
              font-semibold text-slate-700">
              {{ formattedViews }} views
            </p>
          </div>
        </div>
      </div>

      <!-- Hero image -->

      <figure class="mt-10">
        <div class="relative min-h-[280px]
          overflow-hidden rounded-[28px]
          bg-slate-100
          shadow-[0_24px_70px_rgba(15,23,42,0.14)]
          sm:min-h-[440px]
          lg:min-h-[590px]">
          <!-- Loading skeleton -->

          <div v-if="!imageLoaded && !imageFailed" class="absolute inset-0
            animate-pulse bg-gradient-to-br
            from-slate-100 via-slate-200
            to-slate-100" />

          <!-- Fallback -->

          <div v-if="imageFailed" class="absolute inset-0 flex
            flex-col items-center justify-center
            bg-gradient-to-br from-slate-100
            to-indigo-50 px-6 text-center">
            <div class="flex h-16 w-16
              items-center justify-center
              rounded-2xl bg-white
              text-2xl shadow-sm">
              📰
            </div>

            <p class="mt-4 text-sm font-bold
              text-slate-700">
              Article image unavailable
            </p>

            <p class="mt-2 text-xs
              text-slate-400">
              The story content remains available below.
            </p>
          </div>

          <img v-if="article.image" :src="article.image" :alt="article.title" loading="lazy" class="h-full w-full object-cover
  transition-transform duration-500
  group-hover:scale-105" />

          <div v-else class="flex h-full min-h-40 items-center
  justify-center bg-gradient-to-br
  from-slate-100 to-slate-200">
            <span class="text-4xl" aria-hidden="true">
              📰
            </span>
          </div>

          <!-- Image overlay badge -->

          <div class="absolute left-5 top-5
            flex flex-wrap items-center
            gap-2 sm:left-7 sm:top-7">
            <span class="rounded-full
              border border-white/20
              bg-slate-950/65
              px-3 py-2 text-[9px]
              font-bold uppercase
              tracking-[0.14em] text-white
              backdrop-blur-md">
              {{ article.categoryName }}
            </span>

            <span class="rounded-full
              border border-white/20
              bg-white/85 px-3 py-2
              text-[9px] font-semibold
              text-slate-700 backdrop-blur-md">
              {{ article.region }}
            </span>
          </div>

          <!-- Scroll cue -->

          <a href="#article-content" aria-label="Continue to article content" class="absolute bottom-5
            left-1/2 flex h-11 w-11
            -translate-x-1/2 items-center
            justify-center rounded-2xl
            border border-white/20
            bg-slate-950/60 text-white
            backdrop-blur-md
            transition-all
            hover:-translate-y-1
            hover:bg-slate-950">
            ↓
          </a>
        </div>

        <!-- Caption -->

        <figcaption class="mt-3 flex flex-col
          justify-between gap-2 px-1
          text-[9px] leading-5
          text-slate-400 sm:flex-row">
          <span>
            Image accompanying:
            {{ article.title }}
          </span>

          <span>
            Source:
            {{ article.source }}
          </span>
        </figcaption>
      </figure>
    </div>
  </header>
</template>