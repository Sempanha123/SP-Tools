<script setup lang="ts">
import type {
  NewsArticle,
  NewsCategory,
} from '~/types/news'

interface CoverageCard {
  category: NewsCategory
  latest: NewsArticle | null
  index: number
}

const newsApi = useNewsApi()

const {
  categories,
  latestArticles,
  loadHomeNews,
  timeAgo,
} = useNewsData()

await loadHomeNews()

const categoryOrder = [
  'world',
  'asia',
  'americas',
  'europe',
  'middle-east',
  'business',
  'technology',
  'science',
  'climate',
  'health',
]

const orderedCategories = computed(() => {
  const order = new Map(
    categoryOrder.map(
      (slug, index) => [slug, index],
    ),
  )

  return [...categories.value]
    .filter(category => category.isActive)
    .sort((first, second) => {
      const firstOrder = order.get(first.slug) ?? 999
      const secondOrder = order.get(second.slug) ?? 999

      if (firstOrder !== secondOrder) {
        return firstOrder - secondOrder
      }

      return first.sortOrder - second.sortOrder
    })
})

const {
  data: previewMap,
} = await useAsyncData(
  'news-v22-compact-background-previews',
  async () => {
    const result:
      Record<string, NewsArticle | null> = {}

    await Promise.all(
      orderedCategories.value.map(
        async category => {
          const fromHome =
            latestArticles.value.find(
              article =>
                article.category === category.slug
                && Boolean(article.image),
            )
            ?? latestArticles.value.find(
              article =>
                article.category === category.slug,
            )

          if (fromHome) {
            result[category.slug] = fromHome
            return
          }

          if (Number(category.articlesCount ?? 0) <= 0) {
            result[category.slug] = null
            return
          }

          try {
            const response =
              await newsApi.getCategoryNews(
                category.slug,
                {
                  sort: 'latest',
                  per_page: 1,
                  page: 1,
                },
              )

            result[category.slug] =
              response.data[0] ?? null
          } catch {
            result[category.slug] = null
          }
        },
      ),
    )

    return result
  },
  {
    default: () => ({}),
  },
)

const cards = computed<CoverageCard[]>(
  () =>
    orderedCategories.value.map(
      (category, index) => ({
        category,
        index,
        latest:
          previewMap.value?.[category.slug]
          ?? latestArticles.value.find(
            article =>
              article.category === category.slug,
          )
          ?? null,
      }),
    ),
)

const accentClass = (
  slug: string,
): string =>
  `sp-v22-accent-${slug}`

const fallbackClass = (
  slug: string,
): string =>
  `sp-v22-fallback-${slug}`
</script>

<template>
  <section
    id="news-coverage"
    class="sp-v22-coverage relative overflow-hidden border-y border-line"
  >
    <div class="sp-container-wide py-14 sm:py-16 lg:py-20">
      <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div class="max-w-2xl">
          <div class="sp-kicker">
            Explore coverage
          </div>

          <h2 class="mt-3 text-[clamp(2.3rem,4vw,3.6rem)] font-[820] leading-[.94] tracking-[-.055em] text-fg">
            Pick a desk.
            <span class="text-fg-subtle">
              See the story instantly.
            </span>
          </h2>

          <p class="mt-4 max-w-xl text-[12px] leading-5 text-fg-muted sm:text-[13px]">
            Images become the card background, so every topic is easy to understand before you click.
          </p>
        </div>

        <NuxtLink
          to="/news/search"
          class="group inline-flex items-center gap-2 text-[10px] font-bold text-fg-muted transition hover:text-accent"
        >
          Browse all coverage
          <span class="transition-transform group-hover:translate-x-1">→</span>
        </NuxtLink>
      </div>

      <div class="sp-v22-grid mt-8">
        <NuxtLink
          v-for="card in cards"
          :key="card.category.slug"
          :to="`/news/category/${card.category.slug}`"
          class="sp-v22-card group"
          :class="accentClass(card.category.slug)"
        >
          <img
            v-if="card.latest?.image"
            :src="card.latest.image"
            :alt="card.latest.title"
            loading="lazy"
            class="sp-v22-bg-image"
          >

          <div
            v-else
            class="sp-v22-bg-fallback"
            :class="fallbackClass(card.category.slug)"
          />

          <div class="sp-v22-overlay" />

          <div class="sp-v22-top">
            <span class="sp-v22-count">
              {{ card.category.articlesCount }}
              {{ card.category.articlesCount === 1 ? 'story' : 'stories' }}
            </span>

            <span class="sp-v22-arrow">
              →
            </span>
          </div>

          <div class="sp-v22-bottom">
            <p class="sp-v22-category">
              {{ card.category.name }}
            </p>

            <p
              v-if="card.latest"
              class="sp-v22-headline"
            >
              {{ card.latest.title }}
            </p>

            <p
              v-else
              class="sp-v22-headline"
            >
              {{ card.category.description || 'Coverage coming soon.' }}
            </p>

            <span
              v-if="card.latest"
              class="sp-v22-time"
            >
              {{ timeAgo(card.latest.publishedAt) }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
