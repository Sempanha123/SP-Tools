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

const platform = computed<'tiktok' | 'facebook' | 'youtube' | 'generic'>(() => {
  const label = props.hostLabel.toLowerCase()
  if (label.includes('tiktok')) return 'tiktok'
  if (label.includes('facebook')) return 'facebook'
  if (label.includes('youtube')) return 'youtube'
  return 'generic'
})

const platformIcon = computed(() => ({
  tiktok: '♪',
  facebook: 'f',
  youtube: '▶',
  generic: '↗',
}[platform.value]))

const isValid = computed(() => {
  const raw = value.value.trim()
  if (!raw) return false

  try {
    const url = new URL(raw)
    if (!/^https?:$/.test(url.protocol)) return false
    return props.hosts.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))
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

const clear = () => {
  value.value = ''
}
</script>

<template>
  <form
    class="sp-url-form w-full"
    :class="[`sp-platform-${platform}`, showValidation ? 'is-invalid' : '', loading ? 'is-loading' : '']"
    @submit.prevent="submit"
  >
    <div class="sp-url-shell">
      <div class="sp-url-accent-line" aria-hidden="true" />

      <div class="sp-url-inner">
        <div class="sp-url-field">
          <span class="sp-platform-logo sp-url-platform-icon" aria-hidden="true">
            {{ platformIcon }}
          </span>

          <label class="sr-only" for="downloader-url">{{ hostLabel }} URL</label>

          <div class="min-w-0 flex-1">
            <p class="sp-url-label">{{ hostLabel }} URL</p>
            <input
              id="downloader-url"
              v-model="value"
              type="url"
              inputmode="url"
              autocomplete="off"
              spellcheck="false"
              :placeholder="placeholder"
              class="sp-url-input"
              :aria-invalid="showValidation"
              :disabled="loading"
            />
          </div>

          <button
            v-if="value"
            type="button"
            class="sp-url-clear"
            aria-label="Clear the URL"
            :disabled="loading"
            @click="clear"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
              <path stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div class="sp-url-actions">
          <button
            type="button"
            class="sp-url-paste"
            :disabled="loading"
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
            class="sp-url-submit sp-platform-submit sp-shimmer"
          >
            <span
              v-if="loading"
              class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/25 border-t-current"
              aria-hidden="true"
            />
            {{ loading ? 'Resolving…' : 'Get video' }}
            <span v-if="!loading" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>

    <div class="sp-url-meta" aria-live="polite">
      <p :class="showValidation ? 'sp-url-error' : 'sp-url-help'">
        {{
          showValidation
            ? `Enter a valid ${hostLabel} URL.`
            : `Public ${hostLabel} links only. Download content you own or have permission to use.`
        }}
      </p>

      <span class="sp-url-ready">
        <span class="sp-url-ready-dot sp-pulse-soft" />
        resolver ready
      </span>
    </div>
  </form>
</template>
