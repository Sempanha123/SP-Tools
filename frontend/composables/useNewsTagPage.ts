import type {
    ApiPaginationLinks,
    ApiPaginationMeta,
    NewsArticle,
    NewsTag,
} from '~/types/news'

export type TagNewsSort =
    | 'latest'
    | 'oldest'
    | 'popular'

interface TagContext {
    type: 'tag'
    slug: string
    name: string
    description?: string | null
}

interface TagPageData {
    articles: NewsArticle[]
    links: ApiPaginationLinks
    meta: ApiPaginationMeta
    context: TagContext | null

    relatedTags: NewsTag[]
    mostReadArticles: NewsArticle[]
}

interface TagFilterUpdates {
    q?: string | null
    region?: string | null
    sort?: TagNewsSort | null
    page?: number | null
}

const resolveRouteValue = (
  value: unknown,
): string => {
  if (Array.isArray(value)) {
    return value.find(
      (item): item is string =>
        typeof item === 'string',
    ) ?? ''
  }

  return typeof value === 'string'
    ? value
    : ''
}

const resolvePositiveInteger = (
    value: unknown,
    fallback = 1,
): number => {
    const parsed = Number.parseInt(
        String(value ?? ''),
        10,
    )

    if (
        !Number.isFinite(parsed)
        || parsed < 1
    ) {
        return fallback
    }

    return parsed
}

const resolveTagSort = (
    value: unknown,
): TagNewsSort => {
    const sort = resolveRouteValue(
        value as
        | string
        | string[]
        | null
        | undefined,
    )

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

export const useNewsTagPage =
    async () => {
        const route = useRoute()
        const router = useRouter()
        const newsApi = useNewsApi()

        const slug = computed(() =>
            resolveRouteValue(
                route.params.slug,
            ),
        )

        const page = computed(() =>
            resolvePositiveInteger(
                route.query.page,
            ),
        )

        const sort = computed(() =>
            resolveTagSort(
                route.query.sort,
            ),
        )

        const searchQuery = computed(() =>
            resolveRouteValue(
                route.query.q,
            ).trim(),
        )

        const region = computed(() =>
            resolveRouteValue(
                route.query.region,
            ).trim(),
        )

        const loadTagPage =
            async (): Promise<TagPageData> => {
                if (!slug.value) {
                    throw createError({
                        statusCode: 404,
                        statusMessage:
                            'Tag not found',
                    })
                }

                try {
                    const [
                        tagResponse,
                        tagsResponse,
                        mostReadResponse,
                    ] = await Promise.all([
                        newsApi.getTagNews(
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
                        ),

                        newsApi.getTags(),

                        newsApi.getMostReadNews({
                            limit: 6,
                        }),
                    ])

                    const relatedTags =
                        tagsResponse.data
                            .filter(
                                tag =>
                                    tag.slug !== slug.value,
                            )
                            .sort(
                                (first, second) =>
                                    second.articlesCount
                                    - first.articlesCount,
                            )
                            .slice(0, 10)

                    const tagContext: TagContext | null =
                        tagResponse.context?.type === 'tag'
                            ? {
                                type: 'tag',
                                slug: tagResponse.context.slug,
                                name: tagResponse.context.name,
                                description:
                                    tagResponse.context.description
                                    ?? null,
                            }
                            : null

                    return {
                        articles: tagResponse.data,
                        links: tagResponse.links,
                        meta: tagResponse.meta,

                        context: tagContext,

                        relatedTags,

                        mostReadArticles:
                            mostReadResponse.data.slice(0, 6),
                    }

                } catch (error: unknown) {
                    const statusCode =
                        resolveFetchStatus(error)

                    throw createError({
                        statusCode,
                        statusMessage:
                            statusCode === 404
                                ? 'Tag not found'
                                : 'Unable to load tag',
                        cause: error,
                    })
                }
            }

        const {
            data,
            pending,
            error,
            refresh,
        } = await useAsyncData<TagPageData>(
            `news-tag:${slug.value}`,
            loadTagPage,
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

        const articles = computed(
            () =>
                data.value?.articles
                ?? [],
        )

        const leadArticle = computed(
            () =>
                articles.value[0]
                ?? null,
        )

        const remainingArticles = computed(
            () =>
                articles.value.slice(1),
        )

        const pagination = computed(
            () =>
                data.value?.meta
                ?? null,
        )

        const paginationLinks = computed(
            () =>
                data.value?.links
                ?? null,
        )

        const tag = computed(
            () =>
                data.value?.context
                ?? null,
        )

        const relatedTags = computed(
            () =>
                data.value?.relatedTags
                ?? [],
        )

        const mostReadArticles = computed(
            () =>
                data.value?.mostReadArticles
                ?? [],
        )

        const tagName = computed(() => {
            if (tag.value?.name) {
                return tag.value.name
            }

            return slug.value
                .replace(/-/g, ' ')
                .replace(
                    /\b\w/g,
                    character =>
                        character.toUpperCase(),
                )
        })

        const tagDescription = computed(
            () =>
                tag.value?.description
                ?? `Latest news, reports, and analysis related to ${tagName.value}.`,
        )

        const updateFilters = async (
            updates: TagFilterUpdates,
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
                sort?: TagNewsSort
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
                pagination.value
                    ?.last_page
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

            tag,
            tagName,
            tagDescription,

            articles,
            leadArticle,
            remainingArticles,

            relatedTags,
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