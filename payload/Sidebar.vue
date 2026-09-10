<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

interface Props {
  article: NewsArticle
  mostRead: NewsArticle[]
}

const props = defineProps<Props>()
const { timeAgo, formatViews } = useNewsData()

interface TocItem {
  id: string
  title: string
}

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const tableOfContents = computed<TocItem[]>(() => {
  const result: TocItem[] = []

  const sections = props.article.sections ?? []
  if (sections.length) {
    sections.forEach((section, index) => {
      const title = section.title?.trim() || `Section ${index + 1}`
      result.push({
        id: section.id?.trim() || slugify(title) || `article-section-${index + 1}`,
        title,
      })
    })
  } else {
    result.push({ id: 'article-summary', title: 'Article summary' })
  }

  if ((props.article.keyPoints ?? []).length) {
    result.splice(Math.min(2, result.length), 0, {
      id: 'key-points',
      title: 'Key points',
    })
  }

  if ((props.article.timeline ?? []).length) {
    result.push({ id: 'story-timeline', title: 'Story timeline' })
  }

  if ((props.article.sources ?? []).length) {
    result.push({ id: 'article-sources', title: 'Sources' })
  }

  return result
})

const activeSectionId = ref('')
let observer: IntersectionObserver | null = null

const initObserver = async () => {
  if (!import.meta.client) return
  await nextTick()

  observer?.disconnect()
  activeSectionId.value = tableOfContents.value[0]?.id ?? ''

  observer = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

      if (visible[0]?.target.id) {
        activeSectionId.value = visible[0].target.id
      }
    },
    {
      rootMargin: '-145px 0px -68% 0px',
      threshold: [0, 0.1, 0.25],
    },
  )

  tableOfContents.value.forEach(item => {
    const element = document.getElementById(item.id)
    if (element) observer?.observe(element)
  })
}

const scrollToSection = (id: string) => {
  if (!import.meta.client) return
  const element = document.getElementById(id)
  if (!element) return

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })

  activeSectionId.value = id
}

const readMore = computed(() =>
  props.mostRead
    .filter(item => item.id !== props.article.id)
    .slice(0, 5),
)

watch(
  () => props.article.slug,
  () => initObserver(),
)

watch(
  tableOfContents,
  () => initObserver(),
  { deep: true },
)

onMounted(() => initObserver())
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <aside class="sp-reader-rail space-y-5 xl:sticky xl:top-28">
    <section class="sp-reader-rail-card overflow-hidden rounded-[24px] border border-line bg-elevated shadow-lift">
      <header class="border-b border-line px-5 py-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[9px] font-bold uppercase tracking-[0.17em] text-accent">
              In this story
            </p>
            <h2 class="mt-2 text-xl font-bold tracking-[-0.035em] text-fg">
              Reading guide
            </h2>
            <p class="mt-2 text-[11px] leading-5 text-fg-subtle">
              Jump to the part you need.
            </p>
          </div>

          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-line bg-surface-2 text-accent">
            ≡
          </div>
        </div>
      </header>

      <nav aria-label="Article contents" class="p-2.5">
        <button
          v-for="(item, index) in tableOfContents"
          :key="item.id"
          type="button"
          class="group flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left transition"
          :class="
            activeSectionId === item.id
              ? 'bg-accent-soft text-accent'
              : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
          "
          @click="scrollToSection(item.id)"
        >
          <span
            class="flex h-7 min-w-7 items-center justify-center rounded-[9px] text-[8px] font-black"
            :class="
              activeSectionId === item.id
                ? 'bg-accent text-accent-fg'
                : 'border border-line bg-surface text-fg-subtle'
            "
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>

          <span class="min-w-0 flex-1 text-[11px] font-semibold leading-5">
            {{ item.title }}
          </span>

          <span class="text-[10px] transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </nav>

      <div class="flex items-center justify-between border-t border-line px-5 py-4">
        <span class="text-[9px] font-semibold text-fg-subtle">Reading time</span>
        <span class="rounded-full bg-accent-soft px-3 py-1.5 text-[9px] font-bold text-accent">
          {{ article.readTime }}
        </span>
      </div>
    </section>

    <section
      v-if="readMore.length"
      class="sp-reader-rail-card overflow-hidden rounded-[24px] border border-line bg-elevated shadow-lift"
    >
      <header class="flex items-end justify-between gap-4 border-b border-line px-5 py-5">
        <div>
          <p class="text-[9px] font-bold uppercase tracking-[0.17em] text-accent">
            Read next
          </p>
          <h2 class="mt-2 text-xl font-bold tracking-[-0.035em] text-fg">
            More news
          </h2>
        </div>

        <NuxtLink
          :to="{ path: '/news/search', query: { sort: 'popular' } }"
          class="text-[9px] font-bold text-fg-subtle transition hover:text-accent"
        >
          View all →
        </NuxtLink>
      </header>

      <div class="divide-y divide-line">
        <NuxtLink
          v-for="(item, index) in readMore"
          :key="item.id"
          :to="`/news/posts/${item.slug}`"
          class="group grid grid-cols-[92px_minmax(0,1fr)] gap-3 px-4 py-4 transition hover:bg-surface-2"
        >
          <div class="relative h-[78px] overflow-hidden rounded-[14px] bg-surface-3">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              loading="lazy"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            >
            <div v-else class="flex h-full items-center justify-center text-lg text-fg-subtle">
              N
            </div>

            <span class="absolute left-1.5 top-1.5 flex h-6 min-w-6 items-center justify-center rounded-[8px] bg-surface/90 px-1 text-[8px] font-black text-accent shadow-xs backdrop-blur">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
          </div>

          <div class="min-w-0">
            <span class="text-[8px] font-bold uppercase tracking-[0.12em] text-accent">
              {{ item.categoryName }}
            </span>

            <h3 class="mt-1.5 line-clamp-3 text-[12px] font-bold leading-[1.35rem] text-fg transition group-hover:text-accent">
              {{ item.title }}
            </h3>

            <p class="mt-1.5 text-[8px] text-fg-subtle">
              {{ timeAgo(item.publishedAt) }} · {{ formatViews(item.views) }} views
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </aside>
</template>
