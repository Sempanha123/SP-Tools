<script setup lang="ts">
const { findTool } = useTools()
const { upscaleImage } = useMediaApi()

const tool = findTool('image-upscaler')!

useSeoMeta({
  title: 'AI Image Upscaler — Enlarge Images up to 4× | SP-Tools',
  description:
    'Upscale images 2× or 4× with Real-ESRGAN. Reconstructs real detail instead of blurring, and downloads as a lossless PNG.',
  ogTitle: 'AI Image Upscaler | SP-Tools',
  ogDescription:
    'Increase image resolution up to 4× without losing sharpness.',
})

/* ------------------------------------------------------------------ state */

type Stage = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

const stage = ref<Stage>('idle')
const scale = ref<2 | 4>(2)
const progress = ref(0)
const errorMessage = ref('')
const originalUrl = ref('')
const resultUrl = ref('')
const originalName = ref('')
const elapsedMs = ref(0)

const sourceFile = ref<File | null>(null)
const sourceSize = ref<{ width: number; height: number } | null>(null)
const resultSize = ref<{ width: number; height: number } | null>(null)
const resultBytes = ref(0)

let controller: AbortController | null = null
let timer: ReturnType<typeof setInterval> | null = null

const isBusy = computed(
  () => stage.value === 'uploading' || stage.value === 'processing',
)

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
  sourceFile.value = null
  sourceSize.value = null
  resultSize.value = null
  resultBytes.value = 0
}

onUnmounted(() => {
  controller?.abort()
  if (timer) clearInterval(timer)
  revoke()
})

/** Reads intrinsic dimensions so we can show the exact output resolution. */
const measure = (url: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image()
    image.onload = () =>
      resolve({ width: image.naturalWidth, height: image.naturalHeight })
    image.onerror = () => reject(new Error('Could not read that image.'))
    image.src = url
  })

/* --------------------------------------------------------------- process */

const run = async (file: File) => {
  controller = new AbortController()
  stage.value = 'uploading'
  progress.value = 0
  errorMessage.value = ''

  if (resultUrl.value) {
    URL.revokeObjectURL(resultUrl.value)
    resultUrl.value = ''
  }

  const startedAt = Date.now()
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    elapsedMs.value = Date.now() - startedAt
  }, 100)

  try {
    const blob = await upscaleImage(file, {
      scale: scale.value,
      signal: controller.signal,
      onProgress: (percent) => {
        progress.value = percent
        if (percent >= 100) stage.value = 'processing'
      },
    })

    resultUrl.value = URL.createObjectURL(blob)
    resultBytes.value = blob.size
    resultSize.value = await measure(resultUrl.value)
    stage.value = 'done'
  } catch (error) {
    if (stage.value === 'idle') return

    errorMessage.value =
      error instanceof Error ? error.message : 'Upscaling failed.'
    stage.value = 'error'
  } finally {
    if (timer) clearInterval(timer)
    elapsedMs.value = Date.now() - startedAt
  }
}

const process = async (file: File) => {
  revoke()

  sourceFile.value = file
  originalName.value = file.name.replace(/\.[^.]+$/, '')
  originalUrl.value = URL.createObjectURL(file)

  try {
    sourceSize.value = await measure(originalUrl.value)
  } catch {
    sourceSize.value = null
  }

  await run(file)
}

/** Re-runs the current image at a different scale without re-uploading it. */
const changeScale = async (next: 2 | 4) => {
  if (scale.value === next) return
  scale.value = next

  if (sourceFile.value && stage.value === 'done') {
    await run(sourceFile.value)
  }
}

const onDropzoneError = (problem: string) => {
  errorMessage.value = problem
  stage.value = 'error'
}

/* -------------------------------------------------------------- download */

const download = () => {
  if (!resultUrl.value) return

  const link = document.createElement('a')
  link.href = resultUrl.value
  link.download = `${originalName.value || 'image'}-${scale.value}x.png`
  link.click()
}

const elapsedLabel = computed(() => `${(elapsedMs.value / 1000).toFixed(1)}s`)

const sizeLabel = (size: { width: number; height: number } | null) =>
  size ? `${size.width} × ${size.height}` : '—'

const bytesLabel = computed(() => {
  if (!resultBytes.value) return '—'
  const mb = resultBytes.value / 1024 / 1024
  return mb >= 1
    ? `${mb.toFixed(1)} MB`
    : `${Math.round(resultBytes.value / 1024)} KB`
})

const faqs = [
  {
    question: 'How much can I enlarge an image?',
    answer:
      'Choose 2× or 4×. A 500×500 source becomes 1000×1000 at 2×, or 2000×2000 at 4×. Larger sources take proportionally longer to process.',
  },
  {
    question: 'Why does 4× take longer than 2×?',
    answer:
      'The model reconstructs four times as many pixels, and runs on CPU by default. Large images at 4× can take a while — the timer shows live progress.',
  },
  {
    question: 'Is this better than resizing in an image editor?',
    answer:
      'Yes for photos. A normal resize interpolates between existing pixels, which softens edges. Real-ESRGAN predicts plausible detail, so edges and textures stay crisp.',
  },
  {
    question: 'What format do I get back?',
    answer:
      'A lossless PNG, so no additional compression artefacts are introduced on top of the upscaled result.',
  },
]
</script>

<template>
  <div>
    <ToolHero
      eyebrow="AI Image Upscaler"
      title="Enlarge images without losing detail"
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
          <UiButton size="sm" variant="secondary" @click="reset">
            Start over
          </UiButton>
        </template>
      </UiAlert>

      <!-- Scale selector -->
      <div
        class="mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <span class="text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
          Scale factor
        </span>

        <div
          class="inline-flex rounded-xl border border-line bg-surface-2 p-1"
          role="group"
          aria-label="Upscale factor"
        >
          <button
            v-for="option in ([2, 4] as const)"
            :key="option"
            type="button"
            class="rounded-lg px-5 py-2 text-sm font-semibold transition-colors"
            :class="
              scale === option
                ? 'bg-accent text-accent-fg shadow-glow'
                : 'text-fg-muted hover:text-fg'
            "
            :disabled="isBusy"
            :aria-pressed="scale === option"
            @click="changeScale(option)"
          >
            {{ option }}×
          </button>
        </div>
      </div>

      <!-- Idle -->
      <div v-if="stage === 'idle' || stage === 'error'">
        <ToolDropzone
          hint="JPG, PNG or WEBP"
          :max-size-mb="10"
          @file="process"
          @error="onDropzoneError"
        />
      </div>

      <!-- Busy -->
      <div v-else-if="isBusy" class="sp-panel px-6 py-14 text-center">
        <div
          class="mx-auto h-14 w-14 animate-spin rounded-full border-4
            border-accent border-t-transparent"
        />

        <p class="mt-6 text-base font-semibold text-fg">
          {{ stage === 'uploading' ? 'Uploading your image…' : `Upscaling to ${scale}×…` }}
        </p>

        <p class="mt-1.5 text-sm text-fg-muted">
          {{ stage === 'uploading' ? `${progress}% uploaded` : `Running for ${elapsedLabel}` }}
        </p>

        <p
          v-if="stage === 'processing' && scale === 4"
          class="mx-auto mt-3 max-w-sm text-xs text-fg-subtle"
        >
          4× reconstruction is compute-heavy and may take a minute on larger
          images.
        </p>

        <div class="mx-auto mt-6 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-surface-3">
          <div
            class="h-full rounded-full bg-accent transition-[width] duration-200"
            :class="stage === 'processing' ? 'animate-pulse' : ''"
            :style="{ width: stage === 'processing' ? '100%' : `${progress}%` }"
          />
        </div>

        <UiButton variant="ghost" size="sm" class="mt-6" @click="reset">
          Cancel
        </UiButton>
      </div>

      <!-- Done -->
      <div v-else-if="stage === 'done'" class="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <ToolCompareSlider
          :before="originalUrl"
          :after="resultUrl"
          before-label="Original"
          :after-label="`${scale}× upscaled`"
        />

        <div class="sp-card flex flex-col p-6">
          <UiBadge tone="positive" dot>Done in {{ elapsedLabel }}</UiBadge>

          <h2 class="mt-4 font-display text-2xl font-bold text-fg">
            Upscaled {{ scale }}×
          </h2>

          <p class="mt-2 text-sm leading-6 text-fg-muted">
            Drag the handle to inspect the reconstructed detail at full size.
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

            <UiButton
              variant="secondary"
              block
              @click="changeScale(scale === 2 ? 4 : 2)"
            >
              Try {{ scale === 2 ? '4' : '2' }}× instead
            </UiButton>

            <UiButton variant="ghost" block @click="reset">
              Upscale another image
            </UiButton>
          </div>

          <dl class="mt-6 space-y-2 border-t border-line pt-5 text-xs">
            <div class="flex justify-between">
              <dt class="text-fg-subtle">Original</dt>
              <dd class="font-semibold text-fg">{{ sizeLabel(sourceSize) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-fg-subtle">Upscaled</dt>
              <dd class="font-semibold text-accent">{{ sizeLabel(resultSize) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-fg-subtle">File size</dt>
              <dd class="font-semibold text-fg">{{ bytesLabel }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-fg-subtle">Format</dt>
              <dd class="font-semibold text-fg">Lossless PNG</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <ToolFaq :items="faqs" />
    <ToolRelatedTools exclude="image-upscaler" />
  </div>
</template>
