<script setup lang="ts">
import type { TikTokResult } from '~/composables/useMediaApi'

const { findTool } = useTools()
const { fetchTikTok, proxyUrl } = useMediaApi()

const tool = findTool('tiktok-download')!

useSeoMeta({
  title: 'TikTok Video Downloader — Save TikToks Without Watermark | SP-Tools',
  description:
    'Paste a TikTok link to download the video in HD, watermark-free, or as the original file. Free, no account, no install.',
  ogTitle: 'TikTok Downloader | SP-Tools',
  ogDescription: 'Download TikTok videos in HD without the watermark.',
})

/* ------------------------------------------------------------------ state */

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

/* ---------------------------------------------------------------- resolve */

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
      throw new Error(
        'No downloadable video was returned. The post may be private or region-locked.',
      )
    }

    result.value = data
  } catch (error) {
    // A superseded or unmounted request is not worth surfacing.
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

/* -------------------------------------------------------------- downloads */

/** Slug used for the saved filename, derived from the creator handle. */
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

  if (data.MP4_HD) {
    rows.push({
      key: 'hd',
      label: 'HD, no watermark',
      meta: 'Highest quality rendition TikTok exposes',
      tag: 'HD',
      tone: 'accent',
      url: data.MP4_HD,
      filename: `${fileStem.value}-hd.mp4`,
      recommended: true,
    })
  }

  if (data.MP4) {
    rows.push({
      key: 'mp4',
      label: 'MP4, no watermark',
      meta: 'Standard quality — smaller file',
      tag: 'MP4',
      tone: 'neutral',
      url: data.MP4,
      filename: `${fileStem.value}.mp4`,
      recommended: !data.MP4_HD,
    })
  }

  if (data.MP4_with_Watermark) {
    rows.push({
      key: 'watermark',
      label: 'Original, with watermark',
      meta: 'Exactly as published, TikTok logo intact',
      tag: 'RAW',
      tone: 'neutral',
      url: data.MP4_with_Watermark,
      filename: `${fileStem.value}-watermark.mp4`,
    })
  }

  return rows
})

/* -------------------------------------------------------------- page copy */

const steps = [
  {
    title: 'Copy the link',
    description:
      'Tap Share on the TikTok post and choose Copy link. Works from the app or the web.',
  },
  {
    title: 'Paste it here',
    description:
      'Drop the URL into the field above — the Paste button reads your clipboard directly.',
  },
  {
    title: 'Pick a rendition',
    description:
      'We list every stream TikTok exposes, so you can choose HD, standard, or the watermarked original.',
  },
  {
    title: 'Save the file',
    description:
      'The download streams through our proxy, so you get a proper .mp4 file instead of a browser tab.',
  },
]

const faqs = [
  {
    question: 'Why do some videos only offer one quality?',
    answer:
      'TikTok does not publish the same renditions for every post. If only a watermarked file is returned, that is the only stream available for that video.',
  },
  {
    question: 'Does this work with private videos?',
    answer:
      'No. Only publicly viewable posts can be resolved. Private, friends-only, and deleted posts will return an error.',
  },
  {
    question: 'Why does the download go through a proxy?',
    answer:
      'TikTok CDN links block direct saving and expire quickly. Streaming through our own endpoint sets the right headers so the browser saves a real MP4 file with a sensible name.',
  },
  {
    question: 'Am I allowed to download these videos?',
    answer:
      'Downloading is against TikTok’s terms of service, and the videos are the creator’s copyrighted work. Use this only for content you own or have explicit permission to reuse.',
  },
]
</script>

<template>
  <div>
    <ToolHero
      eyebrow="TikTok Downloader"
      title="Save TikTok videos without the watermark"
      :description="tool.description"
      :features="tool.features"
      :accent="tool.accent"
    >
      <div class="mx-auto mt-10 max-w-2xl">
        <DownloadUrlInput
          v-model="url"
          :loading="loading"
          :hosts="['tiktok.com', 'vt.tiktok.com', 'vm.tiktok.com']"
          host-label="TikTok"
          placeholder="https://www.tiktok.com/@user/video/…"
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
          Reading the TikTok post…
        </p>
        <p class="mt-1.5 text-sm text-fg-muted">
          Resolving the available video streams.
        </p>
      </div>

      <!-- Result -->
      <div v-else-if="result" class="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <DownloadMediaCard
          portrait
          :thumbnail="result.bg_url"
          :title="result.caption"
          :author="result.username ? `@${result.username}` : null"
          :avatar="result.circle_img_url"
          :stats="[{ label: 'Renditions', value: String(renditions.length) }]"
        />

        <div class="sp-card flex flex-col p-6">
          <UiBadge tone="positive" dot>Ready to download</UiBadge>

          <h2 class="mt-4 font-display text-2xl font-bold text-fg">
            {{ renditions.length }}
            {{ renditions.length === 1 ? 'rendition' : 'renditions' }} available
          </h2>

          <p class="mt-2 text-sm leading-6 text-fg-muted">
            Each option streams through our proxy so it saves as a real MP4.
          </p>

          <div class="mt-6 space-y-2.5">
            <DownloadFormatRow
              v-for="rendition in renditions"
              :key="rendition.key"
              :label="rendition.label"
              :meta="rendition.meta"
              :tag="rendition.tag"
              :tone="rendition.tone"
              :recommended="rendition.recommended"
              :href="proxyUrl(rendition.url, rendition.filename)"
              :download="rendition.filename"
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
        title="Paste a TikTok link to begin"
        description="We read the post, list every available video stream, and let you pick the one you want. Nothing is uploaded from your device."
      />
    </section>

    <DownloadSteps
      :steps="steps"
      title="From link to file in four steps"
      description="No login, no app install, no watermark burned into the result."
    />

    <ToolFaq :items="faqs" />
    <ToolRelatedTools exclude="tiktok-download" />

  </div>
</template>
