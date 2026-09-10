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
  <section class="relative overflow-hidden border-b border-line bg-surface">
    <div class="sp-quiet-grid pointer-events-none absolute inset-x-0 top-0 h-72 opacity-45" />
    <div class="pointer-events-none absolute left-[18%] top-[-180px] h-[330px] w-[520px] rounded-full bg-accent/10 blur-[120px]" />

    <div class="sp-container relative py-12 sm:py-16 lg:py-20">
      <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-[11px] font-semibold text-fg-subtle">
        <NuxtLink to="/" class="transition hover:text-fg">Home</NuxtLink>
        <span aria-hidden="true">/</span>
        <span class="text-fg-muted">News</span>
      </nav>

      <div class="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)] lg:items-end">
        <div>
          <div class="sp-kicker">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-35" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            Live global desk
          </div>

          <h1 class="mt-5 max-w-4xl font-display text-[clamp(3rem,6vw,4.6rem)] font-[650] leading-[0.98] tracking-[-0.055em] text-fg">
            Clear reporting on the stories shaping the world.
          </h1>

          <p class="mt-6 max-w-2xl text-[15px] leading-7 text-fg-muted sm:text-[17px]">
            Breaking developments, global affairs, business, technology, science and regional coverage—organized for fast reading without the visual noise.
          </p>

          <div class="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <a
              href="#top-stories"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-fg px-5 text-sm font-semibold text-surface-2 transition hover:opacity-90"
            >
              Read top stories
              <span aria-hidden="true">↓</span>
            </a>

            <NuxtLink
              to="/news/category/world"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-elevated px-5 text-sm font-semibold text-fg transition hover:bg-surface-3"
            >
              Browse world news
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>

        <div class="rounded-[16px] border border-line bg-elevated p-5 shadow-soft">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-fg-subtle">Newsroom status</p>
              <p class="mt-1.5 text-sm font-semibold text-fg">Coverage updated throughout the day</p>
            </div>
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-positive-soft text-positive">✓</span>
          </div>

          <div class="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
            <div>
              <p class="text-[11px] font-semibold text-fg">Breaking</p>
              <p class="mt-1 text-[10px] text-fg-subtle">Live updates</p>
            </div>
            <div class="border-x border-line">
              <p class="text-[11px] font-semibold text-fg">Global</p>
              <p class="mt-1 text-[10px] text-fg-subtle">Regions</p>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-fg">Transparent</p>
              <p class="mt-1 text-[10px] text-fg-subtle">Sources & time</p>
            </div>
          </div>

          <p v-if="lastUpdated" class="mt-4 text-[10px] text-fg-subtle">
            Last refreshed {{ lastUpdated }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
