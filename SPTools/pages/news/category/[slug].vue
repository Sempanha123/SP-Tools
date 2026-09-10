<script setup lang="ts">
import type {
  CategoryNewsSort,
} from '~/composables/useNewsCategoryPage'

interface CategoryTagItem {
  name: string
  slug: string
  count: number
}

const {
  slug: categorySlug,

  articles: categoryArticles,
  featuredArticle,
  remainingArticles,

  categoryDetails,
  categoryName,
  categoryDescription,

  mostReadArticles,

  pagination,

  page,
  sort,
  searchQuery,
  region,

  pending,
  error,
  refresh,

  applyFilters,
  goToPage,
  clearFilters,
} = await useNewsCategoryPage()

const {
  timeAgo,
  formatViews,
  getCategoryClasses,
} = useNewsData()

/* =========================================================
   FILTER INPUTS
========================================================= */

const searchInput = ref(
  searchQuery.value,
)

const regionInput = ref(
  region.value,
)

const sortInput =
  ref<CategoryNewsSort>(
    sort.value,
  )

watch(
  searchQuery,
  value => {
    searchInput.value = value
  },
)

watch(
  region,
  value => {
    regionInput.value = value
  },
)

watch(
  sort,
  value => {
    sortInput.value = value
  },
)

/* =========================================================
   PRESENTATION HELPERS
========================================================= */

const slugify = (
  value: string,
): string => {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const categoryIcon = computed(() => {
  return (
    categoryDetails.value?.icon?.trim()
    || categoryName.value
      .charAt(0)
      .toUpperCase()
    || 'N'
  )
})

const categoryAccentClass =
  computed(() => {
    const color =
      categoryDetails.value
        ?.color
        ?.toLowerCase()
      ?? ''

    if (
      color.includes('red')
      || color.includes('rose')
    ) {
      return 'from-red-500 to-rose-700'
    }

    if (
      color.includes('green')
      || color.includes('emerald')
    ) {
      return 'from-emerald-500 to-green-700'
    }

    if (
      color.includes('amber')
      || color.includes('orange')
      || color.includes('yellow')
    ) {
      return 'from-amber-500 to-orange-700'
    }

    if (
      color.includes('cyan')
      || color.includes('sky')
      || color.includes('blue')
    ) {
      return 'from-cyan-500 to-blue-700'
    }

    if (
      color.includes('purple')
      || color.includes('violet')
      || color.includes('indigo')
    ) {
      return 'from-indigo-500 to-violet-700'
    }

    return 'from-slate-600 to-slate-900'
  })

const totalArticles = computed(() => {
  return (
    pagination.value?.total
    ?? categoryArticles.value.length
  )
})

const hasActiveFilters = computed(() => {
  return Boolean(
    searchQuery.value
    || region.value
    || sort.value !== 'latest',
  )
})

/* =========================================================
   CATEGORY TAGS
========================================================= */

const categoryTags = computed<
  CategoryTagItem[]
>(() => {
  const tagMap = new Map<
    string,
    CategoryTagItem
  >()

  categoryArticles.value.forEach(
    article => {
      article.tags.forEach(
        (name, index) => {
          const cleanName =
            name.trim()

          if (!cleanName) {
            return
          }

          const tagSlug =
            article.tagSlugs?.[index]
            || slugify(cleanName)

          const existing =
            tagMap.get(tagSlug)

          if (existing) {
            existing.count += 1
            return
          }

          tagMap.set(tagSlug, {
            name: cleanName,
            slug: tagSlug,
            count: 1,
          })
        },
      )
    },
  )

  return Array.from(
    tagMap.values(),
  )
    .sort(
      (first, second) =>
        second.count - first.count,
    )
    .slice(0, 10)
})

/* =========================================================
   PAGINATION
========================================================= */

const visiblePages = computed(() => {
  const currentPage =
    pagination.value?.current_page
    ?? 1

  const lastPage =
    pagination.value?.last_page
    ?? 1

  const start = Math.max(
    1,
    currentPage - 2,
  )

  const end = Math.min(
    lastPage,
    currentPage + 2,
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

/* =========================================================
   ACTIONS
========================================================= */

const submitFilters =
  async (): Promise<void> => {
    await applyFilters({
      q: searchInput.value,
      region: regionInput.value,
      sort: sortInput.value,
    })
  }

const resetFilters =
  async (): Promise<void> => {
    searchInput.value = ''
    regionInput.value = ''
    sortInput.value = 'latest'

    await clearFilters()
  }

const retryLoad =
  async (): Promise<void> => {
    await refresh()
  }

/* =========================================================
   SEO
========================================================= */

const pageTitle = computed(() => {
  return (
    `${categoryName.value} News`
    + ' and Latest Updates | SP-Tools'
  )
})

const pageDescription = computed(() => {
  return categoryDescription.value
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

  ogType: 'website',

  twitterTitle: () =>
    pageTitle.value,

  twitterDescription: () =>
    pageDescription.value,

  twitterCard:
    'summary_large_image',
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',

      href:
        `/news/category/`
        + categorySlug.value,
    },
  ],
}))
</script>

<template>
  <main class="min-h-screen overflow-x-hidden
    bg-surface text-fg">
    <!-- Loading -->

    <section v-if="pending" class="mx-auto min-h-[75vh]
      max-w-7xl px-6 py-24">
      <div class="animate-pulse">
        <div class="mx-auto h-16 w-16
          rounded-2xl bg-surface-3" />

        <div class="mx-auto mt-8 h-14
          max-w-xl rounded-2xl
          bg-surface-3" />

        <div class="mx-auto mt-5 h-5
          max-w-2xl rounded
          bg-surface-2" />

        <div class="mt-16 aspect-[16/7]
          rounded-[34px] bg-surface-3" />

        <div class="mt-12 grid gap-7
          md:grid-cols-2 lg:grid-cols-3">
          <div v-for="index in 6" :key="index" class="h-80 rounded-3xl
            bg-surface-2" />
        </div>
      </div>
    </section>

    <!-- Error -->

    <section v-else-if="error" class="mx-auto flex min-h-[70vh]
      max-w-3xl items-center
      justify-center px-6 py-20">
      <div class="w-full rounded-[32px]
        border border-red-200
        bg-red-50 p-8 text-center
        sm:p-12">
        <div class="mx-auto flex h-16 w-16
          items-center justify-center
          rounded-2xl bg-surface
          text-3xl shadow-sm">
          📰
        </div>

        <h1 class="mt-6 text-2xl
          font-black text-red-950">
          Category could not be loaded
        </h1>

        <p class="mx-auto mt-3 max-w-xl
          leading-7 text-red-700">
          This category may not exist,
          may be inactive, or the news
          API may be unavailable.
        </p>

        <div class="mt-8 flex flex-wrap
          justify-center gap-3">
          <button type="button" class="rounded-xl bg-red-700
            px-5 py-3 text-sm font-bold
            text-white transition
            hover:bg-red-800" @click="retryLoad">
            Try again
          </button>

          <NuxtLink to="/news" class="rounded-xl border
            border-red-200 bg-surface
            px-5 py-3 text-sm font-bold
            text-red-800">
            Back to news
          </NuxtLink>
        </div>
      </div>
    </section>

    <template v-else>
      <!-- Category hero -->

      <section class="relative overflow-hidden
        bg-accent text-accent-fg pb-20 pt-32
        text-white sm:pb-24 sm:pt-40">
        <div class="pointer-events-none
          absolute inset-0 opacity-[0.07]" style="
            background-image:
              linear-gradient(
                rgba(255, 255, 255, 0.22) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.22) 1px,
                transparent 1px
              );
            background-size: 52px 52px;
          " />

        <div class="pointer-events-none
          absolute -left-40 -top-32
          h-[500px] w-[500px]
          rounded-full bg-indigo-600/25
          blur-[130px]" />

        <div class="pointer-events-none
          absolute -right-40 top-0
          h-[500px] w-[500px]
          rounded-full bg-cyan-500/15
          blur-[130px]" />

        <div class="relative mx-auto
          max-w-7xl px-6">
          <nav aria-label="Breadcrumb" class="flex flex-wrap
            items-center justify-center
            gap-2 text-xs font-medium
            text-fg-subtle">
            <NuxtLink to="/" class="hover:text-white">
              Home
            </NuxtLink>

            <span>/</span>

            <NuxtLink to="/news" class="hover:text-white">
              News
            </NuxtLink>

            <span>/</span>

            <span class="text-indigo-300">
              {{ categoryName }}
            </span>
          </nav>

          <div class="mx-auto mt-8
            max-w-4xl text-center">
            <div class="mx-auto flex h-16 w-16
              items-center justify-center
              rounded-2xl bg-gradient-to-br
              text-xl font-bold text-white
              shadow-xl" :class="categoryAccentClass">
              {{ categoryIcon }}
            </div>

            <div class="mt-7 inline-flex
              items-center gap-2 rounded-full
              border border-line/10
              bg-surface/[0.06] px-4 py-2
              backdrop-blur-xl">
              <span class="h-2 w-2 rounded-full
                bg-indigo-400" />

              <span class="text-[10px] font-bold
                uppercase tracking-[0.2em]
                text-indigo-300">
                SP-Tools Global News
              </span>
            </div>

            <h1 class="mt-7 text-5xl
              font-bold leading-[1.04]
              tracking-[-0.055em]
              sm:text-6xl lg:text-8xl">
              {{ categoryName }}
            </h1>

            <p class="mx-auto mt-7
              max-w-2xl text-base
              leading-8 text-fg-subtle
              sm:text-lg">
              {{ categoryDescription }}
            </p>

            <div class="mt-10 flex flex-wrap
              items-center justify-center
              gap-x-8 gap-y-3 text-xs
              font-medium text-fg-subtle">
              <span class="flex items-center gap-2">
                <span class="h-1.5 w-1.5
                  rounded-full bg-indigo-400" />

                {{ totalArticles }}
                {{
                  totalArticles === 1
                    ? 'story'
                    : 'stories'
                }}
              </span>

              <span class="flex items-center gap-2">
                <span class="h-1.5 w-1.5
                  rounded-full bg-red-400" />

                Breaking updates
              </span>

              <span class="flex items-center gap-2">
                <span class="h-1.5 w-1.5
                  rounded-full bg-cyan-400" />

                Global coverage
              </span>
            </div>
          </div>
        </div>
      </section>

      <NewsHomeCategoryNav />

      <!-- Filters -->

      <section class="sticky top-0 z-30
        border-b border-line
        bg-surface/95 shadow-sm
        backdrop-blur">
        <div class="mx-auto max-w-7xl
          px-6 py-5">
          <form class="grid gap-3
            md:grid-cols-[minmax(0,1fr)_190px_170px_auto]" @submit.prevent="submitFilters()">
            <input v-model="searchInput" type="search" :placeholder="`Search ${categoryName} news...`
              " class="h-12 rounded-xl
              border border-line
              bg-surface-2 px-4 text-sm
              outline-none transition
              focus:border-indigo-400
              focus:bg-surface
              focus:ring-4
              focus:ring-indigo-500/10">

            <input v-model="regionInput" type="text" placeholder="Region" class="h-12 rounded-xl
              border border-line
              bg-surface-2 px-4 text-sm
              outline-none transition
              focus:border-indigo-400
              focus:bg-surface">

            <select v-model="sortInput" class="h-12 rounded-xl
              border border-line
              bg-surface-2 px-4 text-sm
              font-semibold outline-none" @change="submitFilters()">
              <option value="latest">
                Latest
              </option>

              <option value="popular">
                Popular
              </option>

              <option value="oldest">
                Oldest
              </option>
            </select>

            <button type="submit" class="h-12 rounded-xl
              bg-accent text-accent-fg px-6
              text-sm font-bold text-white
              hover:bg-indigo-600">
              Search
            </button>
          </form>

          <div v-if="hasActiveFilters" class="mt-3 flex flex-wrap
            items-center gap-2">
            <span class="text-xs text-fg-subtle">
              Filters active
            </span>

            <button type="button" class="text-xs font-bold
              text-red-700" @click="resetFilters()">
              Clear all
            </button>
          </div>

          <div v-if="categoryTags.length" class="category-tags mt-4
            flex gap-2 overflow-x-auto">
            <NuxtLink v-for="tag in categoryTags" :key="tag.slug" :to="`/news/tag/${tag.slug}`" class="shrink-0 rounded-full
              border border-line
              bg-surface-2 px-4 py-2
              text-[10px] font-semibold
              text-fg-muted transition
              hover:border-indigo-200
              hover:bg-indigo-50
              hover:text-indigo-600">
              #{{ tag.name }}

              <span class="ml-1 text-fg-subtle">
                {{ tag.count }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Featured article -->

      <section v-if="featuredArticle" class="bg-surface py-16 sm:py-20">
        <div class="mx-auto max-w-7xl px-6">
          <div class="mb-8 flex flex-col
            justify-between gap-4
            sm:flex-row sm:items-end">
            <div>
              <span class="text-xs font-bold
                uppercase tracking-[0.18em]
                text-red-600">
                Lead story
              </span>

              <h2 class="mt-3 text-3xl
                font-bold tracking-[-0.035em]">
                Latest from
                <span class="text-fg-subtle">
                  {{ categoryName }}
                </span>
              </h2>
            </div>

            <span class="text-xs text-fg-subtle">
              Updated throughout the day
            </span>
          </div>

          <NuxtLink :to="`/news/posts/${featuredArticle.slug}`
            " class="group relative block
            min-h-[500px] overflow-hidden
            rounded-[34px] bg-accent text-accent-fg">
            <img v-if="featuredArticle.image" :src="featuredArticle.image" :alt="featuredArticle.title" class="absolute inset-0
              h-full w-full object-cover
              transition-transform
              duration-700
              group-hover:scale-105">

            <div v-else class="absolute inset-0
              flex items-center
              justify-center
              bg-gradient-to-br
              from-slate-800
              via-slate-900
              to-indigo-950">
              <span class="text-sm font-bold
                uppercase tracking-wider
                text-white/50">
                No cover image
              </span>
            </div>

            <div class="absolute inset-0
              bg-gradient-to-t
              from-slate-950
              via-slate-950/45
              to-transparent" />

            <div class="absolute left-6 top-6
              flex flex-wrap gap-2">
              <span v-if="
                featuredArticle.isBreaking
              " class="rounded-full
                bg-red-600 px-3 py-1.5
                text-[9px] font-bold
                uppercase tracking-wider
                text-white">
                Breaking
              </span>

              <span v-if="featuredArticle.isLive" class="rounded-full
                bg-surface/90 px-3 py-1.5
                text-[9px] font-bold
                uppercase text-red-600">
                Live
              </span>
            </div>

            <div class="absolute inset-x-0
              bottom-0 p-7 sm:p-10">
              <span class="rounded-full
                border px-3 py-1.5
                text-[9px] font-bold
                uppercase tracking-wider" :class="getCategoryClasses(
                  featuredArticle.category,
                )
                  ">
                {{
                  featuredArticle.categoryName
                }}
              </span>

              <h2 class="mt-5 max-w-4xl
                text-3xl font-bold
                leading-tight
                tracking-[-0.04em]
                text-white sm:text-5xl">
                {{ featuredArticle.title }}
              </h2>

              <p class="mt-4 max-w-2xl
                text-sm leading-7
                text-fg-subtle sm:text-base">
                {{ featuredArticle.excerpt }}
              </p>

              <div class="mt-6 flex flex-wrap
                items-center gap-3 text-xs
                text-fg-subtle">
                <span>
                  {{
                    featuredArticle.source
                    || 'SP-Tools News'
                  }}
                </span>

                <span>•</span>

                <time :datetime="featuredArticle.publishedAt
                  ">
                  {{
                    timeAgo(
                      featuredArticle.publishedAt,
                    )
                  }}
                </time>

                <span>•</span>

                <span>
                  {{ featuredArticle.readTime }}
                </span>

                <span>•</span>

                <span>
                  {{
                    formatViews(
                      featuredArticle.views,
                    )
                  }}
                  views
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Articles and sidebar -->

      <section class="border-y border-line
        bg-surface-2 py-20">
        <div class="mx-auto grid max-w-7xl
          items-start gap-10 px-6
          lg:grid-cols-[minmax(0,1fr)_340px]">
          <section>
            <div class="flex items-end
              justify-between gap-4
              border-b border-line
              pb-6">
              <div>
                <span class="text-xs font-bold
                  uppercase tracking-[0.18em]
                  text-indigo-600">
                  More coverage
                </span>

                <h2 class="mt-3 text-3xl
                  font-bold">
                  {{ categoryName }} stories
                </h2>
              </div>

              <p class="text-xs text-fg-subtle">
                {{ totalArticles }} results
              </p>
            </div>

            <div v-if="remainingArticles.length" class="mt-8 grid gap-6
              md:grid-cols-2">
              <NewsSharedArticleCard v-for="
item in remainingArticles
                " :key="item.id" :article="item" />
            </div>

            <div v-else-if="featuredArticle" class="mt-8 rounded-[28px]
              border border-line
              bg-surface px-6 py-14
              text-center">
              <p class="font-bold">
                You are viewing the latest
                available story.
              </p>
            </div>

            <div v-else class="mt-8 rounded-[28px]
              border border-dashed
              border-line-strong bg-surface
              px-6 py-16 text-center">
              <h3 class="text-xl font-bold">
                No matching stories
              </h3>

              <p class="mt-2 text-sm
                text-fg-subtle">
                Clear the search or select
                another category.
              </p>

              <button v-if="hasActiveFilters" type="button" class="mt-6 rounded-xl
                bg-accent text-accent-fg px-5 py-3
                text-xs font-bold text-white" @click="resetFilters()">
                Clear filters
              </button>
            </div>

            <!-- Pagination -->

            <nav v-if="
              pagination
              && pagination.last_page > 1
            " class="mt-12 flex flex-wrap
              justify-center gap-2" aria-label="Category pagination">
              <button type="button" class="rounded-xl border
                border-line-strong bg-surface
                px-4 py-2.5 text-sm
                font-semibold disabled:opacity-40" :disabled="page <= 1" @click="goToPage(page - 1)">
                Previous
              </button>

              <button v-for="
pageNumber in visiblePages
                " :key="pageNumber" type="button" class="h-10 min-w-10
                rounded-xl border px-3
                text-sm font-bold" :class="pageNumber === page
                    ? 'border-accent bg-accent text-accent-fg'
                    : 'border-line-strong bg-surface text-fg-muted'
                  " @click="
                  goToPage(pageNumber)
                  ">
                {{ pageNumber }}
              </button>

              <button type="button" class="rounded-xl border
                border-line-strong bg-surface
                px-4 py-2.5 text-sm
                font-semibold disabled:opacity-40" :disabled="page >= pagination.last_page
                  " @click="goToPage(page + 1)">
                Next
              </button>
            </nav>
          </section>

          <!-- Sidebar -->

          <aside class="space-y-7">
            <section v-if="categoryTags.length" class="rounded-3xl border
              border-line bg-surface
              p-6">
              <h2 class="text-lg font-black">
                Popular topics
              </h2>

              <div class="mt-5 flex flex-wrap
                gap-2">
                <NuxtLink v-for="tag in categoryTags" :key="tag.slug" :to="`/news/tag/${tag.slug}`
                  " class="rounded-full
                  border border-line
                  bg-surface-2 px-3 py-2
                  text-xs font-bold
                  text-fg-muted
                  hover:bg-accent text-accent-fg
                  hover:text-white">
                  #{{ tag.name }}
                </NuxtLink>
              </div>
            </section>

            <section class="rounded-3xl border
              border-line bg-surface
              p-6">
              <h2 class="text-lg font-black">
                Most read
              </h2>

              <div class="mt-5 divide-y
                divide-line">
                <NuxtLink v-for="(
item,
                      index
                  ) in mostReadArticles" :key="item.id" :to="`/news/posts/${item.slug}`
                    " class="group flex gap-4
                  py-4 first:pt-0">
                  <span class="text-2xl font-black
                    text-fg-subtle">
                    {{
                      String(index + 1)
                        .padStart(2, '0')
                    }}
                  </span>

                  <div class="min-w-0">
                    <h3 class="line-clamp-2
                      text-sm font-bold
                      leading-6
                      group-hover:text-indigo-600">
                      {{ item.title }}
                    </h3>

                    <p class="mt-2 text-xs
                      text-fg-subtle">
                      {{
                        formatViews(item.views)
                      }}
                      views
                    </p>
                  </div>
                </NuxtLink>
              </div>
            </section>
          </aside>
        </div>
      </section>

      <NewsHomeWorldRegions />
      <NewsHomeNewsletter />
    </template>
  </main>
</template>

<style scoped>
.category-tags {
  scrollbar-width: none;
}

.category-tags::-webkit-scrollbar {
  display: none;
}
</style>