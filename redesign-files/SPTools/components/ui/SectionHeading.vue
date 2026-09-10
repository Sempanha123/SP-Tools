<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; description?: string; align?: 'left' | 'center' }>()
</script>

<template>
  <div :class="align === 'center' ? 'text-center' : ''">
    <div v-if="eyebrow" class="sp-kicker" :class="align === 'center' ? 'justify-center' : ''">{{ eyebrow }}</div>
    <h2 class="text-[clamp(2rem,4vw,3.1rem)] font-[720] leading-[1] tracking-[-0.052em] text-fg" :class="eyebrow ? 'mt-3' : ''">{{ title }}</h2>
    <p v-if="description" class="mt-3 text-[13px] leading-6 text-fg-muted sm:text-[14px]" :class="align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'">{{ description }}</p>
    <slot />
  </div>
</template>
