<script setup lang="ts">
/**
 * Shared hero for every tool page: title, description, and an optional
 * feature-pill row. Keeps the five tool pages visually identical up top.
 */
defineProps<{
  eyebrow?: string
  title: string
  description: string
  features?: string[]
  accent?: string
}>()
</script>

<template>
  <section class="relative overflow-hidden border-b border-line bg-surface">
    <div class="sp-grid-bg pointer-events-none absolute inset-0" />

    <div
      class="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[760px]
        -translate-x-1/2 rounded-full opacity-[0.16] blur-[110px]"
      :style="{ background: accent ?? 'var(--sp-accent)' }"
    />

    <div class="sp-container relative py-14 text-center sm:py-20">
      <UiBadge v-if="eyebrow" tone="accent" dot pulse>{{ eyebrow }}</UiBadge>

      <h1
        class="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold
          tracking-tight text-fg sm:text-6xl"
      >
        {{ title }}
      </h1>

      <p
        class="mx-auto mt-5 max-w-2xl text-sm leading-7 text-fg-muted sm:text-lg"
      >
        {{ description }}
      </p>

      <ul
        v-if="features?.length"
        class="mt-8 flex flex-wrap items-center justify-center gap-2.5"
      >
        <li
          v-for="feature in features"
          :key="feature"
          class="flex items-center gap-1.5 rounded-full border border-line
            bg-surface-2 px-3.5 py-1.5 text-xs font-medium text-fg-muted"
        >
          <svg
            class="h-3.5 w-3.5 text-positive"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5" />
          </svg>
          {{ feature }}
        </li>
      </ul>

      <slot />
    </div>
  </section>
</template>
