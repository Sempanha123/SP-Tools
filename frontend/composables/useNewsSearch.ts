import type {
  ApiPaginationMeta,
  NewsArticle,
  NewsCategory,
  NewsTag,
} from '~/types/news'

export type NewsSearchSortMode =
  | 'latest'
  | 'popular'

export type NewsSearchDateRange =
  | 'all'
  | '24h'
  | '7d'
  | '30d'

export interface NewsSearchFilter {
  key:
    | 'query'
    | 'category'
    | 'region'
    | 'date'

  label: string
}

interface NewsSearchPageData {
  articles: NewsArticle[]
  meta: ApiPaginationMeta

  categories: NewsCategory[]
  tags: NewsTag[]
  mostReadArticles: NewsArticle[]
}

interface NewsSearchRequest {
  q?: string
  category?: string
  region?: string
  date?: Exclude<
    NewsSearchDateRange,
    'all'
  >

  sort: NewsSearchSortMode
  page: number
  per_page: number
}

/* =========================================================
   ROUTE HELPERS
========================================================= */

const resolveRouteValue = (
  value: unknown,
): string => {
  if (Array.isArray(value)) {
    return (
      value.find(
        (item): item is string =>
          typeof item === 'string',
      ) ?? ''
    )
  }

  return typeof value === 'string'
    ? value
    : ''
}

const validDateRanges:
  NewsSearchDateRange[] = [
    'all',
    '24h',
    '7d',
    '30d',
  ]

const validSortModes:
  NewsSearchSortMode[] = [
    'latest',
    'popular',
  ]

const resolveDateRange = (
  value: unknown,
): NewsSearchDateRange => {
  const result =
    resolveRouteValue(
      value,
    ) as NewsSearchDateRange

  return validDateRanges.includes(
    result,
  )
    ? result
    : 'all'
}

const resolveSortMode = (
  value: unknown,
): NewsSearchSortMode => {
  const result =
    resolveRouteValue(
      value,
    ) as NewsSearchSortMode

  return validSortModes.includes(
    result,
  )
    ? result
    : 'latest'
}

const resolvePageNumber = (
  value: unknown,
): number => {
  const parsed = Number.parseInt(
    resolveRouteValue(value),
    10,
  )

  if (
    !Number.isFinite(parsed)
    || parsed < 1
  ) {
    return 1
  }

  return parsed
}

const resolveFetchStatus = (
  error: unknown,
): number => {
  const fetchError = error as {
    statusCode?: number
    status?: number

    response?: {
      status?: number
    }
  }

  return (
    fetchError.statusCode
    ?? fetchError.status
    ?? fetchError.response?.status
    ?? 500
  )
}

/* =========================================================
   SEARCH COMPOSABLE
========================================================= */

export const useNewsSearch =
  async () => {
    const route = useRoute()
    const router = useRouter()
    const newsApi = useNewsApi()

    /*
    |--------------------------------------------------------------------------
    | Applied route values
    |--------------------------------------------------------------------------
    */

    const appliedQuery = computed(() => {
      return resolveRouteValue(
        route.query.q,
      ).trim()
    })

    const appliedCategory =
      computed(() => {
        return (
          resolveRouteValue(
            route.query.category,
          )
            .trim()
            .toLowerCase()
          || 'all'
        )
      })

    const appliedRegion =
      computed(() => {
        return (
          resolveRouteValue(
            route.query.region,
          ).trim()
          || 'all'
        )
      })

    const appliedDateRange =
      computed(() => {
        return resolveDateRange(
          route.query.date,
        )
      })

    const appliedSortMode =
      computed(() => {
        return resolveSortMode(
          route.query.sort,
        )
      })

    const appliedPage = computed(() => {
      return resolvePageNumber(
        route.query.page,
      )
    })

    /*
    |--------------------------------------------------------------------------
    | Editable UI state
    |--------------------------------------------------------------------------
    */

    const query = ref(
      appliedQuery.value,
    )

    const selectedCategory = ref(
      appliedCategory.value,
    )

    const selectedRegion = ref(
      appliedRegion.value,
    )

    const dateRange =
      ref<NewsSearchDateRange>(
        appliedDateRange.value,
      )

    const sortMode =
      ref<NewsSearchSortMode>(
        appliedSortMode.value,
      )

    const currentPage = ref(
      appliedPage.value,
    )

    const pageSize = 8

    /*
    |--------------------------------------------------------------------------
    | Load API results
    |--------------------------------------------------------------------------
    */

    const loadSearchPage =
      async (): Promise<NewsSearchPageData> => {
        try {
          const request:
            NewsSearchRequest = {
              sort:
                appliedSortMode.value,

              page:
                appliedPage.value,

              per_page:
                pageSize,
            }

          if (appliedQuery.value) {
            request.q =
              appliedQuery.value
          }

          if (
            appliedCategory.value
            !== 'all'
          ) {
            request.category =
              appliedCategory.value
          }

          if (
            appliedRegion.value
            !== 'all'
          ) {
            request.region =
              appliedRegion.value
          }

          if (
            appliedDateRange.value
            !== 'all'
          ) {
            request.date =
              appliedDateRange.value
          }

          /*
           * The search endpoint is used when
           * a keyword exists. Otherwise the
           * standard news endpoint is used.
           */

          const articleResponse =
            appliedQuery.value
              ? await newsApi.searchNews(
                  request,
                )
              : await newsApi.getNews(
                  request,
                )

          const [
            categoriesResult,
            tagsResult,
            mostReadResult,
          ] = await Promise.allSettled([
            newsApi.getCategories(),

            newsApi.getTags(),

            newsApi.getMostReadNews({
              limit: 6,
            }),
          ])

          const categories =
            categoriesResult.status
              === 'fulfilled'
              ? categoriesResult
                  .value.data
              : []

          const tags =
            tagsResult.status
              === 'fulfilled'
              ? tagsResult
                  .value.data
              : []

          const mostReadArticles =
            mostReadResult.status
              === 'fulfilled'
              ? mostReadResult
                  .value.data
              : []

          return {
            articles:
              articleResponse.data,

            meta:
              articleResponse.meta,

            categories,

            tags:
              [...tags].sort(
                (first, second) =>
                  second.articlesCount
                  - first.articlesCount,
              ),

            mostReadArticles:
              mostReadArticles.slice(
                0,
                6,
              ),
          }
        } catch (error: unknown) {
          const statusCode =
            resolveFetchStatus(error)

          throw createError({
            statusCode,

            statusMessage:
              statusCode === 404
                ? 'Search results not found'
                : 'Unable to search news',

            cause: error,
          })
        }
      }

    const {
      data,
      pending,
      error,
      refresh,
    } = await useAsyncData<
      NewsSearchPageData
    >(
      'news-search-page',
      loadSearchPage,
      {
        watch: [
          appliedQuery,
          appliedCategory,
          appliedRegion,
          appliedDateRange,
          appliedSortMode,
          appliedPage,
        ],
      },
    )

    /*
    |--------------------------------------------------------------------------
    | API result values
    |--------------------------------------------------------------------------
    */

    const paginatedArticles =
      computed<NewsArticle[]>(() => {
        return (
          data.value?.articles
          ?? []
        )
      })

    const categories = computed<
      NewsCategory[]
    >(() => {
      return (
        data.value?.categories
        ?? []
      )
    })

    const tags = computed<
      NewsTag[]
    >(() => {
      return (
        data.value?.tags
        ?? []
      )
    })

    const mostReadArticles =
      computed<NewsArticle[]>(() => {
        return (
          data.value
            ?.mostReadArticles
          ?? []
        )
      })

    const pagination = computed(() => {
      return data.value?.meta ?? null
    })

    const resultCount = computed(() => {
      return (
        pagination.value?.total
        ?? paginatedArticles
          .value.length
      )
    })

    const totalPages = computed(() => {
      return Math.max(
        1,
        pagination.value?.last_page
        ?? 1,
      )
    })

    /*
    |--------------------------------------------------------------------------
    | Options
    |--------------------------------------------------------------------------
    */

    const categoryOptions = computed<
      Array<
        Pick<
          NewsCategory,
          'slug' | 'name'
        >
      >
    >(() => {
      return [
        {
          slug: 'all',
          name: 'All categories',
        },

        ...categories.value.map(
          category => ({
            slug:
              category.slug,

            name:
              category.name,
          }),
        ),
      ]
    })

    /*
     * There is currently no separate
     * regions endpoint, so region options
     * are created from loaded results.
     */

    const regionOptions = computed<
      string[]
    >(() => {
      const regions = new Set<string>()

      paginatedArticles.value.forEach(
        article => {
          const articleRegion =
            article.region?.trim()

          if (articleRegion) {
            regions.add(
              articleRegion,
            )
          }
        },
      )

      if (
        selectedRegion.value
        && selectedRegion.value !== 'all'
      ) {
        regions.add(
          selectedRegion.value,
        )
      }

      return [
        'all',

        ...Array.from(regions).sort(
          (first, second) =>
            first.localeCompare(second),
        ),
      ]
    })

    /*
    |--------------------------------------------------------------------------
    | Trending tags
    |--------------------------------------------------------------------------
    */

    const searchTrendingTags =
      computed(() => {
        return tags.value
          .slice(0, 10)
          .map(tag => ({
            name:
              tag.name,

            count:
              tag.articlesCount,
          }))
      })

    /*
    |--------------------------------------------------------------------------
    | Active filters
    |--------------------------------------------------------------------------
    */

    const categoryLabel = computed(() => {
      return (
        categoryOptions.value.find(
          category =>
            category.slug
            === selectedCategory.value,
        )?.name
        || selectedCategory.value
      )
    })

    const dateLabel = computed(() => {
      const labels: Record<
        NewsSearchDateRange,
        string
      > = {
        all: 'Any date',
        '24h': 'Past 24 hours',
        '7d': 'Past 7 days',
        '30d': 'Past 30 days',
      }

      return labels[
        dateRange.value
      ]
    })

    const activeFilters =
      computed<
        NewsSearchFilter[]
      >(() => {
        const filters:
          NewsSearchFilter[] = []

        const cleanQuery =
          query.value.trim()

        if (cleanQuery) {
          filters.push({
            key: 'query',

            label:
              `Search: “${cleanQuery}”`,
          })
        }

        if (
          selectedCategory.value
          !== 'all'
        ) {
          filters.push({
            key: 'category',

            label:
              categoryLabel.value,
          })
        }

        if (
          selectedRegion.value
          !== 'all'
        ) {
          filters.push({
            key: 'region',

            label:
              selectedRegion.value,
          })
        }

        if (
          dateRange.value !== 'all'
        ) {
          filters.push({
            key: 'date',

            label:
              dateLabel.value,
          })
        }

        return filters
      })

    /*
    |--------------------------------------------------------------------------
    | URL construction
    |--------------------------------------------------------------------------
    */

    const buildRouteQuery = () => {
      const nextQuery:
        Record<string, string> = {}

      const cleanQuery =
        query.value.trim()

      if (cleanQuery) {
        nextQuery.q =
          cleanQuery
      }

      if (
        selectedCategory.value
        !== 'all'
      ) {
        nextQuery.category =
          selectedCategory.value
      }

      if (
        selectedRegion.value
        !== 'all'
      ) {
        nextQuery.region =
          selectedRegion.value
      }

      if (
        dateRange.value
        !== 'all'
      ) {
        nextQuery.date =
          dateRange.value
      }

      if (
        sortMode.value
        !== 'latest'
      ) {
        nextQuery.sort =
          sortMode.value
      }

      if (currentPage.value > 1) {
        nextQuery.page =
          String(
            currentPage.value,
          )
      }

      return nextQuery
    }

    let routeUpdateTimer:
      | ReturnType<typeof setTimeout>
      | null = null

    let syncingFromRoute = false

    const cancelScheduledUpdate =
      (): void => {
        if (!routeUpdateTimer) {
          return
        }

        clearTimeout(
          routeUpdateTimer,
        )

        routeUpdateTimer = null
      }

    const applySearch =
      async (): Promise<void> => {
        cancelScheduledUpdate()

        await router.push({
          path: '/news/search',

          query:
            buildRouteQuery(),
        })
      }

    const scheduleUrlUpdate =
      (): void => {
        if (syncingFromRoute) {
          return
        }

        cancelScheduledUpdate()

        routeUpdateTimer =
          setTimeout(() => {
            void router.replace({
              path:
                '/news/search',

              query:
                buildRouteQuery(),
            })

            routeUpdateTimer = null
          }, 350)
      }

    /*
    |--------------------------------------------------------------------------
    | Synchronize route back into controls
    |--------------------------------------------------------------------------
    */

    const syncStateFromRoute =
      async (): Promise<void> => {
        syncingFromRoute = true

        query.value =
          appliedQuery.value

        selectedCategory.value =
          appliedCategory.value

        selectedRegion.value =
          appliedRegion.value

        dateRange.value =
          appliedDateRange.value

        sortMode.value =
          appliedSortMode.value

        currentPage.value =
          appliedPage.value

        await nextTick()

        syncingFromRoute = false
      }

    watch(
      [
        appliedQuery,
        appliedCategory,
        appliedRegion,
        appliedDateRange,
        appliedSortMode,
        appliedPage,
      ],
      () => {
        void syncStateFromRoute()
      },
    )

    /*
    |--------------------------------------------------------------------------
    | Update route after filter changes
    |--------------------------------------------------------------------------
    */

    watch(
      [
        query,
        selectedCategory,
        selectedRegion,
        dateRange,
        sortMode,
      ],
      () => {
        if (syncingFromRoute) {
          return
        }

        currentPage.value = 1

        scheduleUrlUpdate()
      },
    )

    watch(
      currentPage,
      () => {
        if (syncingFromRoute) {
          return
        }

        scheduleUrlUpdate()
      },
    )

    /*
    |--------------------------------------------------------------------------
    | Actions
    |--------------------------------------------------------------------------
    */

    const changePage =
      async (
        nextPage: number,
      ): Promise<void> => {
        const safePage = Math.min(
          totalPages.value,
          Math.max(
            1,
            nextPage,
          ),
        )

        if (
          safePage
          === currentPage.value
        ) {
          return
        }

        currentPage.value =
          safePage

        await applySearch()

        if (import.meta.client) {
          document
            .getElementById(
              'search-results',
            )
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
        }
      }

    const removeFilter = (
      key: NewsSearchFilter['key'],
    ): void => {
      if (key === 'query') {
        query.value = ''
      }

      if (key === 'category') {
        selectedCategory.value =
          'all'
      }

      if (key === 'region') {
        selectedRegion.value =
          'all'
      }

      if (key === 'date') {
        dateRange.value =
          'all'
      }
    }

    const clearAllFilters =
      (): void => {
        query.value = ''

        selectedCategory.value =
          'all'

        selectedRegion.value =
          'all'

        dateRange.value =
          'all'

        sortMode.value =
          'latest'

        currentPage.value = 1
      }

    onBeforeUnmount(() => {
      cancelScheduledUpdate()
    })

    return {
      query,
      selectedCategory,
      selectedRegion,
      dateRange,
      sortMode,
      currentPage,

      categoryOptions,
      regionOptions,

      paginatedArticles,
      resultCount,
      totalPages,
      pagination,

      activeFilters,
      dateLabel,

      mostReadArticles,
      searchTrendingTags,

      pending,
      error,
      refresh,

      applySearch,
      changePage,
      removeFilter,
      clearAllFilters,
    }
  }