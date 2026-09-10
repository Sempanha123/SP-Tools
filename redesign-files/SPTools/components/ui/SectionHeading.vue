<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    description?: string
    align?: 'left' | 'center'
  }>(),
  {
    align: 'left',
  },
)
</script>

<template>
  <div :class="align === 'center' ? 'text-center' : ''">
    <span v-if="eyebrow" class="sp-kicker">
      <span class="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
      {{ eyebrow }}
    </span>

    <h2
      class="text-[1.75rem] font-[700] leading-[1.08] tracking-[-0.035em] text-fg sm:text-[2.15rem]"
      :class="eyebrow ? 'mt-3.5' : ''"
    >
      {{ title }}
    </h2>

    <p
      v-if="description"
      class="mt-3.5 text-[15px] leading-7 text-fg-muted"
      :class="align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'"
    >
      {{ description }}
    </p>

    <slot />
  </div>
</template>
