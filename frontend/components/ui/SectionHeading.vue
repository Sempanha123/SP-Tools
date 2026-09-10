<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; description?: string; align?: 'left' | 'center' }>()
</script>

<template>
  <div :class="align === 'center' ? 'text-center' : ''">
    <div v-if="eyebrow" class="sp-kicker" :class="align === 'center' ? 'justify-center' : ''">{{ eyebrow }}</div>
    <div v-if="eyebrow" class="mt-3 h-px w-10 bg-gradient-to-r from-accent to-accent-2" :class="align === 'center' ? 'mx-auto' : ''" />
    <h2 class="text-[clamp(2.05rem,4vw,3.35rem)] font-[735] leading-[.96] tracking-[-0.058em] text-fg" :class="eyebrow ? 'mt-4' : ''">{{ title }}</h2>
    <p v-if="description" class="mt-4 text-[13px] leading-6 text-fg-muted sm:text-[14px]" :class="align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'">{{ description }}</p>
    <slot />
  </div>
</template>
