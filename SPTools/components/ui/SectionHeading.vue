<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}>()
</script>

<template>
  <div :class="align === 'center' ? 'text-center' : ''">
    <span
      v-if="eyebrow"
      class="text-[11px] font-bold uppercase tracking-[0.18em] text-accent"
    >
      {{ eyebrow }}
    </span>

    <h2
      class="text-3xl font-bold tracking-tight text-fg sm:text-4xl"
      :class="eyebrow ? 'mt-3' : ''"
    >
      {{ title }}
    </h2>

    <p
      v-if="description"
      class="mt-3 text-sm leading-7 text-fg-muted sm:text-base"
      :class="align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'"
    >
      {{ description }}
    </p>

    <slot />
  </div>
</template>
