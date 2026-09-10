<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    meta?: string
    tag?: string
    tone?: 'accent' | 'neutral' | 'positive'
    href?: string
    download?: string
    pending?: boolean
    recommended?: boolean
    platform?: 'tiktok' | 'facebook' | 'youtube' | 'generic'
  }>(),
  { tone: 'neutral', platform: 'generic' },
)
const toneRing: Record<string, string> = {
  accent: 'border-accent/35 bg-accent-soft text-accent',
  positive: 'border-positive/35 bg-positive-soft text-positive',
  neutral: 'border-line bg-surface-3 text-fg-muted',
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :download="href ? download : undefined"
    :type="href ? undefined : 'button'"
    :aria-busy="pending || undefined"
    class="sp-format-row group relative flex w-full items-center gap-3.5 overflow-hidden rounded-[14px] border border-line bg-elevated px-3.5 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft"
    :class="[`sp-platform-${props.platform}`, recommended ? 'sp-format-recommended' : '']"
  >
    <div class="sp-format-accent absolute inset-y-2 left-0 w-[2px] rounded-full opacity-0 transition group-hover:opacity-100" />
    <span class="flex h-10 min-w-14 shrink-0 items-center justify-center rounded-[10px] border px-2 text-[10px] font-black uppercase" :class="toneRing[tone]">{{ tag ?? '↓' }}</span>
    <span class="min-w-0 flex-1"><span class="flex flex-wrap items-center gap-2"><span class="truncate text-[12px] font-bold text-fg">{{ label }}</span><span v-if="recommended" class="sp-platform-best rounded-full px-2 py-1 text-[7px] font-black uppercase tracking-[.12em]">Best</span></span><span v-if="meta" class="mt-1 block truncate text-[10px] text-fg-subtle">{{ meta }}</span></span>
    <span v-if="pending" class="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden="true" />
    <svg v-else class="h-4 w-4 shrink-0 text-fg-subtle transition duration-200 group-hover:translate-y-0.5 group-hover:text-fg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v12m0 0l-4.5-4.5M12 16l4.5-4.5M5 20h14"/></svg>
  </component>
</template>
