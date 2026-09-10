<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

const props = defineProps<{
  article: NewsArticle
  mostRead: NewsArticle[]
}>()

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

const toc = computed(() => {
  const items = (props.article.sections ?? []).map(
    (section, index) => ({
      id:
        section.id?.trim()
        || slugify(section.title)
        || `section-${index + 1}`,
      title:
        section.title?.trim()
        || `Section ${index + 1}`,
    }),
  )

  if ((props.article.keyPoints ?? []).length) {
    items.splice(Math.min(1, items.length), 0, {
      id: 'key-points',
      title: 'What to know',
    })
  }

  if ((props.article.timeline ?? []).length) {
    items.push({ id: 'story-timeline', title: 'Timeline' })
  }

  if ((props.article.sources ?? []).length) {
    items.push({ id: 'article-sources', title: 'Sources' })
  }

  return items
})

const relatedTopics = computed(() => {
  const items = [
    {
      label: props.article.categoryName,
      to: `/news/category/${props.article.category}`,
      primary: true,
      prefix: '',
    },
    ...(props.article.tags ?? []).map(tag => ({
      label: tag,
      to: `/news/tag/${slugify(tag)}`,
      primary: false,
      prefix: '#',
    })),
  ]

  const seen = new Set<string>()

  return items
    .filter(item => {
      const label = item.label.trim()
      if (!label) return false
      const key = label.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, 7)
})

const activeId = ref('')
let observer: IntersectionObserver | null = null

const initObserver = async () => {
  if (!import.meta.client) return
  await nextTick()
  observer?.disconnect()
  activeId.value = toc.value[0]?.id ?? ''

  observer = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort(
          (a, b) =>
            a.boundingClientRect.top
            - b.boundingClientRect.top,
        )

      if (visible[0]?.target.id) {
        activeId.value = visible[0].target.id
      }
    },
    {
      rootMargin: '-150px 0px -64% 0px',
      threshold: [0, 0.1, 0.25],
    },
  )

  toc.value.forEach(item => {
    const element = document.getElementById(item.id)
    if (element) observer?.observe(element)
  })
}

const jumpTo = (id: string) => {
  if (!import.meta.client) return
  const element = document.getElementById(id)
  if (!element) return

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })

  activeId.value = id
}

watch(() => props.article.slug, () => initObserver())
watch(toc, () => initObserver(), { deep: true })
onMounted(() => initObserver())
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <aside class="space-y-6 xl:sticky xl:top-[160px]">
    <section
      v-if="toc.length"
      class="overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_14px_40px_rgba(15,23,42,0.05)]"
    >
      <header class="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
        <div>
          <span class="text-[9px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
            In this story
          </span>
          <h2 class="mt-2 text-xl font-bold tracking-[-0.03em] text-fg">
            Reading guide
          </h2>
        </div>

        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300">
          ≡
        </div>
      </header>

      <nav class="p-3" aria-label="Article contents">
        <button
          v-for="(item, index) in toc"
          :key="item.id"
          type="button"
          class="grid w-full grid-cols-[28px_minmax(0,1fr)] items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-semibold transition"
          :class="activeId === item.id
            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300'
            : 'text-fg-muted hover:bg-surface-2 hover:text-fg'"
          @click="jumpTo(item.id)"
        >
          <span class="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-surface-2 text-[8px] font-bold">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <span class="truncate">{{ item.title }}</span>
        </button>
      </nav>
    </section>

    <section
      v-if="relatedTopics.length"
      class="overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_14px_40px_rgba(15,23,42,0.05)]"
    >
      <header class="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
        <div>
          <span class="text-[9px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
            Explore more
          </span>
          <h2 class="mt-2 text-xl font-bold tracking-[-0.03em] text-fg">
            Related topics
          </h2>
          <p class="mt-2 text-xs leading-5 text-fg-subtle">
            More coverage connected to this story.
          </p>
        </div>

        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300">
          #
        </div>
      </header>

      <div class="p-5">
        <div class="flex flex-wrap gap-2">
          <NuxtLink
            v-for="topic in relatedTopics"
            :key="`${topic.to}-${topic.label}`"
            :to="topic.to"
            class="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3.5 py-2 text-[10px] font-semibold text-fg-muted transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:border-indigo-400/20 dark:hover:bg-indigo-400/10 dark:hover:text-indigo-300"
            :class="topic.primary ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-300' : ''"
          >
            <span v-if="topic.prefix">{{ topic.prefix }}</span>
            {{ topic.label }}
            <span class="opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-100">↗</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <NewsSharedMostReadPanel
      :articles="mostRead"
      :current-article-id="article.id"
      subtitle="Popular stories readers are opening now."
    />
  </aside>
</template>
