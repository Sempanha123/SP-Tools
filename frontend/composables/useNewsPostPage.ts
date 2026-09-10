import type {
  NewsArticle,
} from '~/types/news'

interface NewsPostPageData {
  article: NewsArticle
  relatedArticles: NewsArticle[]
  mostReadArticles: NewsArticle[]
}

const resolveRouteSlug = (
  value: string | string[] | undefined,
): string => {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return value ?? ''
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

export const useNewsPostPage = async () => {
  const route = useRoute()
  const newsApi = useNewsApi()

  const slug = computed(() =>
    resolveRouteSlug(
      route.params.slug,
    ),
  )

  const loadPost =
    async (): Promise<NewsPostPageData> => {
      if (!slug.value) {
        throw createError({
          statusCode: 404,
          statusMessage:
            'Article not found',
        })
      }

      try {
        const articleResponse =
          await newsApi.getArticle(
            slug.value,
          )

        const article =
          articleResponse.data

        const [
          relatedResponse,
          mostReadResponse,
        ] = await Promise.all([
          newsApi.getNews({
            category:
              article.category,

            sort: 'latest',
            per_page: 8,
          }),

          newsApi.getMostReadNews({
            limit: 6,
          }),
        ])

        const relatedArticles =
          relatedResponse.data
            .filter(
              item =>
                item.id !== article.id,
            )
            .slice(0, 6)

        const mostReadArticles =
          mostReadResponse.data
            .filter(
              item =>
                item.id !== article.id,
            )
            .slice(0, 5)

        return {
          article,
          relatedArticles,
          mostReadArticles,
        }
      } catch (error: unknown) {
        const statusCode =
          resolveFetchStatus(error)

        throw createError({
          statusCode,
          statusMessage:
            statusCode === 404
              ? 'Article not found'
              : 'Unable to load article',
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
    NewsPostPageData
  >(
    `news-post:${slug.value}`,
    loadPost,
    {
      watch: [
        slug,
      ],
    },
  )

  const article = computed(
    () => data.value?.article ?? null,
  )

  const relatedArticles = computed(
    () =>
      data.value?.relatedArticles
      ?? [],
  )

  const mostReadArticles = computed(
    () =>
      data.value?.mostReadArticles
      ?? [],
  )

  return {
    slug,

    article,
    relatedArticles,
    mostReadArticles,

    pending,
    error,
    refresh,
  }
}