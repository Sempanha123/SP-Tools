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

const emit = defineEmits<{
  reset: []
}>()

const meta = computed(() => ({
  tiktok: {
    icon: '♪',
    product: 'TikTok download studio',
    inputTitle: 'Paste a TikTok video link',
    inputHint: 'Public videos and share links supported',
    idleTitle: 'Your TikTok will appear here',
    idleBody: 'Paste a real post link above. We will replace this preview state with the creator, thumbnail and every available rendition.',
    preview: 'Vertical video preview',
    chips: ['HD', 'No watermark', 'MP4'],
  },
  facebook: {
    icon: 'f',
    product: 'Facebook media studio',
    inputTitle: 'Paste a Facebook Reel or video link',
    inputHint: 'Public watch, Reel and share links supported',
    idleTitle: 'Your Facebook video will appear here',
    idleBody: 'Paste a public Reel or video URL above. The real post preview and available qualities will load into this workspace.',
    preview: 'Reel / video preview',
    chips: ['Reels', 'HD', 'MP4'],
  },
  youtube: {
    icon: '▶',
    product: 'YouTube stream studio',
    inputTitle: 'Paste a YouTube watch or Shorts link',
    inputHint: 'Watch, Shorts and youtu.be links supported',
    idleTitle: 'Your YouTube video will appear here',
    idleBody: 'Paste a real YouTube URL above. This area will update with the thumbnail, channel and the video/audio streams we actually resolve.',
    preview: 'Video + audio preview',
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
  <section
    class="sp-download-hero sp-prism-field sp-noise relative overflow-hidden border-b border-line"
    :class="`sp-platform-${platform}`"
  >
    <div class="sp-download-orb sp-download-orb-a" />
    <div class="sp-download-orb sp-download-orb-b" />
    <div class="sp-quiet-grid pointer-events-none absolute inset-0 opacity-[.18]" />

    <div class="sp-container-wide relative py-12 sm:py-16 lg:py-[76px]">
      <div class="grid items-center gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-14 xl:gap-20">
        <div class="sp-reveal-left relative z-10">
          <div class="sp-kicker">
            <span class="sp-platform-dot h-1.5 w-1.5 rounded-full" />
            {{ eyebrow }}
          </div>

          <h1 class="mt-5 max-w-[690px] text-[clamp(3rem,5.1vw,5rem)] font-[790] leading-[.9] tracking-[-.067em] text-fg">
            {{ title }}
          </h1>

          <p class="mt-6 max-w-[610px] text-[15px] leading-7 text-fg-muted sm:text-[17px]">
            {{ description }}
          </p>

          <ul v-if="features.length" class="mt-7 flex flex-wrap gap-2.5">
            <li v-for="feature in features" :key="feature" class="sp-chip">
              <span class="sp-platform-check">✓</span>
              {{ feature }}
            </li>
          </ul>

          <div class="mt-8 hidden max-w-[520px] grid-cols-3 gap-2 sm:grid">
            <div v-for="(label, index) in ['Paste', 'Resolve', 'Download']" :key="label" class="sp-download-mini-step">
              <span>0{{ index + 1 }}</span>
              <strong>{{ label }}</strong>
            </div>
          </div>
        </div>

        <!-- This is the REAL, interactive downloader. No fake input controls. -->
        <div class="sp-reveal relative min-w-0">
          <div class="sp-platform-aura pointer-events-none absolute left-1/2 top-1/2 h-[410px] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[105px]" />

          <div class="sp-download-workspace relative overflow-hidden rounded-[30px] p-[1px] shadow-pop">
            <div class="relative overflow-hidden rounded-[29px] border border-white/10 bg-[#0a0f17] text-white">
              <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[.095]" />
              <div class="sp-platform-sheen pointer-events-none absolute inset-0" />

              <header class="relative flex flex-col gap-4 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div class="flex min-w-0 items-center gap-3">
                  <span class="sp-platform-logo flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] text-sm font-black">
                    {{ meta.icon }}
                  </span>
                  <div class="min-w-0">
                    <p class="truncate text-[9px] font-black uppercase tracking-[.16em] text-white/38">Interactive downloader</p>
                    <p class="mt-1 truncate text-[13px] font-bold text-white/92">{{ meta.product }}</p>
                  </div>
                </div>

                <span class="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[.055] px-3 py-1.5 text-[9px] font-semibold text-white/58">
                  <span class="h-1.5 w-1.5 rounded-full" :class="loading ? 'animate-pulse bg-amber-300' : resolved ? 'bg-emerald-300' : 'sp-platform-dot'" />
                  {{ statusText }}
                </span>
              </header>

              <div class="relative p-4 sm:p-5">
                <!-- Explicit start-here treatment makes it obvious this is a real form. -->
                <div class="sp-download-start relative rounded-[20px] border border-white/10 bg-white/[.045] p-3 sm:p-4">
                  <div class="mb-3 flex flex-wrap items-end justify-between gap-3 px-1">
                    <div>
                      <p class="sp-platform-start-label text-[8px] font-black uppercase tracking-[.16em]">01 · Start here</p>
                      <h2 class="mt-1.5 text-[14px] font-bold text-white sm:text-[15px]">{{ meta.inputTitle }}</h2>
                    </div>
                    <p class="text-[9px] text-white/34">{{ meta.inputHint }}</p>
                  </div>
                  <slot name="input" />
                </div>

                <div v-if="errorMessage" class="mt-3 flex flex-col gap-3 rounded-[16px] border border-red-400/20 bg-red-400/[.07] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div class="min-w-0">
                    <p class="text-[10px] font-bold text-red-200">Could not resolve this link</p>
                    <p class="mt-1 text-[10px] leading-5 text-red-100/58">{{ errorMessage }}</p>
                  </div>
                  <button type="button" class="shrink-0 rounded-[10px] border border-red-300/15 bg-white/[.06] px-3 py-2 text-[9px] font-bold text-white/75 transition hover:bg-white/[.1] hover:text-white" @click="emit('reset')">
                    Start over
                  </button>
                </div>

                <div class="mt-4">
                  <Transition name="sp-workspace" mode="out-in">
                    <div v-if="loading" key="loading" class="sp-download-state sp-scanline relative min-h-[280px] overflow-hidden rounded-[20px] border border-white/10 bg-white/[.035] p-5 sm:min-h-[320px]">
                      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,var(--sp-platform-soft),transparent_42%)]" />
                      <div class="relative flex min-h-[240px] flex-col items-center justify-center text-center sm:min-h-[280px]">
                        <div class="sp-resolver-ring relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[.04]">
                          <span class="sp-platform-logo flex h-12 w-12 items-center justify-center rounded-[15px] text-base font-black">{{ meta.icon }}</span>
                        </div>
                        <p class="mt-6 text-[14px] font-bold text-white">Reading the real media…</p>
                        <p class="mt-2 max-w-md text-[11px] leading-6 text-white/42">We are contacting the media service and preparing the actual preview and formats. Nothing below is a fake player.</p>
                        <div class="mt-6 h-1.5 w-full max-w-[330px] overflow-hidden rounded-full bg-white/8"><div class="sp-platform-progress h-full" /></div>
                      </div>
                    </div>

                    <div v-else-if="resolved" key="result" class="sp-download-state">
                      <div class="mb-3 flex items-center justify-between gap-3 px-1">
                        <div>
                          <p class="text-[8px] font-black uppercase tracking-[.16em] text-emerald-300">02 · Real content resolved</p>
                          <p class="mt-1 text-[11px] text-white/45">Choose the actual media and quality returned by the service.</p>
                        </div>
                        <span class="hidden rounded-full border border-emerald-300/15 bg-emerald-300/[.07] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.12em] text-emerald-200 sm:inline-flex">Live result</span>
                      </div>
                      <slot name="result" />
                    </div>

                    <div v-else key="idle" class="sp-download-state relative overflow-hidden rounded-[20px] border border-dashed border-white/12 bg-white/[.025] p-5 sm:p-6">
                      <div class="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[var(--sp-platform-soft)] blur-[70px]" />
                      <div class="relative grid min-h-[250px] gap-6 sm:grid-cols-[.8fr_1.2fr] sm:items-center">
                        <div class="sp-idle-preview relative mx-auto w-full max-w-[220px] overflow-hidden rounded-[18px] border border-white/10 bg-black/20 p-3" :class="platform === 'tiktok' ? 'aspect-[9/13]' : 'aspect-video sm:aspect-[4/3]'">
                          <div class="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,.035),transparent)]" />
                          <div class="flex h-full flex-col justify-between rounded-[13px] border border-white/[.06] p-3">
                            <div class="flex items-center justify-between"><span class="sp-platform-logo flex h-8 w-8 items-center justify-center rounded-[10px] text-[11px] font-black">{{ meta.icon }}</span><span class="rounded-full border border-white/10 bg-white/[.04] px-2 py-1 text-[7px] uppercase tracking-[.12em] text-white/32">preview</span></div>
                            <div>
                              <div class="space-y-2"><span class="block h-2 w-[72%] rounded-full bg-white/10"/><span class="block h-2 w-[48%] rounded-full bg-white/[.06]"/></div>
                              <div class="mt-4 h-1 overflow-hidden rounded-full bg-white/8"><div class="sp-platform-progress h-full" /></div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p class="sp-platform-start-label text-[8px] font-black uppercase tracking-[.16em]">Result area</p>
                          <h3 class="mt-2 text-[18px] font-bold tracking-[-.025em] text-white sm:text-[20px]">{{ meta.idleTitle }}</h3>
                          <p class="mt-3 max-w-lg text-[11px] leading-6 text-white/44">{{ meta.idleBody }}</p>
                          <div class="mt-5 flex flex-wrap gap-2">
                            <span v-for="chip in meta.chips" :key="chip" class="sp-platform-pill">{{ chip }}</span>
                          </div>
                          <p class="mt-5 inline-flex items-center gap-2 text-[9px] font-semibold text-white/30"><span class="sp-platform-dot h-1.5 w-1.5 rounded-full" /> {{ meta.preview }} · updates after resolve</p>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>

              <footer class="relative grid grid-cols-3 border-t border-white/10 bg-black/10 text-center">
                <div v-for="(item, index) in ['Paste a link', 'Review real content', 'Save a format']" :key="item" class="px-2 py-3" :class="index === 1 ? 'border-x border-white/10' : ''">
                  <p class="text-[7px] font-black uppercase tracking-[.14em] text-white/22">0{{ index + 1 }}</p>
                  <p class="mt-1 text-[9px] font-semibold text-white/52">{{ item }}</p>
                </div>
              </footer>
            </div>
          </div>

          <div class="sp-float-delayed absolute -bottom-4 -left-3 hidden rounded-[13px] border border-line bg-elevated px-3 py-2 shadow-soft sm:block">
            <p class="text-[8px] font-bold uppercase tracking-[.12em] text-fg-subtle">Real workspace</p>
            <p class="mt-1 text-[10px] font-semibold text-fg">Input + resolved content in one place</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
