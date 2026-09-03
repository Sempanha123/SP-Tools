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
  // Reset so re-picking the same file fires change again.
  target.value = ''
}

/**
 * dragenter/dragleave fire for every child element, so depth-count instead of
 * toggling a boolean — otherwise the highlight flickers.
 */
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
    class="relative rounded-panel border-2 border-dashed px-6 py-14
      text-center transition-colors"
    :class="[
      isDragging
        ? 'border-accent bg-accent-soft'
        : 'border-line-strong bg-surface-2 hover:border-accent/60',
      disabled ? 'pointer-events-none opacity-60' : '',
    ]"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <input
      ref="input"
      type="file"
      class="sr-only"
      :accept="accept"
      :disabled="disabled"
      @change="onSelect"
    />

    <div
      class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl
        bg-accent-soft text-accent"
    >
      <svg
        class="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 17v1.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V17"
        />
      </svg>
    </div>

    <p class="mt-5 text-base font-semibold text-fg">
      {{ isDragging ? 'Drop your image here' : 'Drag and drop your image' }}
    </p>

    <p class="mt-1.5 text-sm text-fg-muted">
      or
      <button
        type="button"
        class="font-semibold text-accent underline-offset-4 hover:underline"
        @click="input?.click()"
      >
        browse your files
      </button>
      — you can also paste from the clipboard
    </p>

    <p class="mt-4 text-xs text-fg-subtle">
      {{ hint }} · up to {{ maxSizeMb }} MB
    </p>

    <slot />
  </div>
</template>
