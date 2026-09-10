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

const iconPaths: Record<string, string[]> = {
  world: [
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
    'M3.6 9h16.8M3.6 15h16.8',
    'M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21',
    'M12 3C9.8 5.5 8.7 8.5 8.7 12s1.1 6.5 3.3 9',
  ],
  asia: [
    'M4 6.5 8.5 5l3.5 1.5L15.5 5 20 6.5v11L15.5 19 12 17.5 8.5 19 4 17.5v-11Z',
    'M8.5 5v14M15.5 5v14',
  ],
  americas: [
    'M4 6.5 8.5 5l3.5 1.5L15.5 5 20 6.5v11L15.5 19 12 17.5 8.5 19 4 17.5v-11Z',
    'M8.5 5v14M15.5 5v14',
  ],
  europe: [
    'M4 19h16M6 16h12M7 8v8M10.5 8v8M13.5 8v8M17 8v8',
    'M5 8h14L12 4 5 8Z',
  ],
  'middle-east': [
    'M4 6.5 8.5 5l3.5 1.5L15.5 5 20 6.5v11L15.5 19 12 17.5 8.5 19 4 17.5v-11Z',
    'M8.5 5v14M15.5 5v14',
  ],
  business: [
    'M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7',
    'M4 8.5h16v10.5H4V8.5ZM4 12h16M10 12v1.5h4V12',
  ],
  technology: [
    'M8 8h8v8H8V8Z',
    'M10 2v3M14 2v3M10 19v3M14 19v3',
    'M2 10h3M2 14h3M19 10h3M19 14h3',
  ],
  science: [
    'M9 3h6M10 3v6l-4.5 7.7A2.8 2.8 0 0 0 7.9 21h8.2a2.8 2.8 0 0 0 2.4-4.3L14 9V3',
    'M8.5 15h7',
  ],
  climate: [
    'M18.5 4.5C12 4.5 7.5 8 7.5 13.2c0 3.7 2.5 6.3 5.8 6.3 4.2 0 6.2-4.4 5.2-15Z',
    'M6 20c2.2-5.6 5.4-9.7 10.2-12.1',
  ],
  health: [
    'M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z',
    'M9.5 12h5M12 9.5v5',
  ],
}

const getIconPaths = (
  slug: string,
): string[] =>
  iconPaths[slug]
  ?? ['M5 5h14v14H5V5ZM8 9h8M8 13h8M8 17h5']

const orderedCategories = computed(() => {
  const order = new Map(
    categoryOrder.map(
      (slug, index) => [slug, index],
    ),
  )

  return [...categories.value]
    .filter(category => category.isActive)
    .sort((first, second) => {
      const firstOrder =
        order.get(first.slug)
        ?? 999

      const secondOrder =
        order.get(second.slug)
        ?? 999

      if (firstOrder !== secondOrder) {
        return firstOrder - secondOrder
      }

      return first.sortOrder - second.sortOrder
    })
})

const {
  data: categoryPreviewData,
} = await useAsyncData(
  'news-v21-category-previews',
  async () => {
    const previews:
      Record<string, NewsArticle | null> = {}

    await Promise.all(
      orderedCategories.value.map(
        async category => {
          const homeArticle =
            latestArticles.value.find(
              article =>
                article.category
                  === category.slug
                && Boolean(article.image),
            )
            ?? latestArticles.value.find(
              article =>
                article.category
                  === category.slug,
            )

          if (homeArticle) {
            previews[category.slug] =
              homeArticle
            return
          }

          if (
            Number(
              category.articlesCount
              ?? 0,
            ) <= 0
          ) {
            previews[category.slug] = null
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

            previews[category.slug] =
              response.data[0]
              ?? null
          } catch {
            previews[category.slug] = null
          }
        },
      ),
    )

    return previews
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
          categoryPreviewData.value?.[
            category.slug
          ]
          ?? latestArticles.value.find(
            article =>
              article.category
                === category.slug,
          )
          ?? null,
      }),
    ),
)

const featuredCard = computed(() =>
  cards.value.find(
    card => card.category.slug === 'world',
  )
  ?? cards.value[0]
  ?? null,
)

const compactCards = computed(() =>
  cards.value.filter(
    card =>
      card.category.slug
      !== featuredCard.value?.category.slug,
  ),
)

const totalStories = computed(() =>
  orderedCategories.value.reduce(
    (total, category) =>
      total
      + Number(
        category.articlesCount
        ?? 0,
      ),
    0,
  ),
)

const activeDeskCount = computed(
  () => orderedCategories.value.length,
)

const updatedTodayCount = computed(() => {
  const now = new Date()

  return latestArticles.value.filter(
    article => {
      const date =
        new Date(article.publishedAt)

      return (
        date.getFullYear()
          === now.getFullYear()
        && date.getMonth()
          === now.getMonth()
        && date.getDate()
          === now.getDate()
      )
    },
  ).length
})

const getCardClass = (
  slug: string,
): string =>
  `sp-v21-card-${slug}`

const getAccentClass = (
  slug: string,
): string =>
  `sp-v21-accent-${slug}`

const getFallbackClass = (
  slug: string,
): string =>
  `sp-v21-fallback-${slug}`
</script>

<template>
  <section
    id="news-coverage"
    class="sp-v21-coverage relative overflow-hidden border-y border-line"
  >
    <div class="sp-v21-grid-texture pointer-events-none absolute inset-0" />

    <div class="sp-container-wide relative py-16 sm:py-20 lg:py-24">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div class="max-w-3xl">
          <div class="sp-kicker">
            Global coverage
          </div>

          <h2 class="mt-4 max-w-3xl text-[clamp(2.9rem,5vw,5rem)] font-[820] leading-[.9] tracking-[-.065em] text-fg">
            Explore
            <span class="sp-v21-heading-accent">
              coverage
            </span>
          </h2>

          <p class="mt-5 max-w-2xl text-[13px] leading-6 text-fg-muted sm:text-[14px]">
            See the story before you open it. Every desk uses its latest reporting image and headline so readers can understand the topic at a glance.
          </p>
        </div>

        <div class="sp-v21-status-grid">
          <div class="sp-v21-status-card">
            <span class="sp-v21-status-dot" />
            <div>
              <strong>Fresh now</strong>
              <span>Live coverage</span>
            </div>
          </div>

          <div class="sp-v21-status-card">
            <span class="sp-v21-status-icon">▤</span>
            <div>
              <strong>{{ totalStories }} stories</strong>
              <span>Across all desks</span>
            </div>
          </div>

          <div class="sp-v21-status-card">
            <span class="sp-v21-status-icon">◎</span>
            <div>
              <strong>{{ activeDeskCount }} desks</strong>
              <span>Global coverage</span>
            </div>
          </div>

          <div class="sp-v21-status-card">
            <span class="sp-v21-status-icon">↻</span>
            <div>
              <strong>{{ updatedTodayCount }} today</strong>
              <span>Latest updates</span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="featuredCard"
        class="sp-v21-coverage-grid mt-10"
      >
        <NuxtLink
          :to="`/news/category/${featuredCard.category.slug}`"
          class="sp-v21-featured-card group"
          :class="[
            getCardClass(featuredCard.category.slug),
            getAccentClass(featuredCard.category.slug),
          ]"
        >
          <div class="sp-v21-card-media">
            <img
              v-if="featuredCard.latest?.image"
              :src="featuredCard.latest.image"
              :alt="featuredCard.latest.title"
              loading="lazy"
              class="sp-v21-card-image"
            >

            <div
              v-else
              class="sp-v21-media-fallback"
              :class="getFallbackClass(featuredCard.category.slug)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path
                  v-for="path in getIconPaths(featuredCard.category.slug)"
                  :key="path"
                  :d="path"
                />
              </svg>
            </div>

            <div class="sp-v21-image-shade" />

            <span class="sp-v21-featured-label">
              Featured
            </span>

            <span class="sp-v21-story-count">
              {{ featuredCard.category.articlesCount }}
              {{ featuredCard.category.articlesCount === 1 ? 'story' : 'stories' }}
            </span>
          </div>

          <div class="sp-v21-featured-content">
            <div class="flex min-w-0 items-start gap-3">
              <span class="sp-v21-category-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.65"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path
                    v-for="path in getIconPaths(featuredCard.category.slug)"
                    :key="path"
                    :d="path"
                  />
                </svg>
              </span>

              <div class="min-w-0">
                <h3 class="text-[30px] font-[820] leading-none tracking-[-.055em] text-fg">
                  {{ featuredCard.category.name }}
                </h3>

                <p class="mt-2 max-w-md text-[11px] leading-5 text-fg-muted">
                  {{ featuredCard.category.description }}
                </p>
              </div>
            </div>

            <div
              v-if="featuredCard.latest"
              class="sp-v21-featured-headline"
            >
              <span>
                {{ featuredCard.latest.isBreaking ? 'Breaking' : 'Latest' }}
              </span>

              <p>
                {{ featuredCard.latest.title }}
              </p>

              <small>
                {{ timeAgo(featuredCard.latest.publishedAt) }}
              </small>
            </div>

            <div class="sp-v21-open-desk">
              <span>Open desk</span>
              <span class="sp-v21-open-arrow">→</span>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          v-for="card in compactCards"
          :key="card.category.slug"
          :to="`/news/category/${card.category.slug}`"
          class="sp-v21-topic-card group"
          :class="[
            getCardClass(card.category.slug),
            getAccentClass(card.category.slug),
          ]"
        >
          <div class="sp-v21-card-media">
            <img
              v-if="card.latest?.image"
              :src="card.latest.image"
              :alt="card.latest.title"
              loading="lazy"
              class="sp-v21-card-image"
            >

            <div
              v-else
              class="sp-v21-media-fallback"
              :class="getFallbackClass(card.category.slug)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path
                  v-for="path in getIconPaths(card.category.slug)"
                  :key="path"
                  :d="path"
                />
              </svg>
            </div>

            <div class="sp-v21-image-shade" />

            <span class="sp-v21-story-count">
              {{ card.category.articlesCount }}
              {{ card.category.articlesCount === 1 ? 'story' : 'stories' }}
            </span>
          </div>

          <div class="sp-v21-topic-content">
            <div class="flex min-w-0 items-start gap-3">
              <span class="sp-v21-category-icon sp-v21-category-icon-small">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.65"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path
                    v-for="path in getIconPaths(card.category.slug)"
                    :key="path"
                    :d="path"
                  />
                </svg>
              </span>

              <div class="min-w-0 flex-1">
                <h3 class="text-[18px] font-[790] leading-tight tracking-[-.04em] text-fg">
                  {{ card.category.name }}
                </h3>

                <p class="mt-1 line-clamp-1 text-[9.5px] leading-4 text-fg-muted">
                  {{ card.category.description }}
                </p>
              </div>

              <span class="sp-v21-topic-arrow">
                →
              </span>
            </div>

            <div
              v-if="card.latest"
              class="sp-v21-latest-strip"
            >
              <p>
                {{ card.latest.title }}
              </p>

              <span>
                {{ timeAgo(card.latest.publishedAt) }}
              </span>
            </div>

            <div
              v-else
              class="sp-v21-latest-strip sp-v21-latest-empty"
            >
              <p>Coverage coming soon</p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="mt-8 flex justify-center">
        <NuxtLink
          to="/news/search"
          class="sp-v21-browse-all group"
        >
          Browse all coverage
          <span class="transition-transform group-hover:translate-x-1">→</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
