<script setup lang="ts">
/**
 * One downloadable rendition row. `href` triggers a real browser download via
 * the proxy; `pending` shows a spinner while a JS-driven download streams.
 */
withDefaults(
  defineProps<{
    label: string
    /** Right-hand meta, e.g. "MP4 · 12.4 MB". */
    meta?: string
    /** Small tag on the left, e.g. "1080p" or "HD". */
    tag?: string
    tone?: 'accent' | 'neutral' | 'positive'
    href?: string
    download?: string
    pending?: boolean
    recommended?: boolean
  }>(),
  { tone: 'neutral' },
)

const toneRing: Record<string, string> = {
  accent: 'border-accent/40 bg-accent-soft text-accent',
  positive: 'border-positive/40 bg-positive-soft text-positive',
  neutral: 'border-line bg-surface-2 text-fg-muted',
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :download="href ? download : undefined"
    :type="href ? undefined : 'button'"
    :aria-busy="pending || undefined"
    class="group flex w-full items-center gap-3.5 rounded-card border border-line
      bg-elevated px-4 py-3.5 text-left transition-all duration-200
      hover:border-accent/50 hover:shadow-lift"
    :class="recommended ? 'ring-1 ring-accent/30' : ''"
  >
    <span
      class="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg
        border text-[11px] font-bold uppercase"
      :class="toneRing[tone]"
    >
      {{ tag ?? '↓' }}
    </span>

    <span class="min-w-0 flex-1">
      <span class="flex flex-wrap items-center gap-2">
        <span class="truncate text-sm font-semibold text-fg">{{ label }}</span>
        <UiBadge v-if="recommended" tone="accent">Best</UiBadge>
      </span>
      <span v-if="meta" class="mt-0.5 block truncate text-xs text-fg-subtle">
        {{ meta }}
      </span>
    </span>

    <span
      v-if="pending"
      class="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-accent
        border-t-transparent"
      aria-hidden="true"
    />

    <svg
      v-else
      class="h-4 w-4 shrink-0 text-fg-subtle transition-transform duration-200
        group-hover:translate-y-0.5 group-hover:text-accent"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4v12m0 0l-4.5-4.5M12 16l4.5-4.5M5 20h14"
      />
    </svg>
  </component>
</template>
