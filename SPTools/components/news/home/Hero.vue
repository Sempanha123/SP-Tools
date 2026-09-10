<script setup lang="ts">
const lastUpdated = ref('')

onMounted(() => {
  lastUpdated.value = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())
})
</script>

<template>
  <section class="relative overflow-hidden border-b border-line bg-surface py-5 sm:py-7">
    <div class="sp-container-wide">
      <div class="sp-noise sp-reveal relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0f17] px-5 py-7 text-white shadow-pop sm:px-8 sm:py-9 lg:px-10 lg:py-11">
        <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[.08]" />
        <div class="pointer-events-none absolute -left-28 -top-40 h-[440px] w-[440px] rounded-full bg-violet-500/22 blur-[120px]" />
        <div class="pointer-events-none absolute right-[-10rem] top-[-6rem] h-[420px] w-[420px] rounded-full bg-cyan-400/16 blur-[120px]" />
        <div class="pointer-events-none absolute bottom-[-14rem] left-[42%] h-[360px] w-[360px] rounded-full bg-amber-400/8 blur-[110px]" />

        <div class="relative grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
          <div>
            <div class="flex flex-wrap items-center gap-3 text-[9px] font-bold uppercase tracking-[.16em] text-white/38">
              <span class="inline-flex items-center gap-2 text-red-300"><span class="h-1.5 w-1.5 rounded-full bg-red-400 sp-pulse-soft" /> Live global desk</span>
              <span>•</span>
              <span>SP-Tools editorial</span>
            </div>

            <h1 class="mt-5 max-w-[820px] font-display text-[clamp(3.8rem,7.2vw,7.5rem)] font-[650] leading-[.78] tracking-[-.074em] text-white">
              Clarity in a
              <span class="block text-white/38">noisy world.</span>
            </h1>

            <p class="mt-7 max-w-2xl text-[14px] leading-7 text-white/56 sm:text-[16px]">
              Breaking developments, global affairs, technology, business and regional coverage—presented with stronger hierarchy, visible context and less feed clutter.
            </p>

            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#top-stories" class="sp-shimmer inline-flex h-12 items-center justify-center gap-2 rounded-[13px] bg-white px-5 text-[12px] font-bold text-[#0a0f17] transition hover:-translate-y-0.5">
                Read top stories <span>↓</span>
              </a>
              <NuxtLink to="/news/category/world" class="inline-flex h-12 items-center justify-center gap-2 rounded-[13px] border border-white/12 bg-white/[.055] px-5 text-[12px] font-semibold text-white/78 backdrop-blur transition hover:bg-white/[.085] hover:text-white">
                Browse world news <span>↗</span>
              </NuxtLink>
            </div>

            <div class="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[9px] font-semibold uppercase tracking-[.12em] text-white/32">
              <span class="inline-flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-violet-300" /> breaking</span>
              <span class="inline-flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-cyan-300" /> regional</span>
              <span class="inline-flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-emerald-300" /> sourced</span>
            </div>
          </div>

          <div class="relative mx-auto w-full max-w-[560px] lg:mx-0">
            <div class="sp-orbit px-4 py-8">
              <div class="sp-border-flow sp-depth-hover relative rounded-[25px] p-[1px]">
                <div class="overflow-hidden rounded-[24px] border border-white/10 bg-white/[.055] backdrop-blur-xl">
                  <div class="flex items-center justify-between border-b border-white/8 px-4 py-3">
                    <div>
                      <p class="text-[8px] font-bold uppercase tracking-[.15em] text-white/32">Newsroom signal</p>
                      <p class="mt-1 text-[11px] font-semibold text-white/82">Coverage moving in real time</p>
                    </div>
                    <span class="flex h-9 w-9 items-center justify-center rounded-[11px] border border-white/10 bg-white/[.06] text-emerald-300">✓</span>
                  </div>

                  <div class="grid grid-cols-3 border-b border-white/8">
                    <div class="p-4"><p class="text-[8px] uppercase tracking-[.12em] text-white/28">desk</p><p class="mt-1.5 text-[11px] font-bold text-violet-300">Global</p></div>
                    <div class="border-x border-white/8 p-4"><p class="text-[8px] uppercase tracking-[.12em] text-white/28">mode</p><p class="mt-1.5 text-[11px] font-bold text-cyan-300">Live</p></div>
                    <div class="p-4"><p class="text-[8px] uppercase tracking-[.12em] text-white/28">status</p><p class="mt-1.5 text-[11px] font-bold text-emerald-300">Open</p></div>
                  </div>

                  <div class="sp-scanline relative p-4">
                    <div class="flex items-end gap-1.5 h-28">
                      <span v-for="(height, index) in [28,44,35,61,47,76,58,91,72,83,64,94,70,86,54,79]" :key="index" class="flex-1 rounded-t-[3px] bg-gradient-to-t from-violet-500/15 to-cyan-300/45 transition duration-300 hover:to-violet-300" :style="{ height: `${height}%` }" />
                    </div>
                    <div class="mt-4 flex items-center justify-between text-[8px] uppercase tracking-[.11em] text-white/25">
                      <span>signal intensity</span><span v-if="lastUpdated">refreshed {{ lastUpdated }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sp-float absolute -right-2 top-[12%] hidden rounded-[13px] border border-white/10 bg-[#111722] px-3 py-2 shadow-pop sm:block">
                <p class="text-[8px] font-bold uppercase tracking-[.12em] text-red-300">Live</p>
                <p class="mt-1 text-[10px] font-semibold text-white/80">New signal detected</p>
              </div>
              <div class="sp-float-delayed absolute -bottom-1 -left-2 hidden rounded-[13px] border border-white/10 bg-[#111722] px-3 py-2 shadow-pop sm:block">
                <p class="text-[8px] font-bold uppercase tracking-[.12em] text-cyan-300">Editorial mode</p>
                <p class="mt-1 text-[10px] font-semibold text-white/80">Signal over spectacle</p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative mt-10 grid gap-3 border-t border-white/8 pt-5 text-[8px] font-bold uppercase tracking-[.13em] text-white/25 sm:grid-cols-4">
          <span>01 · breaking</span><span>02 · world</span><span>03 · business + tech</span><span>04 · context first</span>
        </div>
      </div>
    </div>
  </section>
</template>
