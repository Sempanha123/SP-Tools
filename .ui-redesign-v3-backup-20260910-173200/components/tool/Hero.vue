<script setup lang="ts">
const props = defineProps<{
  eyebrow?: string
  title: string
  description: string
  features?: string[]
  accent?: string
}>()

const slots = useSlots()
const hasAction = computed(() => Boolean(slots.default))
const glowStyle = computed(() => ({
  background: props.accent ?? 'var(--sp-accent)',
}))
</script>

<template>
  <section class="sp-spotlight relative overflow-hidden border-b border-line bg-surface">
    <div class="sp-quiet-grid pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-[0.38]" />
    <div class="pointer-events-none absolute right-[8%] top-[-170px] h-[330px] w-[330px] rounded-full opacity-[0.08] blur-[95px]" :style="glowStyle" />

    <div class="sp-container-wide relative py-12 sm:py-16 lg:py-[76px]">
      <div
        class="grid gap-9"
        :class="hasAction ? 'lg:grid-cols-[minmax(0,1.02fr)_minmax(430px,.98fr)] lg:items-center lg:gap-14' : ''"
      >
        <div :class="hasAction ? 'text-left' : 'mx-auto max-w-[900px] text-center'">
          <div class="sp-kicker" :class="hasAction ? '' : 'justify-center'">
            {{ eyebrow }}
          </div>

          <h1
            class="mt-5 font-sans text-[clamp(2.75rem,5vw,4.35rem)] font-[750] leading-[0.96] tracking-[-0.06em] text-fg"
            :class="hasAction ? 'max-w-[720px]' : 'mx-auto max-w-[880px]'"
          >
            {{ title }}
          </h1>

          <p
            class="mt-5 text-[15px] leading-7 text-fg-muted sm:text-[17px]"
            :class="hasAction ? 'max-w-[610px]' : 'mx-auto max-w-[650px]'"
          >
            {{ description }}
          </p>

          <ul
            v-if="features?.length"
            class="mt-7 flex flex-wrap gap-x-5 gap-y-2.5 text-[12px] font-medium text-fg-muted"
            :class="hasAction ? '' : 'justify-center'"
          >
            <li v-for="feature in features" :key="feature" class="inline-flex items-center gap-2">
              <span class="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-positive-soft text-positive">
                <svg class="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="m2.5 6.2 2.1 2.1 4.9-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              {{ feature }}
            </li>
          </ul>
        </div>

        <div v-if="hasAction" class="relative">
          <div class="pointer-events-none absolute left-1/2 top-1/2 h-56 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[70px]" />
          <div class="sp-float relative rounded-[22px] p-[1px] sp-gradient-ring">
            <div class="sp-glass rounded-[21px] p-3 sm:p-4">
              <div class="flex items-center justify-between border-b border-line px-1 pb-3">
                <div class="flex items-center gap-2">
                  <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-[11px] text-accent">✦</span>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-[0.13em] text-fg-subtle">Ready to start</p>
                    <p class="mt-0.5 text-[11px] font-medium text-fg-muted">Paste a supported link below</p>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[9px] font-semibold text-positive"><span class="h-1.5 w-1.5 rounded-full bg-positive sp-pulse-soft" /> online</span>
              </div>
              <div class="pt-3 [&>div]:!mt-0">
                <slot />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="mx-auto mt-1 max-w-[780px]">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
