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
const glowStyle = computed(() => ({ background: props.accent ?? 'var(--sp-accent)' }))
</script>

<template>
  <section class="sp-prism-field sp-noise relative border-b border-line">
    <div class="sp-ambient-ring -right-36 top-10 hidden h-[360px] w-[360px] opacity-60 lg:block" />
    <div class="sp-container-wide relative py-14 sm:py-[72px] lg:py-20">
      <div class="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-14 xl:gap-18">
        <div class="sp-reveal-left relative z-10">
          <div class="sp-kicker">{{ eyebrow }}</div>
          <h1 class="mt-5 max-w-[760px] text-[clamp(3rem,5.7vw,5.3rem)] font-[780] leading-[.88] tracking-[-.071em] text-fg">
            {{ title }}
          </h1>
          <p class="mt-6 max-w-[610px] text-[15px] leading-7 text-fg-muted sm:text-[17px]">{{ description }}</p>

          <ul v-if="features?.length" class="mt-7 flex flex-wrap gap-2.5">
            <li v-for="feature in features" :key="feature" class="sp-chip">
              <span class="flex h-4 w-4 items-center justify-center rounded-full bg-positive-soft text-positive">
                <svg class="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m2.5 6.2 2.1 2.1 4.9-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              {{ feature }}
            </li>
          </ul>
        </div>

        <!-- Action workspace for downloader pages -->
        <div v-if="hasAction" class="sp-reveal relative">
          <div class="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[80px]" />
          <div class="sp-border-flow sp-depth-hover relative rounded-[26px] p-[1px]">
            <div class="sp-lens-card overflow-hidden rounded-[25px] p-3 sm:p-4">
              <div class="overflow-hidden rounded-[18px] border border-line bg-surface-2">
                <div class="flex items-center justify-between border-b border-line bg-surface-3/55 px-4 py-3">
                  <div class="flex items-center gap-2.5">
                    <span class="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#10141d] text-[12px] text-violet-300">↗</span>
                    <div><p class="text-[9px] font-bold uppercase tracking-[.14em] text-fg-subtle">Resolve media</p><p class="mt-0.5 text-[10px] font-medium text-fg-muted">Paste a supported link</p></div>
                  </div>
                  <span class="inline-flex items-center gap-1.5 text-[9px] font-semibold text-positive"><span class="h-1.5 w-1.5 rounded-full bg-positive sp-pulse-soft" /> online</span>
                </div>
                <div class="p-3.5 sm:p-4 [&>div]:!mt-0"><slot /></div>
                <div class="grid grid-cols-3 border-t border-line bg-surface-3/45 px-4 py-3 text-center">
                  <div><p class="text-[8px] uppercase tracking-[.12em] text-fg-subtle">step</p><p class="mt-1 text-[10px] font-bold text-fg">Paste</p></div>
                  <div class="border-x border-line"><p class="text-[8px] uppercase tracking-[.12em] text-fg-subtle">process</p><p class="mt-1 text-[10px] font-bold text-accent">Resolve</p></div>
                  <div><p class="text-[8px] uppercase tracking-[.12em] text-fg-subtle">result</p><p class="mt-1 text-[10px] font-bold text-positive">Download</p></div>
                </div>
              </div>
            </div>
          </div>
          <div class="sp-float-delayed absolute -bottom-4 -left-4 hidden rounded-[13px] border border-line bg-elevated px-3 py-2 shadow-soft sm:block"><p class="text-[8px] font-bold uppercase tracking-[.12em] text-fg-subtle">Fast path</p><p class="mt-1 text-[10px] font-semibold text-fg">URL → clean result</p></div>
        </div>

        <!-- Visual system panel for image pages -->
        <div v-else class="sp-reveal relative mx-auto w-full max-w-[640px]">
          <div class="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[80px]" :style="glowStyle" />
          <div class="sp-orbit px-4 py-7">
            <div class="sp-border-flow sp-depth-hover relative rounded-[26px] p-[1px]">
              <div class="sp-lens-card overflow-hidden rounded-[25px] p-3">
                <div class="sp-scanline rounded-[19px] border border-line bg-[#10141d] p-5 text-white sm:p-6">
                  <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[.12]" />
                  <div class="relative">
                    <div class="flex items-start justify-between gap-6">
                      <div>
                        <p class="text-[9px] font-bold uppercase tracking-[.16em] text-violet-300">Image intelligence</p>
                        <p class="mt-2 text-[20px] font-[700] tracking-[-.035em] text-white">Visual processing workspace</p>
                      </div>
                      <span class="flex h-10 w-10 items-center justify-center rounded-[13px] border border-white/10 bg-white/[.06] text-violet-300">✦</span>
                    </div>
                    <div class="mt-7 grid grid-cols-[1.3fr_.7fr] gap-3">
                      <div class="relative min-h-[150px] overflow-hidden rounded-[16px] border border-white/10 bg-white/[.055] p-4">
                        <div class="absolute inset-5 rounded-[13px] border border-dashed border-white/13" />
                        <div class="relative flex h-full items-center justify-center"><span class="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white/[.07] text-violet-300">↑</span></div>
                      </div>
                      <div class="grid gap-3">
                        <div class="rounded-[14px] border border-white/10 bg-white/[.055] p-3"><p class="text-[8px] uppercase tracking-[.12em] text-white/35">edge</p><p class="mt-1.5 text-[11px] font-semibold text-emerald-300">Detected</p></div>
                        <div class="rounded-[14px] border border-white/10 bg-white/[.055] p-3"><p class="text-[8px] uppercase tracking-[.12em] text-white/35">engine</p><p class="mt-1.5 text-[11px] font-semibold text-violet-300">Ready</p></div>
                      </div>
                    </div>
                    <div class="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8"><div class="sp-progress-beam h-full rounded-full" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
