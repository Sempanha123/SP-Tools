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

    return props.hosts.some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
    )
  } catch {
    return false
  }
})

const showValidation = computed(
  () => value.value.trim().length > 0 && !isValid.value,
)

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

const clear = () => {
  value.value = ''
}
</script>

<template>
  <form class="w-full" @submit.prevent="submit">
    <div
      class="group rounded-[16px] border border-line bg-elevated p-2 shadow-lift transition-all duration-200 focus-within:border-accent/[0.55] focus-within:ring-4 focus-within:ring-accent/10"
    >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div class="relative flex min-w-0 flex-1 items-center">
          <span class="pointer-events-none absolute left-3.5 flex h-8 w-8 items-center justify-center rounded-lg bg-surface-3 text-fg-subtle">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
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
            class="h-[54px] w-full min-w-0 rounded-xl bg-transparent pl-[54px] pr-10 text-[15px] text-fg outline-none placeholder:text-fg-subtle"
            :aria-invalid="showValidation"
            :disabled="loading"
          />

          <button
            v-if="value"
            type="button"
            class="absolute right-2.5 flex h-7 w-7 items-center justify-center rounded-lg text-fg-subtle transition hover:bg-surface-3 hover:text-fg"
            aria-label="Clear the URL"
            @click="clear"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" aria-hidden="true">
              <path stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-[auto_1fr] gap-2 sm:flex sm:shrink-0">
          <button
            type="button"
            class="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl border border-line bg-surface-2 px-3.5 text-sm font-semibold text-fg-muted transition hover:border-line-strong hover:bg-surface-3 hover:text-fg sm:h-[54px]"
            @click="pasteFromClipboard"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <rect x="8" y="3" width="8" height="4" rx="1.2" />
              <path stroke-linecap="round" d="M8 5H6.5A1.5 1.5 0 0 0 5 6.5v12A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 17.5 5H16" />
            </svg>
            Paste
          </button>

          <button
            type="submit"
            :disabled="loading || !isValid"
            class="inline-flex h-[46px] min-w-[126px] items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-fg shadow-xs transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-45 sm:h-[54px]"
          >
            <span v-if="loading" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
            {{ loading ? 'Fetching…' : 'Get video' }}
            <span v-if="!loading" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>

    <p v-if="showValidation" class="mt-2.5 px-1 text-xs font-medium text-danger">
      Enter a valid {{ hostLabel }} URL.
    </p>

    <p v-else class="mt-2.5 px-1 text-[11px] leading-5 text-fg-subtle">
      Supports {{ hostLabel }} links. Only download content you own or have permission to use.
    </p>
  </form>
</template>
