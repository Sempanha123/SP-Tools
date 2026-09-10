import type {
  ApiPaginationLinks,
  ApiPaginationMeta,
  NewsArticle,
  NewsCategory,
  NewsTag,
} from '~/types/news'

export type CategoryNewsSort =
  | 'latest'
  | 'oldest'
  | 'popular'

interface CategoryContext {
  type: 'category'
  slug: string
  name: string
  description?: string | null
}

interface CategoryPageData {
  articles: NewsArticle[]
  links: ApiPaginationLinks
  meta: ApiPaginationMeta

  context: CategoryContext | null
  categoryDetails: NewsCategory | null

  popularTags: NewsTag[]
  mostReadArticles: NewsArticle[]
}

interface CategoryFilterUpdates {
  q?: string | null
  region?: string | null
  sort?: CategoryNewsSort | null
  page?: number | null
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

const resolvePositiveInteger = (
  value: unknown,
  fallback = 1,
): number => {
  const rawValue =
    resolveRouteValue(value)

  const parsed =
    Number.parseInt(rawValue, 10)

  if (
    !Number.isFinite(parsed)
    || parsed < 1
  ) {
    return fallback
  }

  return parsed
}

const resolveCategorySort = (
  value: unknown,
): CategoryNewsSort => {
  const sort =
    resolveRouteValue(value)

  if (
    sort === 'oldest'
    || sort === 'popular'
  ) {
    return sort
  }

  return 'latest'
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
   CATEGORY PAGE
========================================================= */

export const useNewsCategoryPage =
  async () => {
    const route = useRoute()
    const router = useRouter()
    const newsApi = useNewsApi()

    const slug = computed(() => {
      return resolveRouteValue(
        route.params.slug,
      )
        .trim()
        .toLowerCase()
    })

    const page = computed(() => {
      return resolvePositiveInteger(
        route.query.page,
      )
    })

    const sort = computed(() => {
      return resolveCategorySort(
        route.query.sort,
      )
    })

    const searchQuery = computed(() => {
      return resolveRouteValue(
        route.query.q,
      ).trim()
    })

    const region = computed(() => {
      return resolveRouteValue(
        route.query.region,
      ).trim()
    })

    /* =======================================================
       LOAD DATA
    ======================================================= */

    const loadCategory =
      async (): Promise<CategoryPageData> => {
        if (!slug.value) {
          throw createError({
            statusCode: 404,
            statusMessage:
              'Category not found',
          })
        }

        try {
          /*
           * Category articles are required.
           * Other sidebar requests are optional,
           * so their failure will not break the page.
           */

          const categoryResponse =
            await newsApi.getCategoryNews(
              slug.value,
              {
                page: page.value,
                per_page: 12,
                sort: sort.value,

                q:
                  searchQuery.value
                  || undefined,

                region:
                  region.value
                  || undefined,
              },
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
              ? categoriesResult.value.data
              : []

          const tags =
            tagsResult.status
              === 'fulfilled'
              ? tagsResult.value.data
              : []

          const mostRead =
            mostReadResult.status
              === 'fulfilled'
              ? mostReadResult.value.data
              : []

          const categoryDetails =
            categories.find(
              item =>
                item.slug === slug.value,
            )
            ?? null

          const categoryContext:
            CategoryContext | null =
              categoryResponse.context?.type
                === 'category'
                ? {
                    type: 'category',

                    slug:
                      categoryResponse
                        .context.slug,

                    name:
                      categoryResponse
                        .context.name,

                    description:
                      categoryResponse
                        .context.description
                      ?? null,
                  }
                : null

          const popularTags =
            [...tags]
              .sort(
                (first, second) =>
                  second.articlesCount
                  - first.articlesCount,
              )
              .slice(0, 10)

          return {
            articles:
              categoryResponse.data,

            links:
              categoryResponse.links,

            meta:
              categoryResponse.meta,

            context:
              categoryContext,

            categoryDetails,

            popularTags,

            mostReadArticles:
              mostRead.slice(0, 6),
          }
        } catch (error: unknown) {
          const statusCode =
            resolveFetchStatus(error)

          throw createError({
            statusCode,

            statusMessage:
              statusCode === 404
                ? 'Category not found'
                : 'Unable to load category',

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
      CategoryPageData
    >(
      `news-category:${slug.value}`,
      loadCategory,
      {
        watch: [
          slug,
          page,
          sort,
          searchQuery,
          region,
        ],
      },
    )

    /* =======================================================
       PAGE DATA
    ======================================================= */

    const articles = computed(() => {
      return data.value?.articles ?? []
    })

    const featuredArticle = computed(() => {
      return articles.value[0] ?? null
    })

    const remainingArticles = computed(() => {
      return articles.value.slice(1)
    })

    const pagination = computed(() => {
      return data.value?.meta ?? null
    })

    const paginationLinks = computed(() => {
      return data.value?.links ?? null
    })

    const category = computed(() => {
      return data.value?.context ?? null
    })

    const categoryDetails = computed(() => {
      return (
        data.value?.categoryDetails
        ?? null
      )
    })

    const popularTags = computed(() => {
      return data.value?.popularTags ?? []
    })

    const mostReadArticles = computed(() => {
      return (
        data.value?.mostReadArticles
        ?? []
      )
    })

    const categoryName = computed(() => {
      return (
        categoryDetails.value?.name
        || category.value?.name
        || slug.value
          .replace(/-/g, ' ')
          .replace(
            /\b\w/g,
            character =>
              character.toUpperCase(),
          )
      )
    })

    const categoryDescription =
      computed(() => {
        return (
          categoryDetails.value
            ?.description
          || category.value
            ?.description
          || `Latest ${categoryName.value} news and updates.`
        )
      })

    /* =======================================================
       UPDATE FILTERS
    ======================================================= */

    const updateFilters = async (
      updates: CategoryFilterUpdates,
    ): Promise<void> => {
      const query: Record<
        string,
        string
      > = {}

      const currentSearch =
        updates.q !== undefined
          ? updates.q
          : searchQuery.value

      const currentRegion =
        updates.region !== undefined
          ? updates.region
          : region.value

      const currentSort =
        updates.sort !== undefined
          ? updates.sort
          : sort.value

      const currentPage =
        updates.page !== undefined
          ? updates.page
          : page.value

      const cleanSearch =
        currentSearch?.trim()

      const cleanRegion =
        currentRegion?.trim()

      if (cleanSearch) {
        query.q = cleanSearch
      }

      if (cleanRegion) {
        query.region = cleanRegion
      }

      if (
        currentSort
        && currentSort !== 'latest'
      ) {
        query.sort = currentSort
      }

      if (
        currentPage
        && currentPage > 1
      ) {
        query.page =
          String(currentPage)
      }

      await router.push({
        path: route.path,
        query,
      })
    }

    const applyFilters = async (
      filters: {
        q?: string
        region?: string
        sort?: CategoryNewsSort
      },
    ): Promise<void> => {
      await updateFilters({
        ...filters,
        page: 1,
      })
    }

    const goToPage = async (
      newPage: number,
    ): Promise<void> => {
      const lastPage =
        pagination.value?.last_page
        ?? 1

      const safePage = Math.min(
        lastPage,
        Math.max(1, newPage),
      )

      await updateFilters({
        page: safePage,
      })

      if (import.meta.client) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    }

    const clearFilters =
      async (): Promise<void> => {
        await router.push({
          path: route.path,
          query: {},
        })
      }

    return {
      slug,

      articles,
      featuredArticle,
      remainingArticles,

      category,
      categoryDetails,
      categoryName,
      categoryDescription,

      popularTags,
      mostReadArticles,

      pagination,
      paginationLinks,

      page,
      sort,
      searchQuery,
      region,

      pending,
      error,
      refresh,

      updateFilters,
      applyFilters,
      goToPage,
      clearFilters,
    }
  }