<script setup lang="ts">
const lastUpdated = ref('')

onMounted(() => {
  lastUpdated.value = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())
})
</script>

<template>
  <section class="sp-spotlight relative overflow-hidden border-b border-line bg-surface">
    <div class="sp-quiet-grid pointer-events-none absolute inset-x-0 top-0 h-[620px] opacity-[0.32]" />
    <div class="pointer-events-none absolute -right-16 top-12 hidden select-none font-display text-[10rem] font-semibold leading-none tracking-[-0.07em] text-fg/[0.025] xl:block" aria-hidden="true">DESK</div>

    <div class="sp-container-wide relative py-12 sm:py-16 lg:py-20">
      <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-[10px] font-semibold text-fg-subtle">
        <NuxtLink to="/" class="transition hover:text-fg">Home</NuxtLink><span>/</span><span class="text-fg-muted">News</span>
      </nav>

      <div class="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)] lg:items-center lg:gap-16">
        <div>
          <div class="sp-kicker text-danger">Live global desk</div>
          <h1 class="mt-5 max-w-4xl font-display text-[clamp(3.4rem,6.4vw,5.7rem)] font-[650] leading-[0.91] tracking-[-0.064em] text-fg">
            The world,
            <span class="relative inline-block italic text-accent">
              clearly.
              <span class="absolute -bottom-1 left-1 right-0 h-[5px] -rotate-1 rounded-full bg-accent/12" aria-hidden="true" />
            </span>
          </h1>
          <p class="mt-7 max-w-[690px] text-[15px] leading-7 text-fg-muted sm:text-[17px]">
            Breaking developments, global affairs, business, technology and science—organized as an editorial desk instead of an endless feed.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#top-stories" class="sp-btn h-12 bg-fg px-5 text-sm text-surface-2 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
              Read top stories <span aria-hidden="true">↓</span>
            </a>
            <NuxtLink to="/news/category/world" class="sp-btn sp-btn-secondary h-12 px-5 text-sm">Browse world news <span aria-hidden="true">↗</span></NuxtLink>
          </div>

          <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-subtle">
            <span class="inline-flex items-center gap-2"><span class="relative flex h-2 w-2"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-30"/><span class="relative h-2 w-2 rounded-full bg-danger"/></span>Breaking</span>
            <span>Global regions</span><span>Sources visible</span><span>Fast timestamps</span>
          </div>
        </div>

        <div class="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:ml-auto">
          <div class="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[85px]" />
          <div class="sp-float relative rotate-[1.25deg] rounded-[24px] p-[1px] sp-gradient-ring">
            <div class="sp-glass rounded-[23px] p-3">
              <div class="overflow-hidden rounded-[18px] border border-line bg-surface-2">
                <div class="flex items-center justify-between border-b border-line px-4 py-3">
                  <div>
                    <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-fg-subtle">Newsroom pulse</p>
                    <p class="mt-1 text-[12px] font-semibold text-fg">Coverage updated throughout the day</p>
                  </div>
                  <span class="flex h-9 w-9 items-center justify-center rounded-[12px] bg-positive-soft text-positive">✓</span>
                </div>

                <div class="grid grid-cols-3 divide-x divide-line border-b border-line">
                  <div class="p-4">
                    <p class="font-display text-[1.7rem] font-semibold leading-none text-fg">24h</p>
                    <p class="mt-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-fg-subtle">Desk cycle</p>
                  </div>
                  <div class="p-4">
                    <p class="font-display text-[1.7rem] font-semibold leading-none text-fg">Live</p>
                    <p class="mt-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-fg-subtle">Updates</p>
                  </div>
                  <div class="p-4">
                    <p class="font-display text-[1.7rem] font-semibold leading-none text-fg">Open</p>
                    <p class="mt-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-fg-subtle">Sources</p>
                  </div>
                </div>

                <div class="p-4">
                  <div class="flex items-center justify-between text-[10px] font-semibold text-fg-muted"><span>Coverage signal</span><span class="text-positive">Active</span></div>
                  <div class="mt-3 flex h-12 items-end gap-1.5">
                    <span v-for="(height, index) in [35, 58, 43, 72, 54, 88, 66, 96, 78, 90, 70, 82]" :key="index" class="flex-1 rounded-t-sm bg-accent/20 transition-all duration-300 hover:bg-accent/55" :style="{ height: `${height}%` }" />
                  </div>
                  <div class="mt-4 flex items-center justify-between text-[9px] text-fg-subtle">
                    <span v-if="lastUpdated">Refreshed {{ lastUpdated }}</span>
                    <span class="inline-flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-positive sp-pulse-soft" /> newsroom online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="sp-float-delayed absolute -bottom-5 -left-4 hidden rounded-[14px] border border-line bg-elevated px-3.5 py-2.5 shadow-soft sm:block">
            <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-danger">Live desk</p>
            <p class="mt-1 text-[11px] font-semibold text-fg">Signal over spectacle.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
