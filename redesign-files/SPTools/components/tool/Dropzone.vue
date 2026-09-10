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

const acceptedTypes = computed(() => props.accept.split(',').map((type) => type.trim()))

const validate = (file: File): string | null => {
  if (!acceptedTypes.value.includes(file.type)) return `Unsupported file type. Please use ${props.hint}.`
  if (file.size > props.maxSizeMb * 1024 * 1024) return `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${props.maxSizeMb} MB.`
  return null
}

const accept = (file: File | undefined | null) => {
  if (!file) return
  const problem = validate(file)
  if (problem) return emit('error', problem)
  emit('file', file)
}

const onSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  accept(target.files?.[0])
  target.value = ''
}

const onDragEnter = () => { dragDepth.value += 1; isDragging.value = true }
const onDragLeave = () => { dragDepth.value = Math.max(0, dragDepth.value - 1); if (dragDepth.value === 0) isDragging.value = false }
const onDrop = (event: DragEvent) => { dragDepth.value = 0; isDragging.value = false; accept(event.dataTransfer?.files?.[0]) }

const onPaste = (event: ClipboardEvent) => {
  const item = Array.from(event.clipboardData?.items ?? []).find((entry) => entry.type.startsWith('image/'))
  if (item) accept(item.getAsFile())
}

onMounted(() => window.addEventListener('paste', onPaste))
onUnmounted(() => window.removeEventListener('paste', onPaste))
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-[22px] border bg-elevated p-3 shadow-soft transition-all duration-300 sm:p-4"
    :class="[
      isDragging ? 'border-accent/55 -translate-y-0.5 shadow-lift' : 'border-line hover:border-line-strong hover:shadow-lift',
      disabled ? 'pointer-events-none opacity-60' : '',
    ]"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[0.18]" />
    <div class="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-accent/12 blur-[65px] transition duration-500" :class="isDragging ? 'scale-125 opacity-100' : 'opacity-60 group-hover:scale-110'" />
    <div class="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-accent-2/10 blur-[70px]" />

    <input ref="input" type="file" class="sr-only" :accept="accept" :disabled="disabled" @change="onSelect" />

    <div
      class="relative grid min-h-[270px] place-items-center rounded-[17px] border border-dashed p-6 text-center transition-all duration-300 sm:min-h-[300px]"
      :class="isDragging ? 'border-accent bg-accent-soft/50' : 'border-line-strong bg-surface-2/72 group-hover:bg-surface-2'"
    >
      <div class="max-w-lg">
        <div class="relative mx-auto w-fit">
          <span class="sp-pulse-soft absolute -inset-5 rounded-full bg-accent/10 blur-xl" />
          <span class="relative flex h-16 w-16 items-center justify-center rounded-[18px] border border-line bg-elevated text-accent shadow-soft transition duration-300" :class="isDragging ? 'scale-110 border-accent/40' : 'group-hover:-translate-y-1'">
            <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 16V5m0 0L7.5 9.5M12 5l4.5 4.5M5 16.5v1A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-1" />
            </svg>
          </span>
        </div>

        <p class="mt-6 text-[18px] font-[690] tracking-[-0.025em] text-fg">
          {{ isDragging ? 'Release to upload' : 'Drop your image here' }}
        </p>
        <p class="mx-auto mt-2 max-w-md text-[13px] leading-6 text-fg-muted">
          Drag a file into this workspace, paste an image, or choose one directly from your device.
        </p>

        <button
          type="button"
          class="sp-btn sp-btn-primary sp-shimmer mt-5 h-11 px-5 text-[13px]"
          @click="input?.click()"
        >
          Choose image
          <span aria-hidden="true">+</span>
        </button>

        <div class="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-medium text-fg-subtle">
          <span class="inline-flex items-center gap-1.5"><span class="h-1 w-1 rounded-full bg-accent" /> {{ hint }}</span>
          <span class="inline-flex items-center gap-1.5"><span class="h-1 w-1 rounded-full bg-accent" /> Up to {{ maxSizeMb }} MB</span>
          <span class="inline-flex items-center gap-1.5"><span class="h-1 w-1 rounded-full bg-accent" /> Clipboard paste</span>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
