<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    accept?: string
    maxSizeMb?: number
    disabled?: boolean
    hint?: string
  }>(),
  {
    accept: 'image/jpeg,image/png,image/webp',
    maxSizeMb: 12,
    hint: 'JPG, PNG or WEBP',
  },
)

const emit = defineEmits<{ file: [File]; error: [string] }>()

const input = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const dragDepth = ref(0)

const acceptedTypes = computed(() =>
  props.accept.split(',').map((type) => type.trim()),
)

const validate = (file: File): string | null => {
  if (!acceptedTypes.value.includes(file.type)) {
    return `Unsupported file type. Please use ${props.hint}.`
  }

  if (file.size > props.maxSizeMb * 1024 * 1024) {
    return `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${props.maxSizeMb} MB.`
  }

  return null
}

const accept = (file: File | undefined | null) => {
  if (!file) return

  const problem = validate(file)
  if (problem) {
    emit('error', problem)
    return
  }

  emit('file', file)
}

const onSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  accept(target.files?.[0])
  target.value = ''
}

const onDragEnter = () => {
  dragDepth.value += 1
  isDragging.value = true
}

const onDragLeave = () => {
  dragDepth.value = Math.max(0, dragDepth.value - 1)
  if (dragDepth.value === 0) isDragging.value = false
}

const onDrop = (event: DragEvent) => {
  dragDepth.value = 0
  isDragging.value = false
  accept(event.dataTransfer?.files?.[0])
}

const onPaste = (event: ClipboardEvent) => {
  const item = Array.from(event.clipboardData?.items ?? []).find((entry) =>
    entry.type.startsWith('image/'),
  )
  if (item) accept(item.getAsFile())
}

onMounted(() => window.addEventListener('paste', onPaste))
onUnmounted(() => window.removeEventListener('paste', onPaste))
</script>

<template>
  <div
    class="relative flex min-h-[270px] flex-col items-center justify-center overflow-hidden rounded-[18px] border bg-elevated px-6 py-9 text-center shadow-soft transition-all duration-200 sm:min-h-[290px]"
    :class="[
      isDragging
        ? 'border-accent bg-accent-soft shadow-lift'
        : 'border-line hover:border-line-strong',
      disabled ? 'pointer-events-none opacity-55' : '',
    ]"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="sp-quiet-grid pointer-events-none absolute inset-0 opacity-35" />

    <input
      ref="input"
      type="file"
      class="sr-only"
      :accept="accept"
      :disabled="disabled"
      @change="onSelect"
    />

    <div class="relative flex h-12 w-12 items-center justify-center rounded-[14px] border border-line bg-surface-2 text-accent shadow-xs">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15V4m0 0L8 8m4-4 4 4M5 16.5v1A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-1" />
      </svg>
    </div>

    <p class="relative mt-5 text-[17px] font-[680] tracking-[-0.02em] text-fg">
      {{ isDragging ? 'Release to upload your image' : 'Drop your image here' }}
    </p>

    <p class="relative mt-2 max-w-md text-sm leading-6 text-fg-muted">
      Drag a file into this workspace, paste an image, or choose one from your device.
    </p>

    <button
      type="button"
      class="relative mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-accent-fg shadow-xs transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
      @click="input?.click()"
    >
      Choose image
    </button>

    <div class="relative mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-medium text-fg-subtle">
      <span>{{ hint }}</span>
      <span aria-hidden="true">•</span>
      <span>Up to {{ maxSizeMb }} MB</span>
      <span aria-hidden="true">•</span>
      <span>Clipboard paste supported</span>
    </div>

    <div class="relative mt-5 w-full">
      <slot />
    </div>
  </div>
</template>
