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
  value.trim().toLowerCase().normalize('NFKD')
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
    result.splice(Math.min(2, result.length), 0, { id: 'key-points', title: 'Key points' })
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

      if (visible[0]?.target.id) activeSectionId.value = visible[0].target.id
    },
    {
      rootMargin: '-145px 0px -68% 0px',
      threshold: [0, 0.1, 0.25],
    },
  )

  tableOfContents.value.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) observer?.observe(el)
  })
}

const scrollToSection = (id: string) => {
  if (!import.meta.client) return

  const el = document.getElementById(id)
  if (!el) return

  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeSectionId.value = id
}

const readNext = computed(() =>
  props.mostRead
    .filter(item => item.id !== props.article.id)
    .slice(0, 6),
)

watch(() => props.article.slug, () => initObserver())
watch(tableOfContents, () => initObserver(), { deep: true })
onMounted(() => initObserver())
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <aside class="sp-reader-rail w-full space-y-5 xl:sticky xl:top-28">
    <section class="sp-reader-rail-card overflow-hidden rounded-[24px] border border-line bg-elevated shadow-lift">
      <header class="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <p class="text-[8px] font-bold uppercase tracking-[.16em] text-accent">
            In this story
          </p>
          <h2 class="mt-1.5 text-[20px] font-bold tracking-[-.035em] text-fg">
            Reading guide
          </h2>
        </div>

        <span class="flex h-9 w-9 items-center justify-center rounded-[11px] border border-line bg-surface-2 text-accent">
          ≡
        </span>
      </header>

      <nav aria-label="Article contents" class="p-2">
        <button
          v-for="(item, index) in tableOfContents"
          :key="item.id"
          type="button"
          class="group flex w-full items-center gap-3 rounded-[13px] px-3 py-2.5 text-left transition"
          :class="
            activeSectionId === item.id
              ? 'bg-accent-soft text-accent'
              : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
          "
          @click="scrollToSection(item.id)"
        >
          <span
            class="flex h-6 min-w-6 items-center justify-center rounded-[8px] text-[7px] font-black"
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
        </button>
      </nav>
    </section>

    <section
      v-if="readNext.length"
      class="sp-read-next overflow-hidden rounded-[28px] border border-line bg-elevated shadow-lift"
    >
      <header class="sp-read-next-header relative overflow-hidden border-b border-line px-6 py-7">
        <div class="sp-read-next-aura pointer-events-none absolute inset-0" />

        <div class="relative flex items-end justify-between gap-5">
          <div>
            <p class="text-[9px] font-bold uppercase tracking-[.17em] text-accent">
              Read next
            </p>

            <h2 class="mt-2 text-[36px] font-[820] leading-[.92] tracking-[-.055em] text-fg">
              More news
            </h2>

            <p class="mt-3 max-w-[300px] text-[11px] leading-5 text-fg-subtle">
              Full-size previews with enough headline space to choose the next story.
            </p>
          </div>

          <NuxtLink
            :to="{ path: '/news/search', query: { sort: 'popular' } }"
            class="shrink-0 rounded-full border border-line bg-surface px-3 py-2 text-[9px] font-bold text-fg-muted transition hover:border-accent/20 hover:text-accent"
          >
            All →
          </NuxtLink>
        </div>
      </header>

      <div class="divide-y divide-line">
        <NuxtLink
          v-for="(item, index) in readNext"
          :key="item.id"
          :to="`/news/posts/${item.slug}`"
          class="sp-read-next-item group grid grid-cols-[168px_minmax(0,1fr)] gap-5 px-5 py-5 transition hover:bg-surface-2"
        >
          <div class="relative h-[124px] overflow-hidden rounded-[18px] bg-surface-3">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              loading="lazy"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            >

            <div v-else class="flex h-full items-center justify-center text-xl text-fg-subtle">
              N
            </div>

            <span class="absolute left-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-[8px] border border-white/15 bg-black/45 px-1 text-[8px] font-black text-white backdrop-blur">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
          </div>

          <div class="min-w-0 self-center">
            <span class="text-[8px] font-bold uppercase tracking-[.12em] text-accent">
              {{ item.categoryName }}
            </span>

            <h3 class="sp-read-next-title mt-2 text-[17px] font-[790] leading-[1.4rem] tracking-[-.022em] text-fg transition group-hover:text-accent">
              {{ item.title }}
            </h3>

            <p class="mt-2.5 text-[9px] text-fg-subtle">
              {{ timeAgo(item.publishedAt) }} · {{ formatViews(item.views) }} views
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </aside>
</template>
