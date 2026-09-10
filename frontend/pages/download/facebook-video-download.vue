<script setup lang="ts">
import type { FacebookResult } from '~/composables/useMediaApi'

const { findTool } = useTools()
const { fetchFacebook, proxyUrl } = useMediaApi()
const tool = findTool('facebook-video-download')!

useSeoMeta({
  title: 'Facebook Video Downloader — Save Reels and Videos in HD | SP-Tools',
  description: 'Paste a public Facebook video or reel link to list every available MP4 quality, then save it directly. Free, no account needed.',
  ogTitle: 'Facebook Video Downloader | SP-Tools',
  ogDescription: 'Download public Facebook videos and reels in HD.',
})

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
      throw new Error('No downloadable formats were returned. The post may be private or age-restricted.')
    }
    result.value = data
  } catch (error) {
    if (request.signal.aborted) return
    errorMessage.value = error instanceof Error ? error.message : 'Could not fetch that video.'
  } finally {
    if (!request.signal.aborted) loading.value = false
  }
}

const onInputError = (problem: string) => { errorMessage.value = problem }

const fileStem = computed(() => {
  const source = result.value?.title || result.value?.page_name || 'facebook'
  return source.toLowerCase().replace(/[^\w\s-]+/g, '').trim().replace(/\s+/g, '-').slice(0, 60) || 'facebook'
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
  weight: number
}

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
      label: isAudio ? 'Audio only' : heightLabel ? `Video ${heightLabel}` : isHd ? 'HD video' : 'SD video',
      meta: parts.join(' · '),
      tag: isAudio ? 'M4A' : heightLabel ?? (isHd ? 'HD' : 'SD'),
      tone: isAudio ? 'neutral' : isHd ? 'accent' : 'neutral',
      url: raw.url,
      filename: isAudio ? `${fileStem.value}-audio.${raw.ext || 'm4a'}` : `${fileStem.value}${heightLabel ? `-${heightLabel}` : isHd ? '-hd' : ''}.${raw.ext || 'mp4'}`,
      weight: isAudio ? -1 : height ?? (isHd ? 720 : 360),
    })
  }

  data.formats?.forEach(push)
  if (!rows.length && data.video_url) push({ format: 'video', url: data.video_url, ext: 'mp4' }, 0)
  rows.sort((a, b) => b.weight - a.weight)
  if (rows[0] && rows[0].weight > 0) rows[0].recommended = true
  return rows
})

const steps = [
  { title: 'Copy a public link', description: 'Open a Facebook Reel or video and copy its public share URL.' },
  { title: 'Paste into the studio', description: 'Use the real URL control above. The workspace shows when the resolver starts.' },
  { title: 'Review the media', description: 'The placeholder becomes the actual post title, thumbnail, page and available qualities.' },
  { title: 'Choose a quality', description: 'Pick the best HD or other returned rendition and save it as a real file.' },
]

const faqs = [
  { question: 'Why does it say the video is unavailable?', answer: 'The most common causes are a private post, friends-only audience, age-restricted video, or a link that points to a profile rather than a specific video. Only publicly viewable videos can be resolved.' },
  { question: 'Can I download Reels?', answer: 'Yes. Reel URLs, watch URLs, and supported share links from the mobile app can be resolved when the post is public.' },
  { question: 'Why are there several qualities?', answer: 'Facebook encodes videos at multiple resolutions. We show the real renditions returned by the resolver so you can pick the most useful one.' },
  { question: 'Is downloading Facebook videos allowed?', answer: 'Only download content you own or have permission to reuse, and follow the platform rules and applicable copyright law.' },
]
</script>

<template>
  <div class="sp-download-page sp-platform-facebook">
    <DownloadStudio
      platform="facebook"
      eyebrow="Facebook Downloader"
      title="Download Facebook videos and reels"
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
          :hosts="['facebook.com', 'fb.watch', 'fb.com']"
          host-label="Facebook"
          placeholder="https://www.facebook.com/watch?v=…"
          @submit="submit"
          @error="onInputError"
        />
      </template>

      <template #result>
        <div class="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <DownloadMediaCard
            platform="facebook"
            :thumbnail="result?.thumbnail"
            :title="result?.title"
            :author="result?.page_name"
            :stats="stats"
          />

          <div class="sp-workspace-pane flex min-w-0 flex-col rounded-[18px] border border-line bg-elevated p-4 sm:p-5">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="text-[8px] font-black uppercase tracking-[.16em] text-positive">Public media resolved</p>
                <h2 class="mt-2 text-[18px] font-bold tracking-[-.03em] text-fg">Choose a Facebook quality</h2>
                <p class="mt-2 text-[10px] leading-5 text-fg-muted">Highest-quality returned video appears first.</p>
              </div>
              <span class="sp-platform-best rounded-full px-2.5 py-1.5 text-[8px] font-bold">{{ formats.length }} formats</span>
            </div>

            <div class="mt-4 max-h-[390px] space-y-2.5 overflow-y-auto pr-1">
              <DownloadFormatRow
                v-for="format in formats"
                :key="format.key"
                platform="facebook"
                :label="format.label"
                :meta="format.meta"
                :tag="format.tag"
                :tone="format.tone"
                :recommended="format.recommended"
                :href="proxyUrl(format.url, format.filename)"
                :download="format.filename"
              />
            </div>

            <button type="button" class="sp-workspace-reset mt-4" @click="reset">Download another Facebook video <span>↗</span></button>
          </div>
        </div>
      </template>
    </DownloadStudio>

    <DownloadSteps :steps="steps" title="Facebook, from public post to file" description="The workspace changes from input to the real resolved Facebook content, so the flow is always obvious." />
    <ToolFaq :items="faqs" />
    <ToolRelatedTools exclude="facebook-video-download" />
  </div>
</template>
