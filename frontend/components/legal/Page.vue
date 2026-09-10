<script setup lang="ts">
/**
 * Shared shell for the static legal / info pages so they share one layout.
 * `sections` render as h2 + paragraph list; `updated` shows the revision date.
 */
defineProps<{
  eyebrow: string
  title: string
  intro: string
  updated?: string
  sections: { heading: string; body: string[] }[]
}>()
</script>

<template>
  <div>
    <section class="relative overflow-hidden border-b border-line bg-surface">
      <div class="sp-grid-bg pointer-events-none absolute inset-0" />

      <div class="sp-container relative py-14 sm:py-20">
        <UiBadge tone="accent" dot>{{ eyebrow }}</UiBadge>

        <h1
          class="mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight
            text-fg sm:text-5xl"
        >
          {{ title }}
        </h1>

        <p class="mt-5 max-w-2xl text-sm leading-7 text-fg-muted sm:text-base">
          {{ intro }}
        </p>

        <p v-if="updated" class="mt-6 text-xs text-fg-subtle">
          Last updated {{ updated }}
        </p>
      </div>
    </section>

    <section class="sp-container max-w-3xl py-14 sm:py-20">
      <div class="space-y-12">
        <div v-for="section in sections" :key="section.heading">
          <h2 class="font-display text-xl font-bold text-fg sm:text-2xl">
            {{ section.heading }}
          </h2>

          <div class="mt-4 space-y-4">
            <p
              v-for="(paragraph, index) in section.body"
              :key="index"
              class="text-sm leading-7 text-fg-muted"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>
      </div>

      <slot />
    </section>
  </div>
</template>
