<script setup lang="ts">
export interface NewsSidebarTopicItem {
  label: string
  to: string
  count?: number | string | null
  primary?: boolean
  prefix?: string
}

withDefaults(
  defineProps<{
    kicker?: string
    title: string
    items: NewsSidebarTopicItem[]
    footerLabel?: string
    footerTo?: string
  }>(),
  {
    kicker: 'Explore more',
    footerLabel: 'Browse all coverage',
    footerTo: '/news/search',
  },
)
</script>

<template>
  <section class="sp-v25-panel overflow-hidden">
    <div class="relative px-4 pb-3 pt-4">
      <div class="sp-v25-topic-aura pointer-events-none absolute inset-0" />

      <div class="relative">
        <p class="sp-v25-kicker">
          {{ kicker }}
        </p>

        <div class="mt-1.5 flex items-end justify-between gap-3">
          <h2 class="text-[20px] font-[800] tracking-[-.04em] text-fg">
            {{ title }}
          </h2>

          <span class="text-[8px] font-bold uppercase tracking-[.12em] text-fg-subtle">
            {{ items.length }}
          </span>
        </div>
      </div>
    </div>

    <div class="border-t border-line p-3">
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="item in items"
          :key="`${item.to}-${item.label}`"
          :to="item.to"
          class="sp-v25-topic-chip group"
          :class="item.primary ? 'sp-v25-topic-chip-primary' : ''"
        >
          <span
            v-if="item.prefix"
            class="text-[8px] opacity-60"
          >
            {{ item.prefix }}
          </span>

          <span>{{ item.label }}</span>

          <span
            v-if="item.count !== undefined && item.count !== null"
            class="sp-v25-topic-count"
          >
            {{ item.count }}
          </span>

          <span class="sp-v25-topic-arrow">
            ↗
          </span>
        </NuxtLink>
      </div>
    </div>

    <NuxtLink
      v-if="footerTo"
      :to="footerTo"
      class="sp-v25-panel-footer group"
    >
      {{ footerLabel }}
      <span class="transition-transform group-hover:translate-x-1">
        →
      </span>
    </NuxtLink>
  </section>
</template>
