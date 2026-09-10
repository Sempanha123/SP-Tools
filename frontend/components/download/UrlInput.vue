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

const clear = () => { value.value = '' }
</script>

<template>
  <form class="w-full" :class="`sp-platform-${platform}`" @submit.prevent="submit">
    <div class="sp-platform-input-shell relative rounded-[18px] p-[1px] transition-transform duration-200 focus-within:scale-[1.003]">
      <div class="relative flex flex-col gap-2 rounded-[17px] bg-[#111722]/94 p-2 shadow-[0_18px_50px_rgba(0,0,0,.24)] sm:flex-row sm:items-center">
        <div class="sp-platform-input-light pointer-events-none absolute inset-x-12 top-0 h-px" />

        <div class="relative flex min-w-0 flex-1 items-center rounded-[12px] border border-white/10 bg-white/[.045] transition focus-within:border-white/20 focus-within:bg-white/[.065]">
          <span class="sp-platform-logo ml-2.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[12px] font-black">
            {{ platformIcon }}
          </span>

          <label class="sr-only" for="downloader-url">{{ hostLabel }} URL</label>
          <div class="min-w-0 flex-1">
            <p class="px-3 pt-2 text-[8px] font-bold uppercase tracking-[.14em] text-white/28">{{ hostLabel }} URL</p>
            <input
              id="downloader-url"
              v-model="value"
              type="url"
              inputmode="url"
              autocomplete="off"
              spellcheck="false"
              :placeholder="placeholder"
              class="h-[38px] w-full min-w-0 bg-transparent px-3 pb-1 text-[13px] text-white outline-none placeholder:text-white/28"
              :aria-invalid="showValidation"
              :disabled="loading"
            />
          </div>

          <button v-if="value" type="button" class="mr-2 flex h-8 w-8 items-center justify-center rounded-[9px] text-white/35 transition hover:bg-white/8 hover:text-white" aria-label="Clear the URL" @click="clear">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path stroke-linecap="round" d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <div class="grid shrink-0 grid-cols-[auto_1fr] gap-2 sm:flex">
          <button type="button" class="flex h-[55px] items-center justify-center gap-2 rounded-[12px] border border-white/10 bg-white/[.045] px-4 text-[12px] font-semibold text-white/72 transition hover:border-white/18 hover:bg-white/[.075] hover:text-white" @click="pasteFromClipboard">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="8" y="3" width="8" height="4" rx="1.2"/><path stroke-linecap="round" d="M8 5H6.5A1.5 1.5 0 0 0 5 6.5v12A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 17.5 5H16"/></svg>
            Paste
          </button>

          <button type="submit" :disabled="loading || !isValid" class="sp-platform-submit sp-shimmer flex h-[55px] min-w-[132px] items-center justify-center gap-2 rounded-[12px] px-5 text-[12px] font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-40">
            <span v-if="loading" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            {{ loading ? 'Resolving…' : 'Get video' }}
            <span v-if="!loading" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>

    <div class="mt-2.5 flex items-center justify-between gap-4 px-1 text-[9px] font-medium">
      <p :class="showValidation ? 'text-red-300' : 'text-white/38'">
        {{ showValidation ? `Enter a valid ${hostLabel} URL.` : `Public ${hostLabel} links only. Download content you own or have permission to use.` }}
      </p>
      <span class="hidden shrink-0 items-center gap-1.5 text-emerald-300 sm:inline-flex"><span class="h-1.5 w-1.5 rounded-full bg-emerald-300 sp-pulse-soft" /> resolver ready</span>
    </div>
  </form>
</template>
