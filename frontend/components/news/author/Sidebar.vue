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

const { formatViews } = useNewsData()

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

    <NewsSharedMostReadPanel
      :articles="popularArticles"
      kicker="Popular reporting"
      subtitle="Popular reporting from this author."
    />

    <!-- Popular articles -->

    <section v-if="popularArticles.length" class="rounded-[28px]
      border border-line
      bg-surface p-6">
      <span class="text-[10px] font-bold
        uppercase tracking-[0.18em]
        text-red-600">
        Popular reporting
      </span>

      <h2 class="mt-2 text-xl font-bold
        text-fg">
        Most-read articles
      </h2>

      <div class="mt-6 divide-y
        divide-line">
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
              text-fg
              transition-colors
              group-hover:text-indigo-600">
              {{ article.title }}
            </h3>

            <div class="mt-2 flex flex-wrap
              items-center gap-2
              text-[10px] text-fg-subtle">
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
      border border-line
      bg-surface p-6">
      <span class="text-[10px] font-bold
        uppercase tracking-[0.18em]
        text-indigo-600">
        Profile
      </span>

      <h2 class="mt-2 text-xl font-bold
        text-fg">
        Author information
      </h2>

      <div class="mt-5 space-y-3">
        <div class="flex items-center
          justify-between gap-4
          rounded-xl border
          border-line
          bg-surface-2 px-4 py-3">
          <span class="text-xs font-medium
            text-fg-subtle">
            Role
          </span>

          <span class="text-right text-xs
            font-bold text-fg">
            {{ authorRole }}
          </span>
        </div>

        <div class="flex items-center
          justify-between gap-4
          rounded-xl border
          border-line
          bg-surface-2 px-4 py-3">
          <span class="text-xs font-medium
            text-fg-subtle">
            Location
          </span>

          <span class="text-right text-xs
            font-bold text-fg">
            {{ authorLocation }}
          </span>
        </div>

        <div class="flex items-center
          justify-between gap-4
          rounded-xl border
          border-line
          bg-surface-2 px-4 py-3">
          <span class="text-xs font-medium
            text-fg-subtle">
            Articles
          </span>

          <span class="text-right text-xs
            font-bold text-fg">
            {{
              author.articlesCount
                .toLocaleString('en-US')
            }}
          </span>
        </div>

        <div class="flex items-center
          justify-between gap-4
          rounded-xl border
          border-line
          bg-surface-2 px-4 py-3">
          <span class="text-xs font-medium
            text-fg-subtle">
            Total views
          </span>

          <span class="text-right text-xs
            font-bold text-fg">
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
          border-line
          bg-surface-2 px-4 py-3">
          <span class="text-xs font-medium
            text-fg-subtle">
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
      rounded-[28px] bg-accent text-accent-fg
      p-7 text-white">
      <div class="pointer-events-none
        absolute -right-16 -top-16
        h-48 w-48 rounded-full
        bg-indigo-600/30 blur-3xl" />

      <div class="relative">
        <div class="flex h-11 w-11
          items-center justify-center
          rounded-xl bg-surface/10">
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
          text-fg-subtle">
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