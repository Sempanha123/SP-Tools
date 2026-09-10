<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    tone?: 'neutral' | 'danger'
  }>(),
  { tone: 'neutral' },
)
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-card border
      border-dashed px-6 py-14 text-center"
    :class="
      tone === 'danger'
        ? 'border-danger/40 bg-danger-soft'
        : 'border-line-strong bg-surface-2'
    "
  >
    <div
      class="flex h-12 w-12 items-center justify-center rounded-xl"
      :class="
        tone === 'danger'
          ? 'bg-danger/10 text-danger'
          : 'bg-surface-3 text-fg-subtle'
      "
    >
      <slot name="icon">
        <svg
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 5h16v14H4zM8 10h8M8 14h5"
          />
        </svg>
      </slot>
    </div>

    <p class="mt-4 text-base font-semibold text-fg">{{ title }}</p>

    <p
      v-if="description"
      class="mt-1.5 max-w-md text-sm leading-6 text-fg-muted"
    >
      {{ description }}
    </p>

    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>
