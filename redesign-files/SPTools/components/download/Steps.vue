<script setup lang="ts">
defineProps<{
  steps: { title: string; description: string }[]
  title?: string
  description?: string
}>()
</script>

<template>
  <section class="border-t border-line bg-surface-2 py-14 sm:py-16">
    <div class="sp-container">
      <UiSectionHeading
        eyebrow="How it works"
        :title="title ?? 'Four steps, no account'"
        :description="description"
        align="center"
      />

      <ol class="relative mx-auto mt-10 max-w-5xl lg:grid lg:grid-cols-4 lg:gap-0">
        <div
          class="pointer-events-none absolute left-[12.5%] right-[12.5%] top-5 hidden h-px bg-line lg:block"
          aria-hidden="true"
        />

        <li
          v-for="(step, index) in steps"
          :key="step.title"
          class="relative grid grid-cols-[44px_1fr] gap-4 pb-8 last:pb-0 lg:block lg:px-4 lg:pb-0 lg:text-center"
        >
          <div
            v-if="index < steps.length - 1"
            class="absolute bottom-0 left-[21px] top-10 w-px bg-line lg:hidden"
            aria-hidden="true"
          />

          <span
            class="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-elevated text-[12px] font-bold tracking-[0.08em] text-accent shadow-xs lg:mx-auto"
            aria-hidden="true"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>

          <div>
            <h3 class="text-[15px] font-[680] tracking-[-0.02em] text-fg lg:mt-5">
              {{ step.title }}
            </h3>
            <p class="mt-1.5 text-[13px] leading-6 text-fg-muted">
              {{ step.description }}
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
