import type {
  ApiPaginationMeta,
  NewsArticle,
  NewsAuthor,
  NewsAuthorContext,
} from '~/types/news'

interface AuthorPageData {
  author: NewsAuthor
  articles: NewsArticle[]
  popularArticles: NewsArticle[]
  meta: ApiPaginationMeta
}

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

const normalizeAuthor = (
  context:
    | NewsAuthorContext
    | null
    | undefined,
): NewsAuthor | null => {
  if (
    !context
    || context.type !== 'author'
  ) {
    return null
  }

  return {
    id: context.id,
    slug: context.slug,
    name: context.name,

    bio: context.bio ?? null,
    avatar: context.avatar ?? null,
    location: context.location ?? null,
    role: context.role ?? null,

    verified:
      Boolean(context.verified),

    joinedAt:
      context.joinedAt ?? null,

    latestPublishedAt:
      context.latestPublishedAt
      ?? null,

    articlesCount:
      Number(
        context.articlesCount
        ?? 0,
      ),

    totalViews:
      Number(
        context.totalViews
        ?? 0,
      ),

    categories:
      context.categories ?? [],

    regions:
      context.regions ?? [],
  }
}

export const useNewsAuthorPage =
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
      return resolvePageNumber(
        route.query.page,
      )
    })

    const loadAuthorPage =
      async (): Promise<AuthorPageData> => {
        if (!slug.value) {
          throw createError({
            statusCode: 404,
            statusMessage:
              'News author not found',
          })
        }

        try {
          const [
            authorResponse,
            popularResponse,
          ] = await Promise.all([
            newsApi.getAuthorNews(
              slug.value,
              {
                page: page.value,
                per_page: 9,
                sort: 'latest',
              },
            ),

            newsApi
              .getAuthorNews(
                slug.value,
                {
                  page: 1,
                  per_page: 5,
                  sort: 'popular',
                },
              )
              .catch(() => null),
          ])

          const author =
            normalizeAuthor(
              authorResponse.context,
            )

          if (!author) {
            throw createError({
              statusCode: 404,
              statusMessage:
                'News author not found',
            })
          }

          return {
            author,

            articles:
              authorResponse.data,

            popularArticles:
              popularResponse?.data
              ?? [],

            meta:
              authorResponse.meta,
          }
        } catch (error: unknown) {
          const statusCode =
            resolveFetchStatus(error)

          throw createError({
            statusCode,

            statusMessage:
              statusCode === 404
                ? 'News author not found'
                : 'Unable to load author',

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
      AuthorPageData
    >(
      `news-author:${slug.value}`,
      loadAuthorPage,
      {
        watch: [
          slug,
          page,
        ],
      },
    )

    const author = computed(() => {
      return data.value?.author
        ?? null
    })

    const articles = computed(() => {
      return data.value?.articles
        ?? []
    })

    const featuredArticle =
      computed(() => {
        if (page.value !== 1) {
          return null
        }

        return articles.value[0]
          ?? null
      })

    const remainingArticles =
      computed(() => {
        if (page.value !== 1) {
          return articles.value
        }

        return articles.value.slice(1)
      })

    const popularArticles =
      computed(() => {
        const featuredId =
          featuredArticle.value?.id

        return (
          data.value
            ?.popularArticles
          ?? []
        )
          .filter(
            article =>
              article.id !== featuredId,
          )
          .slice(0, 5)
      })

    const pagination = computed(() => {
      return data.value?.meta
        ?? null
    })

    const totalPages = computed(() => {
      return (
        pagination.value?.last_page
        ?? 1
      )
    })

    const goToPage = async (
      nextPage: number,
    ): Promise<void> => {
      const safePage = Math.min(
        totalPages.value,
        Math.max(1, nextPage),
      )

      await router.push({
        path: route.path,

        query:
          safePage > 1
            ? {
                page:
                  String(safePage),
              }
            : {},
      })

      if (import.meta.client) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    }

    return {
      slug,
      page,

      author,
      articles,
      featuredArticle,
      remainingArticles,
      popularArticles,

      pagination,
      totalPages,

      pending,
      error,
      refresh,

      goToPage,
    }
  }