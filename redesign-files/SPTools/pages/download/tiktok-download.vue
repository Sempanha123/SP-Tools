<script setup lang="ts">
import type { TikTokResult } from '~/composables/useMediaApi'

const { findTool } = useTools()
const { fetchTikTok, proxyUrl } = useMediaApi()
const tool = findTool('tiktok-download')!

useSeoMeta({
  title: 'TikTok Video Downloader — Save TikToks Without Watermark | SP-Tools',
  description: 'Paste a TikTok link to download the video in HD, watermark-free, or as the original file. Free, no account, no install.',
  ogTitle: 'TikTok Downloader | SP-Tools',
  ogDescription: 'Download TikTok videos in HD without the watermark.',
})

const url = ref('')
const loading = ref(false)
const errorMessage = ref('')
const result = ref<TikTokResult | null>(null)
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
    const data = await fetchTikTok(url.value.trim(), request.signal)
    if (!data?.MP4 && !data?.MP4_HD && !data?.MP4_with_Watermark) {
      throw new Error('No downloadable video was returned. The post may be private or region-locked.')
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
  const handle = (result.value?.username || 'tiktok').replace(/[^\w.-]+/g, '')
  return `${handle || 'tiktok'}-sptools`
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
}

const renditions = computed<Rendition[]>(() => {
  const data = result.value
  if (!data) return []
  const rows: Rendition[] = []

  if (data.MP4_HD) rows.push({
    key: 'hd', label: 'HD, no watermark', meta: 'Highest quality rendition TikTok exposes', tag: 'HD', tone: 'accent',
    url: data.MP4_HD, filename: `${fileStem.value}-hd.mp4`, recommended: true,
  })
  if (data.MP4) rows.push({
    key: 'mp4', label: 'MP4, no watermark', meta: 'Standard quality — smaller file', tag: 'MP4', tone: 'neutral',
    url: data.MP4, filename: `${fileStem.value}.mp4`, recommended: !data.MP4_HD,
  })
  if (data.MP4_with_Watermark) rows.push({
    key: 'watermark', label: 'Original, with watermark', meta: 'Exactly as published, TikTok logo intact', tag: 'RAW', tone: 'neutral',
    url: data.MP4_with_Watermark, filename: `${fileStem.value}-watermark.mp4`,
  })
  return rows
})

const steps = [
  { title: 'Copy the link', description: 'Tap Share on the TikTok post and choose Copy link. Works from the app or the web.' },
  { title: 'Paste it here', description: 'Drop the URL into the real downloader workspace above. The Paste button can read your clipboard.' },
  { title: 'Review the post', description: 'The workspace changes to the actual creator, thumbnail and streams returned by TikTok.' },
  { title: 'Save your version', description: 'Choose HD, standard, or original where available and save the MP4 through our proxy.' },
]

const faqs = [
  { question: 'Why do some videos only offer one quality?', answer: 'TikTok does not publish the same renditions for every post. If only a watermarked file is returned, that is the only stream available for that video.' },
  { question: 'Does this work with private videos?', answer: 'No. Only publicly viewable posts can be resolved. Private, friends-only, and deleted posts will return an error.' },
  { question: 'Why does the download go through a proxy?', answer: 'TikTok CDN links block direct saving and expire quickly. Streaming through our own endpoint sets the right headers so the browser saves a real MP4 file with a sensible name.' },
  { question: 'Am I allowed to download these videos?', answer: 'Use the downloader only for content you own or have permission to reuse, and follow the platform rules and applicable copyright law.' },
]
</script>

<template>
  <div>
    <DownloadStudio
      platform="tiktok"
      eyebrow="TikTok Downloader"
      title="Save TikTok videos without the watermark"
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
          :hosts="['tiktok.com', 'vt.tiktok.com', 'vm.tiktok.com']"
          host-label="TikTok"
          placeholder="https://www.tiktok.com/@user/video/…"
          @submit="submit"
          @error="onInputError"
        />
      </template>

      <template #result>
        <div class="grid gap-4 xl:grid-cols-[.88fr_1.12fr]">
          <DownloadMediaCard
            platform="tiktok"
            portrait
            :thumbnail="result?.bg_url"
            :title="result?.caption"
            :author="result?.username ? `@${result.username}` : null"
            :avatar="result?.circle_img_url"
            :stats="[{ label: 'Renditions', value: String(renditions.length) }]"
          />

          <div class="sp-workspace-pane flex min-w-0 flex-col rounded-[18px] border border-line bg-elevated p-4 sm:p-5">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="text-[8px] font-black uppercase tracking-[.16em] text-positive">Ready to download</p>
                <h2 class="mt-2 text-[18px] font-bold tracking-[-.03em] text-fg">Choose your TikTok version</h2>
                <p class="mt-2 text-[10px] leading-5 text-fg-muted">These are the real renditions returned for this post.</p>
              </div>
              <span class="sp-platform-best rounded-full px-2.5 py-1.5 text-[8px] font-bold">{{ renditions.length }} options</span>
            </div>

            <div class="mt-4 space-y-2.5">
              <DownloadFormatRow
                v-for="rendition in renditions"
                :key="rendition.key"
                platform="tiktok"
                :label="rendition.label"
                :meta="rendition.meta"
                :tag="rendition.tag"
                :tone="rendition.tone"
                :recommended="rendition.recommended"
                :href="proxyUrl(rendition.url, rendition.filename)"
                :download="rendition.filename"
              />
            </div>

            <button type="button" class="sp-workspace-reset mt-4" @click="reset">Download another TikTok <span>↗</span></button>
          </div>
        </div>
      </template>
    </DownloadStudio>

    <DownloadSteps :steps="steps" title="TikTok, from post to file" description="The same workspace handles the real link, real post preview and available downloads." />
    <ToolFaq :items="faqs" />
    <ToolRelatedTools exclude="tiktok-download" />
  </div>
</template>
