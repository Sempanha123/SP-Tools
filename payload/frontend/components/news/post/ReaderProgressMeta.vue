<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

const props = defineProps<{
  article: NewsArticle
  progress: number
}>()

const cleanStrings = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []

const estimatedWordCount = computed(() => {
  const sections = props.article.sections ?? []

  const sectionText = sections.flatMap(section => [
    section.title ?? '',
    ...cleanStrings(section.paragraphs),
    ...cleanStrings(section.bullets),
    section.quote ?? '',
    section.note ?? '',
    section.youtubeCaption ?? '',
  ])

  const timelineText = (props.article.timeline ?? []).flatMap(item => [
    item.time ?? '',
    item.title ?? '',
    item.description ?? '',
  ])

  const sourceText = (props.article.sources ?? []).flatMap(source => [
    source.name ?? '',
    source.type ?? '',
    source.description ?? '',
  ])

  return [
    props.article.title,
    props.article.excerpt,
    props.article.lead ?? '',
    ...cleanStrings(props.article.keyPoints),
    ...sectionText,
    ...timelineText,
    ...sourceText,
  ].join(' ').trim().split(/\s+/).filter(Boolean).length
})

const estimatedMinutes = computed(() =>
  Math.max(1, Math.ceil(estimatedWordCount.value / 220)),
)

const roundedProgress = computed(() =>
  Math.min(100, Math.max(0, Math.round(props.progress))),
)
</script>

<template>
  <div class="sp-reader-progress-meta hidden min-w-0 items-center gap-3 md:flex">
    <div class="sp-reader-progress-badge">
      <span>{{ roundedProgress }}</span><small>%</small>
    </div>

    <div class="min-w-0">
      <p class="text-[8px] font-bold uppercase tracking-[.15em] text-fg-subtle">
        Reading progress
      </p>
      <p class="mt-1 max-w-[270px] truncate text-[11px] font-semibold text-fg-muted">
        {{ article.title }}
      </p>
    </div>

    <div class="sp-reader-progress-stats">
      <div>
        <span>Words</span>
        <strong>{{ estimatedWordCount.toLocaleString('en-US') }}</strong>
      </div>
      <div>
        <span>Read</span>
        <strong>{{ estimatedMinutes }} min</strong>
      </div>
    </div>
  </div>
</template>
