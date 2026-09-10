<script setup lang="ts">
const {
  latestArticles,
  breakingArticles,
} = useNewsData()

const lastUpdated = ref('')

onMounted(() => {
  lastUpdated.value = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())
})

const visibleSignals = computed(() => {
  const breaking = breakingArticles.value.length
  const latest = latestArticles.value.length

  return {
    global: Math.max(1, latest),
    live: Math.max(1, breaking || Math.ceil(latest / 5)),
    open: Math.max(1, Math.ceil(latest / 2)),
  }
})

const bars = [
  38, 31, 46, 58, 49, 67, 54, 73,
  63, 79, 71, 84, 62, 78, 55, 86,
]
</script>

<template>
  <section class="sp-v23-hero-section relative overflow-hidden border-b border-line bg-surface py-5 sm:py-7">
    <div class="sp-container-wide">
      <div class="sp-v23-hero-panel sp-reveal relative overflow-hidden rounded-[30px] border">
        <div class="sp-v23-hero-grid pointer-events-none absolute inset-0" />
        <div class="sp-v23-hero-aura pointer-events-none absolute inset-0" />

        <div class="relative grid items-center gap-10 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.02fr_.98fr] lg:gap-14 lg:px-10 lg:py-12">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-3 text-[9px] font-bold uppercase tracking-[.16em] text-fg-subtle">
              <span class="inline-flex items-center gap-2 text-accent">
                <span class="sp-v23-live-dot h-1.5 w-1.5 rounded-full" />
                Live global desk
              </span>

              <span>•</span>
              <span>SP-Tools editorial</span>
            </div>

            <h1 class="mt-5 max-w-[820px] font-display text-[clamp(3.8rem,7.2vw,7.4rem)] font-[660] leading-[.8] tracking-[-.074em] text-fg">
              Clarity in a
              <span class="sp-v23-hero-word block">
                noisy world.
              </span>
            </h1>

            <p class="mt-7 max-w-2xl text-[14px] leading-7 text-fg-muted sm:text-[16px]">
              Breaking developments, global affairs, technology, business and regional coverage—presented with stronger hierarchy, visible context and less feed clutter.
            </p>

            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#top-stories"
                class="sp-v23-primary-cta inline-flex h-12 items-center justify-center gap-2 rounded-[13px] px-5 text-[12px] font-bold text-white transition hover:-translate-y-0.5"
              >
                Read top stories
                <span>↓</span>
              </a>

              <NuxtLink
                to="/news/category/world"
                class="inline-flex h-12 items-center justify-center gap-2 rounded-[13px] border border-line bg-elevated/80 px-5 text-[12px] font-semibold text-fg-muted shadow-xs backdrop-blur transition hover:border-accent/20 hover:bg-surface-2 hover:text-fg"
              >
                Browse world news
                <span>↗</span>
              </NuxtLink>
            </div>

            <div class="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[9px] font-semibold uppercase tracking-[.12em] text-fg-subtle">
              <span class="inline-flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-danger" />
                breaking
              </span>

              <span class="inline-flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                regional
              </span>

              <span class="inline-flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-positive" />
                sourced
              </span>
            </div>
          </div>

          <div class="relative mx-auto w-full max-w-[590px] lg:mx-0">
            <div class="sp-v23-signal-orbit pointer-events-none absolute inset-[-24px]" />

            <div class="sp-v23-signal-card relative overflow-hidden rounded-[24px] border border-line">
              <header class="flex items-center justify-between gap-4 border-b border-line px-4 py-3.5 sm:px-5">
                <div class="flex min-w-0 items-center gap-3">
                  <span class="sp-v23-signal-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      aria-hidden="true"
                    >
                      <path d="M5 16v3M10 11v8M15 7v12M20 4v15" />
                    </svg>
                  </span>

                  <div class="min-w-0">
                    <p class="text-[13px] font-[790] tracking-[-.02em] text-fg">
                      Newsroom signal
                    </p>

                    <p class="mt-0.5 text-[9px] text-fg-muted">
                      Coverage moving in real time
                    </p>
                  </div>
                </div>

                <span class="sp-v23-live-badge">
                  <span class="h-1.5 w-1.5 rounded-full bg-danger" />
                  Live
                </span>
              </header>

              <div class="grid grid-cols-3 border-b border-line">
                <div class="px-4 py-3.5">
                  <p class="text-[8px] font-bold uppercase tracking-[.11em] text-fg-subtle">
                    Global
                  </p>
                  <p class="mt-1 text-[12px] font-[800] text-violet-600 dark:text-violet-300">
                    {{ visibleSignals.global }}
                  </p>
                </div>

                <div class="border-x border-line px-4 py-3.5">
                  <p class="text-[8px] font-bold uppercase tracking-[.11em] text-fg-subtle">
                    Live
                  </p>
                  <p class="mt-1 text-[12px] font-[800] text-cyan-600 dark:text-cyan-300">
                    {{ visibleSignals.live }}
                  </p>
                </div>

                <div class="px-4 py-3.5">
                  <p class="text-[8px] font-bold uppercase tracking-[.11em] text-fg-subtle">
                    Open
                  </p>
                  <p class="mt-1 text-[12px] font-[800] text-emerald-600 dark:text-emerald-300">
                    {{ visibleSignals.open }}
                  </p>
                </div>
              </div>

              <div class="relative px-4 pb-4 pt-5 sm:px-5 sm:pb-5">
                <div class="sp-v23-chart-guides pointer-events-none absolute inset-x-5 bottom-[44px] top-5" />

                <div class="relative flex h-32 items-end gap-1.5">
                  <span
                    v-for="(height, index) in bars"
                    :key="index"
                    class="sp-v23-chart-bar flex-1 rounded-t-[4px]"
                    :style="{ height: `${height}%` }"
                  />
                </div>

                <div class="mt-3 flex items-center justify-between text-[8px] font-medium text-fg-subtle">
                  <span>00h</span>
                  <span>06h</span>
                  <span>12h</span>
                  <span>18h</span>
                  <span>Now</span>
                </div>

                <div class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[13px] border border-line bg-surface-2 px-3 py-2.5">
                  <div class="flex items-center gap-2">
                    <span class="sp-v23-radio-icon">⌁</span>

                    <div>
                      <p class="text-[9px] font-bold text-fg">
                        Editorial mode
                      </p>
                      <p class="mt-0.5 text-[8px] text-fg-subtle">
                        Signal over spectacle
                      </p>
                    </div>
                  </div>

                  <p class="text-[8px] font-semibold text-positive">
                    Live
                    <span v-if="lastUpdated" class="text-fg-subtle">
                      · updated {{ lastUpdated }}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div class="sp-v23-float-card sp-v23-float-live absolute -right-2 top-[14%] hidden sm:block">
              <p class="text-[8px] font-bold uppercase tracking-[.12em] text-danger">
                Live
              </p>
              <p class="mt-1 text-[10px] font-semibold text-fg">
                New signal detected
              </p>
            </div>

            <div class="sp-v23-float-card sp-v23-float-mode absolute -bottom-3 -left-2 hidden sm:block">
              <p class="text-[8px] font-bold uppercase tracking-[.12em] text-cyan-600 dark:text-cyan-300">
                Editorial mode
              </p>
              <p class="mt-1 text-[10px] font-semibold text-fg">
                Signal over spectacle
              </p>
            </div>
          </div>
        </div>

        <div class="relative mx-5 grid gap-3 border-t border-line py-5 text-[8px] font-bold uppercase tracking-[.13em] text-fg-subtle sm:mx-8 sm:grid-cols-4 lg:mx-10">
          <span>01 · breaking</span>
          <span>02 · world</span>
          <span>03 · business + tech</span>
          <span>04 · context first</span>
        </div>
      </div>
    </div>
  </section>
</template>
