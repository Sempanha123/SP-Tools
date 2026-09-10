<script setup lang="ts">
type ArticleTextSize =
    | 'small'
    | 'normal'
    | 'large'

const {
    article,
    relatedArticles,
    mostReadArticles,
    pending,
    error,
    refresh,
} = await useNewsPostPage()

/*
|--------------------------------------------------------------------------
| Reader state
|--------------------------------------------------------------------------
*/

const isSaved = ref(false)
const toastMessage = ref('')
const readingProgress = ref(0)

const textSize =
    ref<ArticleTextSize>('normal')

const articleContainer =
    ref<HTMLElement | null>(null)

let toastTimer:
    | ReturnType<typeof setTimeout>
    | undefined

const articleTextClass = computed(() => {
    return `article-text-${textSize.value}`
})

const continueReadingArticles = computed(() => {
    return relatedArticles.value.slice(0, 2)
})

/*
|--------------------------------------------------------------------------
| SEO
|--------------------------------------------------------------------------
*/

const pageTitle = computed(() => {
    return (
        article.value?.metaTitle
        || article.value?.title
        || 'News Article'
    )
})

const pageDescription = computed(() => {
    return (
        article.value?.metaDescription
        || article.value?.excerpt
        || 'Read the latest news article.'
    )
})

const pageImage = computed(() => {
    return article.value?.image
        || undefined
})

useSeoMeta({
    title: () => pageTitle.value,

    description: () =>
        pageDescription.value,

    ogTitle: () =>
        pageTitle.value,

    ogDescription: () =>
        pageDescription.value,

    ogImage: () =>
        pageImage.value,

    ogType: 'article',

    twitterCard:
        'summary_large_image',

    twitterTitle: () =>
        pageTitle.value,

    twitterDescription: () =>
        pageDescription.value,

    twitterImage: () =>
        pageImage.value,
})

/*
|--------------------------------------------------------------------------
| Structured data
|--------------------------------------------------------------------------
*/

const structuredData = computed(() => {
    const currentArticle =
        article.value

    if (!currentArticle) {
        return null
    }

    return {
        '@context':
            'https://schema.org',

        '@type':
            'NewsArticle',

        headline:
            currentArticle.title,

        description:
            currentArticle.excerpt,

        image:
            currentArticle.image
                ? [currentArticle.image]
                : undefined,

        datePublished:
            currentArticle.publishedAt,

        dateModified:
            currentArticle.updatedAt
            || currentArticle.publishedAt,

        author: {
            '@type': 'Person',
            name: currentArticle.author,
        },

        publisher: {
            '@type': 'Organization',

            name:
                currentArticle.source
                || 'SP-Tools News',
        },

        articleSection:
            currentArticle.categoryName,

        keywords:
            currentArticle.tags.join(', '),
    }
})

useHead(() => ({
    script: structuredData.value
        ? [
            {
                key:
                    'news-article-schema',

                type:
                    'application/ld+json',

                innerHTML:
                    JSON.stringify(
                        structuredData.value,
                    ),
            },
        ]
        : [],
}))

/*
|--------------------------------------------------------------------------
| Toast
|--------------------------------------------------------------------------
*/

const displayToast = (
    message: string,
): void => {
    toastMessage.value = message

    if (toastTimer) {
        clearTimeout(toastTimer)
    }

    toastTimer = setTimeout(() => {
        toastMessage.value = ''
    }, 2500)
}

/*
|--------------------------------------------------------------------------
| Save article
|--------------------------------------------------------------------------
*/

const storageKey = computed(() => {
    if (!article.value) {
        return ''
    }

    return `saved-news-${article.value.id}`
})

const loadSavedStatus = (): void => {
    if (
        !import.meta.client
        || !storageKey.value
    ) {
        return
    }

    isSaved.value =
        localStorage.getItem(
            storageKey.value,
        ) === '1'
}

const toggleSavedArticle = (): void => {
    if (
        !import.meta.client
        || !storageKey.value
    ) {
        return
    }

    isSaved.value = !isSaved.value

    if (isSaved.value) {
        localStorage.setItem(
            storageKey.value,
            '1',
        )

        displayToast('Article saved')
        return
    }

    localStorage.removeItem(
        storageKey.value,
    )

    displayToast(
        'Article removed from saved',
    )
}

/*
|--------------------------------------------------------------------------
| Copy, share and print
|--------------------------------------------------------------------------
*/

const copyArticleLink =
    async (): Promise<void> => {
        if (!import.meta.client) {
            return
        }

        try {
            await navigator.clipboard.writeText(
                window.location.href,
            )

            displayToast(
                'Article link copied',
            )
        } catch {
            displayToast(
                'Unable to copy article link',
            )
        }
    }

const shareArticle =
    async (): Promise<void> => {
        if (
            !import.meta.client
            || !article.value
        ) {
            return
        }

        if (navigator.share) {
            try {
                await navigator.share({
                    title:
                        article.value.title,

                    text:
                        article.value.excerpt,

                    url:
                        window.location.href,
                })

                return
            } catch {
                return
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

/*
|--------------------------------------------------------------------------
| Reading progress
|--------------------------------------------------------------------------
*/

const updateReadingProgress =
    (): void => {
        if (
            !import.meta.client
            || !articleContainer.value
        ) {
            readingProgress.value = 0
            return
        }

        const element =
            articleContainer.value

        const elementTop =
            window.scrollY
            + element
                .getBoundingClientRect()
                .top

        const readableDistance =
            element.offsetHeight
            - window.innerHeight

        if (readableDistance <= 0) {
            readingProgress.value = 100
            return
        }

        const progress =
            (
                (
                    window.scrollY
                    - elementTop
                )
                / readableDistance
            )
            * 100

        readingProgress.value =
            Math.min(
                100,
                Math.max(0, progress),
            )
    }

watch(
    article,
    async () => {
        loadSavedStatus()

        await nextTick()

        updateReadingProgress()
    },
    {
        immediate: true,
    },
)

onMounted(() => {
    window.addEventListener(
        'scroll',
        updateReadingProgress,
        {
            passive: true,
        },
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

    if (toastTimer) {
        clearTimeout(toastTimer)
    }
})

const retryLoad = async (): Promise<void> => {
    await refresh()
}
</script>

<template>
    <main class="min-h-screen overflow-x-hidden
    bg-surface text-fg">
        <!-- Reading progress -->

        <div class="fixed inset-x-0 top-0
      z-[90] h-1 bg-surface-3/60
      print:hidden">
            <div class="h-full bg-gradient-to-r
        from-indigo-600 via-violet-500
        to-cyan-400 transition-[width]
        duration-150 ease-out" :style="{
            width: `${readingProgress}%`,
        }" />
        </div>

        <!-- Loading state -->

        <section v-if="pending" class="mx-auto min-h-[75vh]
      max-w-7xl px-6 py-20">
            <div class="animate-pulse">
                <div class="h-4 w-36 rounded-full
          bg-surface-3" />

                <div class="mt-7 h-14 max-w-4xl
          rounded-2xl bg-surface-3" />

                <div class="mt-4 h-7 max-w-2xl
          rounded-xl bg-surface-2" />

                <div class="mt-10 aspect-[16/8]
          rounded-[32px] bg-surface-3" />

                <div class="mt-12 grid gap-12
          lg:grid-cols-[minmax(0,1fr)_340px]">
                    <div class="space-y-4">
                        <div v-for="index in 7" :key="index" class="h-5 rounded
              bg-surface-2" :class="index % 3 === 0
                ? 'w-4/5'
                : 'w-full'
                " />
                    </div>

                    <div class="hidden h-96 rounded-3xl
            bg-surface-2 lg:block" />
                </div>
            </div>
        </section>

        <!-- Error state -->

        <section v-else-if="error" class="mx-auto flex min-h-[70vh]
      max-w-3xl items-center
      justify-center px-6 py-20">
            <div class="w-full rounded-[32px]
        border border-red-200
        bg-gradient-to-br
        from-red-50 to-white
        p-8 text-center shadow-sm
        sm:p-12">
                <div class="mx-auto flex h-16 w-16
          items-center justify-center
          rounded-2xl bg-surface
          text-3xl shadow-md">
                    📰
                </div>

                <h1 class="mt-6 text-2xl font-black
          tracking-tight text-red-950
          sm:text-3xl">
                    Article could not be loaded
                </h1>

                <p class="mx-auto mt-4 max-w-xl
          leading-7 text-red-700">
                    The article may be unavailable,
                    unpublished, archived, or the news
                    server may not be running.
                </p>

                <div class="mt-8 flex flex-wrap
          justify-center gap-3">
                    <button type="button" class="rounded-xl bg-red-700
  px-5 py-3 text-sm font-bold
  text-white transition
  hover:bg-red-800
  disabled:cursor-not-allowed
  disabled:opacity-60" :disabled="pending" @click="retryLoad">
                        {{ pending ? 'Loading...' : 'Try again' }}
                    </button>

                    <NuxtLink to="/news" class="rounded-xl border
            border-red-200 bg-surface
            px-5 py-3 text-sm font-bold
            text-red-800 transition
            hover:bg-red-100">
                        Back to news
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- Loaded article -->

        <template v-else-if="article">
            <!-- Article header -->

            <NewsPostHeader :article="article" />

            <!-- Reader toolbar -->

            <section class="sticky top-0 z-40
        border-y border-line/80
        bg-surface/90 shadow-sm
        backdrop-blur-xl print:hidden">
                <div class="mx-auto flex max-w-7xl
          items-center justify-between
          gap-3 px-4 py-3 sm:px-6">
                    <!-- Progress -->

                    <div class="hidden min-w-0
            items-center gap-3 md:flex">
                        <div class="flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl bg-indigo-50
              text-xs font-black
              text-indigo-600">
                            {{ Math.round(readingProgress) }}%
                        </div>

                        <div class="min-w-0">
                            <p class="text-[9px] font-bold
                uppercase tracking-[0.16em]
                text-fg-subtle">
                                Reading progress
                            </p>

                            <p class="max-w-[320px] truncate
                text-xs font-semibold
                text-fg-muted">
                                {{ article.title }}
                            </p>
                        </div>
                    </div>

                    <!-- Actions -->

                    <div class="flex w-full items-center
            justify-between gap-2 md:w-auto
            md:justify-end">
                        <!-- Text size -->

                        <div class="flex items-center
              rounded-xl border
              border-line
              bg-surface-2 p-1">
                            <button type="button" aria-label="Use smaller article text" class="flex h-8 w-8
                items-center justify-center
                rounded-lg text-[10px]
                font-bold transition" :class="textSize === 'small'
                    ? 'bg-surface text-indigo-600 shadow-sm'
                    : 'text-fg-subtle hover:text-fg'
                    " @click="textSize = 'small'">
                                A
                            </button>

                            <button type="button" aria-label="Use normal article text" class="flex h-8 w-8
                items-center justify-center
                rounded-lg text-xs
                font-bold transition" :class="textSize === 'normal'
                    ? 'bg-surface text-indigo-600 shadow-sm'
                    : 'text-fg-subtle hover:text-fg'
                    " @click="textSize = 'normal'">
                                A
                            </button>

                            <button type="button" aria-label="Use larger article text" class="flex h-8 w-8
                items-center justify-center
                rounded-lg text-base
                font-bold transition" :class="textSize === 'large'
                    ? 'bg-surface text-indigo-600 shadow-sm'
                    : 'text-fg-subtle hover:text-fg'
                    " @click="textSize = 'large'">
                                A
                            </button>
                        </div>

                        <!-- Save -->

                        <button type="button" class="inline-flex h-10
              items-center gap-2 rounded-xl
              border px-3 text-xs font-bold
              transition sm:px-4" :class="isSaved
                ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                : 'border-line bg-surface text-fg-muted hover:border-indigo-200 hover:text-indigo-600'
                " @click="toggleSavedArticle">
                            <svg class="h-4 w-4" :fill="isSaved
                                ? 'currentColor'
                                : 'none'
                                " viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                                <path
                                    d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.75L6 21V4.75Z" />
                            </svg>

                            <span class="hidden sm:inline">
                                {{
                                    isSaved
                                        ? 'Saved'
                                        : 'Save'
                                }}
                            </span>
                        </button>

                        <!-- Copy -->

                        <button type="button" aria-label="Copy article link" class="flex h-10 w-10
              items-center justify-center
              rounded-xl border
              border-line bg-surface
              text-fg-muted transition
              hover:border-indigo-200
              hover:text-indigo-600" @click="copyArticleLink">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                stroke-width="1.8" aria-hidden="true">
                                <path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />

                                <path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.15-1.15" />
                            </svg>
                        </button>

                        <!-- Share -->

                        <button type="button" aria-label="Share article" class="flex h-10 w-10
              items-center justify-center
              rounded-xl border
              border-line bg-surface
              text-fg-muted transition
              hover:border-indigo-200
              hover:text-indigo-600" @click="shareArticle">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                stroke-width="1.8" aria-hidden="true">
                                <circle cx="18" cy="5" r="2.5" />

                                <circle cx="6" cy="12" r="2.5" />

                                <circle cx="18" cy="19" r="2.5" />

                                <path d="m8.2 10.8 7.6-4.5" />

                                <path d="m8.2 13.2 7.6 4.5" />
                            </svg>
                        </button>

                        <!-- Print -->

                        <button type="button" aria-label="Print article" class="hidden h-10 w-10
              items-center justify-center
              rounded-xl border
              border-line bg-surface
              text-fg-muted transition
              hover:border-indigo-200
              hover:text-indigo-600 sm:flex" @click="printArticle">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                stroke-width="1.8" aria-hidden="true">
                                <path d="M7 8V3h10v5" />

                                <path d="M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />

                                <path d="M7 14h10v7H7z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            <!-- Article content -->

            <section id="article-content" ref="articleContainer" class="bg-surface py-12
        sm:py-16 lg:py-20">
                <div class="mx-auto grid max-w-7xl
          items-start gap-10 px-6
          lg:grid-cols-[minmax(0,1fr)_340px]
          xl:gap-14">
                    <div class="min-w-0" :class="articleTextClass">
                        <NewsPostArticleBody :article="article" />
                    </div>

                    <aside class="min-w-0 print:hidden">
                        <NewsPostSidebar :article="article" :most-read="mostReadArticles.slice(0, 6)
                            " />
                    </aside>
                </div>
            </section>

            <!-- Continue reading -->

            <section v-if="continueReadingArticles.length" class="border-y border-line
        bg-surface-2 py-12 print:hidden">
                <div class="mx-auto max-w-7xl px-6">
                    <div class="mb-6 flex items-end
            justify-between gap-4">
                        <div>
                            <p class="text-xs font-bold
                uppercase tracking-[0.18em]
                text-indigo-600">
                                Continue reading
                            </p>

                            <h2 class="mt-2 text-2xl font-black
                tracking-tight text-fg">
                                More from this category
                            </h2>
                        </div>

                        <NuxtLink :to="`/news/category/${article.category}`
                            " class="hidden text-sm font-bold
              text-indigo-700 transition
              hover:text-indigo-900 sm:block">
                            View category →
                        </NuxtLink>
                    </div>

                    <div class="grid gap-5 md:grid-cols-2">
                        <NuxtLink v-for="relatedArticle in continueReadingArticles" :key="relatedArticle.id" :to="`/news/posts/${relatedArticle.slug}`
                            " class="group grid overflow-hidden
              rounded-3xl border
              border-line bg-surface
              shadow-sm transition
              hover:-translate-y-1
              hover:border-indigo-200
              hover:shadow-xl
              sm:grid-cols-[150px_minmax(0,1fr)]">
                            <div class="relative min-h-44
                overflow-hidden bg-surface-3
                sm:min-h-full">
                                <img v-if="relatedArticle.image" :src="relatedArticle.image" :alt="relatedArticle.title"
                                    loading="lazy" class="absolute inset-0
                  h-full w-full object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-105">

                                <div v-else class="absolute inset-0
                  flex items-center
                  justify-center
                  bg-gradient-to-br
                  from-slate-100
                  to-slate-300 text-3xl">
                                    📰
                                </div>
                            </div>

                            <div class="p-5">
                                <p class="text-xs font-bold
                  uppercase tracking-wider
                  text-indigo-600">
                                    {{
                                        relatedArticle.categoryName
                                    }}
                                </p>

                                <h3 class="mt-3 line-clamp-2
                  text-lg font-black
                  leading-7 text-fg
                  transition
                  group-hover:text-indigo-700">
                                    {{ relatedArticle.title }}
                                </h3>

                                <p class="mt-3 line-clamp-2
                  text-sm leading-6
                  text-fg-muted">
                                    {{ relatedArticle.excerpt }}
                                </p>
                            </div>
                        </NuxtLink>
                    </div>
                </div>
            </section>

            <!-- Related articles -->

            <NewsPostRelatedArticles v-if="relatedArticles.length" :articles="relatedArticles" :category-name="article.categoryName
                " />

            <!-- Newsletter -->

            <NewsHomeNewsletter />
        </template>

        <!-- Toast -->

        <Transition enter-active-class="
        transition duration-200
      " enter-from-class="
        translate-y-4 opacity-0
      " enter-to-class="
        translate-y-0 opacity-100
      " leave-active-class="
        transition duration-200
      " leave-from-class="
        translate-y-0 opacity-100
      " leave-to-class="
        translate-y-4 opacity-0
      ">
            <div v-if="toastMessage" role="status" aria-live="polite" class="fixed bottom-6 left-1/2
        z-[100] -translate-x-1/2
        whitespace-nowrap rounded-2xl
        bg-accent text-accent-fg px-5 py-3
        text-xs font-semibold
        text-white shadow-2xl
        print:hidden">
                {{ toastMessage }}
            </div>
        </Transition>
    </main>
</template>

<style>
.article-text-small {
    --article-body-size: 15px;
    --article-body-line-height: 1.8;
}

.article-text-normal {
    --article-body-size: 17px;
    --article-body-line-height: 1.9;
}

.article-text-large {
    --article-body-size: 19px;
    --article-body-line-height: 2;
}

@media print {

    header,
    footer,
    nav,
    button {
        display: none !important;
    }

    main {
        background: white !important;
    }

    article {
        width: 100% !important;
        max-width: none !important;
    }
}
</style>