<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

const props = defineProps<{
  article: NewsArticle
  mostRead: NewsArticle[]
}>()

const { timeAgo, formatViews } = useNewsData()

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
    items.splice(
      Math.min(1, items.length),
      0,
      {
        id: 'key-points',
        title: 'What to know',
      },
    )
  }

  if ((props.article.timeline ?? []).length) {
    items.push({
      id: 'story-timeline',
      title: 'Timeline',
    })
  }

  if ((props.article.sources ?? []).length) {
    items.push({
      id: 'article-sources',
      title: 'Sources',
    })
  }

  return items
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

const readNext = computed(() =>
  props.mostRead
    .filter(item => item.id !== props.article.id)
    .slice(0, 4),
)

watch(() => props.article.slug, () => initObserver())
watch(toc, () => initObserver(), { deep: true })
onMounted(() => initObserver())
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <aside class="sp-v19-sidebar space-y-7 xl:sticky xl:top-[160px]">
    <section
      v-if="toc.length"
      class="sp-v19-toc"
    >
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="sp-v19-kicker">
            In this article
          </p>

          <h2 class="mt-1.5 text-[20px] font-[780] tracking-[-.04em] text-fg">
            Reading guide
          </h2>
        </div>

        <span class="sp-v19-toc-icon">
          ≡
        </span>
      </div>

      <nav
        aria-label="Article contents"
        class="mt-4"
      >
        <button
          v-for="(item, index) in toc"
          :key="item.id"
          type="button"
          class="sp-v19-toc-row"
          :class="activeId === item.id ? 'sp-v19-toc-row-active' : ''"
          @click="jumpTo(item.id)"
        >
          <span class="sp-v19-toc-number">
            {{ String(index + 1).padStart(2, '0') }}
          </span>

          <span class="min-w-0 flex-1">
            {{ item.title }}
          </span>
        </button>
      </nav>
    </section>

    <section v-if="readNext.length">
      <div class="flex items-end justify-between gap-3">
        <div>
          <p class="sp-v19-kicker">
            More news
          </p>

          <h2 class="mt-1.5 text-[24px] font-[800] tracking-[-.045em] text-fg">
            Read next
          </h2>
        </div>

        <NuxtLink
          :to="{ path: '/news/search', query: { sort: 'popular' } }"
          class="text-[9px] font-bold text-fg-subtle transition hover:text-accent"
        >
          View all →
        </NuxtLink>
      </div>

      <div class="sp-v19-read-next mt-4">
        <NuxtLink
          v-for="(item, index) in readNext"
          :key="item.id"
          :to="`/news/posts/${item.slug}`"
          class="sp-v19-read-next-item group"
        >
          <div class="sp-v19-read-next-image">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              loading="lazy"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            >

            <span class="sp-v19-read-next-index">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
          </div>

          <div class="min-w-0">
            <p class="text-[8px] font-bold uppercase tracking-[.12em] text-accent">
              {{ item.categoryName }}
            </p>

            <h3 class="mt-1.5 line-clamp-3 text-[14px] font-[740] leading-[1.28rem] tracking-[-.018em] text-fg transition group-hover:text-accent">
              {{ item.title }}
            </h3>

            <p class="mt-1.5 text-[8px] text-fg-subtle">
              {{ timeAgo(item.publishedAt) }} · {{ formatViews(item.views) }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </aside>
</template>
