<script setup lang="ts">
/**
 * URL input used by all three downloader pages. Owns validation and the
 * paste-from-clipboard affordance; the parent owns the request.
 */
const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    loading?: boolean
    /** Hostnames considered valid, e.g. ['tiktok.com']. */
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
      (host) =>
        url.hostname === host ||
        url.hostname.endsWith(`.${host}`),
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
      class="flex flex-col gap-2.5 rounded-panel border border-line
        bg-elevated p-2.5 shadow-lift sm:flex-row sm:items-center"
    >
      <div class="relative flex min-w-0 flex-1 items-center">
        <svg
          class="pointer-events-none absolute left-3.5 h-4 w-4 text-fg-subtle"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10 13a4 4 0 0 0 5.7 0l2.8-2.8A4 4 0 0 0 12.8 4.5L11.4 6M14 11a4 4 0 0 0-5.7 0L5.5 13.8A4 4 0 0 0 11.2 19.5l1.4-1.4"
          />
        </svg>

        <label class="sr-only" for="downloader-url">Video URL</label>

        <input
          id="downloader-url"
          v-model="value"
          type="url"
          inputmode="url"
          autocomplete="off"
          spellcheck="false"
          :placeholder="placeholder"
          class="h-12 w-full min-w-0 rounded-xl bg-transparent pl-10 pr-9
            text-sm text-fg outline-none placeholder:text-fg-subtle"
          :aria-invalid="showValidation"
          :disabled="loading"
        />

        <button
          v-if="value"
          type="button"
          class="absolute right-3 flex h-5 w-5 items-center justify-center
            rounded-full bg-surface-3 text-fg-subtle transition-colors
            hover:text-fg"
          aria-label="Clear the URL"
          @click="clear"
        >
          <svg
            class="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            aria-hidden="true"
          >
            <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div class="flex shrink-0 gap-2">
        <UiButton
          type="button"
          variant="secondary"
          size="md"
          class="sm:px-3.5"
          @click="pasteFromClipboard"
        >
          <svg
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <rect x="8" y="3" width="8" height="4" rx="1.2" />
            <path
              stroke-linecap="round"
              d="M8 5H6.5A1.5 1.5 0 0 0 5 6.5v12A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 17.5 5H16"
            />
          </svg>
          <span class="sm:hidden">Paste</span>
        </UiButton>

        <UiButton
          type="submit"
          size="md"
          :loading="loading"
          :disabled="loading || !isValid"
          class="flex-1 sm:flex-none"
        >
          {{ loading ? 'Fetching…' : 'Get video' }}
        </UiButton>
      </div>
    </div>

    <p v-if="showValidation" class="mt-2.5 pl-1 text-xs text-danger">
      Enter a valid {{ hostLabel }} URL.
    </p>

    <p v-else class="mt-2.5 pl-1 text-xs text-fg-subtle">
      Works with {{ hostLabel }} links. Only download content you own or have
      permission to use.
    </p>
  </form>
</template>
