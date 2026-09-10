import type {
  NewsArticle,
  NewsCategory,
  NewsTag,
} from '~/types/news'

interface NewsHomeData {
  latest: NewsArticle[]
  featured: NewsArticle[]
  breaking: NewsArticle[]
  mostRead: NewsArticle[]

  categories: NewsCategory[]
  tags: NewsTag[]
}

const createEmptyHomeData =
  (): NewsHomeData => ({
    latest: [],
    featured: [],
    breaking: [],
    mostRead: [],

    categories: [],
    tags: [],
  })

const resolveErrorMessage = (
  error: unknown,
): string => {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unable to load news from the server.'
}

export const useNewsData = () => {
  const newsApi = useNewsApi()

  const homeData =
    useState<NewsHomeData>(
      'news-home-data',
      createEmptyHomeData,
    )

  const isLoading =
    useState<boolean>(
      'news-home-loading',
      () => false,
    )

  const isLoaded =
    useState<boolean>(
      'news-home-loaded',
      () => false,
    )

  const errorMessage =
    useState<string | null>(
      'news-home-error',
      () => null,
    )

  /*
  |--------------------------------------------------------------------------
  | Load homepage data
  |--------------------------------------------------------------------------
  */

  const loadHomeNews = async (
    force = false,
  ): Promise<void> => {
    if (
      isLoaded.value &&
      !force
    ) {
      return
    }

    if (isLoading.value) {
      return
    }

    isLoading.value = true
    errorMessage.value = null

    try {
      const [
        latestResponse,
        featuredResponse,
        breakingResponse,
        mostReadResponse,
        categoryResponse,
        tagResponse,
      ] = await Promise.all([
        newsApi.getNews({
          sort: 'latest',
          per_page: 24,
        }),

        newsApi.getFeaturedNews({
          limit: 4,
        }),

        newsApi.getBreakingNews({
          limit: 6,
        }),

        newsApi.getMostReadNews({
          limit: 6,
        }),

        newsApi.getCategories(),

        newsApi.getTags(),
      ])

      homeData.value = {
        latest:
          latestResponse.data,

        featured:
          featuredResponse.data,

        breaking:
          breakingResponse.data,

        mostRead:
          mostReadResponse.data,

        categories:
          categoryResponse.data,

        tags:
          tagResponse.data,
      }

      isLoaded.value = true
    } catch (error: unknown) {
      errorMessage.value =
        resolveErrorMessage(error)

      if (!isLoaded.value) {
        homeData.value =
          createEmptyHomeData()
      }

      console.error(
        'Failed to load homepage news:',
        error,
      )
    } finally {
      isLoading.value = false
    }
  }

  const refreshHomeNews =
    async (): Promise<void> => {
      await loadHomeNews(true)
    }

  /*
  |--------------------------------------------------------------------------
  | Article collections
  |--------------------------------------------------------------------------
  */

  const articles = computed(
    () => homeData.value.latest,
  )

  const latestArticles = computed(
    () => homeData.value.latest,
  )

  const featuredArticles = computed(
    () => homeData.value.featured,
  )

  const breakingArticles = computed(
    () => homeData.value.breaking,
  )

  const mostReadArticles = computed(
    () => homeData.value.mostRead,
  )

  const trendingArticles =
    mostReadArticles

  /*
  |--------------------------------------------------------------------------
  | Categories and tags
  |--------------------------------------------------------------------------
  */

  const categories = computed(
    () => homeData.value.categories,
  )

  const tags = computed(
    () => homeData.value.tags,
  )

  const trendingTags = computed(() => {
    return [...tags.value]
      .sort(
        (first, second) =>
          second.articlesCount -
          first.articlesCount,
      )
      .slice(0, 10)
      .map(tag => ({
        ...tag,
        count: tag.articlesCount,
      }))
  })

  const regions = computed(() => {
    return Array.from(
      new Set(
        articles.value
          .map(article => article.region)
          .filter(Boolean),
      ),
    ).sort()
  })

  const getArticleBySlug = (
    slug: string,
  ): NewsArticle | undefined => {
    const availableArticles = [
      ...articles.value,
      ...featuredArticles.value,
      ...breakingArticles.value,
      ...mostReadArticles.value,
    ]

    return availableArticles.find(
      article =>
        article.slug === slug,
    )
  }

  const getArticlesByCategory = (
    categorySlug: string,
  ): NewsArticle[] => {
    return articles.value.filter(
      article =>
        article.category ===
        categorySlug,
    )
  }

  const getCategoryBySlug = (
    slug: string,
  ): NewsCategory | undefined => {
    return categories.value.find(
      category =>
        category.slug === slug,
    )
  }


  const timeAgo = (
    value: string | Date | null | undefined,
  ): string => {
    if (!value) {
      return 'Unknown date'
    }

    const date =
      value instanceof Date
        ? value
        : new Date(value)

    if (Number.isNaN(date.getTime())) {
      return 'Unknown date'
    }

    const seconds = Math.round(
      (date.getTime() - Date.now()) / 1000,
    )

    const absoluteSeconds = Math.abs(seconds)

    const formatter =
      new Intl.RelativeTimeFormat('en-US', {
        numeric: 'auto',
      })

    if (absoluteSeconds < 60) {
      return formatter.format(
        seconds,
        'second',
      )
    }

    const minutes = Math.round(
      seconds / 60,
    )

    if (Math.abs(minutes) < 60) {
      return formatter.format(
        minutes,
        'minute',
      )
    }

    const hours = Math.round(
      minutes / 60,
    )

    if (Math.abs(hours) < 24) {
      return formatter.format(
        hours,
        'hour',
      )
    }

    const days = Math.round(
      hours / 24,
    )

    if (Math.abs(days) < 30) {
      return formatter.format(
        days,
        'day',
      )
    }

    const months = Math.round(
      days / 30,
    )

    if (Math.abs(months) < 12) {
      return formatter.format(
        months,
        'month',
      )
    }

    const years = Math.round(
      days / 365,
    )

    return formatter.format(
      years,
      'year',
    )
  }

  const formatViews = (
    value: number | null | undefined,
  ): string => {
    const views = Math.max(
      0,
      Number(value ?? 0),
    )

    return new Intl.NumberFormat(
      'en-US',
      {
        notation: 'compact',
        maximumFractionDigits: 1,
      },
    ).format(views)
  }

  const categoryClassMap: Record< string, string > = {
    world:
      'bg-indigo-100 text-indigo-700',

    asia:
      'bg-red-100 text-red-700',

    americas:
      'bg-blue-100 text-blue-700',

    europe:
      'bg-violet-100 text-violet-700',

    'middle-east':
      'bg-amber-100 text-amber-800',

    business:
      'bg-emerald-100 text-emerald-700',

    technology:
      'bg-cyan-100 text-cyan-700',

    science:
      'bg-purple-100 text-purple-700',

    climate:
      'bg-green-100 text-green-700',

    health:
      'bg-rose-100 text-rose-700',
  }

  const getCategoryClasses = (
    category: string | null | undefined,
  ): string => {
    const normalizedCategory = String(
      category ?? '',
    )
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')

    return (
      categoryClassMap[
      normalizedCategory
      ] ??
      'bg-slate-100 text-slate-700'
    )
  }

  const parseNewsDate = (
    value: string | Date | null | undefined,
  ): Date | null => {
    if (!value) {
      return null
    }

    const date = value instanceof Date
      ? value
      : new Date(value)

    if (Number.isNaN(date.getTime())) {
      return null
    }

    return date
  }

  const formatDate = (
    value: string | Date | null | undefined,
  ): string => {
    const date = parseNewsDate(value)

    if (!date) {
      return 'Unknown date'
    }

    return new Intl.DateTimeFormat(
      'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
    ).format(date)
  }

  const formatDateTime = (
    value: string | Date | null | undefined,
  ): string => {
    const date = parseNewsDate(value)

    if (!date) {
      return 'Unknown date'
    }

    return new Intl.DateTimeFormat(
      'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      },
    ).format(date)
  }

  return {
    articles,
    latestArticles,

    featuredArticles,
    breakingArticles,
    mostReadArticles,
    trendingArticles,

    categories,
    tags,
    trendingTags,
    regions,

    isLoading,
    isLoaded,
    errorMessage,

    loadHomeNews,
    refreshHomeNews,

    getArticleBySlug,
    getArticlesByCategory,
    getCategoryBySlug,

    timeAgo,
    formatViews,
    getCategoryClasses,

    formatDate,
    formatDateTime,

  }
}