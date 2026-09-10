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

const acceptedTypes = computed(() => props.accept.split(',').map(type => type.trim()))

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
  const item = Array.from(event.clipboardData?.items ?? []).find(entry => entry.type.startsWith('image/'))
  if (item) accept(item.getAsFile())
}

onMounted(() => window.addEventListener('paste', onPaste))
onUnmounted(() => window.removeEventListener('paste', onPaste))
</script>

<template>
  <div
    class="sp-border-flow group relative rounded-[26px] p-[1px] transition duration-300"
    :class="isDragging ? '-translate-y-1 scale-[1.004]' : ''"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="sp-lens-card overflow-hidden rounded-[25px] p-3 sm:p-4" :class="disabled ? 'pointer-events-none opacity-60' : ''">
      <input ref="input" type="file" class="sr-only" :accept="accept" :disabled="disabled" @change="onSelect" />

      <div
        class="sp-scanline relative min-h-[310px] overflow-hidden rounded-[19px] border p-6 text-center transition-all duration-300 sm:min-h-[340px]"
        :class="isDragging ? 'border-accent/55 bg-accent-soft/55' : 'border-line bg-surface-2/82 group-hover:border-line-strong'"
      >
        <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[.18]" />
        <div class="pointer-events-none absolute left-1/2 top-[40%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[75px] transition duration-500" :class="isDragging ? 'scale-[1.3] opacity-100' : 'opacity-55 group-hover:scale-110'" />
        <div class="pointer-events-none absolute -bottom-28 left-[8%] h-52 w-52 rounded-full bg-accent-2/10 blur-[80px]" />

        <div class="relative mx-auto flex min-h-[260px] max-w-3xl flex-col items-center justify-center">
          <div class="relative">
            <span class="sp-pulse-soft absolute -inset-8 rounded-full bg-accent/10 blur-2xl" />
            <span class="relative flex h-[72px] w-[72px] items-center justify-center rounded-[20px] border border-line bg-elevated text-accent shadow-lift transition duration-300" :class="isDragging ? 'scale-110 rotate-2 border-accent/40' : 'group-hover:-translate-y-1'">
              <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 16V5m0 0L7.5 9.5M12 5l4.5 4.5M5 16.5v1A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-1" />
              </svg>
            </span>
          </div>

          <p class="mt-6 text-[20px] font-[720] tracking-[-.035em] text-fg">
            {{ isDragging ? 'Release and let SP-Tools take it from here' : 'Drop an image into the workspace' }}
          </p>
          <p class="mx-auto mt-2 max-w-md text-[13px] leading-6 text-fg-muted">
            Drag, paste from your clipboard, or choose a file. We keep the interaction simple and show processing state clearly.
          </p>

          <div class="mt-5 flex flex-col items-center gap-3 sm:flex-row">
            <button type="button" class="sp-btn sp-btn-primary sp-shimmer h-11 px-5 text-[13px]" @click="input?.click()">
              Choose image <span aria-hidden="true">→</span>
            </button>
            <span class="text-[10px] font-medium text-fg-subtle">or press Ctrl/Cmd + V</span>
          </div>

          <div class="mt-7 grid w-full max-w-lg grid-cols-3 overflow-hidden rounded-[14px] border border-line bg-elevated shadow-xs">
            <div class="p-3 text-center"><p class="text-[8px] font-bold uppercase tracking-[.12em] text-fg-subtle">format</p><p class="mt-1 text-[10px] font-semibold text-fg">{{ hint }}</p></div>
            <div class="border-x border-line p-3 text-center"><p class="text-[8px] font-bold uppercase tracking-[.12em] text-fg-subtle">size</p><p class="mt-1 text-[10px] font-semibold text-fg">≤ {{ maxSizeMb }} MB</p></div>
            <div class="p-3 text-center"><p class="text-[8px] font-bold uppercase tracking-[.12em] text-fg-subtle">input</p><p class="mt-1 text-[10px] font-semibold text-positive">Paste ready</p></div>
          </div>

          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
