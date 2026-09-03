<script setup lang="ts">
/**
 * "Try one of these instead" grid, shown at the bottom of every tool page.
 */
const props = defineProps<{ exclude?: string }>()

const { tools } = useTools()

const suggestions = computed(() =>
  tools.filter((tool) => tool.slug !== props.exclude).slice(0, 4),
)
</script>

<template>
  <section class="border-t border-line bg-surface py-16 sm:py-20">
    <div class="sp-container">
      <UiSectionHeading
        eyebrow="More tools"
        title="Keep going"
        description="Other SP-Tools utilities you can use right now."
      />

      <div class="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="tool in suggestions"
          :key="tool.slug"
          :to="tool.href"
          class="sp-card sp-card-interactive group flex flex-col p-5"
        >
          <span
            class="flex h-10 w-10 items-center justify-center rounded-xl
              border border-line bg-surface-2"
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
              <path stroke-linecap="round" stroke-linejoin="round" :d="tool.icon" />
            </svg>
          </span>

          <p class="mt-4 text-sm font-semibold text-fg">
            {{ tool.shortName }}
          </p>

          <p class="mt-1.5 flex-1 text-xs leading-6 text-fg-muted">
            {{ tool.tagline }}
          </p>

          <span
            class="mt-4 inline-flex items-center gap-1 text-xs font-semibold
              text-accent transition-all group-hover:gap-2"
          >
            Open tool
            <span aria-hidden="true">→</span>
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
