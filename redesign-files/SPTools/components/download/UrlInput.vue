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

const clear = () => { value.value = '' }
</script>

<template>
  <form class="w-full" @submit.prevent="submit">
    <div class="sp-border-flow rounded-[18px] p-[1px] focus-within:scale-[1.003] transition-transform duration-200">
      <div class="relative flex flex-col gap-2 rounded-[17px] bg-elevated p-2 shadow-lift sm:flex-row sm:items-center">
        <div class="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent" />

        <div class="relative flex min-w-0 flex-1 items-center rounded-[12px] border border-line bg-surface-3/55 transition focus-within:border-accent/40 focus-within:bg-surface-2">
          <span class="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-line bg-elevated text-fg-subtle">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M10 13a4 4 0 0 0 5.7 0l2.8-2.8A4 4 0 0 0 12.8 4.5L11.4 6M14 11a4 4 0 0 0-5.7 0L5.5 13.8A4 4 0 0 0 11.2 19.5l1.4-1.4" /></svg>
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
            class="h-[52px] w-full min-w-0 bg-transparent px-3 text-[13px] text-fg outline-none placeholder:text-fg-subtle"
            :aria-invalid="showValidation"
            :disabled="loading"
          />

          <button v-if="value" type="button" class="mr-2 flex h-8 w-8 items-center justify-center rounded-[9px] text-fg-subtle transition hover:bg-elevated hover:text-fg" aria-label="Clear the URL" @click="clear">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path stroke-linecap="round" d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <div class="grid shrink-0 grid-cols-[auto_1fr] gap-2 sm:flex">
          <UiButton type="button" variant="secondary" size="md" class="!h-[52px] !rounded-[12px] px-4" @click="pasteFromClipboard">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="8" y="3" width="8" height="4" rx="1.2"/><path stroke-linecap="round" d="M8 5H6.5A1.5 1.5 0 0 0 5 6.5v12A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 17.5 5H16"/></svg>
            <span>Paste</span>
          </UiButton>

          <UiButton type="submit" size="md" :loading="loading" :disabled="loading || !isValid" class="sp-shimmer !h-[52px] !rounded-[12px] min-w-[126px] px-5">
            {{ loading ? 'Resolving…' : 'Get video' }} <span v-if="!loading" aria-hidden="true">→</span>
          </UiButton>
        </div>
      </div>
    </div>

    <div class="mt-2.5 flex items-center justify-between gap-4 px-1 text-[9px] font-medium">
      <p :class="showValidation ? 'text-danger' : 'text-fg-subtle'">
        {{ showValidation ? `Enter a valid ${hostLabel} URL.` : `Supports ${hostLabel} links. Only download content you own or have permission to use.` }}
      </p>
      <span class="hidden shrink-0 items-center gap-1.5 text-positive sm:inline-flex"><span class="h-1.5 w-1.5 rounded-full bg-positive sp-pulse-soft" /> resolver ready</span>
    </div>
  </form>
</template>
