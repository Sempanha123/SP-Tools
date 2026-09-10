<script setup lang="ts">
type ArticleTextSize = 'small' | 'normal' | 'large'

const {
  article,
  relatedArticles,
  mostReadArticles,
  pending,
  error,
  refresh,
} = await useNewsPostPage()

const isSaved = ref(false)
const toastMessage = ref('')
const readingProgress = ref(0)
const textSize = ref<ArticleTextSize>('normal')
const articleContainer = ref<HTMLElement | null>(null)

let toastTimer: ReturnType<typeof setTimeout> | undefined

const articleTextClass = computed(() =>
  `sp-v19-text-${textSize.value}`,
)

const continueReadingArticles = computed(() =>
  relatedArticles.value.slice(0, 3),
)

const pageTitle = computed(() =>
  article.value?.metaTitle
  || article.value?.title
  || 'News Article',
)

const pageDescription = computed(() =>
  article.value?.metaDescription
  || article.value?.excerpt
  || 'Read the latest SP-Tools news article.',
)

const pageImage = computed(() =>
  article.value?.image || undefined,
)

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogImage: () => pageImage.value,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => pageTitle.value,
  twitterDescription: () => pageDescription.value,
  twitterImage: () => pageImage.value,
})

const structuredData = computed(() => {
  const current = article.value

  if (!current) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: current.title,
    description: current.excerpt,
    image: current.image ? [current.image] : undefined,
    datePublished: current.publishedAt,
    dateModified: current.updatedAt || current.publishedAt,
    author: {
      '@type': 'Person',
      name: current.author,
    },
    publisher: {
      '@type': 'Organization',
      name: current.source || 'SP-Tools News',
    },
    articleSection: current.categoryName,
    keywords: current.tags.join(', '),
  }
})

useHead(() => ({
  link: article.value
    ? [
        {
          rel: 'canonical',
          href:
            article.value.canonicalUrl
            || `/news/posts/${article.value.slug}`,
        },
      ]
    : [],
  script: structuredData.value
    ? [
        {
          key: 'news-article-schema',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(structuredData.value),
        },
      ]
    : [],
}))

const displayToast = (message: string): void => {
  toastMessage.value = message

  if (toastTimer) clearTimeout(toastTimer)

  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2400)
}

const storageKey = computed(() =>
  article.value
    ? `saved-news-${article.value.id}`
    : '',
)

const loadSavedStatus = (): void => {
  if (!import.meta.client || !storageKey.value) return

  isSaved.value =
    localStorage.getItem(storageKey.value) === '1'
}

const toggleSavedArticle = (): void => {
  if (!import.meta.client || !storageKey.value) return

  isSaved.value = !isSaved.value

  if (isSaved.value) {
    localStorage.setItem(storageKey.value, '1')
    displayToast('Article saved')
    return
  }

  localStorage.removeItem(storageKey.value)
  displayToast('Removed from saved')
}

const copyArticleLink = async (): Promise<void> => {
  if (!import.meta.client) return

  try {
    await navigator.clipboard.writeText(window.location.href)
    displayToast('Article link copied')
  } catch {
    displayToast('Unable to copy article link')
  }
}

const shareArticle = async (): Promise<void> => {
  if (!import.meta.client || !article.value) return

  if (navigator.share) {
    try {
      await navigator.share({
        title: article.value.title,
        text: article.value.excerpt,
        url: window.location.href,
      })
      return
    } catch {
      return
    }
  }

  await copyArticleLink()
}

const printArticle = (): void => {
  if (!import.meta.client) return
  window.print()
}

const updateReadingProgress = (): void => {
  if (!import.meta.client || !articleContainer.value) {
    readingProgress.value = 0
    return
  }

  const element = articleContainer.value
  const top =
    window.scrollY
    + element.getBoundingClientRect().top
  const readableDistance =
    element.offsetHeight - window.innerHeight

  if (readableDistance <= 0) {
    readingProgress.value = 100
    return
  }

  const progress =
    ((window.scrollY - top) / readableDistance) * 100

  readingProgress.value =
    Math.min(100, Math.max(0, progress))
}

watch(
  article,
  async () => {
    loadSavedStatus()
    await nextTick()
    updateReadingProgress()
  },
  { immediate: true },
)

onMounted(() => {
  window.addEventListener(
    'scroll',
    updateReadingProgress,
    { passive: true },
  )
  window.addEventListener(
    'resize',
    updateReadingProgress,
  )
  updateReadingProgress()
})

onBeforeUnmount(() => {
  window.removeEventListener(
    'scroll',
    updateReadingProgress,
  )
  window.removeEventListener(
    'resize',
    updateReadingProgress,
  )

  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <main class="sp-v19-post min-h-screen overflow-x-hidden bg-surface text-fg">
    <div class="fixed inset-x-0 top-0 z-[100] h-[3px] bg-surface-3/80 print:hidden">
      <div
        class="sp-v19-top-progress h-full transition-[width] duration-150 ease-out"
        :style="{ width: `${readingProgress}%` }"
      />
    </div>

    <section
      v-if="pending"
      class="sp-v19-shell py-16"
    >
      <div class="animate-pulse">
        <div class="h-3 w-40 rounded-full bg-surface-3" />
        <div class="mt-7 h-20 max-w-4xl rounded-[20px] bg-surface-3" />
        <div class="mt-4 h-7 max-w-2xl rounded-xl bg-surface-2" />
        <div class="mt-10 aspect-[16/8] rounded-[30px] bg-surface-3" />
      </div>
    </section>

    <section
      v-else-if="error"
      class="sp-v19-shell flex min-h-[70vh] items-center justify-center py-20"
    >
      <div class="w-full max-w-xl rounded-[26px] border border-danger/20 bg-danger-soft p-8 text-center shadow-soft">
        <p class="text-[9px] font-bold uppercase tracking-[.18em] text-danger">
          News unavailable
        </p>

        <h1 class="mt-4 text-3xl font-[800] tracking-[-.045em] text-fg">
          Article could not be loaded
        </h1>

        <p class="mt-3 text-sm leading-7 text-fg-muted">
          The article may be unavailable or the News API may not be running.
        </p>

        <div class="mt-6 flex justify-center gap-3">
          <button
            type="button"
            class="sp-btn sp-btn-primary px-5 py-3 text-xs"
            @click="refresh"
          >
            Try again
          </button>

          <NuxtLink
            to="/news"
            class="sp-btn sp-btn-secondary px-5 py-3 text-xs"
          >
            Back to news
          </NuxtLink>
        </div>
      </div>
    </section>

    <template v-else-if="article">
      <NewsPostHeader :article="article" />

      <section class="sp-v19-toolbar sticky z-40 border-y border-line bg-surface/90 backdrop-blur-2xl print:hidden">
        <div class="sp-v19-shell flex min-h-[66px] items-center justify-between gap-4 py-2">
          <NewsPostReaderProgressMeta
            :article="article"
            :progress="readingProgress"
          />

          <div class="flex items-center gap-2">
            <div class="hidden items-center rounded-[13px] border border-line bg-surface-2 p-1 sm:flex">
              <button
                type="button"
                aria-label="Use smaller article text"
                class="sp-v19-text-button text-[10px]"
                :class="textSize === 'small'
                  ? 'bg-elevated text-accent shadow-xs'
                  : 'text-fg-subtle hover:text-fg'"
                @click="textSize = 'small'"
              >
                A
              </button>

              <button
                type="button"
                aria-label="Use normal article text"
                class="sp-v19-text-button text-xs"
                :class="textSize === 'normal'
                  ? 'bg-elevated text-accent shadow-xs'
                  : 'text-fg-subtle hover:text-fg'"
                @click="textSize = 'normal'"
              >
                A
              </button>

              <button
                type="button"
                aria-label="Use larger article text"
                class="sp-v19-text-button text-base"
                :class="textSize === 'large'
                  ? 'bg-elevated text-accent shadow-xs'
                  : 'text-fg-subtle hover:text-fg'"
                @click="textSize = 'large'"
              >
                A
              </button>
            </div>

            <button
              type="button"
              class="sp-v19-action-button"
              :class="isSaved ? 'sp-v19-action-active' : ''"
              @click="toggleSavedArticle"
            >
              <svg class="h-4 w-4" :fill="isSaved ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.75L6 21V4.75Z" />
              </svg>
              <span class="hidden sm:inline">{{ isSaved ? 'Saved' : 'Save' }}</span>
            </button>

            <button
              type="button"
              aria-label="Copy article link"
              class="sp-v19-icon-button"
              @click="copyArticleLink"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.15-1.15" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Share article"
              class="sp-v19-icon-button"
              @click="shareArticle"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <circle cx="18" cy="5" r="2.5" />
                <circle cx="6" cy="12" r="2.5" />
                <circle cx="18" cy="19" r="2.5" />
                <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Print article"
              class="sp-v19-icon-button hidden md:flex"
              @click="printArticle"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
                <path d="M7 14h10v7H7z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section
        ref="articleContainer"
        class="sp-v19-content-section"
      >
        <div class="sp-v19-reader-grid">
          <div class="min-w-0">
            <NewsPostArticleBody
              :article="article"
              :class="articleTextClass"
            />
          </div>

          <div class="hidden min-w-0 xl:block print:hidden">
            <NewsPostSidebar
              :article="article"
              :most-read="mostReadArticles"
            />
          </div>
        </div>
      </section>

      <NewsPostContinueReading
        v-if="continueReadingArticles.length"
        :articles="continueReadingArticles"
        :category-slug="article.category"
      />
    </template>

    <Transition name="fade">
      <div
        v-if="toastMessage"
        class="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full border border-line bg-elevated/95 px-4 py-2.5 text-[11px] font-semibold text-fg shadow-pop backdrop-blur-xl print:hidden"
      >
        {{ toastMessage }}
      </div>
    </Transition>
  </main>
</template>
