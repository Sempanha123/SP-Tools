<script setup lang="ts">
import type {
  NewsArticle,
  NewsArticleSource,
  NewsArticleTimelineItem,
} from '~/types/news'

interface Props {
  article: NewsArticle
  mostRead: NewsArticle[]
}

const props = defineProps<Props>()

const {
  timeAgo,
  formatViews,
} = useNewsData()

/* =========================================================
   SAFE ARTICLE VALUES
========================================================= */

const articleSources = computed<
  NewsArticleSource[]
>(() => {
  return props.article.sources ?? []
})

const articleTimeline = computed<
  NewsArticleTimelineItem[]
>(() => {
  return props.article.timeline ?? []
})

const articleKeyPoints = computed<string[]>(() => {
  return (props.article.keyPoints ?? [])
    .filter(
      (point): point is string =>
        typeof point === 'string'
        && point.trim().length > 0,
    )
    .map(point => point.trim())
})

const articleLead = computed(() => {
  return props.article.lead?.trim() || ''
})

const articleLocation = computed(() => {
  return props.article.location?.trim() || ''
})

const methodologyNote = computed(() => {
  return (
    props.article.methodologyNote?.trim()
    || ''
  )
})

const correctionNote = computed(() => {
  return (
    props.article.correctionNote?.trim()
    || ''
  )
})

/* =========================================================
   HELPERS
========================================================= */

const slugify = (
  value: string,
): string => {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const formatArticleDate = (
  value:
    | string
    | null
    | undefined,
): string => {
  if (!value) {
    return 'Not available'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  ).format(date)
}

const formattedPublishedDate = computed(() => {
  return formatArticleDate(
    props.article.publishedAt,
  )
})

const formattedUpdatedDate = computed(() => {
  return formatArticleDate(
    props.article.updatedAt
    || props.article.publishedAt,
  )
})

/* =========================================================
   TABLE OF CONTENTS
========================================================= */

interface TableOfContentsItem {
  id: string
  title: string
}

const tableOfContents = computed<
  TableOfContentsItem[]
>(() => {
  const result: TableOfContentsItem[] = []

  const sections =
    props.article.sections ?? []

  if (sections.length) {
    sections.forEach(
      (section, index) => {
        const title =
          section.title?.trim()
          || `Section ${index + 1}`

        result.push({
          id:
            section.id?.trim()
            || slugify(title)
            || `article-section-${index + 1}`,

          title,
        })
      },
    )
  } else {
    /*
     * ArticleBody.vue uses this ID when the
     * structured sections are unavailable.
     */
    result.push({
      id: 'article-summary',
      title: 'Article summary',
    })
  }

  if (articleKeyPoints.value.length) {
    result.splice(
      Math.min(2, result.length),
      0,
      {
        id: 'key-points',
        title: 'Key points',
      },
    )
  }

  if (articleTimeline.value.length) {
    result.push({
      id: 'story-timeline',
      title: 'Story timeline',
    })
  }

  if (articleSources.value.length) {
    result.push({
      id: 'article-sources',
      title: 'Sources used',
    })
  }

  result.push({
    id: 'reporting-transparency',
    title: 'About this report',
  })

  return result
})

const activeSectionId = ref('')

let sectionObserver:
  IntersectionObserver | null = null

const initializeSectionObserver =
  async (): Promise<void> => {
    if (!import.meta.client) {
      return
    }

    await nextTick()

    sectionObserver?.disconnect()

    const firstItem =
      tableOfContents.value[0]

    if (
      firstItem
      && !activeSectionId.value
    ) {
      activeSectionId.value =
        firstItem.id
    }

    sectionObserver =
      new IntersectionObserver(
        entries => {
          const visibleEntries =
            entries
              .filter(
                entry =>
                  entry.isIntersecting,
              )
              .sort(
                (first, second) =>
                  first
                    .boundingClientRect
                    .top
                  - second
                    .boundingClientRect
                    .top,
              )

          const activeEntry =
            visibleEntries[0]

          if (activeEntry?.target.id) {
            activeSectionId.value =
              activeEntry.target.id
          }
        },
        {
          rootMargin:
            '-145px 0px -68% 0px',

          threshold: [
            0,
            0.1,
            0.25,
            0.5,
          ],
        },
      )

    tableOfContents.value.forEach(
      item => {
        const element =
          document.getElementById(
            item.id,
          )

        if (element) {
          sectionObserver?.observe(
            element,
          )
        }
      },
    )
  }

const scrollToSection = (
  sectionId: string,
): void => {
  if (!import.meta.client) {
    return
  }

  const element =
    document.getElementById(
      sectionId,
    )

  if (!element) {
    return
  }

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })

  activeSectionId.value =
    sectionId

  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}`
    + `${window.location.search}`
    + `#${sectionId}`,
  )
}

/* =========================================================
   ARTICLE ACTIONS
========================================================= */

const toastMessage = ref('')
const showToast = ref(false)

let toastTimer:
  | ReturnType<typeof setTimeout>
  | null = null

const showMessage = (
  message: string,
): void => {
  toastMessage.value = message
  showToast.value = true

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toastTimer = setTimeout(() => {
    showToast.value = false
    toastMessage.value = ''
  }, 2400)
}

const copyArticleLink =
  async (): Promise<void> => {
    if (!import.meta.client) {
      return
    }

    try {
      await navigator.clipboard.writeText(
        window.location.href,
      )

      showMessage(
        'Article link copied',
      )
    } catch {
      showMessage(
        'Unable to copy the link',
      )
    }
  }

const shareArticle =
  async (): Promise<void> => {
    if (!import.meta.client) {
      return
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title:
            props.article.title,

          text:
            props.article.excerpt,

          url:
            window.location.href,
        })

        return
      } catch (error: unknown) {
        if (
          error instanceof DOMException
          && error.name === 'AbortError'
        ) {
          return
        }
      }
    }

    await copyArticleLink()
  }

const printArticle = (): void => {
  if (!import.meta.client) {
    return
  }

  window.print()
}

/* =========================================================
   MOST READ
========================================================= */

const visibleMostRead = computed<
  NewsArticle[]
>(() => {
  return props.mostRead
    .filter(
      item =>
        item.id !== props.article.id,
    )
    .slice(0, 5)
})

/* =========================================================
   SOURCE INFORMATION
========================================================= */

const sourceCount = computed(() => {
  return articleSources.value.length
})

const sourceStatusLabel = computed(() => {
  if (sourceCount.value > 1) {
    return `${sourceCount.value} listed sources`
  }

  if (sourceCount.value === 1) {
    return '1 listed source'
  }

  return 'No additional sources listed'
})

/* =========================================================
   NEWSLETTER
========================================================= */

const email = ref('')
const newsletterMessage = ref('')
const newsletterSuccess = ref(false)
const newsletterLoading = ref(false)

const isValidEmail = (
  value: string,
): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value,
  )
}

const subscribeToNewsletter =
  async (): Promise<void> => {
    const cleanEmail =
      email.value
        .trim()
        .toLowerCase()

    newsletterMessage.value = ''
    newsletterSuccess.value = false

    if (!cleanEmail) {
      newsletterMessage.value =
        'Enter your email address.'

      return
    }

    if (!isValidEmail(cleanEmail)) {
      newsletterMessage.value =
        'Enter a valid email address.'

      return
    }

    if (!import.meta.client) {
      return
    }

    newsletterLoading.value = true

    try {
      await new Promise<void>(
        resolve => {
          window.setTimeout(
            resolve,
            500,
          )
        },
      )

      const storageKey =
        'sp-tools-newsletter-emails'

      const existingValue =
        localStorage.getItem(
          storageKey,
        )

      let existingEmails:
        string[] = []

      if (existingValue) {
        try {
          const parsedValue:
            unknown = JSON.parse(
              existingValue,
            )

          existingEmails =
            Array.isArray(
              parsedValue,
            )
              ? parsedValue.filter(
                (
                  item,
                ): item is string =>
                  typeof item
                  === 'string',
              )
              : []
        } catch {
          existingEmails = []
        }
      }

      if (
        existingEmails.includes(
          cleanEmail,
        )
      ) {
        newsletterMessage.value =
          'This email is already subscribed.'

        newsletterSuccess.value = true
        return
      }

      existingEmails.push(
        cleanEmail,
      )

      localStorage.setItem(
        storageKey,
        JSON.stringify(
          existingEmails,
        ),
      )

      newsletterMessage.value =
        'You are subscribed to the daily briefing.'

      newsletterSuccess.value = true
      email.value = ''
    } catch {
      newsletterMessage.value =
        'Subscription could not be saved.'
    } finally {
      newsletterLoading.value = false
    }
  }

/* =========================================================
   LIFECYCLE
========================================================= */

watch(
  () => props.article.slug,
  async () => {
    activeSectionId.value =
      tableOfContents.value[0]?.id
      ?? ''

    await initializeSectionObserver()
  },
)

watch(
  tableOfContents,
  async items => {
    activeSectionId.value =
      items[0]?.id ?? ''

    await initializeSectionObserver()
  },
  {
    deep: true,
  },
)

onMounted(async () => {
  activeSectionId.value =
    tableOfContents.value[0]?.id
    ?? ''

  await initializeSectionObserver()
})

onBeforeUnmount(() => {
  sectionObserver?.disconnect()

  if (toastTimer) {
    clearTimeout(toastTimer)
  }
})
</script>

<template>
  <aside class="min-w-0 space-y-6
    lg:sticky lg:top-36">
    <!-- ===================================================== -->
    <!-- ARTICLE CONTENTS -->
    <!-- ===================================================== -->

    <section class="overflow-hidden rounded-[28px]
      border border-line bg-surface
      shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <header class="flex items-start
        justify-between gap-4
        border-b border-line
        px-6 py-5">
        <div>
          <p class="text-[9px] font-bold
            uppercase tracking-[0.18em]
            text-indigo-600">
            In this story
          </p>

          <h2 class="mt-2 text-xl font-bold
            tracking-[-0.03em]
            text-fg">
            Article contents
          </h2>

          <p class="mt-2 text-xs
            leading-5 text-fg-subtle">
            Jump directly to a section.
          </p>
        </div>

        <div class="flex h-10 w-10
          shrink-0 items-center
          justify-center rounded-xl
          bg-indigo-50 text-indigo-600">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path d="M8 6h13" />
            <path d="M8 12h13" />
            <path d="M8 18h13" />
            <path d="M3 6h.01" />
            <path d="M3 12h.01" />
            <path d="M3 18h.01" />
          </svg>
        </div>
      </header>

      <nav aria-label="Article contents" class="p-3">
        <button v-for="(item, index) in tableOfContents" :key="item.id" type="button" class="group relative flex
          w-full items-center gap-3
          rounded-2xl px-3 py-3
          text-left transition-all" :class="activeSectionId === item.id
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-fg-subtle hover:bg-surface-2 hover:text-fg'
            " @click="scrollToSection(item.id)">
          <span class="flex h-7 min-w-7
            items-center justify-center
            rounded-xl text-[8px]
            font-bold transition-colors" :class="activeSectionId === item.id
              ? 'bg-indigo-600 text-white'
              : 'bg-surface-2 text-fg-subtle group-hover:bg-surface'
              ">
            {{
              String(index + 1)
                .padStart(2, '0')
            }}
          </span>

          <span class="min-w-0 flex-1
            text-[10px] font-semibold
            leading-5">
            {{ item.title }}
          </span>

          <span class="text-xs transition-transform
            group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </nav>

      <div class="border-t
        border-line px-5 py-4">
        <div class="flex items-center
          justify-between gap-4">
          <span class="text-[9px]
            font-semibold text-fg-subtle">
            Reading time
          </span>

          <span class="rounded-full
            bg-indigo-50 px-3 py-1.5
            text-[9px] font-bold
            text-indigo-600">
            {{ article.readTime }}
          </span>
        </div>
      </div>
    </section>

    <!-- ===================================================== -->
    <!-- STORY DETAILS -->
    <!-- ===================================================== -->

    <section class="overflow-hidden rounded-[28px]
      border border-line bg-surface
      shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <header class="flex items-center
        justify-between gap-4
        border-b border-line
        px-6 py-5">
        <div>
          <p class="text-[9px] font-bold
            uppercase tracking-[0.18em]
            text-indigo-600">
            Story details
          </p>

          <h2 class="mt-2 text-lg font-bold
            text-fg">
            Report information
          </h2>
        </div>

        <div class="flex h-10 w-10
          items-center justify-center
          rounded-xl bg-surface-2
          text-fg-subtle">
          i
        </div>
      </header>

      <dl class="divide-y
        divide-line px-5">
        <div class="flex items-center
          justify-between gap-4 py-4">
          <dt class="text-[10px] text-fg-subtle">
            Category
          </dt>

          <dd>
            <NuxtLink :to="`/news/category/${article.category}`" class="text-[10px]
              font-bold text-indigo-600
              hover:underline">
              {{ article.categoryName }}
            </NuxtLink>
          </dd>
        </div>

        <div class="flex items-center
          justify-between gap-4 py-4">
          <dt class="text-[10px] text-fg-subtle">
            Region
          </dt>

          <dd class="text-right text-[10px]
            font-bold text-fg-muted">
            {{ article.region }}
          </dd>
        </div>

        <div v-if="article.location" class="flex items-center
          justify-between gap-4 py-4">
          <dt class="text-[10px] text-fg-subtle">
            Location
          </dt>

          <dd class="text-right text-[10px]
            font-bold text-fg-muted">
            {{ article.location }}
          </dd>
        </div>

        <div class="flex items-center
          justify-between gap-4 py-4">
          <dt class="text-[10px] text-fg-subtle">
            Publisher
          </dt>

          <dd class="max-w-[170px]
            truncate text-right
            text-[10px] font-bold
            text-fg-muted">
            {{ article.source }}
          </dd>
        </div>

        <div class="flex items-center
          justify-between gap-4 py-4">
          <dt class="text-[10px] text-fg-subtle">
            Published
          </dt>

          <dd class="text-right text-[10px]
            font-bold text-fg-muted">
            {{ formattedPublishedDate }}
          </dd>
        </div>

        <div class="flex items-center
          justify-between gap-4 py-4">
          <dt class="text-[10px] text-fg-subtle">
            Updated
          </dt>

          <dd class="text-right text-[10px]
            font-bold text-fg-muted">
            {{ formattedUpdatedDate }}
          </dd>
        </div>

        <div class="flex items-center
          justify-between gap-4 py-4">
          <dt class="text-[10px] text-fg-subtle">
            Reading time
          </dt>

          <dd class="text-right text-[10px]
            font-bold text-fg-muted">
            {{ article.readTime }}
          </dd>
        </div>

        <div class="flex items-center
          justify-between gap-4 py-4">
          <dt class="text-[10px] text-fg-subtle">
            Article views
          </dt>

          <dd class="text-right text-[10px]
            font-bold text-fg-muted">
            {{ formatViews(article.views) }}
          </dd>
        </div>
      </dl>

      <!-- Actions -->

      <div class="grid grid-cols-3
        gap-2 border-t
        border-line p-4">
        <button type="button" class="flex flex-col
          items-center justify-center
          gap-2 rounded-xl
          bg-surface-2 px-2 py-3
          text-[9px] font-bold
          text-fg-muted
          transition-all
          hover:bg-indigo-50
          hover:text-indigo-600" @click="copyArticleLink">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />

            <path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.15-1.15" />
          </svg>

          Copy
        </button>

        <button type="button" class="flex flex-col
          items-center justify-center
          gap-2 rounded-xl
          bg-surface-2 px-2 py-3
          text-[9px] font-bold
          text-fg-muted
          transition-all
          hover:bg-indigo-50
          hover:text-indigo-600" @click="shareArticle">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <circle cx="18" cy="5" r="2.5" />
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="19" r="2.5" />
            <path d="m8.2 10.8 7.6-4.5" />
            <path d="m8.2 13.2 7.6 4.5" />
          </svg>

          Share
        </button>

        <button type="button" class="flex flex-col
          items-center justify-center
          gap-2 rounded-xl
          bg-surface-2 px-2 py-3
          text-[9px] font-bold
          text-fg-muted
          transition-all
          hover:bg-indigo-50
          hover:text-indigo-600" @click="printArticle">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path d="M7 8V3h10v5" />

            <path d="M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />

            <path d="M7 14h10v7H7z" />
          </svg>

          Print
        </button>
      </div>
    </section>

    <!-- ===================================================== -->
    <!-- SOURCE TRANSPARENCY -->
    <!-- ===================================================== -->

    <section class="relative overflow-hidden
      rounded-[28px]
      border border-emerald-100
      bg-gradient-to-br
      from-emerald-50 to-white
      p-6">
      <div class="pointer-events-none
        absolute -right-12 -top-12
        h-32 w-32 rounded-full
        bg-emerald-200/50 blur-3xl" />

      <div class="relative flex
        items-start gap-4">
        <div class="flex h-11 w-11
          shrink-0 items-center
          justify-center rounded-2xl
          bg-surface text-emerald-600
          shadow-sm">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path d="M12 3 5 6v5c0 4.6 2.9 8 7 10 4.1-2 7-5.4 7-10V6l-7-3Z" />

            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <div class="min-w-0">
          <p class="text-[9px] font-bold
            uppercase tracking-[0.17em]
            text-emerald-700">
            Source transparency
          </p>

          <h2 class="mt-2 text-base
            font-bold text-fg">
            {{ sourceStatusLabel }}
          </h2>

          <p class="mt-2 text-xs
            leading-6 text-fg-subtle">
            Source and reporting information
            is displayed so readers can better
            evaluate this article.
          </p>

          <button v-if="sourceCount" type="button" class="mt-4 inline-flex
            items-center gap-2
            text-[10px] font-bold
            text-emerald-700" @click="
              scrollToSection(
                'article-sources',
              )
              ">
            Review sources
            <span>↓</span>
          </button>

          <button v-else type="button" class="mt-4 inline-flex
            items-center gap-2
            text-[10px] font-bold
            text-emerald-700" @click="
              scrollToSection(
                'reporting-transparency',
              )
              ">
            View report details
            <span>↓</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ===================================================== -->
    <!-- MOST READ -->
    <!-- ===================================================== -->

    <section v-if="visibleMostRead.length" class="overflow-hidden rounded-[28px]
      border border-line bg-surface
      shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
      <header class="relative overflow-hidden
        bg-accent text-accent-fg px-6 py-6
        text-white">
        <div class="pointer-events-none
          absolute -right-16 -top-16
          h-40 w-40 rounded-full
          bg-red-500/20 blur-3xl" />

        <div class="relative">
          <div class="inline-flex
            items-center gap-2
            text-[9px] font-bold
            uppercase tracking-[0.18em]
            text-red-300">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex
                h-full w-full animate-ping
                rounded-full bg-red-400
                opacity-50" />

              <span class="relative inline-flex
                h-2 w-2 rounded-full
                bg-red-500" />
            </span>

            Latest popular
          </div>

          <h2 class="mt-3 text-xl font-bold
            tracking-[-0.03em]">
            More news
          </h2>

          <p class="mt-2 text-xs
            leading-5 text-fg-subtle">
            Popular reports readers
            are following now.
          </p>
        </div>
      </header>

      <div class="divide-y
        divide-line px-4">
        <NuxtLink v-for="(item, index) in visibleMostRead" :key="item.id" :to="`/news/posts/${item.slug}`" class="group grid
          grid-cols-[70px_minmax(0,1fr)]
          gap-3 py-4">
          <div class="relative h-[70px]
            overflow-hidden rounded-2xl
            bg-surface-2">
            <img v-if="item.image" :src="item.image" :alt="item.title" loading="lazy" class="h-full w-full
  object-cover transition-transform
  duration-500
  group-hover:scale-105" />

            <div v-else class="flex h-full min-h-32
  items-center justify-center
  bg-gradient-to-br
  from-slate-100 to-slate-200">
              <span class="text-3xl" aria-hidden="true">
                📰
              </span>
            </div>

            <span class="absolute left-1.5
              top-1.5 flex h-6
              min-w-6 items-center
              justify-center rounded-lg
              bg-accent text-accent-fg/85
              px-1.5 text-[8px]
              font-bold text-white
              backdrop-blur">
              {{
                String(index + 1)
                  .padStart(2, '0')
              }}
            </span>
          </div>

          <div class="min-w-0">
            <span class="text-[8px] font-bold
              uppercase tracking-[0.13em]
              text-indigo-600">
              {{ item.categoryName }}
            </span>

            <h3 class="story-title mt-1.5
              text-xs font-bold
              leading-5 text-fg
              transition-colors
              group-hover:text-indigo-600">
              {{ item.title }}
            </h3>

            <p class="mt-1.5 text-[8px]
              text-fg-subtle">
              {{ timeAgo(item.publishedAt) }}
              ·
              {{ formatViews(item.views) }}
              views
            </p>
          </div>
        </NuxtLink>
      </div>

      <div class="border-t
        border-line p-4">
        <NuxtLink :to="{
          path: '/news/search',
          query: {
            sort: 'popular',
          },
        }" class="group flex w-full
          items-center justify-center
          gap-2 rounded-xl
          bg-surface-2 px-4 py-3
          text-[10px] font-bold
          text-fg-muted
          transition-all
          hover:bg-indigo-50
          hover:text-indigo-600">
          View popular stories

          <span class="transition-transform
            group-hover:translate-x-1">
            →
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- ===================================================== -->
    <!-- NEWSLETTER -->
    <!-- ===================================================== -->

    <section class="relative overflow-hidden
      rounded-[28px]
      bg-gradient-to-br
      from-slate-950
      via-slate-950
      to-indigo-950 p-6
      text-white
      shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
      <div class="pointer-events-none
        absolute -right-16 -top-16
        h-44 w-44 rounded-full
        bg-indigo-500/25 blur-3xl" />

      <div class="pointer-events-none
        absolute inset-0 opacity-[0.04]" style="
          background-image:
            radial-gradient(
              circle,
              white 1px,
              transparent 1px
            );
          background-size: 20px 20px;
        " />

      <div class="relative">
        <div class="flex h-11 w-11
          items-center justify-center
          rounded-2xl border
          border-line/10
          bg-surface/[0.08]
          text-indigo-300">
          ✦
        </div>

        <p class="mt-6 text-[9px]
          font-bold uppercase
          tracking-[0.17em]
          text-indigo-300">
          Daily briefing
        </p>

        <h2 class="mt-2 text-lg
          font-bold leading-6">
          Important stories in your inbox
        </h2>

        <p class="mt-3 text-xs
          leading-6 text-fg-subtle">
          Receive selected world news,
          developing stories and major updates.
        </p>

        <form class="mt-5 space-y-2" novalidate @submit.prevent="
          subscribeToNewsletter
        ">
          <label for="sidebar-newsletter-email" class="sr-only">
            Email address
          </label>

          <input id="sidebar-newsletter-email" v-model="email" type="email" autocomplete="email"
            placeholder="Email address" class="h-11 w-full
            rounded-xl border
            border-line/10
            bg-surface/[0.08]
            px-4 text-xs text-white
            outline-none
            placeholder:text-fg-subtle
            focus:border-indigo-400
            focus:bg-surface/[0.12]" />

          <button type="submit" :disabled="newsletterLoading" class="flex h-11 w-full
            items-center justify-center
            gap-2 rounded-xl bg-surface
            px-4 text-[10px]
            font-bold text-fg
            transition-all
            hover:bg-indigo-100
            disabled:cursor-wait
            disabled:opacity-70">
            <svg v-if="newsletterLoading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" />

              <path class="opacity-75" fill="currentColor" d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3Z" />
            </svg>

            {{
              newsletterLoading
                ? 'Subscribing...'
                : 'Subscribe'
            }}

            <span v-if="!newsletterLoading">
              →
            </span>
          </button>

          <p v-if="newsletterMessage" class="rounded-xl px-3
            py-2 text-[9px]
            leading-5" :class="newsletterSuccess
              ? 'bg-emerald-500/10 text-emerald-300'
              : 'bg-red-500/10 text-red-300'
              ">
            {{ newsletterMessage }}
          </p>
        </form>

        <p class="mt-3 text-[8px]
          leading-4 text-fg-subtle">
          Demo subscription is stored locally.
          Connect this form to your API before production.
        </p>
      </div>
    </section>

    <!-- Toast -->

    <Transition enter-active-class="transition duration-200" enter-from-class="translate-y-3 opacity-0"
      enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-200"
      leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-3 opacity-0">
      <div v-if="showToast" class="fixed bottom-6
        left-1/2 z-[100]
        -translate-x-1/2
        whitespace-nowrap
        rounded-2xl bg-accent text-accent-fg
        px-5 py-3 text-xs
        font-semibold text-white
        shadow-2xl">
        {{ toastMessage }}
      </div>
    </Transition>
  </aside>
</template>

<style scoped>
.story-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>