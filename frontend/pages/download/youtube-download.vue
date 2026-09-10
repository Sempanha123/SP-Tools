<script setup lang="ts">
import type {
  YoutubeAudioOption,
  YoutubeOptions,
  YoutubeVideoOption,
} from '~/composables/useMediaApi'

const { findTool } = useTools()
const { fetchYoutubeOptions, youtubeVideoUrl, youtubeAudioUrl } = useMediaApi()

const tool = findTool('youtube-download')!

useSeoMeta({
  title: 'YouTube Downloader — Video up to 4K and Audio-Only | SP-Tools',
  description:
    'Paste a YouTube link to list every available stream, then download merged video at up to 4K or extract the audio track. Free, no account.',
  ogTitle: 'YouTube Downloader | SP-Tools',
  ogDescription: 'Download YouTube video or audio in any available quality.',
})

/* ------------------------------------------------------------------ state */

const url = ref('')
const loading = ref(false)
const errorMessage = ref('')
const result = ref<YoutubeOptions | null>(null)
const tab = ref<'video' | 'audio'>('video')

/** itag currently streaming, so the row can show a spinner. */
const activeItag = ref<number | null>(null)

let controller: AbortController | null = null

const reset = () => {
  controller?.abort()
  url.value = ''
  result.value = null
  errorMessage.value = ''
  loading.value = false
  activeItag.value = null
  tab.value = 'video'
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
    const data = await fetchYoutubeOptions(url.value.trim(), request.signal)

    if (!data?.video_options?.length && !data?.audio_options?.length) {
      throw new Error(
        'No downloadable streams were returned. The video may be private, age-restricted or region-locked.',
      )
    }

    result.value = data
    tab.value = data.video_options?.length ? 'video' : 'audio'
  } catch (error) {
    if (request.signal.aborted) return

    errorMessage.value =
      error instanceof Error ? error.message : 'Could not read that URL.'
  } finally {
    if (!request.signal.aborted) loading.value = false
  }
}

const onInputError = (problem: string) => {
  errorMessage.value = problem
}

/* --------------------------------------------------------------- formats */

const fileStem = computed(
  () =>
    (result.value?.title || 'youtube')
      .toLowerCase()
      .replace(/[^\w\s-]+/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60) || 'youtube',
)

const sizeLabel = (value: number | string | undefined) => {
  const megabytes = typeof value === 'string' ? Number.parseFloat(value) : value
  if (!megabytes || Number.isNaN(megabytes)) return 'size unknown'
  return `${megabytes.toFixed(1)} MB`
}

const heightOf = (resolution: string) =>
  Number.parseInt(String(resolution).replace(/\D+/g, ''), 10) || 0

/** Highest-quality entry per resolution, best first. */
const videoRows = computed(() => {
  const options = result.value?.video_options ?? []
  const best = new Map<string, YoutubeVideoOption>()

  for (const option of options) {
    const key = option.resolution || `${option.itag}`
    const current = best.get(key)

    if (!current || (option.fps || 0) > (current.fps || 0)) {
      best.set(key, option)
    }
  }

  return [...best.values()]
    .sort((a, b) => heightOf(b.resolution) - heightOf(a.resolution))
    .map((option, index) => ({
      itag: option.itag,
      label: `${option.resolution}${option.fps && option.fps > 30 ? ` ${option.fps}fps` : ''}`,
      meta: [
        (option.container || 'mp4').toUpperCase(),
        option.video_codec,
        sizeLabel(option.filesize_mb),
      ]
        .filter(Boolean)
        .join(' · '),
      tag: option.resolution || 'MP4',
      tone: (heightOf(option.resolution) >= 1080 ? 'accent' : 'neutral') as
        | 'accent'
        | 'neutral',
      recommended: index === 0,
      filename: `${fileStem.value}-${option.resolution || option.itag}.mp4`,
    }))
})

const abrOf = (abr: string) =>
  Number.parseInt(String(abr).replace(/\D+/g, ''), 10) || 0

const audioRows = computed(() =>
  [...(result.value?.audio_options ?? [])]
    .sort((a: YoutubeAudioOption, b: YoutubeAudioOption) => abrOf(b.abr) - abrOf(a.abr))
    .map((option, index) => ({
      itag: option.itag,
      label: `Audio ${option.abr}`,
      meta: [option.audio_codec, sizeLabel(option.filesize_mb)]
        .filter(Boolean)
        .join(' · '),
      tag: option.abr || 'MP3',
      tone: (index === 0 ? 'accent' : 'neutral') as 'accent' | 'neutral',
      recommended: index === 0,
      filename: `${fileStem.value}.mp3`,
    })),
)

const rows = computed(() => (tab.value === 'video' ? videoRows.value : audioRows.value))

/**
 * Hand the URL to the browser rather than fetching a blob: these files can be
 * hundreds of megabytes, and buffering them in memory to build an object URL
 * would stall the tab. The spinner clears on a timer since navigation to a
 * download does not fire a load event.
 */
const startDownload = (itag: number, kind: 'video' | 'audio') => {
  if (!import.meta.client) return

  const target =
    kind === 'video'
      ? youtubeVideoUrl(url.value.trim(), itag)
      : youtubeAudioUrl(url.value.trim(), itag)

  activeItag.value = itag
  window.location.href = target

  window.setTimeout(() => {
    if (activeItag.value === itag) activeItag.value = null
  }, 4000)
}

const durationLabel = computed(() => {
  const seconds = result.value?.duration
  if (!seconds || seconds <= 0) return null

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainder = Math.round(seconds % 60)

  return hours
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
    : `${minutes}:${String(remainder).padStart(2, '0')}`
})

const stats = computed(() => {
  const out: { label: string; value: string }[] = []
  if (durationLabel.value) out.push({ label: 'Duration', value: durationLabel.value })
  out.push({ label: 'Video', value: String(videoRows.value.length) })
  out.push({ label: 'Audio', value: String(audioRows.value.length) })
  return out
})

/* -------------------------------------------------------------- page copy */

const steps = [
  {
    title: 'Copy the link',
    description:
      'Any youtube.com/watch, youtu.be, or /shorts URL works. Copy it from the address bar or the Share button.',
  },
  {
    title: 'Paste and analyse',
    description:
      'We ask YouTube for the full stream manifest and group it by resolution and bitrate.',
  },
  {
    title: 'Video or audio',
    description:
      'Switch tabs to choose between merged video files and audio-only extraction.',
  },
  {
    title: 'Download',
    description:
      'Video and audio streams are muxed server-side, so you get one playable file rather than two halves.',
  },
]

const faqs = [
  {
    question: 'Why is 1080p and above not always listed?',
    answer:
      'Above 720p YouTube serves video and audio as separate streams. Those resolutions only appear when the service can mux them back together, which requires ffmpeg to be installed alongside the media service.',
  },
  {
    question: 'What format is the audio download?',
    answer:
      'The highest-bitrate audio stream available, delivered as an MP3-named file. Bitrate is shown on each row so you can pick quality over file size.',
  },
  {
    question: 'Why does a large download take a while to start?',
    answer:
      'The file is fetched and muxed on the server before the browser begins saving. For long videos at high resolution, expect a pause before the save dialog appears.',
  },
  {
    question: 'Can I download age-restricted or private videos?',
    answer:
      'No. Anything that requires a signed-in session cannot be resolved, and no credentials are ever collected here.',
  },
  {
    question: 'Is this permitted by YouTube?',
    answer:
      'YouTube’s terms of service prohibit downloading without permission, and the content is copyrighted by its uploader. Use this only for your own videos, or where the rights holder has given you permission.',
  },
]
</script>

<template>
  <div>
    <ToolHero
      eyebrow="YouTube Downloader"
      title="Download YouTube video or audio"
      :description="tool.description"
      :features="tool.features"
      :accent="tool.accent"
    >
      <div class="mx-auto mt-10 max-w-2xl">
        <DownloadUrlInput
          v-model="url"
          :loading="loading"
          :hosts="['youtube.com', 'youtu.be', 'youtube-nocookie.com']"
          host-label="YouTube"
          placeholder="https://www.youtube.com/watch?v=…"
          @submit="submit"
          @error="onInputError"
        />
      </div>
    </ToolHero>

    <section class="sp-container py-12 sm:py-16">
      <UiAlert
        v-if="errorMessage"
        tone="danger"
        title="Could not read that URL"
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
        <p class="mt-6 text-base font-semibold text-fg">Analysing the video…</p>
        <p class="mt-1.5 text-sm text-fg-muted">
          Reading every available video and audio stream.
        </p>
      </div>

      <!-- Result -->
      <div v-else-if="result" class="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <DownloadMediaCard platform="youtube"
          :thumbnail="result.thumbnail_url"
          :title="result.title"
          :author="result.channel_name"
          :stats="stats"
        />

        <div class="sp-card flex flex-col p-6">
          <UiBadge tone="positive" dot>Streams resolved</UiBadge>

          <h2 class="mt-4 font-display text-2xl font-bold text-fg">
            Pick a quality
          </h2>

          <!-- Video / audio switch -->
          <div
            class="mt-5 inline-flex rounded-xl border border-line bg-surface-2 p-1"
            role="tablist"
            aria-label="Download type"
          >
            <button
              v-for="option in (['video', 'audio'] as const)"
              :key="option"
              type="button"
              role="tab"
              class="flex-1 rounded-lg px-5 py-2 text-sm font-semibold capitalize
                transition-colors"
              :class="
                tab === option
                  ? 'bg-accent text-accent-fg shadow-glow'
                  : 'text-fg-muted hover:text-fg'
              "
              :aria-selected="tab === option"
              :disabled="
                option === 'video' ? !videoRows.length : !audioRows.length
              "
              @click="tab = option"
            >
              {{ option }}
              <span class="ml-1 text-xs opacity-70">
                {{ option === 'video' ? videoRows.length : audioRows.length }}
              </span>
            </button>
          </div>

          <div class="mt-5 max-h-96 space-y-2.5 overflow-y-auto pr-1">
            <DownloadFormatRow platform="youtube"
              v-for="row in rows"
              :key="`${tab}-${row.itag}`"
              :label="row.label"
              :meta="row.meta"
              :tag="row.tag"
              :tone="row.tone"
              :recommended="row.recommended"
              :pending="activeItag === row.itag"
              @click="startDownload(row.itag, tab)"
            />

            <UiEmptyState
              v-if="!rows.length"
              :title="`No ${tab} streams available`"
              description="Try the other tab — this video did not expose any streams of that type."
            />
          </div>

          <p class="mt-5 text-xs leading-6 text-fg-subtle">
            Large files are muxed on the server first, so the save dialog may
            take a few seconds to appear.
          </p>

          <UiButton variant="ghost" block class="mt-4" @click="reset">
            Download another video
          </UiButton>
        </div>
      </div>

      <!-- Idle -->
      <UiEmptyState
        v-else
        title="Paste a YouTube link to begin"
        description="Works with watch links, youtu.be short links and Shorts. We list every stream the video exposes, video and audio."
      />
    </section>

    <DownloadSteps
      :steps="steps"
      title="How the YouTube downloader works"
      description="Streams are resolved and merged server-side, so you always get one playable file."
    />

    <ToolFaq :items="faqs" />
    <ToolRelatedTools exclude="youtube-download" />

  </div>
</template>

