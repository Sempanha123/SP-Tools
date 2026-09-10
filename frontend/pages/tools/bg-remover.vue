<script setup lang="ts">
const { findTool } = useTools()
const { removeBackground } = useMediaApi()

const tool = findTool('bg-remover')!

useSeoMeta({
  title: 'AI Background Remover — Free Transparent PNG Maker | SP-Tools',
  description:
    'Remove the background from any photo automatically and download a transparent PNG. No account, no watermark, works in your browser.',
  ogTitle: 'AI Background Remover | SP-Tools',
  ogDescription:
    'Upload an image and get a clean transparent PNG in seconds, powered by U²-Net.',
})

/* ------------------------------------------------------------------ state */

type Stage = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

const stage = ref<Stage>('idle')
const progress = ref(0)
const errorMessage = ref('')
const originalUrl = ref('')
const resultUrl = ref('')
const originalName = ref('')
const elapsedMs = ref(0)

let controller: AbortController | null = null
let timer: ReturnType<typeof setInterval> | null = null

const isBusy = computed(
  () => stage.value === 'uploading' || stage.value === 'processing',
)

/** Revoking object URLs keeps long sessions from leaking blobs. */
const revoke = () => {
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
}

const reset = () => {
  controller?.abort()
  if (timer) clearInterval(timer)
  revoke()

  stage.value = 'idle'
  progress.value = 0
  errorMessage.value = ''
  originalUrl.value = ''
  resultUrl.value = ''
  originalName.value = ''
  elapsedMs.value = 0
}

onUnmounted(() => {
  controller?.abort()
  if (timer) clearInterval(timer)
  revoke()
})

/* --------------------------------------------------------------- process */

const process = async (file: File) => {
  revoke()

  controller = new AbortController()
  stage.value = 'uploading'
  progress.value = 0
  errorMessage.value = ''
  resultUrl.value = ''
  originalName.value = file.name.replace(/\.[^.]+$/, '')
  originalUrl.value = URL.createObjectURL(file)

  const startedAt = Date.now()
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    elapsedMs.value = Date.now() - startedAt
  }, 100)

  try {
    const blob = await removeBackground(file, {
      signal: controller.signal,
      onProgress: (percent) => {
        progress.value = percent
        // Upload finished; the model is now running server-side.
        if (percent >= 100) stage.value = 'processing'
      },
    })

    resultUrl.value = URL.createObjectURL(blob)
    stage.value = 'done'
  } catch (error) {
    // A user-initiated cancel is not an error worth showing.
    if (stage.value === 'idle') return

    errorMessage.value =
      error instanceof Error ? error.message : 'Background removal failed.'
    stage.value = 'error'
  } finally {
    if (timer) clearInterval(timer)
    elapsedMs.value = Date.now() - startedAt
  }
}

const onDropzoneError = (problem: string) => {
  errorMessage.value = problem
  stage.value = 'error'
}

const cancel = () => reset()

/* ----------------------------------------------------------- demo images */

// Only reference files that actually exist in public/images/tools.
const demos = [{ src: '/images/tools/dog-before.png', label: 'Dog portrait' }]

const useDemo = async (src: string) => {
  errorMessage.value = ''

  try {
    const response = await fetch(src)
    if (!response.ok) throw new Error('Demo image is unavailable.')

    const blob = await response.blob()
    await process(
      new File([blob], `${src.split('/').pop()}`, { type: blob.type }),
    )
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Could not load the demo image.'
    stage.value = 'error'
  }
}

/* -------------------------------------------------------------- download */

const download = () => {
  if (!resultUrl.value) return

  const link = document.createElement('a')
  link.href = resultUrl.value
  link.download = `${originalName.value || 'image'}-no-background.png`
  link.click()
}

const elapsedLabel = computed(() => `${(elapsedMs.value / 1000).toFixed(1)}s`)

const faqs = [
  {
    question: 'Is the background remover free?',
    answer:
      'Yes. You can process images directly in your browser without creating an account, and there is no watermark on the result.',
  },
  {
    question: 'What image formats are supported?',
    answer:
      'JPG, PNG and WEBP inputs up to 12 MB. The result is always returned as a PNG so transparency is preserved.',
  },
  {
    question: 'Will the output really have a transparent background?',
    answer:
      'Yes. The subject is masked with an alpha channel, so you can drop the PNG onto any colour or another photo without a white box behind it.',
  },
  {
    question: 'Are my uploads stored?',
    answer:
      'The image is sent to the processing service, the mask is generated, and the result is streamed back. Keep in mind the service writes a copy to disk while processing — clear that directory if you handle sensitive images.',
  },
]
</script>

<template>
  <div>
    <ToolHero
      eyebrow="AI Background Remover"
      title="Remove any background in one step"
      :description="tool.description"
      :features="tool.features"
      :accent="tool.accent"
    />

    <!-- ============================================== WORKSPACE -->

    <section class="sp-container py-12 sm:py-16">
      <UiAlert
        v-if="errorMessage"
        tone="danger"
        title="Something went wrong"
        class="mb-6"
      >
        {{ errorMessage }}

        <template #action>
          <UiButton size="sm" variant="secondary" @click="reset">
            Start over
          </UiButton>
        </template>
      </UiAlert>

      <!-- Idle: dropzone -->
      <div v-if="stage === 'idle' || stage === 'error'">
        <ToolDropzone
          hint="JPG, PNG or WEBP"
          :max-size-mb="12"
          @file="process"
          @error="onDropzoneError"
        />

        <div class="mt-8">
          <p class="text-center text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
            Or try a sample
          </p>

          <div class="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              v-for="demo in demos"
              :key="demo.src"
              type="button"
              class="group relative h-20 w-20 overflow-hidden rounded-xl border
                border-line bg-surface-2 transition hover:border-accent
                hover:shadow-lift"
              @click="useDemo(demo.src)"
            >
              <img
                :src="demo.src"
                :alt="demo.label"
                class="h-full w-full object-cover transition-transform
                  duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Busy -->
      <div v-else-if="isBusy" class="sp-panel px-6 py-14 text-center">
        <div
          class="mx-auto h-14 w-14 animate-spin rounded-full border-4
            border-accent border-t-transparent"
        />

        <p class="mt-6 text-base font-semibold text-fg">
          {{ stage === 'uploading' ? 'Uploading your image…' : 'Removing the background…' }}
        </p>

        <p class="mt-1.5 text-sm text-fg-muted">
          {{ stage === 'uploading' ? `${progress}% uploaded` : `Running for ${elapsedLabel}` }}
        </p>

        <div class="mx-auto mt-6 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-surface-3">
          <div
            class="h-full rounded-full bg-accent transition-[width] duration-200"
            :class="stage === 'processing' ? 'animate-pulse' : ''"
            :style="{ width: stage === 'processing' ? '100%' : `${progress}%` }"
          />
        </div>

        <UiButton variant="ghost" size="sm" class="mt-6" @click="cancel">
          Cancel
        </UiButton>
      </div>

      <!-- Done -->
      <div v-else-if="stage === 'done'" class="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <ToolCompareSlider
          :before="originalUrl"
          :after="resultUrl"
          before-label="Original"
          after-label="Transparent"
          transparent
        />

        <div class="sp-card flex flex-col p-6">
          <UiBadge tone="positive" dot>Done in {{ elapsedLabel }}</UiBadge>

          <h2 class="mt-4 font-display text-2xl font-bold text-fg">
            Your PNG is ready
          </h2>

          <p class="mt-2 text-sm leading-6 text-fg-muted">
            Drag the handle to compare. The download keeps full transparency,
            so it drops cleanly onto any background.
          </p>

          <div class="mt-6 space-y-2.5">
            <UiButton block @click="download">
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.9"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14"
                />
              </svg>
              Download PNG
            </UiButton>

            <UiButton variant="secondary" block @click="reset">
              Process another image
            </UiButton>
          </div>

          <dl class="mt-6 space-y-2 border-t border-line pt-5 text-xs">
            <div class="flex justify-between">
              <dt class="text-fg-subtle">Format</dt>
              <dd class="font-semibold text-fg">PNG with alpha</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-fg-subtle">Processing time</dt>
              <dd class="font-semibold text-fg">{{ elapsedLabel }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-fg-subtle">Watermark</dt>
              <dd class="font-semibold text-positive">None</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <ToolFaq :items="faqs" />
    <ToolRelatedTools exclude="bg-remover" />
  </div>
</template>
