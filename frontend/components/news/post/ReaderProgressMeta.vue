<script setup lang="ts">
import type { NewsArticle } from '~/types/news'

const props = defineProps<{
  article: NewsArticle
  progress: number
}>()

const cleanStrings = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === 'string'
          && item.trim().length > 0,
      )
    : []

const wordCount = computed(() => {
  const sectionWords = (props.article.sections ?? []).flatMap(
    section => [
      section.title ?? '',
      ...cleanStrings(section.paragraphs),
      ...cleanStrings(section.bullets),
      section.quote ?? '',
      section.note ?? '',
      section.youtubeCaption ?? '',
    ],
  )

  return [
    props.article.title,
    props.article.excerpt,
    props.article.lead ?? '',
    ...cleanStrings(props.article.keyPoints),
    ...sectionWords,
  ]
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length
})

const minutes = computed(() =>
  Math.max(
    1,
    props.article.readTimeMinutes
    || Math.ceil(wordCount.value / 220),
  ),
)

const roundedProgress = computed(() =>
  Math.min(
    100,
    Math.max(0, Math.round(props.progress)),
  ),
)

const progressStyle = computed(() => ({
  '--sp-v19-progress':
    `${roundedProgress.value * 3.6}deg`,
}))
</script>

<template>
  <div class="sp-v19-progress-meta min-w-0">
    <div class="flex min-w-0 items-center gap-3">
      <div
        class="sp-v19-progress-ring"
        :style="progressStyle"
      >
        <span>{{ roundedProgress }}</span>
      </div>

      <div class="hidden min-w-0 md:block">
        <p class="text-[8px] font-bold uppercase tracking-[.14em] text-fg-subtle">
          Reading progress
        </p>

        <p class="mt-0.5 max-w-[300px] truncate text-[11px] font-semibold text-fg-muted">
          {{ article.title }}
        </p>
      </div>

      <div class="hidden items-center gap-3 border-l border-line pl-3 lg:flex">
        <span class="text-[9px] font-semibold text-fg-subtle">
          {{ minutes }} min
        </span>

        <span class="text-[9px] font-semibold text-fg-subtle">
          {{ wordCount.toLocaleString('en-US') }} words
        </span>
      </div>
    </div>
  </div>
</template>
