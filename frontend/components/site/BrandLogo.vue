<script setup lang="ts">
withDefaults(
  defineProps<{
    inverse?: boolean
    compact?: boolean
  }>(),
  {
    inverse: false,
    compact: false,
  },
)
</script>

<template>
  <span
    class="inline-flex items-center gap-2.5"
  >
    <span
      class="relative flex shrink-0 items-center justify-center transition duration-300 group-hover:-rotate-3 group-hover:scale-105"
      :class="
        compact
          ? 'h-9 w-9'
          : 'h-11 w-11'
      "
    >
      <img
        src="/brand/sp-tools-mark.svg"
        width="44"
        height="44"
        alt=""
        aria-hidden="true"
        class="block h-full w-full"
        decoding="async"
      >
    </span>

    <span
      class="font-[760] tracking-[-.04em]"
      :class="[
        compact
          ? 'text-[17px]'
          : 'text-[19px]',
        inverse
          ? 'text-white'
          : 'text-fg',
      ]"
    >
      SP<span
        class="bg-gradient-to-r from-accent via-[#6d5dfc] to-accent-2 bg-clip-text text-transparent"
      >-Tools</span>
    </span>
  </span>
</template>
