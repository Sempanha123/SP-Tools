<script setup lang="ts">
import type { NewsSidebarTopicItem } from '~/components/news/shared/TopicPanel.vue'

const {
  mostReadArticles,
  trendingTags,
} = useNewsData()

const tagToSlug = (tag: string) =>
  tag
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const trendingTopicItems = computed<NewsSidebarTopicItem[]>(
  () =>
    trendingTags.value.map(tag => ({
      label: tag.name,
      to: `/news/tag/${tagToSlug(tag.name)}`,
      count: tag.count,
      prefix: '#',
    })),
)
</script>

<template>
  <aside class="min-w-0 space-y-4 lg:sticky lg:top-32">
    <NewsSharedMostReadPanel
      :articles="mostReadArticles"
    />

    <NewsSharedTopicPanel
      kicker="Trending"
      title="Topic radar"
      :items="trendingTopicItems"
      footer-label="Explore all topics"
      footer-to="/news/search"
    />

    <section class="sp-reveal relative overflow-hidden rounded-[21px] border border-line bg-surface-3 p-5">
      <div class="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-positive/10 blur-3xl" />

      <div class="relative flex items-start gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-positive-soft text-positive">
          ✓
        </span>

        <div>
          <p class="text-[8px] font-bold uppercase tracking-[.13em] text-fg-subtle">
            News standards
          </p>

          <h3 class="mt-1.5 text-[14px] font-[690] text-fg">
            Clear context, visible signals
          </h3>

          <p class="mt-1.5 text-[11px] leading-5 text-fg-muted">
            Stories surface sources, timestamps, categories and useful context.
          </p>
        </div>
      </div>
    </section>
  </aside>
</template>
