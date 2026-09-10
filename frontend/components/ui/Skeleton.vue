<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Tailwind height utility, e.g. `h-4`. */
    height?: string
    width?: string
    rounded?: string
    lines?: number
  }>(),
  { height: 'h-4', width: 'w-full', rounded: 'rounded-md', lines: 1 },
)
</script>

<template>
  <div v-if="lines > 1" class="space-y-2.5" aria-hidden="true">
    <div
      v-for="line in lines"
      :key="line"
      class="sp-skeleton"
      :class="[height, rounded, line === lines ? 'w-3/5' : width]"
    />
  </div>

  <div
    v-else
    class="sp-skeleton"
    :class="[height, width, rounded]"
    aria-hidden="true"
  />
</template>
