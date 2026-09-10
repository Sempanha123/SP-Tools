<script setup lang="ts">
const props = defineProps<{
  steps: { title: string; description: string }[]
  title?: string
  description?: string
}>()

const platform = computed<'tiktok' | 'facebook' | 'youtube' | 'generic'>(() => {
  const value = `${props.title ?? ''} ${props.description ?? ''}`.toLowerCase()
  if (value.includes('tiktok')) return 'tiktok'
  if (value.includes('facebook')) return 'facebook'
  if (value.includes('youtube')) return 'youtube'
  return 'generic'
})

const iconSets = {
  tiktok: ['↗', '♪', 'HD', '↓'],
  facebook: ['f', '↗', 'HD', '↓'],
  youtube: ['▶', '⌘', '4K', '↓'],
  generic: ['↗', '⌘', '✦', '↓'],
}

const icons = computed(() => iconSets[platform.value])
</script>

<template>
  <section class="relative overflow-hidden border-t border-line bg-surface py-[72px] sm:py-[88px]" :class="`sp-platform-${platform}`">
    <div class="sp-quiet-grid pointer-events-none absolute inset-x-0 top-0 h-72 opacity-[.13]" />
    <div class="sp-platform-section-glow pointer-events-none absolute left-1/2 top-0 h-56 w-[70%] -translate-x-1/2 rounded-full blur-[90px]" />

    <div class="sp-container-wide relative">
      <UiSectionHeading
        eyebrow="How it works"
        :title="title ?? 'Four steps, no account'"
        :description="description"
        align="center"
      />

      <div class="sp-reveal relative mt-12">
        <div class="absolute left-[9%] right-[9%] top-7 hidden h-[2px] overflow-hidden rounded-full bg-line lg:block">
          <div class="sp-platform-progress h-full" />
        </div>

        <ol class="sp-stagger grid gap-4 lg:grid-cols-4">
          <li
            v-for="(step, index) in steps"
            :key="step.title"
            class="group relative grid grid-cols-[50px_minmax(0,1fr)] gap-4 rounded-[20px] border border-line bg-elevated p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lift lg:block lg:border-transparent lg:bg-transparent lg:p-0 lg:text-center lg:hover:shadow-none"
          >
            <div class="sp-platform-step relative z-10 flex h-12 w-12 items-center justify-center rounded-[15px] border bg-elevated text-[12px] font-black shadow-soft transition duration-300 group-hover:-rotate-3 group-hover:scale-110 lg:mx-auto lg:h-14 lg:w-14 lg:rounded-[17px]">
              <span class="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-fg px-1 text-[8px] font-bold text-surface-2">0{{ index + 1 }}</span>
              <span aria-hidden="true">{{ icons[index] ?? '•' }}</span>
            </div>

            <div class="min-w-0 lg:mt-6">
              <h3 class="text-[15px] font-[720] text-fg">{{ step.title }}</h3>
              <p class="mt-2 text-[12px] leading-6 text-fg-muted lg:mx-auto lg:max-w-[240px]">{{ step.description }}</p>
            </div>
          </li>
        </ol>
      </div>

      <div class="mx-auto mt-10 flex w-fit items-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-2 text-[9px] font-semibold uppercase tracking-[.11em] text-fg-subtle shadow-xs">
        <span class="sp-platform-dot h-1.5 w-1.5 rounded-full sp-pulse-soft" /> Platform-aware flow · link to file
      </div>
    </div>
  </section>
</template>
