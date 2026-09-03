<script setup lang="ts">
const {
  slug: routeSlug,
  page,

  author,
  featuredArticle,
  remainingArticles,
  popularArticles,

  pagination,
  totalPages,

  pending,
  error,
  refresh,

  goToPage,
} = await useNewsAuthorPage()

const retryLoad =
  async (): Promise<void> => {
    await refresh()
  }

const visiblePages = computed(() => {
  const current =
    pagination.value?.current_page
    ?? 1

  const last =
    pagination.value?.last_page
    ?? 1

  const start = Math.max(
    1,
    current - 2,
  )

  const end = Math.min(
    last,
    current + 2,
  )

  return Array.from(
    {
      length:
        end - start + 1,
    },
    (_, index) =>
      start + index,
  )
})

const pageTitle = computed(() => {
  return author.value
    ? `${author.value.name} – Author Profile | SP-Tools News`
    : 'News Author | SP-Tools News'
})

const pageDescription = computed(() => {
  return (
    author.value?.bio
    || (
      author.value
        ? `Read the latest reporting by ${author.value.name}.`
        : 'Read reporting from SP-Tools News.'
    )
  )
})

useSeoMeta({
  title: () =>
    pageTitle.value,

  description: () =>
    pageDescription.value,

  ogTitle: () =>
    pageTitle.value,

  ogDescription: () =>
    pageDescription.value,

  ogType: 'profile',

  twitterTitle: () =>
    pageTitle.value,

  twitterDescription: () =>
    pageDescription.value,

  twitterCard: 'summary',
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',

      href:
        `/news/author/${routeSlug.value}`,
    },
  ],
}))
</script>

<template>
  <main class="min-h-screen overflow-hidden
  bg-white text-slate-950">
    <div v-if="pending" class="mx-auto min-h-[70vh]
    max-w-7xl px-6 py-32 text-center">
      Loading author...
    </div>

    <div v-else-if="error" class="mx-auto min-h-[70vh]
    max-w-3xl px-6 py-32 text-center">
      <h1 class="text-2xl font-bold">
        Author could not be loaded
      </h1>

      <button type="button" class="mt-6 rounded-xl
      bg-slate-950 px-5 py-3
      text-sm font-bold text-white" @click="retryLoad">
        Try again
      </button>
    </div>

    <template v-else-if="author">
      <!-- Profile hero -->
      <NewsAuthorHeader :author="author" />

      <!-- News navigation -->
      <NewsHomeCategoryNav />

      <!-- Featured article -->
      <section v-if="featuredArticle" class="bg-white py-16 sm:py-20">
        <div class="mx-auto max-w-7xl px-6">
          <div class="mb-8 flex flex-col
          justify-between gap-4
          sm:flex-row sm:items-end">
            <div>
              <span class="text-xs font-bold uppercase
              tracking-[0.18em] text-indigo-600">
                Latest reporting
              </span>

              <h2 class="mt-3 text-3xl font-bold
              tracking-[-0.035em]">
                Featured article by
                <span class="text-slate-400">
                  {{ author.name }}
                </span>
              </h2>
            </div>

            <span class="text-xs text-slate-400">
              Most recent publication
            </span>
          </div>

          <NuxtLink :to="`/news/posts/${featuredArticle.slug}`" class="group grid overflow-hidden
          rounded-[34px] border
          border-slate-200 bg-white
          shadow-[0_20px_60px_rgba(15,23,42,0.08)]
          lg:grid-cols-[1.15fr_0.85fr]">
            <div class="relative min-h-[360px]
            overflow-hidden">
              <img v-if="featuredArticle.image" :src="featuredArticle.image" :alt="featuredArticle.title" class="absolute inset-0 h-full w-full
  object-cover transition-transform
  duration-700 group-hover:scale-105" />

              <div v-else class="absolute inset-0
  flex items-center justify-center
  bg-gradient-to-br
  from-slate-800 via-slate-900
  to-indigo-950">
                <span class="text-xs font-bold uppercase
    tracking-wider text-white/50">
                  No cover image
                </span>
              </div>

              <div class="absolute inset-0
              bg-gradient-to-t
              from-slate-950/30 to-transparent" />

              <div class="absolute left-5 top-5
              flex flex-wrap gap-2">
                <span v-if="featuredArticle.isBreaking" class="rounded-full bg-red-600
                px-3 py-1.5 text-[9px]
                font-bold uppercase tracking-wider
                text-white">
                  Breaking
                </span>

                <span v-if="featuredArticle.isLive" class="rounded-full bg-white/90
                px-3 py-1.5 text-[9px]
                font-bold uppercase tracking-wider
                text-red-600">
                  Live
                </span>
              </div>
            </div>

            <div class="flex flex-col justify-center
            p-7 sm:p-10">
              <span class="text-[10px] font-bold
              uppercase tracking-[0.16em]
              text-indigo-600">
                {{ featuredArticle.categoryName }}
                · {{ featuredArticle.region }}
              </span>

              <h2 class="mt-5 text-3xl font-bold
              leading-tight tracking-[-0.04em]
              text-slate-950 sm:text-4xl">
                {{ featuredArticle.title }}
              </h2>

              <p class="mt-5 text-sm leading-7
              text-slate-500 sm:text-base">
                {{ featuredArticle.excerpt }}
              </p>

              <div class="mt-7 flex flex-wrap items-center
              gap-3 text-xs text-slate-400">
                <time :datetime="featuredArticle.publishedAt">
                  {{
                    new Date(
                      featuredArticle.publishedAt,
                    ).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      },
                    )
                  }}
                </time>

                <span>•</span>

                <span>
                  {{ featuredArticle.readTime }}
                </span>

                <span>•</span>

                <span>
                  {{ featuredArticle.views.toLocaleString('en-US') }}
                  views
                </span>
              </div>

              <div class="mt-8 inline-flex items-center
              gap-2 text-sm font-bold
              text-indigo-600">
                Read full article

                <span class="transition-transform
                group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Article archive -->
      <section class="border-y border-slate-100
      bg-slate-50 py-20 sm:py-28">
        <div class="mx-auto grid max-w-7xl
        items-start gap-10 px-6
        lg:grid-cols-[minmax(0,1fr)_340px]">
          <NewsAuthorArticleGrid :articles="remainingArticles" :author-name="author.name" />

          <NewsAuthorSidebar :author="author" :popular-articles="popularArticles" />
        </div>
      </section>

      <!-- More news -->
      <NewsHomeWorldRegions />

      <NewsHomeNewsletter />
    </template>
  </main>
</template>