<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    loading?: boolean
    hosts: string[]
    hostLabel: string
  }>(),
  { placeholder: 'Paste the video link here' },
)

const emit = defineEmits<{
  'update:modelValue': [string]
  submit: []
  error: [string]
}>()

const value = computed({
  get: () => props.modelValue,
  set: (next: string) => emit('update:modelValue', next),
})

const isValid = computed(() => {
  const raw = value.value.trim()
  if (!raw) return false
  try {
    const url = new URL(raw)
    if (!/^https?:$/.test(url.protocol)) return false
    return props.hosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))
  } catch {
    return false
  }
})

const showValidation = computed(() => value.value.trim().length > 0 && !isValid.value)

const submit = () => {
  if (!isValid.value) {
    emit('error', `That does not look like a ${props.hostLabel} link.`)
    return
  }
  emit('submit')
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    if (text) value.value = text.trim()
  } catch {
    emit('error', 'Clipboard access was blocked. Paste the link manually.')
  }
}

const clear = () => { value.value = '' }
</script>

<template>
  <form class="w-full" @submit.prevent="submit">
    <div
      class="group rounded-[16px] border bg-elevated p-2 shadow-soft transition-all duration-200 focus-within:-translate-y-0.5 focus-within:border-accent/40 focus-within:shadow-lift"
      :class="showValidation ? 'border-danger/50' : 'border-line hover:border-line-strong'"
    >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div class="relative flex min-w-0 flex-1 items-center rounded-[12px] bg-surface-3/65 transition focus-within:bg-surface-3">
          <span class="pointer-events-none absolute left-3.5 flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-elevated text-fg-subtle">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 13a4 4 0 0 0 5.7 0l2.8-2.8A4 4 0 0 0 12.8 4.5L11.4 6M14 11a4 4 0 0 0-5.7 0L5.5 13.8A4 4 0 0 0 11.2 19.5l1.4-1.4" />
            </svg>
          </span>

          <label class="sr-only" for="downloader-url">Video URL</label>
          <input
            id="downloader-url"
            v-model="value"
            type="url"
            inputmode="url"
            autocomplete="off"
            spellcheck="false"
            :placeholder="placeholder"
            class="h-[56px] w-full min-w-0 bg-transparent pl-[52px] pr-10 text-[13px] font-medium text-fg outline-none placeholder:font-normal placeholder:text-fg-subtle sm:h-[60px]"
            :aria-invalid="showValidation"
            :disabled="loading"
          />

          <button
            v-if="value"
            type="button"
            class="absolute right-3 flex h-7 w-7 items-center justify-center rounded-lg text-fg-subtle transition hover:bg-elevated hover:text-fg"
            aria-label="Clear the URL"
            @click="clear"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
              <path stroke-linecap="round" d="M7 7l10 10M17 7 7 17" />
            </svg>
          </button>
        </div>

        <div class="flex shrink-0 gap-2">
          <UiButton type="button" variant="secondary" size="md" class="h-[52px] flex-1 px-4 sm:h-[56px] sm:flex-none" @click="pasteFromClipboard">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <rect x="8" y="3" width="8" height="4" rx="1.2" />
              <path stroke-linecap="round" d="M8 5H6.5A1.5 1.5 0 0 0 5 6.5v12A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 17.5 5H16" />
            </svg>
            Paste
          </UiButton>

          <UiButton type="submit" size="md" :loading="loading" :disabled="loading || !isValid" class="sp-shimmer h-[52px] flex-1 px-5 sm:h-[56px] sm:flex-none">
            {{ loading ? 'Fetching…' : 'Get video' }}
            <span v-if="!loading" aria-hidden="true">→</span>
          </UiButton>
        </div>
      </div>
    </div>

    <div class="mt-2.5 flex min-h-5 items-center justify-between gap-3 px-1 text-[10px]">
      <p v-if="showValidation" class="text-danger">Enter a valid {{ hostLabel }} URL.</p>
      <p v-else class="text-fg-subtle">Supports {{ hostLabel }} links · public content only</p>
      <span class="hidden items-center gap-1.5 text-fg-subtle sm:inline-flex"><span class="h-1.5 w-1.5 rounded-full bg-positive" /> Secure request</span>
    </div>
  </form>
</template>
