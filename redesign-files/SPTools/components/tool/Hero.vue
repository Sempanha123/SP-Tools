<script setup lang="ts">
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
    <div class="sp-quiet-grid pointer-events-none absolute inset-x-0 top-0 h-72 opacity-55" />
    <div
      class="pointer-events-none absolute left-1/2 top-[-190px] h-[360px] w-[640px] -translate-x-1/2 rounded-full blur-[110px]"
      :style="{ background: accent ?? 'var(--sp-accent)', opacity: 0.09 }"
    />

    <div class="sp-container relative py-12 text-center sm:py-14 lg:py-16">
      <div v-if="eyebrow" class="sp-kicker justify-center">
        <span class="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
        {{ eyebrow }}
      </div>

      <h1
        class="mx-auto mt-4 max-w-[820px] font-sans text-[clamp(2.45rem,5vw,3.85rem)] font-[720] leading-[1.02] tracking-[-0.052em] text-fg"
      >
        {{ title }}
      </h1>

      <p class="mx-auto mt-5 max-w-[650px] text-[15px] leading-7 text-fg-muted sm:text-[17px]">
        {{ description }}
      </p>

      <div class="mx-auto mt-7 max-w-[780px]">
        <slot />
      </div>

      <ul
        v-if="features?.length"
        class="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] font-medium text-fg-muted"
      >
        <li v-for="feature in features" :key="feature" class="inline-flex items-center gap-2">
          <span class="flex h-4 w-4 items-center justify-center rounded-full bg-positive-soft text-positive">
            <svg class="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="m2.5 6.2 2.1 2.1 4.9-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          {{ feature }}
        </li>
      </ul>
    </div>
  </section>
</template>
