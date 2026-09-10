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
    'Remove image backgrounds quickly and download a clean transparent PNG. No account and no watermark.',
  ogTitle:
    'AI Background Remover | SP-Tools',
  ogDescription:
    'Fast background removal with transparent PNG output.',
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


const faqs = [
  {
    question:
      'Is the background remover free?',
    answer:
      'Yes. You can remove backgrounds and download the result without a watermark.',
  },
  {
    question:
      'What image formats are supported?',
    answer:
      'JPG, PNG and WEBP images are supported. The final result is downloaded as a transparent PNG.',
  },
  {
    question:
      'Will the result keep transparency?',
    answer:
      'Yes. The output includes an alpha channel so you can place the subject on another background.',
  },
  {
    question:
      'Why can the first result take a little longer?',
    answer:
      'The first run may need a little extra preparation. Later runs are usually faster.',
  },
]
</script>

<template>
  <div>
    <ToolHero
      eyebrow="AI Background Remover"
      title="Free AI background remover online"
      :description="tool.description"
      :features="tool.features"
      :accent="tool.accent"
    />

    <section class="sp-container py-12 sm:py-16">
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
          class="mx-auto mt-5 max-w-2xl rounded-[14px] border border-line bg-surface-2 px-4 py-3 text-center"
        >
          <p class="text-[10px] font-semibold leading-5 text-fg-muted">
            Fast, simple background removal with transparent PNG output.
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
              ? 'Preparing background remover…'
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
          Please keep this tab open while your image is processed.
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
            Your transparent image is ready to download.
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
            <div class="flex justify-between gap-4">
              <dt class="text-fg-subtle">Format</dt>
              <dd class="font-semibold text-fg">PNG with alpha</dd>
            </div>

            <div class="flex justify-between gap-4">
              <dt class="text-fg-subtle">Processing time</dt>
              <dd class="font-semibold text-fg">{{ elapsedLabel }}</dd>
            </div>

            <div class="flex justify-between gap-4">
              <dt class="text-fg-subtle">Watermark</dt>
              <dd class="font-semibold text-positive">None</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <ToolSeoLanding slug="bg-remover" />
    <ToolRelatedTools exclude="bg-remover" />
  </div>
</template>
