<script setup lang="ts">
import type {
  NewsArticle,
  NewsAuthor,
} from '~/types/news'

interface Props {
  author: NewsAuthor
  popularArticles: NewsArticle[]
}

const props = defineProps<Props>()

const {
  timeAgo,
  formatViews,
} = useNewsData()

const coverageAreas = computed<string[]>(() => {
  const areas = [
    ...props.author.categories.map(
      category => category.name,
    ),

    ...props.author.regions,
  ]

  return Array.from(
    new Set(
      areas
        .map(area => area.trim())
        .filter(Boolean),
    ),
  )
})

const authorRole = computed(() => {
  return (
    props.author.role?.trim()
    || 'News Author'
  )
})

const authorLocation = computed(() => {
  return (
    props.author.location?.trim()
    || 'Global coverage'
  )
})
</script>

<template>
  <aside class="space-y-6
    lg:sticky lg:top-36">
    <!-- Coverage areas -->

    <section class="rounded-[28px]
      border border-slate-200
      bg-white p-6">
      <div class="flex items-center
        justify-between gap-4">
        <div>
          <span class="text-[10px] font-bold
            uppercase tracking-[0.18em]
            text-indigo-600">
            Author expertise
          </span>

          <h2 class="mt-2 text-xl font-bold
            text-slate-950">
            Coverage areas
          </h2>
        </div>

        <div class="flex h-10 w-10
          shrink-0 items-center
          justify-center rounded-xl
          bg-indigo-50
          text-indigo-600">
          ✦
        </div>
      </div>

      <div v-if="coverageAreas.length" class="mt-6 flex flex-wrap gap-2">
        <span v-for="topic in coverageAreas" :key="topic" class="rounded-full border
          border-slate-200 bg-slate-50
          px-3.5 py-2 text-[10px]
          font-semibold text-slate-600">
          {{ topic }}
        </span>
      </div>

      <p v-else class="mt-6 text-sm
        leading-6 text-slate-500">
        Coverage areas will appear after
        this author publishes articles.
      </p>

      <!-- Categories -->

      <div v-if="author.categories.length" class="mt-6 border-t
        border-slate-100 pt-5">
        <p class="text-[10px] font-bold
          uppercase tracking-wider
          text-slate-400">
          Categories
        </p>

        <div class="mt-3 flex flex-wrap gap-2">
          <NuxtLink v-for="category in author.categories" :key="category.id" :to="`/news/category/${category.slug}`
            " class="rounded-full
            bg-indigo-50 px-3 py-1.5
            text-[10px] font-bold
            text-indigo-600
            transition-colors
            hover:bg-indigo-600
            hover:text-white">
            {{ category.name }}
          </NuxtLink>
        </div>
      </div>

      <!-- Regions -->

      <div v-if="author.regions.length" class="mt-5 border-t
        border-slate-100 pt-5">
        <p class="text-[10px] font-bold
          uppercase tracking-wider
          text-slate-400">
          Regions
        </p>

        <div class="mt-3 flex flex-wrap gap-2">
          <span v-for="region in author.regions" :key="region" class="rounded-full
            bg-cyan-50 px-3 py-1.5
            text-[10px] font-bold
            text-cyan-700">
            {{ region }}
          </span>
        </div>
      </div>
    </section>

    <!-- Popular articles -->

    <section v-if="popularArticles.length" class="rounded-[28px]
      border border-slate-200
      bg-white p-6">
      <span class="text-[10px] font-bold
        uppercase tracking-[0.18em]
        text-red-600">
        Popular reporting
      </span>

      <h2 class="mt-2 text-xl font-bold
        text-slate-950">
        Most-read articles
      </h2>

      <div class="mt-6 divide-y
        divide-slate-100">
        <NuxtLink v-for="(
article,
              index
          ) in popularArticles" :key="article.id" :to="`/news/posts/${article.slug}`
            " class="group flex gap-4 py-5
          first:pt-0 last:pb-0">
          <span class="shrink-0 text-2xl
            font-bold text-slate-200
            transition-colors
            group-hover:text-red-300">
            {{
              String(index + 1)
                .padStart(2, '0')
            }}
          </span>

          <div class="min-w-0">
            <span class="text-[9px] font-bold
              uppercase tracking-wider
              text-indigo-600">
              {{ article.categoryName }}
            </span>

            <h3 class="popular-title mt-1.5
              text-sm font-bold leading-6
              text-slate-800
              transition-colors
              group-hover:text-indigo-600">
              {{ article.title }}
            </h3>

            <div class="mt-2 flex flex-wrap
              items-center gap-2
              text-[10px] text-slate-400">
              <time :datetime="article.publishedAt
                ">
                {{
                  timeAgo(
                    article.publishedAt,
                  )
                }}
              </time>

              <span>•</span>

              <span>
                {{
                  formatViews(
                    article.views,
                  )
                }}
                views
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Author information -->

    <section class="rounded-[28px]
      border border-slate-200
      bg-white p-6">
      <span class="text-[10px] font-bold
        uppercase tracking-[0.18em]
        text-indigo-600">
        Profile
      </span>

      <h2 class="mt-2 text-xl font-bold
        text-slate-950">
        Author information
      </h2>

      <div class="mt-5 space-y-3">
        <div class="flex items-center
          justify-between gap-4
          rounded-xl border
          border-slate-200
          bg-slate-50 px-4 py-3">
          <span class="text-xs font-medium
            text-slate-500">
            Role
          </span>

          <span class="text-right text-xs
            font-bold text-slate-800">
            {{ authorRole }}
          </span>
        </div>

        <div class="flex items-center
          justify-between gap-4
          rounded-xl border
          border-slate-200
          bg-slate-50 px-4 py-3">
          <span class="text-xs font-medium
            text-slate-500">
            Location
          </span>

          <span class="text-right text-xs
            font-bold text-slate-800">
            {{ authorLocation }}
          </span>
        </div>

        <div class="flex items-center
          justify-between gap-4
          rounded-xl border
          border-slate-200
          bg-slate-50 px-4 py-3">
          <span class="text-xs font-medium
            text-slate-500">
            Articles
          </span>

          <span class="text-right text-xs
            font-bold text-slate-800">
            {{
              author.articlesCount
                .toLocaleString('en-US')
            }}
          </span>
        </div>

        <div class="flex items-center
          justify-between gap-4
          rounded-xl border
          border-slate-200
          bg-slate-50 px-4 py-3">
          <span class="text-xs font-medium
            text-slate-500">
            Total views
          </span>

          <span class="text-right text-xs
            font-bold text-slate-800">
            {{
              formatViews(
                author.totalViews,
              )
            }}
          </span>
        </div>

        <div class="flex items-center
          justify-between gap-4
          rounded-xl border
          border-slate-200
          bg-slate-50 px-4 py-3">
          <span class="text-xs font-medium
            text-slate-500">
            Status
          </span>

          <span class="inline-flex items-center
            gap-1.5 text-right text-xs
            font-bold" :class="author.verified
                ? 'text-blue-600'
                : 'text-emerald-600'
              ">
            <span class="h-1.5 w-1.5
              rounded-full" :class="author.verified
                  ? 'bg-blue-500'
                  : 'bg-emerald-500'
                " />

            {{
              author.verified
                ? 'Verified author'
                : 'Active author'
            }}
          </span>
        </div>
      </div>
    </section>

    <!-- Standards -->

    <section class="relative overflow-hidden
      rounded-[28px] bg-slate-950
      p-7 text-white">
      <div class="pointer-events-none
        absolute -right-16 -top-16
        h-48 w-48 rounded-full
        bg-indigo-600/30 blur-3xl" />

      <div class="relative">
        <div class="flex h-11 w-11
          items-center justify-center
          rounded-xl bg-white/10">
          ✓
        </div>

        <p class="mt-6 text-[10px]
          font-bold uppercase
          tracking-[0.17em]
          text-indigo-300">
          Editorial standards
        </p>

        <h3 class="mt-3 text-xl font-bold">
          Transparent author profiles.
        </h3>

        <p class="mt-3 text-sm leading-7
          text-slate-400">
          Published articles clearly display
          their author, source, publication
          time, category, region, and relevant
          topics.
        </p>
      </div>
    </section>
  </aside>
</template>

<style scoped>
.popular-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>