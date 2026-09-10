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

const platform = computed<'tiktok' | 'facebook' | 'youtube' | 'generic'>(() => {
  const value = `${props.eyebrow ?? ''} ${props.title}`.toLowerCase()
  if (value.includes('tiktok')) return 'tiktok'
  if (value.includes('facebook')) return 'facebook'
  if (value.includes('youtube')) return 'youtube'
  return 'generic'
})

const platformMeta = computed(() => ({
  tiktok: {
    short: 'TT',
    label: 'TikTok capture studio',
    subtitle: 'Public post → clean MP4',
    steps: ['Paste link', 'Resolve post', 'Choose HD'],
  },
  facebook: {
    short: 'f',
    label: 'Facebook media desk',
    subtitle: 'Reels + public video',
    steps: ['Paste link', 'Read formats', 'Save quality'],
  },
  youtube: {
    short: '▶',
    label: 'YouTube stream console',
    subtitle: 'Video + audio workspace',
    steps: ['Paste link', 'Read streams', 'Video / audio'],
  },
  generic: {
    short: '↗',
    label: 'Media resolver',
    subtitle: 'Paste a supported link',
    steps: ['Paste', 'Resolve', 'Download'],
  },
}[platform.value]))
</script>

<template>
  <section class="sp-prism-field sp-noise relative border-b border-line">
    <div class="sp-ambient-ring -right-36 top-10 hidden h-[360px] w-[360px] opacity-55 lg:block" />
    <div class="sp-container-wide relative py-14 sm:py-[72px] lg:py-20">
      <div class="grid items-center gap-10 lg:grid-cols-[.88fr_1.12fr] lg:gap-14 xl:gap-20">
        <div class="sp-reveal-left relative z-10">
          <div class="sp-kicker">{{ eyebrow }}</div>
          <h1 class="mt-5 max-w-[760px] text-[clamp(3rem,5.7vw,5.35rem)] font-[790] leading-[.89] tracking-[-.071em] text-fg">
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

        <!-- Platform-specific downloader workspace -->
        <div v-if="hasAction" class="sp-reveal relative" :class="`sp-platform-${platform}`">
          <div class="sp-platform-aura pointer-events-none absolute left-1/2 top-1/2 h-[310px] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]" />

          <div class="sp-platform-shell sp-depth-hover relative overflow-hidden rounded-[28px] p-[1px]">
            <div class="relative overflow-hidden rounded-[27px] bg-elevated p-3 sm:p-4">
              <div class="sp-platform-stage relative overflow-hidden rounded-[21px] border border-white/10 text-white">
                <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[.10]" />
                <div class="sp-platform-sheen pointer-events-none absolute inset-0" />

                <div class="relative flex items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-5">
                  <div class="flex min-w-0 items-center gap-3">
                    <span class="sp-platform-logo flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-sm font-black">
                      {{ platformMeta.short }}
                    </span>
                    <div class="min-w-0">
                      <p class="truncate text-[10px] font-bold uppercase tracking-[.16em] text-white/45">{{ platformMeta.label }}</p>
                      <p class="mt-1 truncate text-[12px] font-semibold text-white/90">{{ platformMeta.subtitle }}</p>
                    </div>
                  </div>
                  <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[.055] px-2.5 py-1.5 text-[9px] font-semibold text-emerald-300">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-300 sp-pulse-soft" /> ready
                  </span>
                </div>

                <!-- Tiny platform preview -->
                <div class="relative px-4 pt-4 sm:px-5">
                  <div v-if="platform === 'tiktok'" class="grid grid-cols-[92px_1fr] gap-3 sm:grid-cols-[112px_1fr]">
                    <div class="sp-tiktok-reel relative min-h-[150px] overflow-hidden rounded-[16px] border border-white/10 bg-white/[.045]">
                      <div class="absolute inset-x-3 top-3 flex items-center justify-between"><span class="h-2 w-10 rounded-full bg-white/12"/><span class="h-5 w-5 rounded-full bg-white/10"/></div>
                      <div class="absolute inset-x-3 bottom-4 space-y-2"><span class="block h-2 w-12 rounded-full bg-white/18"/><span class="block h-2 w-[75%] rounded-full bg-white/10"/><div class="sp-platform-progress mt-3 h-1 rounded-full"/></div>
                    </div>
                    <div class="grid content-center gap-2.5">
                      <div class="rounded-[14px] border border-white/10 bg-white/[.045] p-3"><p class="text-[8px] uppercase tracking-[.14em] text-white/35">quality</p><div class="mt-2 flex items-end gap-1"><i v-for="n in 8" :key="n" class="sp-eq-bar block w-1.5 rounded-full" :style="{ height: `${8 + (n % 4) * 5}px`, animationDelay: `${n * 70}ms` }" /></div><p class="mt-2 text-[11px] font-bold text-white">HD / no watermark</p></div>
                      <div class="flex gap-2"><span class="sp-platform-pill">Original audio</span><span class="sp-platform-pill">MP4</span></div>
                    </div>
                  </div>

                  <div v-else-if="platform === 'facebook'" class="rounded-[16px] border border-white/10 bg-white/[.045] p-3.5">
                    <div class="flex items-center gap-2.5"><span class="sp-platform-logo flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-black">f</span><div class="flex-1"><span class="block h-2 w-20 rounded-full bg-white/18"/><span class="mt-1.5 block h-1.5 w-12 rounded-full bg-white/8"/></div><span class="sp-platform-pill">PUBLIC</span></div>
                    <div class="mt-3 grid grid-cols-[1fr_92px] gap-3"><div class="relative min-h-[96px] overflow-hidden rounded-[13px] bg-white/[.06]"><div class="sp-platform-progress absolute inset-x-3 bottom-3 h-1 rounded-full"/></div><div class="grid gap-2"><div class="rounded-[12px] border border-white/10 bg-white/[.04] p-2.5"><p class="text-[8px] uppercase tracking-[.12em] text-white/35">best</p><p class="mt-1 text-[11px] font-bold text-white">HD 1080p</p></div><div class="rounded-[12px] border border-white/10 bg-white/[.04] p-2.5"><p class="text-[8px] uppercase tracking-[.12em] text-white/35">type</p><p class="mt-1 text-[11px] font-bold text-white">Reel / Video</p></div></div></div>
                  </div>

                  <div v-else-if="platform === 'youtube'" class="rounded-[16px] border border-white/10 bg-white/[.045] p-3.5">
                    <div class="relative flex min-h-[112px] items-center justify-center overflow-hidden rounded-[13px] bg-black/30">
                      <span class="sp-platform-logo flex h-12 w-12 items-center justify-center rounded-[15px] text-[17px]">▶</span>
                      <div class="absolute inset-x-4 bottom-3"><div class="h-1 rounded-full bg-white/10"><div class="sp-youtube-playhead h-full w-[44%] rounded-full"/></div><div class="mt-2 flex items-center justify-between text-[8px] text-white/35"><span>00:42</span><span>4K • 60fps</span></div></div>
                    </div>
                    <div class="mt-3 grid grid-cols-3 gap-2"><span class="sp-platform-pill justify-center">4K video</span><span class="sp-platform-pill justify-center">1080p</span><span class="sp-platform-pill justify-center">Audio</span></div>
                  </div>

                  <div v-else class="rounded-[16px] border border-white/10 bg-white/[.045] p-4"><div class="h-24 rounded-[13px] border border-dashed border-white/12" /></div>
                </div>

                <div class="relative p-4 sm:p-5 [&>div]:!mt-0"><slot /></div>

                <div class="relative grid grid-cols-3 border-t border-white/10 bg-black/10 px-3 py-3 text-center sm:px-5">
                  <div v-for="(step, index) in platformMeta.steps" :key="step" :class="index === 1 ? 'border-x border-white/10' : ''">
                    <p class="text-[8px] uppercase tracking-[.14em] text-white/30">0{{ index + 1 }}</p>
                    <p class="mt-1 text-[10px] font-bold text-white/80">{{ step }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="sp-float-delayed absolute -bottom-4 -left-3 hidden rounded-[13px] border border-line bg-elevated px-3 py-2 shadow-soft sm:block">
            <p class="text-[8px] font-bold uppercase tracking-[.12em] text-fg-subtle">Focused workflow</p>
            <p class="mt-1 text-[10px] font-semibold text-fg">{{ platformMeta.subtitle }}</p>
          </div>
        </div>

        <!-- Visual system panel for image pages -->
        <div v-else class="sp-reveal relative mx-auto w-full max-w-[640px]">
          <div class="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[80px]" :style="glowStyle" />
          <div class="sp-orbit px-4 py-7">
            <div class="sp-border-flow sp-depth-hover relative rounded-[26px] p-[1px]">
              <div class="sp-lens-card overflow-hidden rounded-[25px] p-3">
                <div class="sp-scanline relative rounded-[19px] border border-white/10 bg-[#10141d] p-5 text-white sm:p-6">
                  <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[.12]" />
                  <div class="relative">
                    <div class="flex items-start justify-between gap-6">
                      <div><p class="text-[9px] font-bold uppercase tracking-[.16em] text-violet-300">Image intelligence</p><p class="mt-2 text-[20px] font-[700] tracking-[-.035em] text-white">Visual processing workspace</p></div>
                      <span class="flex h-10 w-10 items-center justify-center rounded-[13px] border border-white/10 bg-white/[.06] text-violet-300">✦</span>
                    </div>
                    <div class="mt-7 grid grid-cols-[1.3fr_.7fr] gap-3">
                      <div class="relative min-h-[150px] overflow-hidden rounded-[16px] border border-white/10 bg-white/[.055] p-4"><div class="absolute inset-5 rounded-[13px] border border-dashed border-white/13" /><div class="relative flex h-full items-center justify-center"><span class="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white/[.07] text-violet-300">↑</span></div></div>
                      <div class="grid gap-3"><div class="rounded-[14px] border border-white/10 bg-white/[.055] p-3"><p class="text-[8px] uppercase tracking-[.12em] text-white/35">edge</p><p class="mt-1.5 text-[11px] font-semibold text-emerald-300">Detected</p></div><div class="rounded-[14px] border border-white/10 bg-white/[.055] p-3"><p class="text-[8px] uppercase tracking-[.12em] text-white/35">engine</p><p class="mt-1.5 text-[11px] font-semibold text-violet-300">Ready</p></div></div>
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
