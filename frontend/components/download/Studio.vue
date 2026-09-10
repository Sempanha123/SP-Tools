<script setup lang="ts">
type Platform = 'tiktok' | 'facebook' | 'youtube'

const props = withDefaults(
  defineProps<{
    platform: Platform
    eyebrow: string
    title: string
    description: string
    features?: string[]
    loading?: boolean
    resolved?: boolean
    errorMessage?: string
  }>(),
  {
    features: () => [],
    loading: false,
    resolved: false,
    errorMessage: '',
  },
)

const emit = defineEmits<{ reset: [] }>()

const meta = computed(() => ({
  tiktok: {
    icon: '♪',
    product: 'TikTok download studio',
    inputTitle: 'Paste a TikTok video link',
    inputHint: 'Public videos and share links supported',
    idleTitle: 'Paste a TikTok link to start',
    idleBody: 'The page will turn into the real post workspace with creator details, preview and every available rendition.',
    chips: ['HD', 'No watermark', 'MP4'],
  },
  facebook: {
    icon: 'f',
    product: 'Facebook media studio',
    inputTitle: 'Paste a Facebook Reel or video link',
    inputHint: 'Public watch, Reel and share links supported',
    idleTitle: 'Paste a Facebook link to start',
    idleBody: 'The page will load the real public video or Reel with its preview and available qualities.',
    chips: ['Reels', 'HD', 'MP4'],
  },
  youtube: {
    icon: '▶',
    product: 'YouTube stream studio',
    inputTitle: 'Paste a YouTube watch or Shorts link',
    inputHint: 'Watch, Shorts and youtu.be links supported',
    idleTitle: 'Paste a YouTube link to start',
    idleBody: 'The page will load the actual thumbnail, channel, video resolutions and audio streams returned by the media service.',
    chips: ['Up to 4K', 'Video', 'Audio'],
  },
}[props.platform]))

const statusText = computed(() => {
  if (props.loading) return 'resolving'
  if (props.resolved) return 'ready to save'
  return 'ready for link'
})
</script>

<template>
  <!--
    V7: this IS the page. There is intentionally no rounded outer studio card,
    no right-hand mockup and no light hero wrapped around a dark widget.
  -->
  <section
    class="sp-download-console-page sp-download-fullbleed sp-download-sticky-host relative"
    :class="`sp-platform-${platform}`"
  >
    <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[.07]" />
    <div class="sp-platform-sheen pointer-events-none absolute inset-0 opacity-55" />
    <div class="sp-download-orb sp-download-orb-a" />
    <div class="sp-download-orb sp-download-orb-b" />

    <!-- Console rail spans the complete page width. -->
    <div class="sp-download-sticky-rail relative border-b border-line bg-surface-2/55 backdrop-blur-xl">
      <div class="sp-container-wide flex min-h-[68px] flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex min-w-0 items-center gap-3.5">
          <span class="sp-platform-logo flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] text-sm font-black">
            {{ meta.icon }}
          </span>
          <div class="min-w-0">
            <p class="truncate text-[9px] font-black uppercase tracking-[.17em] text-fg-subtle">Interactive downloader</p>
            <p class="mt-1 truncate text-[13px] font-bold text-fg">{{ meta.product }}</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <span v-for="chip in meta.chips" :key="chip" class="hidden rounded-full border border-line bg-surface-3/80 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.11em] text-fg-subtle md:inline-flex">
            {{ chip }}
          </span>
          <span class="inline-flex items-center gap-2 rounded-full border border-line bg-surface-3 px-3.5 py-1.5 text-[9px] font-semibold text-fg-muted">
            <span class="h-1.5 w-1.5 rounded-full" :class="loading ? 'animate-pulse bg-amber-300' : resolved ? 'bg-emerald-300' : 'sp-platform-dot'" />
            {{ statusText }}
          </span>
        </div>
      </div>
    </div>

    <div class="sp-container-wide relative py-10 sm:py-14 lg:py-16">
      <!-- Product intro uses the console language directly on the page canvas. -->
      <div class="sp-reveal mx-auto max-w-[1050px] text-center">
        <div class="sp-download-console-kicker mx-auto inline-flex items-center gap-2.5 rounded-full border border-line bg-surface-3/80 px-3.5 py-2 text-[9px] font-black uppercase tracking-[.16em] text-fg-muted">
          <span class="sp-platform-dot h-1.5 w-1.5 rounded-full" />
          {{ eyebrow }}
        </div>

        <h1 class="mx-auto mt-6 max-w-[1000px] text-[clamp(3rem,6.3vw,6.3rem)] font-[790] leading-[.88] tracking-[-.072em] text-fg">
          {{ title }}
        </h1>

        <p class="mx-auto mt-6 max-w-[740px] text-[14px] leading-7 text-fg-muted sm:text-[16px]">
          {{ description }}
        </p>

        <ul v-if="features.length" class="mt-6 flex flex-wrap justify-center gap-2.5">
          <li v-for="feature in features" :key="feature" class="sp-download-console-chip">
            <span class="sp-platform-check">✓</span>
            {{ feature }}
          </li>
        </ul>
      </div>

      <!-- Real input is the primary action of the page, not part of a fake preview. -->
      <div class="sp-reveal mx-auto mt-9 max-w-[1120px] sm:mt-11">
        <div class="sp-download-start sp-download-start-full relative border-y border-line bg-surface-3/70 px-0 py-5 sm:px-5 sm:py-6">
          <div class="mb-4 flex flex-wrap items-end justify-between gap-3 px-1">
            <div>
              <p class="sp-platform-start-label text-[8px] font-black uppercase tracking-[.16em]">01 · Start here</p>
              <h2 class="mt-1.5 text-[15px] font-bold text-fg sm:text-[16px]">{{ meta.inputTitle }}</h2>
            </div>
            <p class="text-[9px] text-fg-subtle">{{ meta.inputHint }}</p>
          </div>
          <slot name="input" />
        </div>

        <div v-if="errorMessage" class="mt-4 flex flex-col gap-3 rounded-[16px] border border-red-400/20 bg-red-400/[.07] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="min-w-0">
            <p class="text-[10px] font-bold text-red-200">Could not resolve this link</p>
            <p class="mt-1 text-[10px] leading-5 text-red-100/58">{{ errorMessage }}</p>
          </div>
          <button type="button" class="shrink-0 rounded-[10px] border border-red-300/15 bg-surface-3 px-3 py-2 text-[9px] font-bold text-fg-muted transition hover:bg-surface-3 hover:text-fg" @click="emit('reset')">
            Start over
          </button>
        </div>
      </div>

      <!-- Actual content stage. No mock player exists in the idle state. -->
      <div class="sp-reveal mx-auto mt-6 max-w-[1280px]">
        <Transition name="sp-workspace" mode="out-in">
          <div v-if="loading" key="loading" class="sp-download-state sp-scanline relative min-h-[330px] overflow-hidden border-y border-line bg-surface-2/70 py-10">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,var(--sp-platform-soft),transparent_42%)]" />
            <div class="relative flex min-h-[250px] flex-col items-center justify-center text-center">
              <div class="sp-resolver-ring relative flex h-20 w-20 items-center justify-center rounded-full border border-line bg-surface-3/80">
                <span class="sp-platform-logo flex h-12 w-12 items-center justify-center rounded-[15px] text-base font-black">{{ meta.icon }}</span>
              </div>
              <p class="mt-6 text-[15px] font-bold text-fg">Reading the real media…</p>
              <p class="mt-2 max-w-md text-[11px] leading-6 text-fg-muted">Resolving the actual content, preview and downloadable formats.</p>
              <div class="mt-6 h-1.5 w-full max-w-[360px] overflow-hidden rounded-full bg-surface-3"><div class="sp-platform-progress h-full" /></div>
            </div>
          </div>

          <div v-else-if="resolved" key="result" class="sp-download-state">
            <div class="mb-4 flex items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <p class="text-[8px] font-black uppercase tracking-[.16em] text-emerald-300">02 · Real content resolved</p>
                <p class="mt-1 text-[11px] text-fg-muted">Choose the actual media and quality returned by the service.</p>
              </div>
              <span class="hidden rounded-full border border-emerald-300/15 bg-emerald-300/[.07] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.12em] text-emerald-200 sm:inline-flex">Live result</span>
            </div>
            <slot name="result" />
          </div>

          <div v-else key="idle" class="sp-download-state relative overflow-hidden border-y border-line bg-surface-2/60 py-12 sm:py-16">
            <div class="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--sp-platform-soft)] blur-[100px]" />
            <div class="relative mx-auto max-w-[760px] text-center">
              <span class="sp-platform-logo mx-auto flex h-14 w-14 items-center justify-center rounded-[17px] text-base font-black">{{ meta.icon }}</span>
              <p class="mt-6 text-[18px] font-[740] tracking-[-.025em] text-fg">{{ meta.idleTitle }}</p>
              <p class="mx-auto mt-3 max-w-[600px] text-[11px] leading-6 text-fg-muted">{{ meta.idleBody }}</p>

              <div class="mt-7 grid gap-2 sm:grid-cols-3">
                <div class="sp-download-stage-step"><span>01</span><strong>Paste link</strong></div>
                <div class="sp-download-stage-step"><span>02</span><strong>Resolve content</strong></div>
                <div class="sp-download-stage-step"><span>03</span><strong>Choose & save</strong></div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

