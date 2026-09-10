import type {
    ApiCollectionResponse,
    ApiItemResponse,
    ApiPaginatedResponse,
    NewsArticle,
    NewsCategory,
    NewsTag,
    AuthorNewsResponse,
} from '~/types/news'

export type NewsSort =
    | 'latest'
    | 'oldest'
    | 'popular'

export interface NewsListQuery {
    q?: string

    category?: string
    tag?: string
    region?: string

    date?: '24h' | '7d' | '30d'

    sort?: NewsSort

    featured?: boolean
    breaking?: boolean
    live?: boolean

    per_page?: number
    page?: number
}




export interface LimitedNewsQuery {
    limit?: number
}

export interface NewsAuthorCategory {
    id: number
    name: string
    slug: string
}

export interface NewsAuthor {
    id: number
    slug: string
    name: string

    bio: string | null
    avatar: string | null
    location: string | null
    role: string | null

    verified: boolean

    joinedAt: string | null
    latestPublishedAt: string | null

    articlesCount: number
    totalViews: number

    categories: NewsAuthorCategory[]
    regions: string[]
}

export interface NewsAuthorContext
    extends NewsAuthor {
    type: 'author'
}

export const useNewsApi = () => {
    const config = useRuntimeConfig()

    const baseURL = String(
        config.public.newsApiBase,
    ).replace(/\/+$/, '')

    const getNews = (
        query: NewsListQuery = {},
    ) => {
        return $fetch<
            ApiPaginatedResponse<NewsArticle>
        >('/news', {
            baseURL,
            query,
        })
    }

    const searchNews = (
        query: NewsListQuery = {},
    ) => {
        return $fetch<
            ApiPaginatedResponse<NewsArticle>
        >('/news/search', {
            baseURL,
            query,
        })
    }

    const getArticle = (
        slug: string,
    ) => {
        return $fetch<
            ApiItemResponse<NewsArticle>
        >(
            `/news/${encodeURIComponent(slug)}`,
            {
                baseURL,
            },
        )
    }

    const getFeaturedNews = (
        query: LimitedNewsQuery = {},
    ) => {
        return $fetch<
            ApiCollectionResponse<NewsArticle>
        >('/news/featured', {
            baseURL,
            query,
        })
    }

    const getBreakingNews = (
        query: LimitedNewsQuery = {},
    ) => {
        return $fetch<
            ApiCollectionResponse<NewsArticle>
        >('/news/breaking', {
            baseURL,
            query,
        })
    }

    const getMostReadNews = (
        query: LimitedNewsQuery = {},
    ) => {
        return $fetch<
            ApiCollectionResponse<NewsArticle>
        >('/news/most-read', {
            baseURL,
            query,
        })
    }

    const getCategories = () => {
        return $fetch<
            ApiCollectionResponse<NewsCategory>
        >('/categories', {
            baseURL,
        })
    }

    const getCategoryNews = (
        slug: string,
        query: NewsListQuery = {},
    ) => {
        return $fetch<
            ApiPaginatedResponse<NewsArticle>
        >(
            `/categories/${encodeURIComponent(slug)}/news`,
            {
                baseURL,
                query,
            },
        )
    }

    const getTags = () => {
        return $fetch<
            ApiCollectionResponse<NewsTag>
        >('/tags', {
            baseURL,
        })
    }

    const getTagNews = (
        slug: string,
        query: NewsListQuery = {},
    ) => {
        return $fetch<
            ApiPaginatedResponse<NewsArticle>
        >(
            `/tags/${encodeURIComponent(slug)}/news`,
            {
                baseURL,
                query,
            },
        )
    }

    const getAuthorNews = (
        slug: string,
        query: NewsListQuery = {},
    ) => {
        return $fetch<AuthorNewsResponse>(
            `/authors/${encodeURIComponent(
                slug,
            )}/news`,
            {
                baseURL,
                query,
            },
        )
    }





    return {
        baseURL,

        getNews,
        searchNews,
        getArticle,

        getFeaturedNews,
        getBreakingNews,
        getMostReadNews,

        getCategories,
        getCategoryNews,

        getTags,
        getTagNews,

        getAuthorNews,
    }
}