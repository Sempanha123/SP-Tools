<script setup lang="ts">
import type {
  FacebookNuxtResult,
} from '~/composables/useFacebookDownload'

const { findTool } = useTools()
const {
  fetchFacebook,
  facebookFileUrl,
} = useFacebookDownload()

const tool =
  findTool(
    'facebook-video-download',
  )!

useSeoMeta({
  title:
    'Facebook Video Downloader — Save Reels and Videos | SP-Tools',
  description:
    'Paste a public Facebook video or Reel link, review available qualities, and save the media.',
  ogTitle:
    'Facebook Video Downloader | SP-Tools',
  ogDescription:
    'Download public Facebook videos and Reels in available qualities.',
})

const url = ref('')
const loading = ref(false)
const errorMessage = ref('')
const activeDownloadKey = ref<string | null>(null)
const result =
  ref<FacebookNuxtResult | null>(
    null,
  )

let controller:
  AbortController | null = null

const reset = () => {
  controller?.abort()
  url.value = ''
  result.value = null
  errorMessage.value = ''
  loading.value = false
}

onUnmounted(
  () => controller?.abort(),
)

const submit = async () => {
  controller?.abort()

  const request =
    new AbortController()

  controller = request
  loading.value = true
  errorMessage.value = ''
  result.value = null

  try {
    const data =
      await fetchFacebook(
        url.value.trim(),
        request.signal,
      )

    if (
      !data?.formats?.length
      && !data?.video_url
    ) {
      throw new Error(
        'No downloadable formats were returned. The post may be private or unavailable.',
      )
    }

    result.value = data
  } catch (error) {
    if (
      request.signal.aborted
    ) {
      return
    }

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Could not fetch that video.'
  } finally {
    if (
      !request.signal.aborted
    ) {
      loading.value = false
    }
  }
}

const onInputError = (
  problem: string,
) => {
  errorMessage.value = problem
}


const startDownload = async (
  rendition: {
    key: string
    url: string
    filename: string
  },
) => {
  if (
    !import.meta.client
    || activeDownloadKey.value
  ) {
    return
  }

  activeDownloadKey.value =
    rendition.key

  errorMessage.value = ''

  try {
    const response =
      await fetch(
        facebookFileUrl(
          rendition.url,
          rendition.filename,
        ),
        {
          credentials:
            'same-origin',
        },
      )

    if (!response.ok) {
      let message =
        `Download failed (HTTP ${response.status}).`

      try {
        const payload =
          await response.json()

        message =
          payload?.statusMessage
          || payload?.message
          || message
      } catch {
        // The response may not be JSON.
      }

      throw new Error(message)
    }

    const blob =
      await response.blob()

    if (!blob.size) {
      throw new Error(
        'The downloaded file was empty.',
      )
    }

    const objectUrl =
      URL.createObjectURL(blob)

    const link =
      document.createElement('a')

    link.href = objectUrl
    link.download =
      rendition.filename

    link.style.display =
      'none'

    document.body.appendChild(
      link,
    )

    link.click()
    link.remove()

    window.setTimeout(
      () =>
        URL.revokeObjectURL(
          objectUrl,
        ),
      30_000,
    )
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Could not download that Facebook video.'
  } finally {
    activeDownloadKey.value =
      null
  }
}

const fileStem = computed(() => {
  const source =
    result.value?.title
    || result.value?.page_name
    || 'facebook'

  return (
    source
      .toLowerCase()
      .replace(
        /[^\w\s-]+/g,
        '',
      )
      .trim()
      .replace(
        /\s+/g,
        '-',
      )
      .slice(0, 60)
    || 'facebook'
  )
})

const durationLabel =
  computed(() => {
    const seconds =
      result.value?.duration

    if (
      !seconds
      || seconds <= 0
    ) {
      return null
    }

    const minutes =
      Math.floor(
        seconds / 60,
      )

    const remainder =
      Math.round(
        seconds % 60,
      )

    return (
      `${minutes}:`
      + String(remainder)
        .padStart(2, '0')
    )
  })

const stats = computed(() => {
  const rows: Array<{
    label: string
    value: string
  }> = []

  if (durationLabel.value) {
    rows.push({
      label: 'Duration',
      value:
        durationLabel.value,
    })
  }

  rows.push({
    label: 'Formats',
    value:
      String(
        formats.value.length,
      ),
  })

  return rows
})

interface Rendition {
  key: string
  label: string
  meta: string
  tag: string
  tone:
    | 'accent'
    | 'neutral'
    | 'positive'
  url: string
  filename: string
  recommended?: boolean
  weight: number
}

const formats =
  computed<Rendition[]>(
    () => {
      const data =
        result.value

      if (!data) return []

      const seen =
        new Set<string>()

      const rows:
        Rendition[] = []

      const push = (
        raw: {
          format: string
          url: string
          ext?: string
          height?: number | null
          filesize_mb?: number | null
        },
        index: number,
      ) => {
        if (
          !raw?.url
          || seen.has(raw.url)
        ) {
          return
        }

        seen.add(raw.url)

        const name =
          String(
            raw.format || '',
          ).toLowerCase()

        const height =
          raw.height ?? null

        const isHd =
          name.includes('hd')
          || (
            height !== null
            && height >= 720
          )

        const heightLabel =
          height
            ? `${height}p`
            : null

        const ext =
          raw.ext || 'mp4'

        const parts =
          [
            ext.toUpperCase(),
          ]

        if (raw.filesize_mb) {
          parts.push(
            `${Number(
              raw.filesize_mb,
            ).toFixed(1)} MB`,
          )
        }

        rows.push({
          key:
            `${raw.format}-${index}`,
          label:
            heightLabel
              ? `Video ${heightLabel}`
              : isHd
                ? 'HD video'
                : 'SD video',
          meta:
            parts.join(' · '),
          tag:
            heightLabel
            ?? (
              isHd
                ? 'HD'
                : 'SD'
            ),
          tone:
            isHd
              ? 'accent'
              : 'neutral',
          url:
            raw.url,
          filename:
            `${fileStem.value}`
            + (
              heightLabel
                ? `-${heightLabel}`
                : isHd
                  ? '-hd'
                  : ''
            )
            + `.${ext}`,
          weight:
            height
            ?? (
              isHd
                ? 720
                : 360
            ),
        })
      }

      data.formats?.forEach(
        push,
      )

      if (
        !rows.length
        && data.video_url
      ) {
        push(
          {
            format: 'video',
            url:
              data.video_url,
            ext: 'mp4',
          },
          0,
        )
      }

      rows.sort(
        (a, b) =>
          b.weight
          - a.weight,
      )

      if (rows[0]) {
        rows[0].recommended =
          true
      }

      return rows
    },
  )

const steps = [
  {
    title: 'Copy a public link',
    description:
      'Open a Facebook Reel or video and copy its public share URL.',
  },
  {
    title: 'Paste into the studio',
    description:
      'Paste the link above and wait while the available media is found.',
  },
  {
    title: 'Review the media',
    description:
      'Check the title, thumbnail and available qualities.',
  },
  {
    title: 'Choose a quality',
    description:
      'Choose the version you want and save it.',
  },
]

const faqs = [
  {
    question:
      'Why does it say the video is unavailable?',
    answer:
      'Private posts, friends-only videos, deleted posts and some restricted content cannot be resolved. Try a publicly viewable Facebook video or Reel.',
  },
  {
    question:
      'Can I download Reels?',
    answer:
      'Public Reel links are supported when Facebook exposes a downloadable video source.',
  },
  {
    question:
      'Why are there several qualities?',
    answer:
      'Some Facebook videos are available in more than one resolution. The highest available quality is shown first.',
  },
  {
    question:
      'Can I save any Facebook video?',
    answer:
      'Only save content you own or have permission to use, and follow applicable platform rules and copyright law.',
  },
]
</script>

<template>
  <div
    class="sp-download-page sp-platform-facebook"
  >
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
          :hosts="[
            'facebook.com',
            'fb.watch',
            'fb.com',
          ]"
          host-label="Facebook"
          placeholder="https://www.facebook.com/watch?v=…"
          @submit="submit"
          @error="onInputError"
        />
      </template>

      <template #result>
        <div
          class="grid gap-4 xl:grid-cols-[1fr_1fr]"
        >
          <DownloadMediaCard
            platform="facebook"
            :thumbnail="result?.thumbnail"
            :title="result?.title"
            :author="result?.page_name"
            :stats="stats"
          />

          <div
            class="sp-workspace-pane flex min-w-0 flex-col rounded-[18px] border border-line bg-elevated p-4 sm:p-5"
          >
            <div
              class="flex flex-wrap items-start justify-between gap-3"
            >
              <div>
                <p
                  class="text-[8px] font-black uppercase tracking-[.16em] text-positive"
                >
                  Ready to download
                </p>

                <h2
                  class="mt-2 text-[18px] font-bold tracking-[-.03em] text-fg"
                >
                  Choose a Facebook quality
                </h2>

                <p
                  class="mt-2 text-[10px] leading-5 text-fg-muted"
                >
                  Choose from the available video qualities.
                </p>
              </div>

              <span
                class="sp-platform-best rounded-full px-2.5 py-1.5 text-[8px] font-bold"
              >
                {{ formats.length }} formats
              </span>
            </div>

            <div
              class="mt-4 max-h-[390px] space-y-2.5 overflow-y-auto pr-1"
            >
              <DownloadFormatRow
                v-for="format in formats"
                :key="format.key"
                platform="facebook"
                :label="format.label"
                :meta="format.meta"
                :tag="format.tag"
                :tone="format.tone"
                :recommended="format.recommended"
                :pending="activeDownloadKey === format.key"
                @click="startDownload(format)"
              />
            </div>

            <p
              v-if="activeDownloadKey"
              class="mt-3 text-[9px] leading-5 text-fg-subtle"
            >
              Preparing your download…
            </p>

            <button
              type="button"
              class="sp-workspace-reset mt-4"
              @click="reset"
            >
              Download another Facebook video
              <span>↗</span>
            </button>
          </div>
        </div>
      </template>
    </DownloadStudio>

    <DownloadSteps
      :steps="steps"
      title="Facebook, from public post to file"
      description="Paste a public link, review the available video, then choose a quality."
    />

    <ToolFaq :items="faqs" />
    <ToolRelatedTools
      exclude="facebook-video-download"
    />
  </div>
</template>
