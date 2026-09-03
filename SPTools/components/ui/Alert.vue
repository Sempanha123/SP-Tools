<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'danger' | 'warning' | 'positive' | 'accent'
    title?: string
  }>(),
  { tone: 'danger' },
)

const toneClass = {
  danger: 'border-danger/35 bg-danger-soft text-danger',
  warning: 'border-warning/35 bg-warning-soft text-warning',
  positive: 'border-positive/35 bg-positive-soft text-positive',
  accent: 'border-accent/35 bg-accent-soft text-accent',
}
</script>

<template>
  <div
    class="flex items-start gap-3 rounded-card border px-4 py-3.5"
    :class="toneClass[tone]"
    role="alert"
  >
    <svg
      class="mt-0.5 h-4.5 w-4.5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path stroke-linecap="round" d="M12 8v4.5M12 16h.01" />
    </svg>

    <div class="min-w-0 flex-1">
      <p v-if="title" class="text-sm font-semibold">{{ title }}</p>
      <p class="text-sm leading-6" :class="title ? 'mt-0.5 opacity-90' : ''">
        <slot />
      </p>
    </div>

    <slot name="action" />
  </div>
</template>
