<script setup lang="ts">
withDefaults(
  defineProps<{
    interactive?: boolean
    as?: string
  }>(),
  { as: 'div' },
)
</script>

<template>
  <component
    :is="as"
    class="sp-card"
    :class="interactive ? 'sp-card-interactive' : ''"
  >
    <slot />
  </component>
</template>
