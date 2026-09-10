<script setup lang="ts">
import type { FacebookResult } from '~/composables/useMediaApi'

const { findTool } = useTools()
const { fetchFacebook, proxyUrl } = useMediaApi()

const tool = findTool('facebook-video-download')!

useSeoMeta({
  title: 'Facebook Video Downloader — Save Reels and Videos in HD | SP-Tools',
  description:
    'Paste a public Facebook video or reel link to list every available MP4 quality, then save it directly. Free, no account needed.',
  ogTitle: 'Facebook Video Downloader | SP-Tools',
  ogDescription: 'Download public Facebook videos and reels in HD.',
})

/* ------------------------------------------------------------------ state */

const url = ref('')
const loading = ref(false)
const errorMessage = ref('')
const result = ref<FacebookResult | null>(null)

let controller: AbortController | null = null

const reset = () => {
  controller?.abort()
  url.value = ''
  result.value = null
  errorMessage.value = ''
  loading.value = false
}

onUnmounted(() => controller?.abort())

/* ---------------------------------------------------------------- resolve */

const submit = async () => {
  controller?.abort()
  const request = new AbortController()
  controller = request

  loading.value = true
  errorMessage.value = ''
  result.value = null

  try {
    const data = await fetchFacebook(url.value.trim(), request.signal)

    if (!data?.formats?.length && !data?.video_url) {
      throw new Error(
        'No downloadable formats were returned. The post may be private or age-restricted.',
      )
    }

    result.value = data
  } catch (error) {
    if (request.signal.aborted) return

    errorMessage.value =
      error instanceof Error ? error.message : 'Could not fetch that video.'
  } finally {
    if (!request.signal.aborted) loading.value = false
  }
}

const onInputError = (problem: string) => {
  errorMessage.value = problem
}

/* --------------------------------------------------------------- formats */

const fileStem = computed(() => {
  const source = result.value?.title || result.value?.page_name || 'facebook'
  return (
    source
      .toLowerCase()
      .replace(/[^\w\s-]+/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60) || 'facebook'
  )
})

const durationLabel = computed(() => {
  const seconds = result.value?.duration
  if (!seconds || seconds <= 0) return null

  const minutes = Math.floor(seconds / 60)
  const remainder = Math.round(seconds % 60)
  return `${minutes}:${String(remainder).padStart(2, '0')}`
})

const stats = computed(() => {
  const rows: { label: string; value: string }[] = []
  if (durationLabel.value) rows.push({ label: 'Duration', value: durationLabel.value })
  rows.push({ label: 'Formats', value: String(formats.value.length) })
  return rows
})

interface Rendition {
  key: string
  label: string
  meta: string
  tag: string
  tone: 'accent' | 'neutral' | 'positive'
  url: string
  filename: string
  recommended?: boolean
  /** Sort weight — higher is better quality. */
  weight: number
}

/**
 * yt_dlp format labels are inconsistent ("hd", "sd", "dash_hd_src", "audio").
 * Normalise them into rows the UI can rank and label predictably.
 */
const formats = computed<Rendition[]>(() => {
  const data = result.value
  if (!data) return []

  const seen = new Set<string>()
  const rows: Rendition[] = []

  const push = (
    raw: { format: string; url: string; ext?: string; height?: number | null; filesize_mb?: number | null },
    index: number,
  ) => {
    if (!raw?.url || seen.has(raw.url)) return
    seen.add(raw.url)

    const name = String(raw.format || '').toLowerCase()
    const isAudio = name.includes('audio') && !name.includes('video')
    const height = raw.height ?? null

    const heightLabel = height ? `${height}p` : null
    const isHd = name.includes('hd') || (height !== null && height >= 720)

    const parts: string[] = []
    if (raw.ext) parts.push(String(raw.ext).toUpperCase())
    else parts.push(isAudio ? 'M4A' : 'MP4')
    if (raw.filesize_mb) parts.push(`${Number(raw.filesize_mb).toFixed(1)} MB`)
    if (!raw.filesize_mb) parts.push('size reported by Facebook')

    rows.push({
      key: `${raw.format}-${index}`,
      label: isAudio
        ? 'Audio only'
        : heightLabel
          ? `Video ${heightLabel}`
          : isHd
            ? 'HD video'
            : 'SD video',
      meta: parts.join(' · '),
      tag: isAudio ? 'M4A' : heightLabel ?? (isHd ? 'HD' : 'SD'),
      tone: isAudio ? 'neutral' : isHd ? 'accent' : 'neutral',
      url: raw.url,
      filename: isAudio
        ? `${fileStem.value}-audio.${raw.ext || 'm4a'}`
        : `${fileStem.value}${heightLabel ? `-${heightLabel}` : isHd ? '-hd' : ''}.${raw.ext || 'mp4'}`,
      weight: isAudio ? -1 : height ?? (isHd ? 720 : 360),
    })
  }

  data.formats?.forEach(push)

  // Some responses only carry a bare `video_url`.
  if (!rows.length && data.video_url) {
    push({ format: 'video', url: data.video_url, ext: 'mp4' }, 0)
  }

  rows.sort((a, b) => b.weight - a.weight)
  if (rows[0] && rows[0].weight > 0) rows[0].recommended = true

  return rows
})

/* -------------------------------------------------------------- page copy */

const steps = [
  {
    title: 'Open the video',
    description:
      'Find the Facebook video or reel you want. It has to be public — private posts cannot be resolved.',
  },
  {
    title: 'Copy the URL',
    description:
      'Use the post’s ⋯ menu → Copy link, or copy the address straight from your browser bar.',
  },
  {
    title: 'Paste and fetch',
    description:
      'We ask Facebook for the manifest and list every MP4 rendition it exposes, plus audio-only where present.',
  },
  {
    title: 'Choose a quality',
    description:
      'HD is marked as the best option. Each row streams through our proxy so the browser saves a real file.',
  },
]

const faqs = [
  {
    question: 'Why does it say the video is unavailable?',
    answer:
      'The most common causes are a private post, a friends-only audience, an age-restricted video, or a link that points to a profile rather than a specific video. Only publicly viewable videos can be resolved.',
  },
  {
    question: 'Can I download Reels?',
    answer:
      'Yes. Reel URLs (facebook.com/reel/…) and watch URLs (facebook.com/watch?v=…) both work, as do share links from the mobile app.',
  },
  {
    question: 'Why are there several qualities?',
    answer:
      'Facebook encodes each video at multiple resolutions and serves whichever suits the viewer’s connection. We show all of them so you can pick, rather than guessing on your behalf.',
  },
  {
    question: 'Is downloading Facebook videos allowed?',
    answer:
      'Facebook’s terms of service do not permit it, and the video belongs to whoever posted it. Only download content you own or have explicit permission to reuse.',
  },
]
</script>

<template>
  <div>
    <ToolHero
      eyebrow="Facebook Downloader"
      title="Download Facebook videos and reels"
      :description="tool.description"
      :features="tool.features"
      :accent="tool.accent"
    >
      <div class="mx-auto mt-10 max-w-2xl">
        <DownloadUrlInput
          v-model="url"
          :loading="loading"
          :hosts="['facebook.com', 'fb.watch', 'fb.com']"
          host-label="Facebook"
          placeholder="https://www.facebook.com/watch?v=…"
          @submit="submit"
          @error="onInputError"
        />
      </div>
    </ToolHero>

    <section class="sp-container py-12 sm:py-16">
      <UiAlert
        v-if="errorMessage"
        tone="danger"
        title="Could not resolve that link"
        class="mb-6"
      >
        {{ errorMessage }}

        <template #action>
          <UiButton size="sm" variant="secondary" @click="reset">
            Start over
          </UiButton>
        </template>
      </UiAlert>

      <!-- Loading -->
      <div v-if="loading" class="sp-panel px-6 py-14 text-center">
        <div
          class="mx-auto h-14 w-14 animate-spin rounded-full border-4
            border-accent border-t-transparent"
        />
        <p class="mt-6 text-base font-semibold text-fg">
          Reading the Facebook post…
        </p>
        <p class="mt-1.5 text-sm text-fg-muted">
          Resolving the available MP4 renditions.
        </p>
      </div>

      <!-- Result -->
      <div v-else-if="result" class="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <DownloadMediaCard platform="facebook"
          :thumbnail="result.thumbnail"
          :title="result.title"
          :author="result.page_name"
          :stats="stats"
        />

        <div class="sp-card flex flex-col p-6">
          <UiBadge tone="positive" dot>Ready to download</UiBadge>

          <h2 class="mt-4 font-display text-2xl font-bold text-fg">
            {{ formats.length }}
            {{ formats.length === 1 ? 'format' : 'formats' }} available
          </h2>

          <p class="mt-2 text-sm leading-6 text-fg-muted">
            Highest quality first. Every row saves through our proxy as a
            properly named file.
          </p>

          <div class="mt-6 max-h-96 space-y-2.5 overflow-y-auto pr-1">
            <DownloadFormatRow platform="facebook"
              v-for="format in formats"
              :key="format.key"
              :label="format.label"
              :meta="format.meta"
              :tag="format.tag"
              :tone="format.tone"
              :recommended="format.recommended"
              :href="proxyUrl(format.url, format.filename)"
              :download="format.filename"
            />
          </div>

          <UiButton variant="ghost" block class="mt-6" @click="reset">
            Download another video
          </UiButton>
        </div>
      </div>

      <!-- Idle -->
      <UiEmptyState
        v-else
        title="Paste a Facebook video link to begin"
        description="Works with watch links, reels, and share URLs from the mobile app. The post must be publicly viewable."
      />
    </section>

    <DownloadSteps
      :steps="steps"
      title="How the Facebook downloader works"
      description="We resolve the video server-side, so nothing is scraped in your browser."
    />

    <ToolFaq :items="faqs" />
    <ToolRelatedTools exclude="facebook-video-download" />
  </div>
</template>

