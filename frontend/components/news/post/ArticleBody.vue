<script setup lang="ts">
import type {
  NewsArticle,
  NewsArticleSection,
  NewsArticleSource,
  NewsArticleTimelineItem,
} from '~/types/news'

/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
|
| Use the shared API type. Do not create another ArticleWithContent
| interface inside this component.
|
*/

interface Props {
  article: NewsArticle
}

const props = defineProps<Props>()

interface NormalizedArticleSection
  extends Omit<
    NewsArticleSection,
    'id' | 'paragraphs' | 'bullets'
  > {
  id: string
  paragraphs: string[]
  bullets?: string[]
}

/*
|--------------------------------------------------------------------------
| Safe article values
|--------------------------------------------------------------------------
*/

const articleLead = computed(() => {
  return props.article.lead?.trim() || ''
})

const articleTimeline = computed<
  NewsArticleTimelineItem[]
>(() => {
  return props.article.timeline ?? []
})

const articleSources = computed<
  NewsArticleSource[]
>(() => {
  return props.article.sources ?? []
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

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const cleanTextList = (
  values: unknown,
): string[] => {
  if (!Array.isArray(values)) {
    return []
  }

  return values
    .filter(
      (value): value is string =>
        typeof value === 'string'
        && value.trim().length > 0,
    )
    .map(value => value.trim())
}

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

const tagToSlug = (
  tag: string,
): string => {
  return slugify(tag)
}

const formatDate = (
  value:
    | string
    | Date
    | null
    | undefined,
): string => {
  if (!value) {
    return 'Not available'
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not available'
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
  ).format(date)
}

/*
|--------------------------------------------------------------------------
| Fallback article content
|--------------------------------------------------------------------------
|
| Do not generate fake report details. When an article has no sections,
| show only its real lead and excerpt.
|
*/

const fallbackSections = computed<
  NewsArticleSection[]
>(() => {
  const paragraphs = Array.from(
    new Set(
      [
        articleLead.value,
        props.article.excerpt?.trim(),
      ].filter(
        (value): value is string =>
          Boolean(value),
      ),
    ),
  )

  if (!paragraphs.length) {
    return []
  }

  return [
    {
      id: 'article-summary',
      title: 'Article summary',
      paragraphs,
    },
  ]
})

/*
|--------------------------------------------------------------------------
| Content sections
|--------------------------------------------------------------------------
*/

const isUsingFallbackContent = computed(() => {
  return !props.article.sections?.length
})

const contentSections = computed<
  NormalizedArticleSection[]
>(() => {
  const sourceSections =
    props.article.sections?.length
      ? props.article.sections
      : fallbackSections.value

  return sourceSections.map(
    (
      section,
      index,
    ): NormalizedArticleSection => {
      const imagePosition:
        NormalizedArticleSection[
        'imagePosition'
        ] =
        section.imagePosition === 'before'
          ? 'before'
          : 'after'

      return {
        id:
          section.id
          || `section-${index + 1}`,

        title:
          section.title?.trim()
          || `Section ${index + 1}`,

        paragraphs:
          Array.isArray(section.paragraphs)
            ? section.paragraphs.filter(
              (
                paragraph,
              ): paragraph is string =>
                typeof paragraph === 'string'
                && paragraph.trim().length > 0,
            )
            : [],

        bullets:
          Array.isArray(section.bullets)
            ? section.bullets.filter(
              (
                bullet,
              ): bullet is string =>
                typeof bullet === 'string'
                && bullet.trim().length > 0,
            )
            : undefined,

        quote:
          section.quote?.trim()
          || null,

        quoteAttribution:
          section.quoteAttribution?.trim()
          || null,

        note:
          section.note?.trim()
          || null,

        image:
          section.image?.trim()
          || null,

        imageAlt:
          section.imageAlt?.trim()
          || null,

        imageCaption:
          section.imageCaption?.trim()
          || null,

        imageCredit:
          section.imageCredit?.trim()
          || null,

        imagePosition,
      }
    },
  )
})

/*
|--------------------------------------------------------------------------
| Key points
|--------------------------------------------------------------------------
|
| Return only points stored in the backend. Do not invent key points.
|
*/

const keyPoints = computed<string[]>(() => {
  return cleanTextList(
    props.article.keyPoints,
  )
})

/*
|--------------------------------------------------------------------------
| Featured quote
|--------------------------------------------------------------------------
|
| The current API stores quotes inside article sections, not as
| top-level NewsArticle fields.
|
*/

const featuredQuote = computed(() => {
  const sectionWithQuote =
    contentSections.value.find(
      section =>
        Boolean(section.quote),
    )

  if (!sectionWithQuote?.quote) {
    return null
  }

  return {
    text: sectionWithQuote.quote,

    attribution:
      sectionWithQuote
        .quoteAttribution
      || 'Source cited in the report',
  }
})

/*
|--------------------------------------------------------------------------
| Sources
|--------------------------------------------------------------------------
*/

const visibleSourceCount = ref(3)
const showAllSources = ref(false)

const visibleSources = computed<
  NewsArticleSource[]
>(() => {
  if (showAllSources.value) {
    return articleSources.value
  }

  return articleSources.value.slice(
    0,
    visibleSourceCount.value,
  )
})

const hasMoreSources = computed(() => {
  return (
    articleSources.value.length
    > visibleSourceCount.value
  )
})

const toggleSources = (): void => {
  showAllSources.value =
    !showAllSources.value
}

/*
|--------------------------------------------------------------------------
| Table of contents
|--------------------------------------------------------------------------
*/

interface TableOfContentsItem {
  id: string
  title: string
}

const tableOfContents = computed<
  TableOfContentsItem[]
>(() => {
  const items =
    contentSections.value.map(
      section => ({
        id: section.id,
        title: section.title,
      }),
    )

  if (keyPoints.value.length) {
    items.splice(
      Math.min(2, items.length),
      0,
      {
        id: 'key-points',
        title: 'Key points',
      },
    )
  }

  if (articleTimeline.value.length) {
    items.push({
      id: 'story-timeline',
      title: 'Story timeline',
    })
  }

  if (articleSources.value.length) {
    items.push({
      id: 'article-sources',
      title: 'Sources',
    })
  }

  items.push({
    id: 'reporting-transparency',
    title: 'About this report',
  })

  return items
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

          const firstVisible =
            visibleEntries[0]

          if (firstVisible?.target.id) {
            activeSectionId.value =
              firstVisible.target.id
          }
        },
        {
          rootMargin:
            '-120px 0px -65% 0px',

          threshold: [
            0,
            0.1,
            0.3,
            0.6,
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

  const section =
    document.getElementById(
      sectionId,
    )

  if (!section) {
    return
  }

  section.scrollIntoView({
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

/*
|--------------------------------------------------------------------------
| Copy section link
|--------------------------------------------------------------------------
*/

const copiedSectionId = ref('')

let copyMessageTimer:
  | ReturnType<typeof setTimeout>
  | null = null

const copySectionLink =
  async (
    sectionId: string,
  ): Promise<void> => {
    if (!import.meta.client) {
      return
    }

    const sectionUrl =
      `${window.location.origin}`
      + `${window.location.pathname}`
      + `${window.location.search}`
      + `#${sectionId}`

    try {
      await navigator.clipboard.writeText(
        sectionUrl,
      )

      copiedSectionId.value =
        sectionId

      if (copyMessageTimer) {
        clearTimeout(
          copyMessageTimer,
        )
      }

      copyMessageTimer =
        setTimeout(() => {
          copiedSectionId.value = ''
        }, 2200)
    } catch {
      copiedSectionId.value = ''
    }
  }

/*
|--------------------------------------------------------------------------
| Content statistics
|--------------------------------------------------------------------------
*/

const estimatedWordCount = computed(() => {
  const sectionWords =
    contentSections.value.flatMap(
      section => [
        ...section.paragraphs,

        ...(section.bullets ?? []),

        section.quote ?? '',
        section.note ?? '',
      ],
    )

  const timelineWords =
    articleTimeline.value.flatMap(
      item => [
        item.time ?? '',
        item.title,
        item.description,
      ],
    )

  const sourceWords =
    articleSources.value.flatMap(
      source => [
        source.name,
        source.type ?? '',
        source.description ?? '',
      ],
    )

  return [
    props.article.title,
    props.article.excerpt,
    articleLead.value,

    ...keyPoints.value,
    ...sectionWords,
    ...timelineWords,
    ...sourceWords,
  ]
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length
})

const estimatedReadingMinutes =
  computed(() => {
    return Math.max(
      1,
      Math.ceil(
        estimatedWordCount.value
        / 220,
      ),
    )
  })

/*
|--------------------------------------------------------------------------
| Keep observer updated
|--------------------------------------------------------------------------
*/

watch(
  () => props.article.id,
  async () => {
    showAllSources.value = false
    copiedSectionId.value = ''

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

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  await initializeSectionObserver()

  if (window.location.hash) {
    const initialSection =
      window.location.hash.slice(1)

    window.setTimeout(() => {
      scrollToSection(
        initialSection,
      )
    }, 250)
  }
})

onBeforeUnmount(() => {
  sectionObserver?.disconnect()

  if (copyMessageTimer) {
    clearTimeout(
      copyMessageTimer,
    )
  }
})
</script>

<template>
  <article class="mx-auto min-w-0 max-w-4xl">
    <!-- ===================================================== -->
    <!-- DEMO CONTENT WARNING -->
    <!-- ===================================================== -->

    <aside v-if="isUsingFallbackContent" class="mb-8 rounded-[22px]
      border border-amber-200
      bg-amber-50 p-5">
      <div class="flex items-start gap-4">
        <div class="flex h-10 w-10
          shrink-0 items-center
          justify-center rounded-xl
          bg-amber-100 text-amber-700">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path d="M12 9v4" />

            <path d="M12 17h.01" />

            <path d="M10.3 4.4 2.9 17.2A2 2 0 0 0 4.6 20h14.8a2 2 0 0 0 1.7-2.8L13.7 4.4a2 2 0 0 0-3.4 0Z" />
          </svg>
        </div>

        <div>
          <p class="text-xs font-bold text-amber-900">
            Limited article structure
          </p>

          <p class="mt-1.5 text-xs leading-6 text-amber-800">
            This article does not contain structured sections yet.
            Its published summary is being displayed as the article content.
          </p>
        </div>
      </div>
    </aside>

    <!-- ===================================================== -->
    <!-- MOBILE TABLE OF CONTENTS -->
    <!-- ===================================================== -->

    <section class="mb-9 rounded-[24px]
      border border-line
      bg-surface-2 p-5 lg:hidden">
      <div class="flex items-center
        justify-between gap-4">
        <div>
          <p class="text-[9px] font-bold
            uppercase tracking-[0.17em]
            text-indigo-600">
            In this story
          </p>

          <h2 class="mt-2 text-base
            font-bold text-fg">
            Article contents
          </h2>
        </div>

        <div class="flex h-10 w-10
          items-center justify-center
          rounded-xl bg-surface
          text-indigo-600 shadow-sm">
          ≡
        </div>
      </div>

      <div class="mt-5 grid gap-2
        sm:grid-cols-2">
        <button v-for="item in tableOfContents" :key="item.id" type="button" class="flex items-center
          justify-between gap-3
          rounded-xl border px-4 py-3
          text-left text-[10px]
          font-semibold transition-all" :class="activeSectionId === item.id
            ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
            : 'border-line bg-surface text-fg-muted'
            " @click="scrollToSection(item.id)">
          <span>
            {{ item.title }}
          </span>

          <span>↓</span>
        </button>
      </div>
    </section>

    <!-- ===================================================== -->
    <!-- ARTICLE OVERVIEW -->
    <!-- ===================================================== -->

    <section class="mb-10 rounded-[26px]
      border border-line
      bg-gradient-to-br
      from-white to-slate-50 p-6
      sm:p-7">
      <div class="grid gap-6
        sm:grid-cols-[minmax(0,1fr)_180px]
        sm:items-center">
        <div>
          <p class="text-[9px] font-bold
            uppercase tracking-[0.17em]
            text-indigo-600">
            Story overview
          </p>

          <p v-if="
            articleLead
            && articleLead !== article.excerpt
          " class="article-lead article-copy
  mb-11 text-fg-muted">
            {{ articleLead }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3
          sm:grid-cols-1">
          <div class="rounded-2xl
            border border-line
            bg-surface px-4 py-3">
            <p class="text-[8px] font-bold
              uppercase tracking-[0.14em]
              text-fg-subtle">
              Estimated words
            </p>

            <p class="mt-1 text-lg
              font-bold text-fg">
              {{
                estimatedWordCount
                  .toLocaleString('en-US')
              }}
            </p>
          </div>

          <div class="rounded-2xl
            border border-line
            bg-surface px-4 py-3">
            <p class="text-[8px] font-bold
              uppercase tracking-[0.14em]
              text-fg-subtle">
              Reading estimate
            </p>

            <p class="mt-1 text-lg
              font-bold text-fg">
              {{ estimatedReadingMinutes }}
              min
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================================================== -->
    <!-- ARTICLE LEAD -->
    <!-- ===================================================== -->

    <p v-if="
      articleLead
      && articleLead !== article.excerpt
    " class="article-lead article-copy
  mb-11 text-fg-muted">
      {{ articleLead }}
    </p>

    <!-- ===================================================== -->
    <!-- CONTENT SECTIONS -->
    <!-- ===================================================== -->

    <template v-for="(section, sectionIndex) in contentSections" :key="section.id">
      <section :id="section.id" data-article-section class="article-section
        scroll-mt-36">
        <!-- Section heading -->

        <div class="group flex items-start
          justify-between gap-4">
          <h2 class="text-2xl font-bold
            tracking-[-0.035em]
            text-fg sm:text-3xl">
            {{ section.title }}
          </h2>

          <button type="button" :aria-label="`Copy link to ${section.title}`
            " class="flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-xl border
            border-line bg-surface
            text-fg-subtle opacity-0
            transition-all
            hover:border-indigo-200
            hover:text-indigo-600
            group-hover:opacity-100
            focus:opacity-100" @click="
              copySectionLink(section.id)
              ">
            <svg v-if="
              copiedSectionId !== section.id
            " class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />

              <path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.15-1.15" />
            </svg>

            <svg v-else class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              stroke-width="2">
              <path d="m5 12 4 4L19 6" />
            </svg>
          </button>
        </div>

        <!-- Section image before content -->

        <figure v-if="
          section.image
          && section.imagePosition === 'before'
        " class="mt-7">
          <img :src="section.image" :alt="section.imageAlt
            || section.title
            || article.title
            " loading="lazy" class="max-h-[680px] w-full
            rounded-[28px] object-cover">

          <figcaption v-if="
            section.imageCaption
            || section.imageCredit
          " class="mt-3 flex flex-wrap
            justify-between gap-2
            text-xs leading-5 text-fg-subtle">
            <span v-if="section.imageCaption">
              {{ section.imageCaption }}
            </span>

            <span v-if="section.imageCredit" class="font-medium">
              Photo: {{ section.imageCredit }}
            </span>
          </figcaption>
        </figure>

        <!-- Paragraphs -->

        <div class="mt-5 space-y-5">
          <p v-for="(
paragraph,
  paragraphIndex
            ) in section.paragraphs" :key="paragraphIndex" class="article-copy text-fg-muted">
            {{ paragraph }}
          </p>
        </div>

        <!-- Section bullet list -->

        <ul v-if="section.bullets?.length" class="mt-6 space-y-3">
          <li v-for="bullet in section.bullets" :key="bullet" class="flex items-start gap-3">
            <span class="mt-2 flex h-5 w-5
              shrink-0 items-center
              justify-center rounded-full
              bg-indigo-50
              text-[9px] font-bold
              text-indigo-600">
              ✓
            </span>

            <span class="article-copy
              text-fg-muted">
              {{ bullet }}
            </span>
          </li>
        </ul>

        <!-- Section note -->

        <aside v-if="section.note" class="mt-7 rounded-[22px]
          border border-indigo-100
          bg-indigo-50/70 p-5">
          <div class="flex items-start gap-3">
            <div class="flex h-9 w-9
              shrink-0 items-center
              justify-center rounded-xl
              bg-surface text-indigo-600
              shadow-sm">
              i
            </div>

            <p class="text-sm leading-7
              text-indigo-900">
              {{ section.note }}
            </p>
          </div>
        </aside>

        <!-- Inline quote -->

        <blockquote v-if="section.quote" class="relative mt-8
          overflow-hidden rounded-[26px]
          bg-gradient-to-br
          from-slate-950 via-slate-950
          to-indigo-950 p-7 text-white
          sm:p-8">
          <div class="pointer-events-none
            absolute -right-16 -top-16
            h-44 w-44 rounded-full
            bg-indigo-500/25 blur-3xl" />

          <div class="relative">
            <span class="text-4xl font-bold
              leading-none text-indigo-400">
              “
            </span>

            <p class="mt-3 text-lg
              font-semibold leading-8
              text-white sm:text-xl">
              {{ section.quote }}
            </p>

            <footer v-if="section.quoteAttribution" class="mt-5 text-[9px]
              font-bold uppercase
              tracking-[0.16em]
              text-indigo-300">
              {{
                section.quoteAttribution
              }}
            </footer>
          </div>
        </blockquote>

        <!-- Section image after content -->

        <figure v-if="
          section.image
          && section.imagePosition === 'after'
        " class="mt-8">
          <img :src="section.image" :alt="section.imageAlt
            || section.title
            || article.title
            " loading="lazy" class="max-h-[680px] w-full
            rounded-[28px] object-cover">

          <figcaption v-if="
            section.imageCaption
            || section.imageCredit
          " class="mt-3 flex flex-wrap
            justify-between gap-2
            text-xs leading-5 text-fg-subtle">
            <span v-if="section.imageCaption">
              {{ section.imageCaption }}
            </span>

            <span v-if="section.imageCredit" class="font-medium">
              Photo: {{ section.imageCredit }}
            </span>
          </figcaption>
        </figure>
      </section>

      <!-- Insert key points after section 2 -->

      <section v-if="
        keyPoints.length
        && sectionIndex ===
        Math.min(
          1,
          contentSections.length - 1,
        )
      " id="key-points" data-article-section class="article-section
        scroll-mt-36">
        <div class="rounded-[28px]
          border border-line
          bg-surface-2 p-6 sm:p-8">
          <div class="flex items-start
            justify-between gap-5">
            <div>
              <p class="text-[9px]
                font-bold uppercase
                tracking-[0.17em]
                text-indigo-600">
                Quick summary
              </p>

              <h2 class="mt-2 text-2xl
                font-bold tracking-[-0.035em]
                text-fg">
                Key points
              </h2>

              <p class="mt-2 text-xs
                leading-6 text-fg-subtle">
                The most important information
                from this report.
              </p>
            </div>

            <div class="flex h-11 w-11
              shrink-0 items-center
              justify-center rounded-2xl
              bg-indigo-600
              text-white shadow-lg">
              ✓
            </div>
          </div>

          <ul class="mt-7 grid gap-3
            sm:grid-cols-2">
            <li v-for="(
point,
  index
              ) in keyPoints" :key="point" class="flex items-start gap-3
              rounded-2xl border
              border-line bg-surface
              p-4">
              <span class="flex h-7 min-w-7
                items-center justify-center
                rounded-xl bg-indigo-50
                text-[9px] font-bold
                text-indigo-600">
                {{
                  String(index + 1)
                    .padStart(2, '0')
                }}
              </span>

              <span class="text-sm leading-6
                text-fg-muted">
                {{ point }}
              </span>
            </li>
          </ul>
        </div>
      </section>
    </template>

    <!-- ===================================================== -->
    <!-- FEATURED QUOTE -->
    <!-- ===================================================== -->

    <blockquote v-if="
      featuredQuote &&
      !contentSections.some(
        section => section.quote,
      )
    " class="article-section
      relative overflow-hidden
      rounded-[28px]
      bg-gradient-to-br
      from-slate-950 via-slate-950
      to-indigo-950 p-8 text-white">
      <div class="pointer-events-none
        absolute -right-20 -top-20
        h-52 w-52 rounded-full
        bg-indigo-500/30 blur-3xl" />

      <div class="relative">
        <span class="text-5xl font-bold
          leading-none text-indigo-400">
          “
        </span>

        <p class="mt-4 text-xl
          font-semibold leading-9">
          {{ featuredQuote.text }}
        </p>

        <footer class="mt-6 text-[9px]
          font-bold uppercase
          tracking-[0.16em]
          text-indigo-300">
          {{ featuredQuote.attribution }}
        </footer>
      </div>
    </blockquote>

    <!-- ===================================================== -->
    <!-- TIMELINE -->
    <!-- ===================================================== -->

    <section v-if="articleTimeline.length" id="story-timeline" data-article-section class="article-section
      scroll-mt-36">
      <div class="flex items-end
        justify-between gap-5">
        <div>
          <p class="text-[9px] font-bold
            uppercase tracking-[0.17em]
            text-indigo-600">
            Developing story
          </p>

          <h2 class="mt-2 text-2xl
            font-bold tracking-[-0.035em]
            text-fg sm:text-3xl">
            Story timeline
          </h2>
        </div>

        <span class="rounded-full
          bg-indigo-50 px-3 py-1.5
          text-[9px] font-bold
          text-indigo-600">
          {{ articleTimeline.length }}
          updates
        </span>
      </div>

      <ol class="relative mt-8">
        <div class="absolute bottom-4
          left-[15px] top-4 w-px
          bg-surface-3" />

        <li v-for="(
item,
  index
  ) in articleTimeline" :key="`${item.time ?? ''}-${item.title}-${index}`
    " class="relative flex gap-5
          pb-8 last:pb-0">
          <span class="relative z-10 flex
            h-8 min-w-8
            items-center justify-center
            rounded-xl border-4
            border-white bg-indigo-600
            text-[8px] font-bold
            text-white shadow">
            {{
              String(index + 1)
                .padStart(2, '0')
            }}
          </span>

          <div class="min-w-0 flex-1
            rounded-2xl border
            border-line
            bg-surface p-5">
            <time v-if="item.time" class="text-[9px]
              font-bold uppercase
              tracking-[0.14em]
              text-indigo-600">
              {{ item.time }}
            </time>

            <h3 class="mt-1 text-base
              font-bold text-fg">
              {{ item.title }}
            </h3>

            <p class="mt-2 text-sm
              leading-7 text-fg-subtle">
              {{ item.description }}
            </p>
          </div>
        </li>
      </ol>
    </section>

    <!-- ===================================================== -->
    <!-- SOURCES -->
    <!-- ===================================================== -->

    <section v-if="articleSources.length" id="article-sources" data-article-section
      class="article-section scroll-mt-36">
      <div class="rounded-[28px]
    border border-line
    bg-surface p-6 sm:p-8">
        <!-- Header -->

        <div class="flex flex-col
      justify-between gap-4
      sm:flex-row sm:items-end">
          <div>
            <p class="text-[9px] font-bold
          uppercase tracking-[0.17em]
          text-emerald-600">
              Source transparency
            </p>

            <h2 class="mt-2 text-2xl
          font-bold tracking-[-0.035em]
          text-fg">
              Sources used
            </h2>

            <p class="mt-2 text-xs
          leading-6 text-fg-subtle">
              Sources referenced while
              preparing this article.
            </p>
          </div>

          <span class="w-fit rounded-full
        bg-emerald-50 px-3 py-1.5
        text-[9px] font-bold
        text-emerald-700">
            {{ articleSources.length }}
            {{
              articleSources.length === 1
                ? 'source'
                : 'sources'
            }}
          </span>
        </div>

        <!-- Source list -->

        <div class="mt-7 grid gap-3">
          <template v-for="source in visibleSources" :key="`${source.name}-${source.url ?? ''}`
            ">
            <!-- Source with URL -->

            <a v-if="source.url" :href="source.url" target="_blank" rel="noopener noreferrer" class="group flex items-start
          justify-between gap-4
          rounded-2xl border
          border-line
          bg-surface-2 p-4
          transition-all duration-200
          hover:-translate-y-0.5
          hover:border-indigo-200
          hover:bg-indigo-50
          hover:shadow-sm">
              <div class="flex min-w-0
            items-start gap-3">
                <!-- Icon -->

                <div class="flex h-10 w-10
              shrink-0 items-center
              justify-center rounded-xl
              bg-surface text-indigo-600
              shadow-sm transition
              group-hover:bg-indigo-600
              group-hover:text-white">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"
                    aria-hidden="true">
                    <path d="M14 5h5v5" />

                    <path d="M10 14 19 5" />

                    <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
                  </svg>
                </div>

                <!-- Information -->

                <div class="min-w-0">
                  <div class="flex flex-wrap
                items-center gap-2">
                    <h3 class="break-words
                  text-sm font-bold
                  text-fg
                  transition-colors
                  group-hover:text-indigo-600">
                      {{ source.name }}
                    </h3>

                    <span v-if="source.type" class="rounded-full
                  border border-line
                  bg-surface px-2 py-1
                  text-[8px] font-bold
                  uppercase tracking-wider
                  text-fg-subtle">
                      {{ source.type }}
                    </span>
                  </div>

                  <p v-if="source.description" class="mt-1.5 text-xs
                leading-5 text-fg-subtle">
                    {{ source.description }}
                  </p>

                  <p class="mt-2 max-w-full
                truncate text-[9px]
                font-semibold
                text-indigo-500">
                    {{ source.url }}
                  </p>
                </div>
              </div>

              <!-- External arrow -->

              <span class="mt-2 shrink-0
            text-fg-subtle
            transition-all
            group-hover:translate-x-1
            group-hover:text-indigo-600" aria-hidden="true">
                →
              </span>
            </a>

            <!-- Source without URL -->

            <div v-else class="flex items-start
          justify-between gap-4
          rounded-2xl border
          border-line
          bg-surface-2 p-4">
              <div class="flex min-w-0
            items-start gap-3">
                <!-- Icon -->

                <div class="flex h-10 w-10
              shrink-0 items-center
              justify-center rounded-xl
              bg-surface text-fg-subtle
              shadow-sm">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"
                    aria-hidden="true">
                    <path d="M6 4h12a1 1 0 0 1 1 1v14l-3-2-4 2-4-2-3 2V5a1 1 0 0 1 1-1Z" />

                    <path d="M8 8h8" />

                    <path d="M8 12h6" />
                  </svg>
                </div>

                <!-- Information -->

                <div class="min-w-0">
                  <div class="flex flex-wrap
                items-center gap-2">
                    <h3 class="break-words
                  text-sm font-bold
                  text-fg">
                      {{ source.name }}
                    </h3>

                    <span v-if="source.type" class="rounded-full
                  border border-line
                  bg-surface px-2 py-1
                  text-[8px] font-bold
                  uppercase tracking-wider
                  text-fg-subtle">
                      {{ source.type }}
                    </span>

                    <span class="rounded-full
                  bg-surface-3/70
                  px-2 py-1
                  text-[8px] font-bold
                  uppercase tracking-wider
                  text-fg-subtle">
                      No link
                    </span>
                  </div>

                  <p v-if="source.description" class="mt-1.5 text-xs
                leading-5 text-fg-subtle">
                    {{ source.description }}
                  </p>

                  <p v-else class="mt-1.5 text-xs
                leading-5 text-fg-subtle">
                    No additional source description
                    is available.
                  </p>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Show all / fewer -->

        <button v-if="hasMoreSources || showAllSources" type="button" class="mt-5 flex w-full
      items-center justify-center
      gap-2 rounded-xl
      border border-line
      bg-surface-2 px-4 py-3
      text-[10px] font-bold
      text-fg-muted
      transition-all
      hover:border-indigo-200
      hover:bg-indigo-50
      hover:text-indigo-600" @click="toggleSources">
          <span>
            {{
              showAllSources
                ? 'Show fewer sources'
                : `Show all ${articleSources.length} sources`
            }}
          </span>

          <svg class="h-4 w-4 transition-transform" :class="showAllSources
            ? 'rotate-180'
            : ''
            " fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
    </section>

    <!-- ===================================================== -->
    <!-- REPORTING TRANSPARENCY -->
    <!-- ===================================================== -->

    <section id="reporting-transparency" data-article-section class="article-section
      scroll-mt-36">
      <div class="overflow-hidden
        rounded-[28px]
        border border-line
        bg-surface-2">
        <div class="grid gap-6 p-6
          sm:p-8 md:grid-cols-[56px_minmax(0,1fr)]">
          <div class="flex h-14 w-14
            items-center justify-center
            rounded-2xl bg-surface
            text-indigo-600 shadow-sm">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path d="M12 3 5 6v5c0 4.6 2.9 8 7 10 4.1-2 7-5.4 7-10V6l-7-3Z" />

              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <div>
            <p class="text-[9px] font-bold
              uppercase tracking-[0.17em]
              text-indigo-600">
              Reporting transparency
            </p>

            <h2 class="mt-2 text-xl
              font-bold text-fg">
              About this report
            </h2>

            <p class="mt-3 text-sm
              leading-7 text-fg-subtle">
              This story was published by
              <strong class="text-fg-muted">
                {{ article.author }}
              </strong>
              for {{ article.source }}.
              Important updates should include
              a visible updated timestamp and
              clear information about what changed.
            </p>

            <p v-if="methodologyNote" class="mt-4 text-sm
              leading-7 text-fg-subtle">
              {{ methodologyNote }}
            </p>

            <div class="mt-5 flex flex-wrap
              gap-2 text-[9px]">
              <span class="rounded-full
                border border-line
                bg-surface px-3 py-2
                font-semibold text-fg-subtle">
                Published:
                {{
                  formatDate(
                    article.publishedAt,
                  )
                }}
              </span>

              <span class="rounded-full
                border border-line
                bg-surface px-3 py-2
                font-semibold text-fg-subtle">
                Updated:
                {{
                  formatDate(
                    article.updatedAt ||
                    article.publishedAt,
                  )
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- Correction note -->

        <div class="border-t border-line
          bg-surface px-6 py-5 sm:px-8">
          <div class="flex items-start gap-3">
            <div class="flex h-9 w-9
              shrink-0 items-center
              justify-center rounded-xl
              bg-emerald-50
              text-emerald-600">
              ✓
            </div>

            <div>
              <p class="text-xs font-bold
                text-fg">
                Corrections and updates
              </p>

              <p class="mt-1.5 text-xs
                leading-6 text-fg-subtle">
                {{
                  correctionNote ||
                  'No correction notice is currently attached to this article.'
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================================================== -->
    <!-- TOPICS -->
    <!-- ===================================================== -->

    <section v-if="article.tags.length" class="article-section
      border-t border-line pt-8">
      <div class="flex flex-col
        justify-between gap-5
        sm:flex-row sm:items-center">
        <div>
          <p class="text-[9px] font-bold
            uppercase tracking-[0.17em]
            text-fg-subtle">
            Topics
          </p>

          <div class="mt-3 flex flex-wrap gap-2">
            <NuxtLink v-for="tag in article.tags" :key="tag" :to="`/news/tag/${tagToSlug(tag)}`
              " class="rounded-full
              border border-line
              bg-surface px-3.5 py-2
              text-[10px] font-semibold
              text-fg-muted transition-all
              hover:-translate-y-0.5
              hover:border-indigo-200
              hover:bg-indigo-50
              hover:text-indigo-600">
              #{{ tag }}
            </NuxtLink>
          </div>
        </div>

        <NuxtLink :to="`/news/category/${article.category}`
          " class="group inline-flex w-fit
          items-center gap-2 rounded-xl
          bg-accent text-accent-fg px-5 py-3
          text-[10px] font-bold
          text-white transition-all
          hover:bg-indigo-600">
          More {{ article.categoryName }}

          <span class="transition-transform
            group-hover:translate-x-1">
            →
          </span>
        </NuxtLink>
      </div>
    </section>
  </article>
</template>

<style scoped>
.article-section {
  margin-top: 3.5rem;
}

.article-copy {
  font-size:
    var(--article-body-size,
      17px);

  line-height:
    var(--article-body-line-height,
      1.9);
}

.article-lead::first-letter {
  float: left;
  margin-right: 0.65rem;
  margin-top: 0.35rem;
  font-size: 3.8rem;
  font-weight: 800;
  line-height: 0.8;
  color: rgb(79 70 229);
}

@media (min-width: 640px) {
  .article-section {
    margin-top: 4.5rem;
  }
}
</style>