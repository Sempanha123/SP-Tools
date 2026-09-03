<script setup lang="ts">
const {
  featuredArticles,
  timeAgo,
  formatViews,
  getCategoryClasses,
} = useNewsData()

const mainArticle = computed(() => featuredArticles.value[0])

const secondaryArticles = computed(() =>
  featuredArticles.value.slice(1, 4),
)
</script>

<template>
  <section v-if="mainArticle" id="top-stories" class="scroll-mt-32 bg-white py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mb-9 flex flex-col justify-between
        gap-4 sm:flex-row sm:items-end">
        <div>
          <div class="inline-flex items-center gap-2
            text-xs font-bold uppercase
            tracking-[0.18em] text-red-600">
            <span class="h-px w-8 bg-red-400" />
            Top stories
          </div>

          <h2 class="mt-4 text-3xl font-bold
            tracking-[-0.04em] sm:text-5xl">
            Latest global
            <span class="text-slate-400">
              developments.
            </span>
          </h2>
        </div>

        <p class="text-xs text-slate-400">
          Updated throughout the day
        </p>
      </div>

      <div class="grid gap-5 lg:grid-cols-[1.55fr_0.75fr]">
        <NuxtLink :to="`/news/posts/${mainArticle.slug}`" class="group relative min-h-[510px]
          overflow-hidden rounded-[34px] bg-slate-950">
          <img v-if="mainArticle?.image" :src="mainArticle.image" :alt="mainArticle.title" loading="lazy" class="absolute inset-0 h-full w-full
  object-cover transition-transform duration-700
  group-hover:scale-105" />

          <div v-else class="absolute inset-0 flex items-center
  justify-center bg-gradient-to-br
  from-slate-200 via-slate-100 to-slate-300">
            <div class="text-center">
              <span class="text-5xl" aria-hidden="true">
                📰
              </span>

              <p class="mt-3 text-sm font-semibold text-slate-500">
                No cover image
              </p>
            </div>
          </div>

          <div class="absolute inset-0 bg-gradient-to-t
            from-slate-950 via-slate-950/45 to-transparent" />

          <div class="absolute left-6 top-6
            flex flex-wrap gap-2">
            <span v-if="mainArticle.isBreaking" class="rounded-full bg-red-600 px-3 py-1.5
              text-[9px] font-bold uppercase
              tracking-wider text-white">
              Breaking
            </span>

            <span v-if="mainArticle.isLive" class="inline-flex items-center gap-2
              rounded-full bg-white/90 px-3 py-1.5
              text-[9px] font-bold uppercase
              tracking-wider text-red-600 backdrop-blur">
              <span class="relative flex h-1.5 w-1.5">
                <span class="absolute inline-flex h-full w-full
                  animate-ping rounded-full bg-red-500
                  opacity-50" />

                <span class="relative inline-flex h-1.5 w-1.5
                  rounded-full bg-red-500" />
              </span>

              Live
            </span>
          </div>

          <div class="absolute inset-x-0 bottom-0 p-7 sm:p-10">
            <span class="rounded-full border px-3 py-1.5
              text-[9px] font-bold uppercase tracking-wider" :class="getCategoryClasses(mainArticle.category)">
              {{ mainArticle.categoryName }}
            </span>

            <h3 class="mt-5 max-w-3xl text-3xl
              font-bold leading-tight tracking-[-0.035em]
              text-white sm:text-5xl">
              {{ mainArticle.title }}
            </h3>

            <p class="mt-4 max-w-2xl text-sm
              leading-7 text-slate-300 sm:text-base">
              {{ mainArticle.excerpt }}
            </p>

            <div class="mt-6 flex flex-wrap items-center
              gap-3 text-xs text-slate-300">
              <span>{{ mainArticle.source }}</span>
              <span>•</span>
              <time :datetime="mainArticle.publishedAt">
                {{ timeAgo(mainArticle.publishedAt) }}
              </time>
              <span>•</span>
              <span>{{ mainArticle.readTime }}</span>
              <span>•</span>
              <span>
                {{ formatViews(mainArticle.views) }} views
              </span>
            </div>
          </div>

          <div class="absolute right-6 top-6 flex h-12 w-12
            items-center justify-center rounded-2xl
            border border-white/20 bg-white/10
            text-xl text-white backdrop-blur
            transition-transform group-hover:translate-x-1">
            →
          </div>
        </NuxtLink>

        <div class="grid gap-5">
          <NuxtLink v-for="article in secondaryArticles" :key="article.id" :to="`/news/posts/${article.slug}`" class="group grid min-h-[155px]
            grid-cols-[125px_minmax(0,1fr)]
            overflow-hidden rounded-[26px]
            border border-slate-200 bg-white
            transition-all hover:-translate-y-0.5
            hover:border-indigo-200
            hover:shadow-lg">
            <div class="relative overflow-hidden">
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
            </div>

            <div class="flex min-w-0 flex-col p-5">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[9px] font-bold uppercase
                  tracking-wider text-indigo-600">
                  {{ article.categoryName }}
                </span>

                <span v-if="article.isBreaking" class="text-[8px] font-bold uppercase
                  text-red-600">
                  Breaking
                </span>
              </div>

              <h3 class="secondary-title mt-2 text-base
                font-bold leading-snug text-slate-950
                transition-colors group-hover:text-indigo-600">
                {{ article.title }}
              </h3>

              <div class="mt-auto flex items-center gap-2
                text-[10px] text-slate-400">
                <time :datetime="article.publishedAt">
                  {{ timeAgo(article.publishedAt) }}
                </time>

                <span>•</span>

                <span>{{ article.readTime }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.secondary-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>