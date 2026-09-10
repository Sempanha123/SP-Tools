<script setup lang="ts">
import type { YoutubeAudioOption, YoutubeOptions, YoutubeVideoOption } from '~/composables/useMediaApi'

const { findTool } = useTools()
const { fetchYoutubeOptions, youtubeVideoUrl, youtubeAudioUrl } = useMediaApi()
const tool = findTool('youtube-download')!

useSeoMeta({
  title: 'YouTube Downloader — Video up to 4K and Audio-Only | SP-Tools',
  description: 'Paste a YouTube link to list every available stream, then download merged video at up to 4K or extract the audio track. Free, no account.',
  ogTitle: 'YouTube Downloader | SP-Tools',
  ogDescription: 'Download YouTube video or audio in any available quality.',
})

const url = ref('')
const loading = ref(false)
const errorMessage = ref('')
const result = ref<YoutubeOptions | null>(null)
const tab = ref<'video' | 'audio'>('video')
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
      throw new Error('No downloadable streams were returned. The video may be private, age-restricted or region-locked.')
    }
    result.value = data
    tab.value = data.video_options?.length ? 'video' : 'audio'
  } catch (error) {
    if (request.signal.aborted) return
    errorMessage.value = error instanceof Error ? error.message : 'Could not read that URL.'
  } finally {
    if (!request.signal.aborted) loading.value = false
  }
}

const onInputError = (problem: string) => { errorMessage.value = problem }

const fileStem = computed(() =>
  (result.value?.title || 'youtube').toLowerCase().replace(/[^\w\s-]+/g, '').trim().replace(/\s+/g, '-').slice(0, 60) || 'youtube',
)

const sizeLabel = (value: number | string | undefined) => {
  const megabytes = typeof value === 'string' ? Number.parseFloat(value) : value
  if (!megabytes || Number.isNaN(megabytes)) return 'size unknown'
  return `${megabytes.toFixed(1)} MB`
}

const heightOf = (resolution: string) => Number.parseInt(String(resolution).replace(/\D+/g, ''), 10) || 0

const videoRows = computed(() => {
  const options = result.value?.video_options ?? []
  const best = new Map<string, YoutubeVideoOption>()
  for (const option of options) {
    const key = option.resolution || `${option.itag}`
    const current = best.get(key)
    if (!current || (option.fps || 0) > (current.fps || 0)) best.set(key, option)
  }

  return [...best.values()]
    .sort((a, b) => heightOf(b.resolution) - heightOf(a.resolution))
    .map((option, index) => ({
      itag: option.itag,
      label: `${option.resolution}${option.fps && option.fps > 30 ? ` ${option.fps}fps` : ''}`,
      meta: [(option.container || 'mp4').toUpperCase(), option.video_codec, sizeLabel(option.filesize_mb)].filter(Boolean).join(' · '),
      tag: option.resolution || 'MP4',
      tone: (heightOf(option.resolution) >= 1080 ? 'accent' : 'neutral') as 'accent' | 'neutral',
      recommended: index === 0,
      filename: `${fileStem.value}-${option.resolution || option.itag}.mp4`,
    }))
})

const abrOf = (abr: string) => Number.parseInt(String(abr).replace(/\D+/g, ''), 10) || 0

const audioRows = computed(() =>
  [...(result.value?.audio_options ?? [])]
    .sort((a: YoutubeAudioOption, b: YoutubeAudioOption) => abrOf(b.abr) - abrOf(a.abr))
    .map((option, index) => ({
      itag: option.itag,
      label: `Audio ${option.abr}`,
      meta: [option.audio_codec, sizeLabel(option.filesize_mb)].filter(Boolean).join(' · '),
      tag: option.abr || 'MP3',
      tone: (index === 0 ? 'accent' : 'neutral') as 'accent' | 'neutral',
      recommended: index === 0,
      filename: `${fileStem.value}.mp3`,
    })),
)

const rows = computed(() => (tab.value === 'video' ? videoRows.value : audioRows.value))

const startDownload = (itag: number, kind: 'video' | 'audio') => {
  if (!import.meta.client) return
  const target = kind === 'video' ? youtubeVideoUrl(url.value.trim(), itag) : youtubeAudioUrl(url.value.trim(), itag)
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

const steps = [
  { title: 'Copy the link', description: 'Copy a YouTube watch, Shorts, or youtu.be URL from the address bar or Share button.' },
  { title: 'Paste into the studio', description: 'The real URL control starts the resolver directly inside the stream workspace.' },
  { title: 'Review real streams', description: 'The workspace changes to the actual thumbnail, channel, video resolutions and audio bitrates.' },
  { title: 'Download', description: 'Choose video or audio. High-resolution streams are merged server-side before the browser saves them.' },
]

const faqs = [
  { question: 'Why is 1080p and above not always listed?', answer: 'Above 720p YouTube often serves video and audio separately. Those resolutions only appear when the service can mux them back together, which requires ffmpeg on the media service.' },
  { question: 'What format is the audio download?', answer: 'Available audio streams are ordered by bitrate. The service delivers the selected audio through the dedicated audio endpoint.' },
  { question: 'Why does a large download take a while to start?', answer: 'The file may need to be fetched and muxed on the server before the browser begins saving. Long videos at high resolution can therefore take longer.' },
  { question: 'Can I download age-restricted or private videos?', answer: 'No. Anything that requires a signed-in session cannot be resolved, and no credentials are collected here.' },
  { question: 'Is this permitted by YouTube?', answer: 'Only download content you own or have permission to reuse, and follow the platform rules and applicable copyright law.' },
]
</script>

<template>
  <div class="sp-download-page sp-platform-youtube">
    <DownloadStudio
      platform="youtube"
      eyebrow="YouTube Downloader"
      title="Download YouTube video or audio"
      :description="tool.description"
      :features="tool.features"
      :loading="loading"
      :resolved="Boolean(result)"
      :error-message="errorMessage"
      @reset="reset"
    >
      <template #input>
        <DownloadUrlInput
          v-model="url"
          :loading="loading"
          :hosts="['youtube.com', 'youtu.be', 'youtube-nocookie.com']"
          host-label="YouTube"
          placeholder="https://www.youtube.com/watch?v=…"
          @submit="submit"
          @error="onInputError"
        />
      </template>

      <template #result>
        <div class="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <DownloadMediaCard
            platform="youtube"
            :thumbnail="result?.thumbnail_url"
            :title="result?.title"
            :author="result?.channel_name"
            :stats="stats"
          />

          <div class="sp-workspace-pane flex min-w-0 flex-col rounded-[18px] border border-line bg-elevated p-4 sm:p-5">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="text-[8px] font-black uppercase tracking-[.16em] text-positive">Streams resolved</p>
                <h2 class="mt-2 text-[18px] font-bold tracking-[-.03em] text-fg">Pick video or audio</h2>
                <p class="mt-2 text-[10px] leading-5 text-fg-muted">Only real streams returned for this URL are shown.</p>
              </div>
              <span class="sp-platform-best rounded-full px-2.5 py-1.5 text-[8px] font-bold">{{ videoRows.length + audioRows.length }} streams</span>
            </div>

            <div class="mt-4 inline-flex rounded-[12px] border border-line bg-surface-3 p-1" role="tablist" aria-label="Download type">
              <button
                v-for="option in (['video', 'audio'] as const)"
                :key="option"
                type="button"
                role="tab"
                class="flex-1 rounded-[9px] px-4 py-2.5 text-[10px] font-bold capitalize transition"
                :class="tab === option ? 'sp-platform-submit text-white' : 'text-fg-muted hover:text-fg'"
                :aria-selected="tab === option"
                :disabled="option === 'video' ? !videoRows.length : !audioRows.length"
                @click="tab = option"
              >
                {{ option }} · {{ option === 'video' ? videoRows.length : audioRows.length }}
              </button>
            </div>

            <div class="mt-3 max-h-[360px] space-y-2.5 overflow-y-auto pr-1">
              <DownloadFormatRow
                v-for="row in rows"
                :key="`${tab}-${row.itag}`"
                platform="youtube"
                :label="row.label"
                :meta="row.meta"
                :tag="row.tag"
                :tone="row.tone"
                :recommended="row.recommended"
                :pending="activeItag === row.itag"
                @click="startDownload(row.itag, tab)"
              />
              <div v-if="!rows.length" class="rounded-[14px] border border-dashed border-line bg-surface-3 px-4 py-8 text-center text-[11px] text-fg-muted">
                No {{ tab }} streams are available for this video. Try the other tab.
              </div>
            </div>

            <p class="mt-3 text-[9px] leading-5 text-fg-subtle">Large files may be muxed on the server before the save dialog appears.</p>
            <button type="button" class="sp-workspace-reset mt-3" @click="reset">Download another YouTube video <span>↗</span></button>
          </div>
        </div>
      </template>
    </DownloadStudio>

    <DownloadSteps :steps="steps" title="YouTube, from link to stream" description="Paste once, review the actual returned media, then choose the exact video or audio format you need." />
    <ToolFaq :items="faqs" />
    <ToolRelatedTools exclude="youtube-download" />
  </div>
</template>
