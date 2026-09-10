<script setup lang="ts">
import type {
  NewsArticle,
  NewsArticleSection,
} from '~/types/news'

const props = defineProps<{
  article: NewsArticle
}>()

interface NormalizedSection extends NewsArticleSection {
  id: string
  paragraphs: string[]
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

const cleanList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === 'string'
          && item.trim().length > 0,
      )
    : []

const sections = computed<NormalizedSection[]>(() => {
  const source = props.article.sections ?? []

  if (!source.length) {
    return [
      {
        id: 'article-summary',
        title: 'Article summary',
        paragraphs: [
          props.article.lead?.trim(),
          props.article.excerpt?.trim(),
        ].filter(
          (value): value is string =>
            Boolean(value),
        ),
      },
    ]
  }

  return source.map((section, index) => ({
    ...section,
    id:
      section.id?.trim()
      || slugify(section.title)
      || `section-${index + 1}`,
    title:
      section.title?.trim()
      || `Section ${index + 1}`,
    paragraphs: cleanList(section.paragraphs),
    bullets: cleanList(section.bullets),
    gallery: cleanList(section.gallery),
    quote: section.quote?.trim() || null,
    quoteAttribution:
      section.quoteAttribution?.trim()
      || null,
    note: section.note?.trim() || null,
    image: section.image?.trim() || null,
    imageAlt: section.imageAlt?.trim() || null,
    imageCaption:
      section.imageCaption?.trim()
      || null,
    imageCredit:
      section.imageCredit?.trim()
      || null,
    imagePosition:
      section.imagePosition === 'before'
        ? 'before'
        : 'after',
    youtubeUrl:
      section.youtubeUrl?.trim()
      || null,
    youtubeCaption:
      section.youtubeCaption?.trim()
      || null,
  }))
})

const keyPoints = computed(() =>
  cleanList(props.article.keyPoints),
)

const sources = computed(() =>
  props.article.sources ?? [],
)

const timeline = computed(() =>
  props.article.timeline ?? [],
)

const showLead = computed(() => {
  const lead = props.article.lead?.trim()

  return Boolean(
    lead
    && lead !== props.article.excerpt?.trim(),
  )
})
</script>

<template>
  <article class="sp-v19-article-body">
    <p
      v-if="showLead"
      class="sp-v19-lead sp-v19-view-reveal"
    >
      {{ article.lead }}
    </p>

    <section
      v-if="keyPoints.length"
      id="key-points"
      class="sp-v19-key-points sp-v19-view-reveal"
    >
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="sp-v19-kicker">
            Quick read
          </p>
          <h2 class="mt-2 text-[22px] font-[780] tracking-[-.035em] text-fg">
            What to know
          </h2>
        </div>

        <span class="sp-v19-key-count">
          {{ keyPoints.length }}
        </span>
      </div>

      <ul class="mt-5 grid gap-3">
        <li
          v-for="point in keyPoints"
          :key="point"
          class="flex gap-3"
        >
          <span class="sp-v19-check">
            ✓
          </span>

          <span>{{ point }}</span>
        </li>
      </ul>
    </section>

    <section
      v-for="(section, sectionIndex) in sections"
      :id="section.id"
      :key="section.id"
      class="sp-v19-section sp-v19-view-reveal scroll-mt-36"
    >
      <figure
        v-if="section.image && section.imagePosition === 'before'"
        class="sp-v19-inline-figure"
      >
        <img
          :src="section.image"
          :alt="section.imageAlt || section.title"
          loading="lazy"
        >

        <figcaption
          v-if="section.imageCaption || section.imageCredit"
          class="sp-v19-caption"
        >
          <span>{{ section.imageCaption }}</span>
          <span v-if="section.imageCredit">{{ section.imageCredit }}</span>
        </figcaption>
      </figure>

      <div class="sp-v19-section-heading">
        <span class="sp-v19-section-index">
          {{ String(sectionIndex + 1).padStart(2, '0') }}
        </span>

        <h2 class="sp-v19-section-title">
          {{ section.title }}
        </h2>
      </div>

      <div class="sp-v19-copy">
        <p
          v-for="(paragraph, index) in section.paragraphs"
          :key="`${section.id}-p-${index}`"
          :class="sectionIndex === 0 && index === 0 ? 'sp-v19-first-paragraph' : ''"
        >
          {{ paragraph }}
        </p>
      </div>

      <ul
        v-if="section.bullets?.length"
        class="sp-v19-bullets"
      >
        <li
          v-for="bullet in section.bullets"
          :key="bullet"
        >
          <span class="sp-v19-bullet-dot" />
          <span>{{ bullet }}</span>
        </li>
      </ul>

      <blockquote
        v-if="section.quote"
        class="sp-v19-quote"
      >
        <span class="sp-v19-quote-mark">“</span>

        <p>{{ section.quote }}</p>

        <footer v-if="section.quoteAttribution">
          {{ section.quoteAttribution }}
        </footer>
      </blockquote>

      <aside
        v-if="section.note"
        class="sp-v19-note"
      >
        <span class="sp-v19-note-label">
          Note
        </span>
        <span>{{ section.note }}</span>
      </aside>

      <figure
        v-if="section.image && section.imagePosition !== 'before'"
        class="sp-v19-inline-figure"
      >
        <img
          :src="section.image"
          :alt="section.imageAlt || section.title"
          loading="lazy"
        >

        <figcaption
          v-if="section.imageCaption || section.imageCredit"
          class="sp-v19-caption"
        >
          <span>{{ section.imageCaption }}</span>
          <span v-if="section.imageCredit">{{ section.imageCredit }}</span>
        </figcaption>
      </figure>

      <NewsPostSectionMedia
        :gallery="section.gallery ?? []"
        :youtube-url="section.youtubeUrl ?? null"
        :youtube-caption="section.youtubeCaption ?? null"
      />
    </section>

    <section
      v-if="timeline.length"
      id="story-timeline"
      class="sp-v19-support-section sp-v19-view-reveal scroll-mt-36"
    >
      <p class="sp-v19-kicker">
        Timeline
      </p>

      <h2 class="sp-v19-support-title">
        What happened
      </h2>

      <div class="sp-v19-timeline mt-6">
        <article
          v-for="item in timeline"
          :key="`${item.time}-${item.title}`"
          class="sp-v19-timeline-item"
        >
          <span class="sp-v19-timeline-dot" />

          <p
            v-if="item.time"
            class="text-[9px] font-bold uppercase tracking-[.12em] text-accent"
          >
            {{ item.time }}
          </p>

          <h3 class="mt-1 text-[16px] font-bold tracking-[-.02em] text-fg">
            {{ item.title }}
          </h3>

          <p class="mt-1.5 text-[13px] leading-6 text-fg-muted">
            {{ item.description }}
          </p>
        </article>
      </div>
    </section>

    <section
      v-if="sources.length"
      id="article-sources"
      class="sp-v19-support-section sp-v19-view-reveal scroll-mt-36"
    >
      <p class="sp-v19-kicker">
        Sources
      </p>

      <h2 class="sp-v19-support-title">
        Sources used
      </h2>

      <div class="sp-v19-sources mt-5">
        <article
          v-for="source in sources"
          :key="`${source.name}-${source.url}`"
          class="sp-v19-source-row"
        >
          <div class="min-w-0">
            <p class="text-[13px] font-bold text-fg">
              {{ source.name }}
            </p>

            <p
              v-if="source.type"
              class="mt-1 text-[8px] font-semibold uppercase tracking-[.12em] text-fg-subtle"
            >
              {{ source.type }}
            </p>

            <p
              v-if="source.description"
              class="mt-2 text-[12px] leading-6 text-fg-muted"
            >
              {{ source.description }}
            </p>
          </div>

          <a
            v-if="source.url"
            :href="source.url"
            target="_blank"
            rel="noopener noreferrer"
            class="shrink-0 text-[10px] font-bold text-accent hover:underline"
          >
            Open ↗
          </a>
        </article>
      </div>
    </section>

    <section
      v-if="article.methodologyNote || article.correctionNote"
      class="sp-v19-report-notes sp-v19-view-reveal"
    >
      <div v-if="article.methodologyNote">
        <p class="sp-v19-kicker">
          About this report
        </p>

        <p class="mt-2">
          {{ article.methodologyNote }}
        </p>
      </div>

      <div
        v-if="article.correctionNote"
        class="mt-4 border-t border-line pt-4"
      >
        <p class="sp-v19-kicker">
          Correction
        </p>

        <p class="mt-2">
          {{ article.correctionNote }}
        </p>
      </div>
    </section>
  </article>
</template>
