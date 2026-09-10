<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

interface RelatedTag {
  name: string
  count: number
}

interface Props {
  currentTag: string
  relatedTags: RelatedTag[]
  mostRead: NewsArticle[]
}

const props = defineProps<Props>()

const {
  timeAgo,
  formatViews,
} = useNewsData()

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

const leadMostRead = computed(() => {
  return props.mostRead[0] || null
})

const remainingMostRead = computed(() => {
  return props.mostRead.slice(1, 5)
})
</script>

<template>
  <aside class="min-w-0 space-y-6
    lg:sticky lg:top-36">
    <!-- Related topics -->

    <section class="overflow-hidden rounded-[28px]
      border border-line bg-surface
      shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <header class="flex items-start
        justify-between gap-4
        border-b border-line
        px-6 py-5">
        <div>
          <span class="text-[9px] font-bold
            uppercase tracking-[0.18em]
            text-indigo-600">
            Explore more
          </span>

          <h2 class="mt-2 text-xl font-bold
            tracking-[-0.03em]">
            Related topics
          </h2>

          <p class="mt-2 text-xs
            leading-5 text-fg-subtle">
            Topics frequently appearing
            with #{{ currentTag }}.
          </p>
        </div>

        <div class="flex h-10 w-10
          shrink-0 items-center
          justify-center rounded-xl
          bg-indigo-50 font-bold
          text-indigo-600">
          #
        </div>
      </header>

      <div class="p-5">
        <div v-if="relatedTags.length" class="flex flex-wrap gap-2">
          <NuxtLink v-for="tag in relatedTags" :key="tag.name" :to="`/news/tag/${tagToSlug(tag.name)}`" class="group inline-flex
            items-center gap-1.5
            rounded-full border
            border-line bg-surface-2
            px-3.5 py-2 text-[10px]
            font-semibold text-fg-muted
            transition-all
            hover:-translate-y-0.5
            hover:border-indigo-200
            hover:bg-indigo-50
            hover:text-indigo-600">
            <span>
              #{{ tag.name }}
            </span>

            <span class="rounded-full bg-surface
              px-1.5 py-0.5 text-[8px]
              text-fg-subtle shadow-sm
              group-hover:text-indigo-500">
              {{ tag.count }}
            </span>
          </NuxtLink>
        </div>

        <div v-else class="rounded-2xl border
          border-dashed border-line
          bg-surface-2 px-4 py-8
          text-center">
          <p class="text-sm font-bold
            text-fg-muted">
            No related topics yet
          </p>

          <p class="mt-2 text-xs
            leading-5 text-fg-subtle">
            More related topics will appear
            as additional stories are published.
          </p>
        </div>
      </div>
    </section>

    <!-- Most read -->

    <section v-if="leadMostRead" class="overflow-hidden rounded-[28px]
      border border-line bg-surface
      shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
      <header class="relative overflow-hidden
        bg-accent text-accent-fg px-6 py-6
        text-white">
        <div class="pointer-events-none
          absolute -right-16 -top-16
          h-40 w-40 rounded-full
          bg-red-500/20 blur-3xl" />

        <div class="relative">
          <div class="inline-flex items-center
            gap-2 text-[9px] font-bold
            uppercase tracking-[0.18em]
            text-red-300">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex
                h-full w-full animate-ping
                rounded-full bg-red-400
                opacity-50" />

              <span class="relative inline-flex
                h-2 w-2 rounded-full
                bg-red-500" />
            </span>

            Trending now
          </div>

          <h2 class="mt-3 text-2xl
            font-bold tracking-[-0.035em]">
            Most read
          </h2>

          <p class="mt-2 text-xs
            leading-5 text-fg-subtle">
            Popular stories connected
            to #{{ currentTag }}.
          </p>
        </div>
      </header>

      <!-- Lead popular story -->

      <div class="p-4">
        <NuxtLink :to="`/news/posts/${leadMostRead.slug}`" class="group relative block
          min-h-[200px] overflow-hidden
          rounded-[22px] bg-accent text-accent-fg">
          <img v-if="leadMostRead?.image" :src="leadMostRead.image" :alt="leadMostRead.title" loading="lazy" class="absolute inset-0
  h-full w-full object-cover
  transition-transform duration-700
  group-hover:scale-105" />

          <div v-else class="absolute inset-0 flex items-center
  justify-center bg-gradient-to-br
  from-slate-100 to-slate-300">
            <span class="text-5xl" aria-hidden="true">
              📰
            </span>
          </div>

          <div class="absolute inset-0
            bg-gradient-to-t
            from-slate-950
            via-slate-950/45
            to-transparent" />

          <span class="absolute left-4 top-4
            flex h-8 min-w-8
            items-center justify-center
            rounded-xl bg-red-600
            px-2 text-xs font-bold
            text-white shadow-lg">
            01
          </span>

          <div class="absolute inset-x-0
            bottom-0 p-5">
            <span class="text-[8px] font-bold
              uppercase tracking-[0.14em]
              text-indigo-300">
              {{ leadMostRead.categoryName }}
            </span>

            <h3 class="mt-2 text-base
              font-bold leading-6
              text-white transition-colors
              group-hover:text-indigo-200">
              {{ leadMostRead.title }}
            </h3>

            <div class="mt-3 flex items-center
              gap-2 text-[9px]
              text-fg-subtle">
              <span>
                {{ timeAgo(leadMostRead.publishedAt) }}
              </span>

              <span>•</span>

              <span>
                {{ formatViews(leadMostRead.views) }}
                views
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Remaining popular stories -->

      <div v-if="remainingMostRead.length" class="divide-y divide-line
        px-4 pb-4">
        <NuxtLink v-for="(article, index) in remainingMostRead" :key="article.id" :to="`/news/posts/${article.slug}`"
          class="group grid
          grid-cols-[68px_minmax(0,1fr)]
          gap-3 py-4 first:pt-2">
          <div class="relative h-[68px]
            overflow-hidden rounded-2xl
            bg-surface-2">
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

            <span class="absolute left-1.5 top-1.5
              flex h-6 min-w-6
              items-center justify-center
              rounded-lg bg-accent text-accent-fg/85
              px-1.5 text-[8px]
              font-bold text-white
              backdrop-blur">
              {{ String(index + 2).padStart(2, '0') }}
            </span>
          </div>

          <div class="min-w-0">
            <span class="text-[8px] font-bold
              uppercase tracking-[0.13em]
              text-indigo-600">
              {{ article.categoryName }}
            </span>

            <h3 class="sidebar-title mt-1.5
              text-xs font-bold leading-5
              text-fg
              transition-colors
              group-hover:text-indigo-600">
              {{ article.title }}
            </h3>

            <p class="mt-1.5 text-[8px]
              text-fg-subtle">
              {{ timeAgo(article.publishedAt) }}
              ·
              {{ formatViews(article.views) }}
              views
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Newsletter CTA -->

    <section class="relative overflow-hidden
      rounded-[28px]
      bg-gradient-to-br
      from-slate-950 via-slate-950
      to-indigo-950 p-6 text-white
      shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
      <div class="pointer-events-none
        absolute -right-16 -top-16
        h-44 w-44 rounded-full
        bg-indigo-500/25 blur-3xl" />

      <div class="relative">
        <div class="flex h-11 w-11
          items-center justify-center
          rounded-2xl border
          border-line/10 bg-surface/[0.08]
          text-indigo-300">
          ✦
        </div>

        <p class="mt-6 text-[9px]
          font-bold uppercase
          tracking-[0.17em]
          text-indigo-300">
          Daily briefing
        </p>

        <h3 class="mt-2 text-lg
          font-bold leading-6">
          Follow important topics.
        </h3>

        <p class="mt-3 text-xs
          leading-6 text-fg-subtle">
          Receive selected world news
          and updates connected to topics
          you follow.
        </p>

        <a href="#newsletter" class="mt-5 inline-flex
          items-center gap-2 rounded-xl
          bg-surface px-4 py-2.5
          text-[10px] font-bold
          text-fg">
          Join the briefing

          <span>→</span>
        </a>
      </div>
    </section>
  </aside>
</template>

<style scoped>
.sidebar-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>