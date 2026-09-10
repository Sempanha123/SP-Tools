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

const articleTextClass = computed(() => `sp-editorial-text-${textSize.value}`)
const continueReadingArticles = computed(() => relatedArticles.value.slice(0, 3))
const pageTitle = computed(() => article.value?.metaTitle || article.value?.title || 'News Article')
const pageDescription = computed(() => article.value?.metaDescription || article.value?.excerpt || 'Read the latest SP-Tools news article.')
const pageImage = computed(() => article.value?.image || undefined)

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
    author: { '@type': 'Person', name: current.author },
    publisher: { '@type': 'Organization', name: current.source || 'SP-Tools News' },
    articleSection: current.categoryName,
    keywords: current.tags.join(', '),
  }
})

useHead(() => ({
  link: article.value ? [{ rel: 'canonical', href: article.value.canonicalUrl || `/news/posts/${article.value.slug}` }] : [],
  script: structuredData.value ? [{ key: 'news-article-schema', type: 'application/ld+json', innerHTML: JSON.stringify(structuredData.value) }] : [],
}))

const displayToast = (message: string) => {
  toastMessage.value = message
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMessage.value = '' }, 2400)
}

const storageKey = computed(() => article.value ? `saved-news-${article.value.id}` : '')

const loadSavedStatus = () => {
  if (!import.meta.client || !storageKey.value) return
  isSaved.value = localStorage.getItem(storageKey.value) === '1'
}

const toggleSavedArticle = () => {
  if (!import.meta.client || !storageKey.value) return
  isSaved.value = !isSaved.value
  if (isSaved.value) {
    localStorage.setItem(storageKey.value, '1')
    displayToast('Article saved')
  } else {
    localStorage.removeItem(storageKey.value)
    displayToast('Removed from saved')
  }
}

const copyArticleLink = async () => {
  if (!import.meta.client) return
  try {
    await navigator.clipboard.writeText(window.location.href)
    displayToast('Article link copied')
  } catch {
    displayToast('Unable to copy article link')
  }
}

const shareArticle = async () => {
  if (!import.meta.client || !article.value) return
  if (navigator.share) {
    try {
      await navigator.share({ title: article.value.title, text: article.value.excerpt, url: window.location.href })
      return
    } catch { return }
  }
  await copyArticleLink()
}

const printArticle = () => {
  if (import.meta.client) window.print()
}

const updateReadingProgress = () => {
  if (!import.meta.client || !articleContainer.value) {
    readingProgress.value = 0
    return
  }

  const element = articleContainer.value
  const top = window.scrollY + element.getBoundingClientRect().top
  const readableDistance = element.offsetHeight - window.innerHeight
  if (readableDistance <= 0) {
    readingProgress.value = 100
    return
  }

  const progress = ((window.scrollY - top) / readableDistance) * 100
  readingProgress.value = Math.min(100, Math.max(0, progress))
}

watch(article, async () => {
  loadSavedStatus()
  await nextTick()
  updateReadingProgress()
}, { immediate: true })

onMounted(() => {
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
  window.addEventListener('resize', updateReadingProgress)
  updateReadingProgress()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateReadingProgress)
  window.removeEventListener('resize', updateReadingProgress)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <main class="sp-editorial-post min-h-screen bg-surface text-fg">
    <div class="fixed inset-x-0 top-0 z-[90] h-[3px] bg-surface-3/70 print:hidden">
      <div class="h-full bg-accent transition-[width] duration-150" :style="{ width: `${readingProgress}%` }" />
    </div>

    <section v-if="pending" class="sp-editorial-shell py-16">
      <div class="animate-pulse">
        <div class="h-3 w-40 rounded-full bg-surface-3" />
        <div class="mt-6 h-16 max-w-4xl rounded-2xl bg-surface-3" />
        <div class="mt-4 h-6 max-w-2xl rounded-xl bg-surface-2" />
        <div class="mt-10 aspect-[16/8] rounded-[24px] bg-surface-3" />
      </div>
    </section>

    <section v-else-if="error" class="sp-editorial-shell flex min-h-[70vh] items-center justify-center py-20">
      <div class="w-full max-w-xl rounded-[24px] border border-danger/20 bg-danger-soft p-8 text-center">
        <p class="text-[10px] font-bold uppercase tracking-[.16em] text-danger">News unavailable</p>
        <h1 class="mt-4 text-3xl font-[780] tracking-[-.04em] text-fg">Article could not be loaded</h1>
        <p class="mt-3 text-sm leading-7 text-fg-muted">The article may be unavailable or the News API may not be running.</p>
        <div class="mt-6 flex justify-center gap-3">
          <button type="button" class="sp-btn sp-btn-primary px-5 py-3 text-xs" @click="refresh">Try again</button>
          <NuxtLink to="/news" class="sp-btn sp-btn-secondary px-5 py-3 text-xs">Back to news</NuxtLink>
        </div>
      </div>
    </section>

    <template v-else-if="article">
      <NewsPostHeader :article="article" />

      <section class="sp-editorial-toolbar sticky z-40 border-y border-line bg-surface/94 backdrop-blur-xl print:hidden">
        <div class="sp-editorial-shell flex min-h-[64px] items-center justify-between gap-4 py-2">
          <NewsPostReaderProgressMeta :article="article" :progress="readingProgress" />

          <div class="flex items-center gap-2">
            <div class="hidden items-center rounded-[12px] border border-line bg-surface-2 p-1 sm:flex">
              <button v-for="size in (['small','normal','large'] as ArticleTextSize[])" :key="size" type="button" class="flex h-8 w-8 items-center justify-center rounded-[9px] font-bold transition" :class="[size === 'small' ? 'text-[10px]' : size === 'large' ? 'text-base' : 'text-xs', textSize === size ? 'bg-elevated text-accent shadow-xs' : 'text-fg-subtle hover:text-fg']" @click="textSize = size">A</button>
            </div>

            <button type="button" class="inline-flex h-10 items-center gap-2 rounded-[11px] border border-line bg-surface px-3 text-[11px] font-bold text-fg-muted transition hover:text-accent" :class="isSaved ? '!border-accent/25 !bg-accent-soft !text-accent' : ''" @click="toggleSavedArticle">
              <span aria-hidden="true">♡</span><span class="hidden sm:inline">{{ isSaved ? 'Saved' : 'Save' }}</span>
            </button>
            <button type="button" aria-label="Copy article link" class="sp-editorial-icon-button" @click="copyArticleLink">↗</button>
            <button type="button" aria-label="Share article" class="sp-editorial-icon-button" @click="shareArticle">⤴</button>
            <button type="button" aria-label="Print article" class="sp-editorial-icon-button hidden md:flex" @click="printArticle">⎙</button>
          </div>
        </div>
      </section>

      <section ref="articleContainer" class="sp-editorial-content-section">
        <div class="sp-editorial-reader-grid">
          <div class="min-w-0">
            <NewsPostArticleBody :article="article" :class="articleTextClass" />
          </div>
          <div class="hidden min-w-0 xl:block print:hidden">
            <NewsPostSidebar :article="article" :most-read="mostReadArticles" />
          </div>
        </div>
      </section>

      <NewsPostContinueReading v-if="continueReadingArticles.length" :articles="continueReadingArticles" :category-slug="article.category" />
    </template>

    <Transition name="fade">
      <div v-if="toastMessage" class="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-line bg-elevated px-4 py-2.5 text-[11px] font-semibold text-fg shadow-pop print:hidden">
        {{ toastMessage }}
      </div>
    </Transition>
  </main>
</template>
