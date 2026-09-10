<script setup lang="ts">
defineProps<{
  steps: { title: string; description: string }[]
  title?: string
  description?: string
}>()
</script>

<template>
  <section class="relative overflow-hidden border-t border-line bg-surface-2 py-16 sm:py-20">
    <div class="sp-quiet-grid pointer-events-none absolute inset-x-0 top-0 h-72 opacity-[0.22]" />
    <div class="sp-container relative">
      <UiSectionHeading eyebrow="How it works" :title="title ?? 'Four steps, no account'" :description="description" align="center" />

      <ol class="sp-stagger relative mx-auto mt-11 max-w-6xl lg:grid lg:grid-cols-4 lg:gap-0">
        <div class="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[31px] hidden h-[2px] overflow-hidden rounded-full bg-line lg:block" aria-hidden="true">
          <div class="sp-progress-beam h-full w-full" />
        </div>

        <li v-for="(step, index) in steps" :key="step.title" class="group relative grid grid-cols-[58px_1fr] gap-4 pb-8 last:pb-0 lg:block lg:px-5 lg:pb-0 lg:text-center">
          <div v-if="index < steps.length - 1" class="absolute bottom-0 left-[28px] top-[58px] w-px bg-line lg:hidden" aria-hidden="true" />

          <span class="relative z-10 flex h-[62px] w-[62px] items-center justify-center rounded-[18px] border border-line bg-elevated shadow-soft transition duration-300 group-hover:-translate-y-1 group-hover:border-accent/35 group-hover:shadow-lift lg:mx-auto">
            <span class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-line bg-surface-2 px-1 text-[8px] font-bold text-accent">{{ String(index + 1).padStart(2, '0') }}</span>
            <svg v-if="index === 0" class="h-5 w-5 text-fg-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h8m-4-4 4 4-4 4M5 5h4v14H5z" /></svg>
            <svg v-else-if="index === 1" class="h-5 w-5 text-fg-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="7" y="3" width="10" height="5" rx="1.5"/><path stroke-linecap="round" d="M7 6H5.5A1.5 1.5 0 0 0 4 7.5v11A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 18.5 6H17"/></svg>
            <svg v-else-if="index === 2" class="h-5 w-5 text-fg-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 7h14M8 12h8M10 17h4"/></svg>
            <svg v-else class="h-5 w-5 text-fg-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>
          </span>

          <div class="pt-1 lg:pt-0">
            <h3 class="text-[15px] font-[680] tracking-[-0.02em] text-fg lg:mt-5">{{ step.title }}</h3>
            <p class="mt-2 text-[12px] leading-6 text-fg-muted lg:mx-auto lg:max-w-[220px]">{{ step.description }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
