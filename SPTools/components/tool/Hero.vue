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
  <section class="sp-mesh-bg relative overflow-hidden border-b border-line">
    <div class="sp-grid-bg pointer-events-none absolute inset-0 opacity-60" />

    <div
      class="animate-blob pointer-events-none absolute left-1/2 -top-24 h-[420px] w-[780px]
        -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
      :style="{ background: accent ?? 'var(--sp-accent)' }"
    />
    <div
      class="animation-delay-2000 animate-blob pointer-events-none absolute -left-28 top-12
        h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[100px]"
    />
    <div
      class="animation-delay-4000 animate-blob pointer-events-none absolute -right-28 top-24
        h-64 w-64 rounded-full bg-cyan-400/15 blur-[100px]"
    />

    <div class="sp-container relative py-16 text-center sm:py-24">
      <UiBadge v-if="eyebrow" tone="accent" dot pulse>{{ eyebrow }}</UiBadge>

      <h1
        class="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold
          tracking-tight text-fg drop-shadow-sm sm:text-6xl lg:text-7xl"
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
            bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-fg-muted
            shadow-soft backdrop-blur-xl transition hover:-translate-y-0.5
            hover:border-accent/40 hover:text-fg"
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
