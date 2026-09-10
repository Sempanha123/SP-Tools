<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'accent' | 'danger' | 'positive' | 'neutral'
    dot?: boolean
    pulse?: boolean
  }>(),
  { tone: 'neutral' },
)

const toneClass = {
  accent: 'sp-badge-accent',
  danger: 'sp-badge-danger',
  positive: 'sp-badge-positive',
  neutral: 'sp-badge-neutral',
}
</script>

<template>
  <span class="sp-badge" :class="toneClass[tone]">
    <span v-if="dot" class="relative flex h-1.5 w-1.5 shrink-0">
      <span
        v-if="pulse"
        class="absolute inline-flex h-full w-full rounded-full
          bg-current opacity-60 animate-pulse-ring"
      />
      <span class="relative h-1.5 w-1.5 rounded-full bg-current" />
    </span>
    <slot />
  </span>
</template>
