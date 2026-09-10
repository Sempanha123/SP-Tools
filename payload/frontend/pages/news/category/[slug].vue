<script setup lang="ts">
import type { CategoryNewsSort } from '~/composables/useNewsCategoryPage'

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

const { timeAgo, formatViews } = useNewsData()

const searchInput = ref(searchQuery.value)
const regionInput = ref(region.value)
const sortInput = ref<CategoryNewsSort>(sort.value)

watch(searchQuery, value => { searchInput.value = value })
watch(region, value => { regionInput.value = value })
watch(sort, value => { sortInput.value = value })

const totalArticles = computed(() =>
  pagination.value?.total ?? categoryArticles.value.length,
)

const currentPage = computed(() =>
  pagination.value?.current_page ?? 1,
)

const lastPage = computed(() =>
  pagination.value?.last_page ?? 1,
)

const visiblePages = computed(() => {
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(lastPage.value, currentPage.value + 2)

  return Array.from(
    { length: end - start + 1 },
    (_, index) => start + index,
  )
})

const categoryIcon = computed(() =>
  categoryDetails.value?.icon?.trim()
  || categoryName.value.charAt(0).toUpperCase()
  || 'N',
)

const categoryTags = computed(() => {
  const map = new Map<string, {
    name: string
    slug: string
    count: number
  }>()

  const slugify = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

  for (const article of categoryArticles.value) {
    article.tags.forEach((name, index) => {
      const slug =
        article.tagSlugs?.[index]
        || slugify(name)

      const item = map.get(slug)

      if (item) {
        item.count += 1
      } else {
        map.set(slug, {
          name,
          slug,
          count: 1,
        })
      }
    })
  }

  return [...map.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
})

const submitFilters = async () =>
  applyFilters({
    q: searchInput.value,
    region: regionInput.value,
    sort: sortInput.value,
  })

const resetFilters = async () => {
  searchInput.value = ''
  regionInput.value = ''
  sortInput.value = 'latest'
  await clearFilters()
}

const pageTitle = computed(() =>
  `${categoryName.value} News and Latest Updates | SP-Tools`,
)

useSeoMeta({
  title: () => pageTitle.value,
  description: () => categoryDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => categoryDescription.value,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `/news/category/${categorySlug.value}`,
    },
  ],
}))
</script>

<template>
  <main class="news-v17-category min-h-screen overflow-x-hidden bg-surface text-fg">
    <section
      v-if="pending"
      class="sp-container-wide py-16"
    >
      <div class="sp-skeleton h-[340px] rounded-[30px]" />

      <div class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="n in 6"
          :key="n"
          class="sp-skeleton h-80 rounded-[22px]"
        />
      </div>
    </section>

    <section
      v-else-if="error"
      class="sp-container py-24 text-center"
    >
      <div class="mx-auto max-w-2xl rounded-[28px] border border-danger/20 bg-danger-soft p-8 shadow-soft sm:p-12">
        <p class="text-[9px] font-bold uppercase tracking-[.16em] text-danger">
          News API
        </p>

        <h1 class="mt-4 text-3xl font-bold tracking-[-.04em] text-fg">
          Category could not be loaded
        </h1>

        <p class="mx-auto mt-3 max-w-xl text-sm leading-7 text-fg-muted">
          SP-Tools could not load this category from the News API.
        </p>

        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            class="sp-btn sp-btn-primary px-5 py-3 text-xs"
            @click="refresh"
          >
            Try again
          </button>

          <NuxtLink
            to="/news"
            class="sp-btn sp-btn-secondary px-5 py-3 text-xs"
          >
            Back to news
          </NuxtLink>
        </div>
      </div>
    </section>

    <template v-else>
      <section class="sp-category-v17-hero relative overflow-hidden border-b border-line">
        <div class="sp-quiet-grid pointer-events-none absolute inset-0 opacity-[.08]" />
        <div class="sp-category-v17-aura pointer-events-none absolute inset-0" />

        <div class="sp-container-wide relative py-10 sm:py-14 lg:py-16">
          <nav
            aria-label="Breadcrumb"
            class="flex flex-wrap items-center gap-2 text-[9px] font-semibold text-fg-subtle"
          >
            <NuxtLink to="/" class="transition hover:text-fg">Home</NuxtLink>
            <span>/</span>
            <NuxtLink to="/news" class="transition hover:text-fg">News</NuxtLink>
            <span>/</span>
            <span class="text-accent">{{ categoryName }}</span>
          </nav>

          <div class="mt-8 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-12">
            <div>
              <div class="flex items-center gap-3">
                <span class="flex h-12 w-12 items-center justify-center rounded-[15px] border border-line bg-elevated text-base font-black text-accent shadow-xs">
                  {{ categoryIcon }}
                </span>

                <div>
                  <p class="text-[9px] font-bold uppercase tracking-[.17em] text-accent">
                    SP-Tools newsroom
                  </p>
                  <p class="mt-1 text-[10px] text-fg-subtle">
                    Category desk
                  </p>
                </div>
              </div>

              <h1 class="mt-6 max-w-4xl font-display text-[clamp(3.2rem,6vw,6rem)] font-[720] leading-[.88] tracking-[-.065em] text-fg">
                {{ categoryName }}
                <span class="text-accent">.</span>
              </h1>

              <p class="mt-5 max-w-2xl text-[14px] leading-7 text-fg-muted sm:text-[16px]">
                {{ categoryDescription }}
              </p>

              <div
                v-if="categoryTags.length"
                class="mt-6 flex flex-wrap gap-2"
              >
                <NuxtLink
                  v-for="tag in categoryTags.slice(0, 5)"
                  :key="tag.slug"
                  :to="`/news/tag/${tag.slug}`"
                  class="rounded-full border border-line bg-elevated px-3 py-2 text-[9px] font-semibold text-fg-muted transition hover:border-accent/25 hover:bg-accent-soft hover:text-accent"
                >
                  #{{ tag.name }}
                </NuxtLink>
              </div>
            </div>

            <div class="sp-category-v17-snapshot rounded-[24px] border border-line bg-elevated/90 p-5 shadow-lift backdrop-blur-xl">
              <p class="text-[8px] font-bold uppercase tracking-[.15em] text-fg-subtle">
                Desk snapshot
              </p>

              <div class="mt-4 grid grid-cols-2 gap-3">
                <div class="rounded-[16px] border border-line bg-surface-2 p-4">
                  <p class="text-[8px] font-bold uppercase tracking-[.12em] text-fg-subtle">
                    Stories
                  </p>
                  <p class="mt-2 text-3xl font-[800] tracking-[-.04em] text-fg">
                    {{ totalArticles }}
                  </p>
                </div>

                <div class="rounded-[16px] border border-line bg-surface-2 p-4">
                  <p class="text-[8px] font-bold uppercase tracking-[.12em] text-fg-subtle">
                    View
                  </p>
                  <p class="mt-2 text-[13px] font-bold capitalize text-accent">
                    {{ sort }}
                  </p>
                </div>
              </div>

              <a
                href="#category-stories"
                class="mt-4 flex h-11 items-center justify-between rounded-[13px] bg-fg px-4 text-[10px] font-bold text-surface-2 transition hover:-translate-y-0.5"
              >
                Browse coverage
                <span>↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <NewsHomeCategoryNav />

      <section class="relative bg-surface py-10 sm:py-14">
        <div class="sp-container-wide">
          <form
            class="grid gap-3 rounded-[22px] border border-line bg-elevated p-4 shadow-soft md:grid-cols-[minmax(0,1fr)_190px_160px_auto]"
            @submit.prevent="submitFilters"
          >
            <input
              v-model="searchInput"
              type="search"
              :placeholder="`Search ${categoryName} coverage…`"
              class="sp-input h-12 text-sm"
            >

            <input
              v-model="regionInput"
              type="text"
              placeholder="Region"
              class="sp-input h-12 text-sm"
            >

            <select
              v-model="sortInput"
              class="sp-input h-12 text-sm"
              @change="submitFilters"
            >
              <option value="latest">Latest</option>
              <option value="popular">Popular</option>
              <option value="oldest">Oldest</option>
            </select>

            <button
              type="submit"
              class="sp-btn sp-btn-primary h-12 px-5 text-xs"
            >
              Search →
            </button>
          </form>

          <div
            id="category-stories"
            class="mt-10 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_360px]"
          >
            <div class="min-w-0">
              <template v-if="categoryArticles.length">
                <section v-if="featuredArticle">
                  <div class="mb-5 flex items-end justify-between gap-4">
                    <div>
                      <p class="sp-kicker">Lead story</p>
                      <h2 class="mt-2 text-2xl font-[760] tracking-[-.04em] text-fg">
                        Top {{ categoryName }} coverage
                      </h2>
                    </div>

                    <span class="text-[9px] font-semibold text-fg-subtle">
                      {{ totalArticles }} {{ totalArticles === 1 ? 'story' : 'stories' }}
                    </span>
                  </div>

                  <NuxtLink
                    :to="`/news/posts/${featuredArticle.slug}`"
                    class="group grid overflow-hidden rounded-[28px] border border-line bg-elevated shadow-lift lg:grid-cols-[1.08fr_.92fr]"
                  >
                    <div class="relative min-h-[340px] overflow-hidden bg-surface-3">
                      <img
                        v-if="featuredArticle.image"
                        :src="featuredArticle.image"
                        :alt="featuredArticle.title"
                        class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                      >

                      <div
                        v-else
                        class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(124,92,255,.12),transparent_32%),var(--sp-surface-soft)]"
                      />

                      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>

                    <div class="flex flex-col justify-center p-6 sm:p-8 lg:p-9">
                      <p class="text-[9px] font-bold uppercase tracking-[.14em] text-accent">
                        {{ featuredArticle.categoryName }} · {{ featuredArticle.region }}
                      </p>

                      <h3 class="mt-4 font-display text-[clamp(2.1rem,3.2vw,3.5rem)] font-[720] leading-[.95] tracking-[-.05em] text-fg">
                        {{ featuredArticle.title }}
                      </h3>

                      <p class="mt-5 text-[13px] leading-7 text-fg-muted">
                        {{ featuredArticle.excerpt }}
                      </p>

                      <div class="mt-6 flex flex-wrap gap-3 text-[9px] text-fg-subtle">
                        <span>{{ timeAgo(featuredArticle.publishedAt) }}</span>
                        <span>·</span>
                        <span>{{ formatViews(featuredArticle.views) }} views</span>
                      </div>

                      <span class="mt-6 inline-flex items-center gap-2 text-[10px] font-bold text-fg">
                        Read full story
                        <span class="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </NuxtLink>
                </section>

                <section
                  v-if="remainingArticles.length"
                  class="mt-10"
                >
                  <div class="mb-5">
                    <p class="sp-kicker">Latest reports</p>
                    <h2 class="mt-2 text-3xl font-[780] tracking-[-.045em] text-fg">
                      More in {{ categoryName }}
                    </h2>
                  </div>

                  <div class="sp-stagger grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                    <NewsSharedArticleCard
                      v-for="article in remainingArticles"
                      :key="article.id"
                      :article="article"
                    />
                  </div>
                </section>

                <div
                  v-else
                  class="mt-8 rounded-[22px] border border-line bg-surface-2 px-6 py-5"
                >
                  <p class="text-[11px] font-bold text-fg">
                    This desk currently has one published story.
                  </p>
                  <p class="mt-1 text-[10px] leading-5 text-fg-muted">
                    The page is working correctly; add or seed more {{ categoryName }} stories to populate the archive.
                  </p>
                </div>
              </template>

              <div
                v-else
                class="rounded-[26px] border border-line bg-elevated px-6 py-16 text-center shadow-soft"
              >
                <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-[17px] border border-line bg-surface-2 text-xl text-accent">
                  {{ categoryIcon }}
                </span>

                <h3 class="mt-5 text-2xl font-[760] tracking-[-.04em] text-fg">
                  No published {{ categoryName }} stories yet
                </h3>

                <p class="mx-auto mt-3 max-w-md text-sm leading-7 text-fg-muted">
                  This category exists, but there are no published articles matching the current filters.
                </p>

                <div class="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    class="sp-btn sp-btn-secondary px-4 py-2.5 text-xs"
                    @click="resetFilters"
                  >
                    Clear filters
                  </button>

                  <NuxtLink
                    to="/news"
                    class="sp-btn sp-btn-primary px-4 py-2.5 text-xs"
                  >
                    Browse all news
                  </NuxtLink>
                </div>
              </div>

              <div
                v-if="lastPage > 1"
                class="mt-10 flex flex-wrap gap-2"
              >
                <button
                  v-for="pageNumber in visiblePages"
                  :key="pageNumber"
                  type="button"
                  class="flex h-10 w-10 items-center justify-center rounded-[11px] border text-xs font-bold transition"
                  :class="
                    pageNumber === currentPage
                      ? 'border-accent bg-accent text-white'
                      : 'border-line bg-surface-2 text-fg-muted hover:border-accent/20 hover:text-fg'
                  "
                  @click="goToPage(pageNumber)"
                >
                  {{ pageNumber }}
                </button>
              </div>
            </div>

            <aside class="space-y-5 xl:sticky xl:top-[150px]">
              <section class="sp-category-v17-reader rounded-[24px] border border-line bg-elevated p-5 shadow-lift">
                <div class="flex items-end justify-between gap-3">
                  <div>
                    <p class="text-[9px] font-bold uppercase tracking-[.15em] text-accent">
                      Reader pulse
                    </p>
                    <h3 class="mt-2 text-2xl font-[780] tracking-[-.04em] text-fg">
                      Most read
                    </h3>
                  </div>

                  <NuxtLink
                    :to="{ path: '/news/search', query: { sort: 'popular' } }"
                    class="text-[9px] font-bold text-fg-subtle transition hover:text-accent"
                  >
                    All →
                  </NuxtLink>
                </div>

                <div class="mt-4 divide-y divide-line">
                  <NuxtLink
                    v-for="(article, index) in mostReadArticles.slice(0, 5)"
                    :key="article.id"
                    :to="`/news/posts/${article.slug}`"
                    class="group grid grid-cols-[36px_minmax(0,1fr)] gap-3 py-4"
                  >
                    <span class="text-xl font-[800] tracking-[-.04em] text-fg-subtle">
                      0{{ index + 1 }}
                    </span>

                    <div class="min-w-0">
                      <p class="line-clamp-3 text-[12px] font-[700] leading-5 text-fg transition group-hover:text-accent">
                        {{ article.title }}
                      </p>

                      <p class="mt-1.5 text-[8px] text-fg-subtle">
                        {{ formatViews(article.views) }} views
                      </p>
                    </div>
                  </NuxtLink>
                </div>
              </section>

              <section class="rounded-[24px] border border-line bg-surface-2 p-5">
                <p class="sp-kicker">About this desk</p>

                <p class="mt-3 text-[12px] leading-6 text-fg-muted">
                  {{ categoryDescription }}
                </p>

                <NuxtLink
                  to="/news/search"
                  class="mt-4 flex items-center justify-between rounded-[13px] border border-line bg-elevated px-4 py-3 text-[10px] font-bold text-fg transition hover:border-accent/25"
                >
                  Search all news
                  <span>→</span>
                </NuxtLink>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>
