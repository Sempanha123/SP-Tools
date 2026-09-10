<script setup lang="ts">
const { findTool } = useTools()
const {
  capabilities,
  removeBackgroundBrowser,
} = useBrowserImageAI()

const tool = findTool('bg-remover')!

useSeoMeta({
  title:
    'AI Background Remover — Free Browser Background Removal | SP-Tools',
  description:
    'Remove image backgrounds directly in your browser. No upload to the SP-Tools server, no account, no watermark, and no Python processing server required.',
  ogTitle:
    'AI Background Remover | SP-Tools',
  ogDescription:
    'Free browser-side background removal with transparent PNG output.',
})

type Stage =
  | 'idle'
  | 'loading-model'
  | 'processing'
  | 'done'
  | 'error'

const stage = ref<Stage>('idle')
const progress = ref(0)
const statusMessage = ref('')
const errorMessage = ref('')
const originalUrl = ref('')
const resultUrl = ref('')
const originalName = ref('')
const elapsedMs = ref(0)
const backendLabel = ref('')

let controller:
  AbortController | null = null

let timer:
  ReturnType<typeof setInterval> | null =
    null

const isBusy = computed(
  () =>
    stage.value === 'loading-model'
    || stage.value === 'processing',
)

const revoke = () => {
  if (originalUrl.value) {
    URL.revokeObjectURL(
      originalUrl.value,
    )
  }

  if (resultUrl.value) {
    URL.revokeObjectURL(
      resultUrl.value,
    )
  }
}

const reset = () => {
  controller?.abort()

  if (timer) {
    clearInterval(timer)
  }

  revoke()

  stage.value = 'idle'
  progress.value = 0
  statusMessage.value = ''
  errorMessage.value = ''
  originalUrl.value = ''
  resultUrl.value = ''
  originalName.value = ''
  elapsedMs.value = 0
  backendLabel.value = ''
}

onUnmounted(() => {
  controller?.abort()

  if (timer) {
    clearInterval(timer)
  }

  revoke()
})

const process = async (
  file: File,
) => {
  revoke()

  controller =
    new AbortController()

  stage.value =
    'loading-model'

  progress.value = 0
  statusMessage.value =
    'Preparing browser AI…'
  errorMessage.value = ''
  resultUrl.value = ''
  backendLabel.value = ''

  originalName.value =
    file.name.replace(
      /\.[^.]+$/,
      '',
    )

  originalUrl.value =
    URL.createObjectURL(file)

  const startedAt =
    Date.now()

  if (timer) {
    clearInterval(timer)
  }

  timer = setInterval(() => {
    elapsedMs.value =
      Date.now() - startedAt
  }, 100)

  try {
    const result =
      await removeBackgroundBrowser(
        file,
        {
          signal:
            controller.signal,

          onProgress: event => {
            stage.value =
              event.phase

            progress.value =
              event.percent

            statusMessage.value =
              event.message
          },
        },
      )

    if (controller.signal.aborted) {
      return
    }

    resultUrl.value =
      URL.createObjectURL(
        result.blob,
      )

    backendLabel.value =
      result.backend === 'webgpu'
        ? 'WebGPU'
        : 'WASM'

    stage.value = 'done'
  } catch (error) {
    if (
      error instanceof Error
      && error.name === 'AbortError'
    ) {
      return
    }

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Background removal failed.'

    stage.value = 'error'
  } finally {
    if (timer) {
      clearInterval(timer)
    }

    elapsedMs.value =
      Date.now() - startedAt
  }
}

const onDropzoneError = (
  problem: string,
) => {
  errorMessage.value = problem
  stage.value = 'error'
}

const cancel = () => reset()

const demos = [
  {
    src:
      '/images/tools/dog-before.png',
    label: 'Dog portrait',
  },
]

const useDemo = async (
  src: string,
) => {
  errorMessage.value = ''

  try {
    const response =
      await fetch(src)

    if (!response.ok) {
      throw new Error(
        'Demo image is unavailable.',
      )
    }

    const blob =
      await response.blob()

    await process(
      new File(
        [blob],
        `${src.split('/').pop()}`,
        {
          type:
            blob.type
            || 'image/png',
        },
      ),
    )
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Could not load the demo image.'

    stage.value = 'error'
  }
}

const download = () => {
  if (!resultUrl.value) return

  const link =
    document.createElement('a')

  link.href =
    resultUrl.value

  link.download =
    `${originalName.value || 'image'}-no-background.png`

  link.click()
}

const elapsedLabel =
  computed(
    () =>
      `${(
        elapsedMs.value
        / 1000
      ).toFixed(1)}s`,
  )

const runtimeLabel =
  computed(() => {
    if (backendLabel.value) {
      return backendLabel.value
    }

    return capabilities.value.webgpu
      ? 'WebGPU available'
      : 'WASM fallback'
  })

const faqs = [
  {
    question:
      'Does this use my SP-Tools VPS CPU?',
    answer:
      'No. The AI runs inside the visitor’s browser. Your VPS only serves the Nuxt page and JavaScript files.',
  },
  {
    question:
      'Is my image uploaded to SP-Tools?',
    answer:
      'No. The selected image stays on the device for AI processing. The browser downloads the AI model separately and caches it for later visits.',
  },
  {
    question:
      'Why can the first run take longer?',
    answer:
      'The browser has to download and prepare the AI model the first time. Later runs are usually faster because browser caching can reuse those model files.',
  },
  {
    question:
      'What output format do I get?',
    answer:
      'A PNG with an alpha channel so the background stays transparent.',
  },
]
</script>

<template>
  <div>
    <ToolHero
      eyebrow="AI Background Remover"
      title="Remove backgrounds on your device"
      :description="tool.description"
      :features="tool.features"
      :accent="tool.accent"
    />

    <section class="sp-container py-12 sm:py-16">
      <div
        class="mb-6 grid gap-3 sm:grid-cols-3"
      >
        <div
          class="rounded-[16px] border border-line bg-surface-2 px-4 py-3"
        >
          <p
            class="text-[8px] font-bold uppercase tracking-[.14em] text-fg-subtle"
          >
            Processing
          </p>

          <p
            class="mt-1.5 text-[11px] font-bold text-fg"
          >
            Your browser
          </p>
        </div>

        <div
          class="rounded-[16px] border border-line bg-surface-2 px-4 py-3"
        >
          <p
            class="text-[8px] font-bold uppercase tracking-[.14em] text-fg-subtle"
          >
            VPS AI load
          </p>

          <p
            class="mt-1.5 text-[11px] font-bold text-positive"
          >
            None
          </p>
        </div>

        <div
          class="rounded-[16px] border border-line bg-surface-2 px-4 py-3"
        >
          <p
            class="text-[8px] font-bold uppercase tracking-[.14em] text-fg-subtle"
          >
            Runtime
          </p>

          <p
            class="mt-1.5 text-[11px] font-bold text-accent"
          >
            {{ runtimeLabel }}
          </p>
        </div>
      </div>

      <UiAlert
        v-if="errorMessage"
        tone="danger"
        title="Something went wrong"
        class="mb-6"
      >
        {{ errorMessage }}

        <template #action>
          <UiButton
            size="sm"
            variant="secondary"
            @click="reset"
          >
            Start over
          </UiButton>
        </template>
      </UiAlert>

      <div
        v-if="
          stage === 'idle'
          || stage === 'error'
        "
      >
        <ToolDropzone
          hint="JPG, PNG or WEBP · processed locally"
          :max-size-mb="12"
          @file="process"
          @error="onDropzoneError"
        />

        <div
          class="mx-auto mt-5 max-w-2xl rounded-[14px] border border-positive/15 bg-positive-soft px-4 py-3 text-center"
        >
          <p
            class="text-[10px] font-semibold leading-5 text-positive"
          >
            Private processing: the selected photo is not sent to the SP-Tools Python/FastAPI server.
          </p>
        </div>

        <div class="mt-8">
          <p
            class="text-center text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle"
          >
            Or try a sample
          </p>

          <div
            class="mt-4 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              v-for="demo in demos"
              :key="demo.src"
              type="button"
              class="group relative h-20 w-20 overflow-hidden rounded-xl border border-line bg-surface-2 transition hover:border-accent hover:shadow-lift"
              @click="useDemo(demo.src)"
            >
              <img
                :src="demo.src"
                :alt="demo.label"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              >
            </button>
          </div>
        </div>
      </div>

      <div
        v-else-if="isBusy"
        class="sp-panel px-6 py-14 text-center"
      >
        <div
          class="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-accent border-t-transparent"
        />

        <p
          class="mt-6 text-base font-semibold text-fg"
        >
          {{
            stage === 'loading-model'
              ? 'Preparing AI in your browser…'
              : 'Removing the background…'
          }}
        </p>

        <p
          class="mx-auto mt-1.5 max-w-lg text-sm text-fg-muted"
        >
          {{ statusMessage }}
        </p>

        <div
          class="mx-auto mt-6 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-surface-3"
        >
          <div
            class="h-full rounded-full bg-accent transition-[width] duration-200"
            :style="{
              width: `${Math.max(
                3,
                progress,
              )}%`,
            }"
          />
        </div>

        <p
          class="mt-4 text-[10px] text-fg-subtle"
        >
          Your VPS is not doing this AI work.
        </p>

        <UiButton
          variant="ghost"
          size="sm"
          class="mt-5"
          @click="cancel"
        >
          Cancel
        </UiButton>
      </div>

      <div
        v-else-if="stage === 'done'"
        class="grid gap-6 lg:grid-cols-[1.6fr_1fr]"
      >
        <ToolCompareSlider
          :before="originalUrl"
          :after="resultUrl"
          before-label="Original"
          after-label="Transparent"
          transparent
        />

        <div
          class="sp-card flex flex-col p-6"
        >
          <UiBadge
            tone="positive"
            dot
          >
            Done in {{ elapsedLabel }}
          </UiBadge>

          <h2
            class="mt-4 font-display text-2xl font-bold text-fg"
          >
            Your transparent PNG is ready
          </h2>

          <p
            class="mt-2 text-sm leading-6 text-fg-muted"
          >
            The image was processed locally in this browser. No image-processing request was sent to your VPS.
          </p>

          <div class="mt-6 space-y-2.5">
            <UiButton
              block
              @click="download"
            >
              Download PNG
            </UiButton>

            <UiButton
              variant="secondary"
              block
              @click="reset"
            >
              Process another image
            </UiButton>
          </div>

          <dl
            class="mt-6 space-y-2 border-t border-line pt-5 text-xs"
          >
            <div
              class="flex justify-between gap-4"
            >
              <dt class="text-fg-subtle">
                AI location
              </dt>

              <dd
                class="font-semibold text-positive"
              >
                Visitor device
              </dd>
            </div>

            <div
              class="flex justify-between gap-4"
            >
              <dt class="text-fg-subtle">
                Runtime
              </dt>

              <dd
                class="font-semibold text-fg"
              >
                {{ backendLabel }}
              </dd>
            </div>

            <div
              class="flex justify-between gap-4"
            >
              <dt class="text-fg-subtle">
                Format
              </dt>

              <dd
                class="font-semibold text-fg"
              >
                PNG with alpha
              </dd>
            </div>

            <div
              class="flex justify-between gap-4"
            >
              <dt class="text-fg-subtle">
                Watermark
              </dt>

              <dd
                class="font-semibold text-positive"
              >
                None
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <ToolFaq :items="faqs" />
    <ToolRelatedTools exclude="bg-remover" />
  </div>
</template>
