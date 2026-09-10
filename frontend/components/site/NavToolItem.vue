<script setup lang="ts">
import type { ToolDefinition } from '~/composables/useTools'

defineProps<{ tool: ToolDefinition }>()
defineEmits<{ navigate: [] }>()
</script>

<template>
  <NuxtLink
    :to="tool.href"
    class="group/item flex items-center gap-3 rounded-xl p-3 transition-colors
      hover:bg-surface-2"
    @click="$emit('navigate')"
  >
    <span
      class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
        border border-line bg-surface-2 transition-colors
        group-hover/item:bg-elevated"
      :style="{ color: tool.accent }"
    >
      <svg
        class="h-5 w-5"
        viewBox="0 0 24 24"
        :fill="tool.iconStyle === 'fill' ? 'currentColor' : 'none'"
        :stroke="tool.iconStyle === 'stroke' ? 'currentColor' : 'none'"
        stroke-width="1.6"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          :d="tool.icon"
        />
      </svg>
    </span>

    <span class="min-w-0 flex-1">
      <span class="flex items-center gap-2">
        <span class="truncate text-sm font-semibold text-fg">
          {{ tool.shortName }}
        </span>
        <UiBadge v-if="tool.badge" tone="accent">{{ tool.badge }}</UiBadge>
      </span>
      <span class="mt-0.5 block truncate text-xs text-fg-muted">
        {{ tool.tagline }}
      </span>
    </span>

    <span
      class="text-fg-subtle transition-transform group-hover/item:translate-x-1"
      aria-hidden="true"
    >
      →
    </span>
  </NuxtLink>
</template>
