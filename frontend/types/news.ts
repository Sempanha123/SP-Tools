export interface NewsArticleSection {
  id?: string
  title: string
  paragraphs: string[]

  bullets?: string[]
  quote?: string | null
  quoteAttribution?: string | null
  note?: string | null

  image?: string | null
  imageAlt?: string | null
  imageCaption?: string | null
  imageCredit?: string | null
  imagePosition?: 'before' | 'after'
}

export interface NewsArticleTimelineItem {
  time?: string | null
  title: string
  description: string
}

export interface NewsArticleSource {
  name: string
  type?: string | null
  description?: string | null
  url?: string | null
}

export interface NewsArticle {
  id: number

  slug: string
  title: string
  excerpt: string
  lead?: string | null

  image: string | null
  imageCaption?: string | null
  imageCredit?: string | null

  category: string
  categoryName: string

  region: string
  location?: string | null

  author: string
  authorSlug?: string | null

  source: string

  publishedAt: string
  updatedAt?: string | null

  readTime: string
  readTimeMinutes: number

  views: number

  isFeatured: boolean
  isBreaking: boolean
  isLive: boolean

  tags: string[]
  tagSlugs?: string[]

  sections?: NewsArticleSection[]
  keyPoints?: string[]
  timeline?: NewsArticleTimelineItem[]
  sources?: NewsArticleSource[]

  methodologyNote?: string | null
  correctionNote?: string | null

  metaTitle?: string | null
  metaDescription?: string | null
  canonicalUrl?: string | null
}

export interface NewsCategory {
  id: number

  name: string
  slug: string

  description?: string | null
  icon?: string | null
  color?: string | null

  isActive: boolean
  sortOrder: number
  articlesCount: number
}

export interface NewsTag {
  id: number

  name: string
  slug: string

  description?: string | null
  articlesCount: number
}

export interface ApiItemResponse<T> {
  data: T
}

export interface ApiCollectionResponse<T> {
  data: T[]

  meta?: {
    limit?: number
    [key: string]: unknown
  }

  context?: {
    type: 'category' | 'tag'
    slug: string
    name: string
    description?: string | null
  }
}

export interface ApiPaginationLinks {
  first: string
  last: string
  prev: string | null
  next: string | null
}

export interface ApiPaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface ApiPaginatedResponse<T> {
  data: T[]
  links: ApiPaginationLinks
  meta: ApiPaginationMeta

  context?: {
    type: 'category' | 'tag'
    slug: string
    name: string
    description?: string | null
  }
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

export interface AuthorNewsResponse {
  data: NewsArticle[]
  links: ApiPaginationLinks
  meta: ApiPaginationMeta
  context: NewsAuthorContext | null
}
