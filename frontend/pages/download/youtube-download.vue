<script setup lang="ts">
import type {
  YoutubeNuxtAudioOption,
  YoutubeNuxtOptions,
  YoutubeNuxtVideoOption,
} from '~/composables/useYouTubeDownload'

const { findTool } = useTools()

const {
  fetchYoutubeOptions,
  youtubeFileUrl,
} = useYouTubeDownload()

const tool =
  findTool(
    'youtube-download',
  )!

useSeoMeta({
  title:
    'YouTube Downloader — Video and Audio | SP-Tools',
  description:
    'Paste a YouTube link to list ready video and audio streams, then save the format you want.',
  ogTitle:
    'YouTube Downloader | SP-Tools',
  ogDescription:
    'Download ready YouTube video or audio streams.',
})

const url = ref('')
const loading = ref(false)
const errorMessage = ref('')
const result =
  ref<YoutubeNuxtOptions | null>(
    null,
  )

const tab =
  ref<'video' | 'audio'>(
    'video',
  )

const activeDownloadKey =
  ref<string | null>(null)

let controller:
  AbortController | null = null

const reset = () => {
  controller?.abort()
  url.value = ''
  result.value = null
  errorMessage.value = ''
  loading.value = false
  activeDownloadKey.value = null
  tab.value = 'video'
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
      await fetchYoutubeOptions(
        url.value.trim(),
        request.signal,
      )

    if (
      !data?.video_options?.length
      && !data?.audio_options?.length
    ) {
      throw new Error(
        'No ready streams were returned. The video may be unavailable or restricted.',
      )
    }

    result.value = data

    tab.value =
      data.video_options?.length
        ? 'video'
        : 'audio'
  } catch (error) {
    if (
      request.signal.aborted
    ) {
      return
    }

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Could not read that URL.'
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

const sizeLabel = (
  value:
    | number
    | string
    | undefined,
) => {
  const megabytes =
    typeof value === 'string'
      ? Number.parseFloat(value)
      : value

  if (
    !megabytes
    || Number.isNaN(
      megabytes,
    )
  ) {
    return 'size unknown'
  }

  return (
    `${megabytes.toFixed(1)} MB`
  )
}

const heightOf = (
  resolution: string,
) =>
  Number.parseInt(
    String(resolution)
      .replace(
        /\D+/g,
        '',
      ),
    10,
  )
  || 0

const videoRows =
  computed(() => {
    const options =
      result.value
        ?.video_options
      ?? []

    const best =
      new Map<
        string,
        YoutubeNuxtVideoOption
      >()

    for (
      const option
      of options
    ) {
      const key =
        option.resolution
        || `${option.itag}`

      const current =
        best.get(key)

      if (
        !current
        || (
          option.fps || 0
        ) > (
          current.fps || 0
        )
      ) {
        best.set(
          key,
          option,
        )
      }
    }

    return [
      ...best.values(),
    ]
      .sort(
        (a, b) =>
          heightOf(
            b.resolution,
          )
          - heightOf(
            a.resolution,
          ),
      )
      .map(
        (
          option,
          index,
        ) => ({
          key:
            `video-${option.client}-${option.itag}`,
          itag:
            option.itag,
          label:
            `${option.resolution}`
            + (
              option.fps
              && option.fps > 30
                ? ` ${option.fps}fps`
                : ''
            ),
          meta:
            [
              (
                option.container
                || 'mp4'
              ).toUpperCase(),
              sizeLabel(
                option.filesize_mb,
              ),
            ]
              .filter(Boolean)
              .join(' · '),
          tag:
            option.resolution
            || 'VIDEO',
          tone:
            (
              heightOf(
                option.resolution,
              ) >= 720
                ? 'accent'
                : 'neutral'
            ) as
              | 'accent'
              | 'neutral',
          recommended:
            index === 0,
          href:
            result.value
              ? youtubeFileUrl(
                  result.value
                    .video_id,
                  option.itag,
                  'video',
                  option.client,
                )
              : '',
        }),
      )
  })

const abrOf = (
  abr: string,
) =>
  Number.parseInt(
    String(abr)
      .replace(
        /\D+/g,
        '',
      ),
    10,
  )
  || 0

const audioRows =
  computed(() =>
    [
      ...(
        result.value
          ?.audio_options
        ?? []
      ),
    ]
      .sort(
        (
          a:
            YoutubeNuxtAudioOption,
          b:
            YoutubeNuxtAudioOption,
        ) =>
          abrOf(b.abr)
          - abrOf(a.abr),
      )
      .map(
        (
          option,
          index,
        ) => ({
          key:
            `audio-${option.client}-${option.itag}`,
          itag:
            option.itag,
          label:
            `Audio ${option.abr}`,
          meta:
            [
              (
                option.container
                || 'audio'
              ).toUpperCase(),
              sizeLabel(
                option.filesize_mb,
              ),
            ]
              .filter(Boolean)
              .join(' · '),
          tag:
            option.abr
            || 'AUDIO',
          tone:
            (
              index === 0
                ? 'accent'
                : 'neutral'
            ) as
              | 'accent'
              | 'neutral',
          recommended:
            index === 0,
          href:
            result.value
              ? youtubeFileUrl(
                  result.value
                    .video_id,
                  option.itag,
                  'audio',
                  option.client,
                )
              : '',
        }),
      ),
  )

const rows =
  computed(
    () =>
      tab.value === 'video'
        ? videoRows.value
        : audioRows.value,
  )

const startDownload = async (
  row: {
    key: string
    href: string
    label: string
  },
) => {
  if (
    !import.meta.client
    || activeDownloadKey.value
  ) {
    return
  }

  activeDownloadKey.value =
    row.key

  errorMessage.value = ''

  try {
    const response =
      await fetch(
        row.href,
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

    const disposition =
      response.headers.get(
        'content-disposition',
      )
      || ''

    const filenameMatch =
      disposition.match(
        /filename="?([^"]+)"?/i,
      )

    const extension =
      response.headers
        .get('content-type')
        ?.includes('audio/webm')
        ? 'webm'
        : response.headers
            .get('content-type')
            ?.includes('audio')
          ? 'm4a'
          : 'mp4'

    const filename =
      filenameMatch?.[1]
      || `${row.label
        .toLowerCase()
        .replace(
          /[^\w.-]+/g,
          '-',
        )}.${extension}`

    const objectUrl =
      URL.createObjectURL(blob)

    const link =
      document.createElement('a')

    link.href = objectUrl
    link.download = filename
    link.style.display = 'none'

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
        : 'Could not download that YouTube file.'
  } finally {
    activeDownloadKey.value =
      null
  }
}

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

    const hours =
      Math.floor(
        seconds / 3600,
      )

    const minutes =
      Math.floor(
        (
          seconds % 3600
        ) / 60,
      )

    const remainder =
      Math.round(
        seconds % 60,
      )

    return hours
      ? (
          `${hours}:`
          + String(minutes)
            .padStart(2, '0')
          + ':'
          + String(remainder)
            .padStart(2, '0')
        )
      : (
          `${minutes}:`
          + String(remainder)
            .padStart(2, '0')
        )
  })

const stats =
  computed(() => {
    const out: Array<{
      label: string
      value: string
    }> = []

    if (durationLabel.value) {
      out.push({
        label: 'Duration',
        value:
          durationLabel.value,
      })
    }

    out.push({
      label: 'Video',
      value:
        String(
          videoRows.value.length,
        ),
    })

    out.push({
      label: 'Audio',
      value:
        String(
          audioRows.value.length,
        ),
    })

    return out
  })

const steps = [
  {
    title: 'Copy the link',
    description:
      'Copy a YouTube watch, Shorts, or youtu.be URL.',
  },
  {
    title: 'Paste into the studio',
    description:
      'Paste the link above and wait for the available streams.',
  },
  {
    title: 'Choose video or audio',
    description:
      'Switch between ready video formats and original audio streams.',
  },
  {
    title: 'Download',
    description:
      'Choose a listed stream and save the file.',
  },
]

const faqs = [
  {
    question:
      'Why are some very high resolutions not listed?',
    answer:
      'YouTube often separates high-resolution video from its audio track. SP-Tools lists ready video formats that already contain audio, so no conversion step is required.',
  },
  {
    question:
      'What format is the audio download?',
    answer:
      'The original available audio stream is provided, commonly M4A or WebM depending on the video.',
  },
  {
    question:
      'Why can a large file take longer?',
    answer:
      'Larger videos naturally need more time to transfer. Try another available quality if you need a smaller file.',
  },
  {
    question:
      'Can private or restricted videos be downloaded?',
    answer:
      'No. Videos that require a signed-in account or are unavailable cannot be resolved.',
  },
  {
    question:
      'Can I save any YouTube video?',
    answer:
      'Only save content you own or have permission to use, and follow applicable platform rules and copyright law.',
  },
]
</script>

<template>
  <div
    class="sp-download-page sp-platform-youtube"
  >
    <DownloadStudio
      platform="youtube"
      eyebrow="YouTube Downloader"
      title="Free YouTube video and audio downloader"
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
            'youtube.com',
            'youtu.be',
            'youtube-nocookie.com',
          ]"
          host-label="YouTube"
          placeholder="https://www.youtube.com/watch?v=…"
          @submit="submit"
          @error="onInputError"
        />
      </template>

      <template #result>
        <div
          class="grid gap-4 xl:grid-cols-[1fr_1fr]"
        >
          <DownloadMediaCard
            platform="youtube"
            :thumbnail="result?.thumbnail_url"
            :title="result?.title"
            :author="result?.channel_name"
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
                  Streams ready
                </p>

                <h2
                  class="mt-2 text-[18px] font-bold tracking-[-.03em] text-fg"
                >
                  Pick video or audio
                </h2>

                <p
                  class="mt-2 text-[10px] leading-5 text-fg-muted"
                >
                  Choose a video or audio format and save it without leaving this page.
                </p>
              </div>

              <span
                class="sp-platform-best rounded-full px-2.5 py-1.5 text-[8px] font-bold"
              >
                {{
                  videoRows.length
                  + audioRows.length
                }}
                streams
              </span>
            </div>

            <div
              class="mt-4 inline-flex rounded-[12px] border border-line bg-surface-3 p-1"
              role="tablist"
              aria-label="Download type"
            >
              <button
                v-for="option in (['video', 'audio'] as const)"
                :key="option"
                type="button"
                role="tab"
                class="flex-1 rounded-[9px] px-4 py-2.5 text-[10px] font-bold capitalize transition"
                :class="
                  tab === option
                    ? 'sp-platform-submit text-white'
                    : 'text-fg-muted hover:text-fg'
                "
                :aria-selected="tab === option"
                :disabled="
                  option === 'video'
                    ? !videoRows.length
                    : !audioRows.length
                "
                @click="tab = option"
              >
                {{ option }}
                ·
                {{
                  option === 'video'
                    ? videoRows.length
                    : audioRows.length
                }}
              </button>
            </div>

            <div
              class="mt-3 max-h-[360px] space-y-2.5 overflow-y-auto pr-1"
            >
              <DownloadFormatRow
                v-for="row in rows"
                :key="row.key"
                platform="youtube"
                :label="row.label"
                :meta="row.meta"
                :tag="row.tag"
                :tone="row.tone"
                :recommended="row.recommended"
                :pending="activeDownloadKey === row.key"
                @click="startDownload(row)"
              />

              <div
                v-if="!rows.length"
                class="rounded-[14px] border border-dashed border-line bg-surface-3 px-4 py-8 text-center text-[11px] text-fg-muted"
              >
                No {{ tab }} streams are available for this video. Try the other tab.
              </div>
            </div>

            <p
              class="mt-3 text-[9px] leading-5 text-fg-subtle"
            >
              Ready video formats already include audio. Separate high-resolution video tracks are not shown.
            </p>

            <p
              v-if="activeDownloadKey"
              class="mt-2 text-[9px] leading-5 text-fg-subtle"
            >
              Preparing your download…
            </p>

            <button
              type="button"
              class="sp-workspace-reset mt-3"
              @click="reset"
            >
              Download another YouTube video
              <span>↗</span>
            </button>
          </div>
        </div>
      </template>
    </DownloadStudio>

    <DownloadSteps
      :steps="steps"
      title="YouTube, from link to stream"
      description="Paste once, review the available media, then choose the video or audio format you need."
    />

    <ToolSeoLanding slug="youtube-download" />
    <ToolRelatedTools
      exclude="youtube-download"
    />
  </div>
</template>
