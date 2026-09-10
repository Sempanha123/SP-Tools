<script setup lang="ts">
/**
 * Three-state theme control: light → dark → system.
 * Rendered client-only by callers to avoid an SSR/client icon mismatch.
 */
const { preference, isDark, cycleTheme } = useTheme()

const label = computed(() => {
  if (preference.value === 'system') return 'Theme: system'
  return preference.value === 'dark' ? 'Theme: dark' : 'Theme: light'
})
</script>

<template>
  <button
    type="button"
    class="relative flex h-9 w-9 items-center justify-center rounded-xl
      border border-line bg-surface-2 text-fg-muted
      transition-colors hover:bg-surface-3 hover:text-fg"
    :title="label"
    :aria-label="label"
    @click="cycleTheme"
  >
    <!-- System -->
    <svg
      v-if="preference === 'system'"
      class="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      aria-hidden="true"
    >
      <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
      <path stroke-linecap="round" d="M8 20h8m-4-3.5V20" />
    </svg>

    <!-- Dark -->
    <svg
      v-else-if="isDark"
      class="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1Z"
      />
    </svg>

    <!-- Light -->
    <svg
      v-else
      class="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path
        stroke-linecap="round"
        d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"
      />
    </svg>
  </button>
</template>
