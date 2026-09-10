<script setup lang="ts">
const { tools } = useTools()

const openFaq = ref<number | null>(0)
const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

const featuredTools = computed(() => tools.slice(0, 5))
const primaryTool = computed(() => featuredTools.value[0])
const secondaryTools = computed(() => featuredTools.value.slice(1))

const faqs = [
  {
    question: 'Is SP-Tools free to use without registration?',
    answer:
      'Yes. The current tools are available directly in the browser without creating an SP-Tools account.',
  },
  {
    question: 'Which image formats are supported?',
    answer:
      'Each image tool lists its supported formats and file-size limit before processing, so you know exactly what can be uploaded.',
  },
  {
    question: 'Can I use SP-Tools on mobile and desktop?',
    answer:
      'Yes. The interface adapts to phones, tablets, laptops and desktop browsers with the same focused workflows.',
  },
  {
    question: 'What can I do from one place?',
    answer:
      'Remove backgrounds, upscale images, resolve supported public media links, and browse the SP-Tools global news section.',
  },
]

useSeoMeta({
  title: 'SP-Tools — Fast Image, Media and News Utilities',
  description:
    'A focused suite for image enhancement, supported media downloads and global news.',
})
</script>

<template>
  <main class="min-h-screen bg-surface text-fg">
    <!-- CINEMATIC PRODUCT HERO -->
    <section class="sp-prism-field sp-noise relative border-b border-line">
      <div class="sp-ambient-ring -right-24 top-20 hidden h-[390px] w-[390px] lg:block" />
      <div class="sp-ambient-ring -left-40 top-[28rem] hidden h-[280px] w-[280px] opacity-60 lg:block" style="animation-direction:reverse;animation-duration:24s" />

      <div class="sp-container-wide relative py-16 sm:py-20 lg:py-24">
        <div class="grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-16 xl:gap-20">
          <div class="relative z-10 sp-reveal-left">
            <div class="sp-kicker">One command center for everyday work</div>

            <h1 class="mt-6 max-w-[780px] text-[clamp(3.4rem,7vw,6.6rem)] font-[790] leading-[.86] tracking-[-.078em] text-fg">
              Create faster.
              <span class="sp-gradient-text block">Stay focused.</span>
            </h1>

            <p class="mt-7 max-w-[620px] text-[16px] leading-7 text-fg-muted sm:text-[18px] sm:leading-8">
              Powerful image tools, clean media workflows and a focused global news desk—wrapped in one fast interface that feels more like a product than a collection of utilities.
            </p>

            <div class="mt-9 flex flex-col gap-3 sm:flex-row">
              <NuxtLink to="/tools" class="sp-btn sp-btn-primary sp-shimmer h-12 w-full px-6 text-sm sm:w-auto">
                Launch workspace <span aria-hidden="true">→</span>
              </NuxtLink>
              <NuxtLink to="/news" class="sp-btn sp-btn-secondary h-12 w-full px-6 text-sm sm:w-auto">
                Open global news <span aria-hidden="true">↗</span>
              </NuxtLink>
            </div>

            <div class="mt-8 flex flex-wrap gap-2.5">
              <span class="sp-chip"><span class="h-1.5 w-1.5 rounded-full bg-positive sp-glow-dot text-positive" /> No account</span>
              <span class="sp-chip"><span class="h-1.5 w-1.5 rounded-full bg-accent sp-glow-dot text-accent" /> AI image tools</span>
              <span class="sp-chip"><span class="h-1.5 w-1.5 rounded-full bg-accent-2 sp-glow-dot text-accent-2" /> Media utilities</span>
            </div>
          </div>

          <!-- Aurora command center -->
          <div class="relative mx-auto w-full max-w-[780px] lg:mx-0">
            <div class="pointer-events-none absolute left-[52%] top-[46%] h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[100px]" />
            <div class="sp-orbit relative px-3 py-8 sm:px-7">
              <div class="sp-border-flow sp-depth-hover relative rounded-[28px] p-[1px]">
                <div class="sp-lens-card overflow-hidden rounded-[27px] p-2.5 sm:p-3">
                  <div class="overflow-hidden rounded-[21px] border border-line bg-surface-2">
                    <div class="flex h-12 items-center justify-between border-b border-line bg-surface-3/60 px-4">
                      <div class="flex items-center gap-1.5">
                        <span class="h-2.5 w-2.5 rounded-full bg-danger/55" />
                        <span class="h-2.5 w-2.5 rounded-full bg-[#e5aa48]/60" />
                        <span class="h-2.5 w-2.5 rounded-full bg-positive/60" />
                      </div>
                      <div class="flex items-center gap-2 rounded-full border border-line bg-elevated px-3 py-1 text-[9px] font-semibold text-fg-subtle">
                        <span class="h-1.5 w-1.5 rounded-full bg-positive sp-pulse-soft" /> SP workspace / live
                      </div>
                      <span class="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-elevated text-[11px] text-accent">✦</span>
                    </div>

                    <div class="grid gap-3 p-3 sm:grid-cols-7 sm:p-4">
                      <NuxtLink
                        v-if="primaryTool"
                        :to="primaryTool.href"
                        class="group sp-scanline relative min-h-[340px] overflow-hidden rounded-[19px] border border-line bg-[#10141d] p-5 text-white shadow-soft sm:col-span-4"
                      >
                        <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[.12]" />
                        <div class="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-500/25 blur-[70px] transition duration-700 group-hover:scale-125" />
                        <div class="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-cyan-500/18 blur-[80px]" />
                        <div class="relative flex h-full flex-col">
                          <div class="flex items-start justify-between">
                            <span class="flex h-12 w-12 items-center justify-center rounded-[15px] border border-white/10 bg-white/[.07] text-violet-300 backdrop-blur">
                              <svg class="h-5 w-5" viewBox="0 0 24 24" :fill="primaryTool.iconStyle === 'fill' ? 'currentColor' : 'none'" :stroke="primaryTool.iconStyle === 'stroke' ? 'currentColor' : 'none'" stroke-width="1.7" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" :d="primaryTool.icon" />
                              </svg>
                            </span>
                            <span class="sp-chip !border-white/10 !bg-white/[.06] !text-white/55">AI workflow</span>
                          </div>

                          <div class="mt-auto">
                            <p class="text-[9px] font-bold uppercase tracking-[.18em] text-violet-300">Featured action</p>
                            <h2 class="mt-3 max-w-sm text-[2.15rem] font-[730] leading-[.98] tracking-[-.05em] text-white">{{ primaryTool.name }}</h2>
                            <p class="mt-3 max-w-md text-[12px] leading-6 text-white/58">{{ primaryTool.description }}</p>

                            <div class="mt-6 grid grid-cols-3 gap-2">
                              <div class="rounded-[12px] border border-white/10 bg-white/[.055] p-2.5">
                                <p class="text-[8px] uppercase tracking-[.12em] text-white/35">input</p>
                                <p class="mt-1 text-[10px] font-semibold text-white/80">Image</p>
                              </div>
                              <div class="rounded-[12px] border border-white/10 bg-white/[.055] p-2.5">
                                <p class="text-[8px] uppercase tracking-[.12em] text-white/35">mode</p>
                                <p class="mt-1 text-[10px] font-semibold text-violet-300">AI</p>
                              </div>
                              <div class="rounded-[12px] border border-white/10 bg-white/[.055] p-2.5">
                                <p class="text-[8px] uppercase tracking-[.12em] text-white/35">state</p>
                                <p class="mt-1 text-[10px] font-semibold text-emerald-300">Ready</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </NuxtLink>

                      <div class="grid gap-3 sm:col-span-3">
                        <NuxtLink
                          v-for="(tool, index) in secondaryTools.slice(0, 2)"
                          :key="tool.slug"
                          :to="tool.href"
                          class="sp-lens-card group relative min-h-[162px] overflow-hidden rounded-[18px] p-4 transition duration-300 hover:-translate-y-1"
                        >
                          <div class="relative flex h-full flex-col justify-between">
                            <div class="flex items-center justify-between">
                              <span class="flex h-9 w-9 items-center justify-center rounded-[12px] border border-line bg-surface-3" :style="{ color: tool.accent }">
                                <svg class="h-4 w-4" viewBox="0 0 24 24" :fill="tool.iconStyle === 'fill' ? 'currentColor' : 'none'" :stroke="tool.iconStyle === 'stroke' ? 'currentColor' : 'none'" stroke-width="1.7" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" :d="tool.icon" /></svg>
                              </span>
                              <span class="text-[9px] font-bold tracking-[.12em] text-fg-subtle">0{{ index + 2 }}</span>
                            </div>
                            <div>
                              <p class="text-[10px] font-bold uppercase tracking-[.13em] text-accent">{{ index === 0 ? 'Enhance' : 'Resolve' }}</p>
                              <p class="mt-2 text-[16px] font-[690] leading-tight text-fg">{{ tool.shortName }}</p>
                              <p class="mt-1.5 text-[10px] leading-5 text-fg-muted">{{ tool.tagline }}</p>
                            </div>
                          </div>
                        </NuxtLink>
                      </div>
                    </div>

                    <div class="grid grid-cols-3 border-t border-line bg-surface-3/45 px-4 py-3 text-center">
                      <div><p class="text-[8px] uppercase tracking-[.12em] text-fg-subtle">workflows</p><p class="mt-1 text-[11px] font-bold text-fg">{{ tools.length }}</p></div>
                      <div class="border-x border-line"><p class="text-[8px] uppercase tracking-[.12em] text-fg-subtle">install</p><p class="mt-1 text-[11px] font-bold text-positive">None</p></div>
                      <div><p class="text-[8px] uppercase tracking-[.12em] text-fg-subtle">interface</p><p class="mt-1 text-[11px] font-bold text-accent">Focused</p></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sp-float-delayed absolute -left-2 top-[22%] hidden rounded-[14px] border border-line bg-elevated px-3 py-2 shadow-soft sm:block">
                <p class="text-[8px] font-bold uppercase tracking-[.12em] text-fg-subtle">Fast path</p>
                <p class="mt-1 text-[10px] font-semibold text-fg">Input → result</p>
              </div>
              <div class="sp-float absolute -bottom-1 right-3 hidden rounded-[14px] border border-line bg-elevated px-3 py-2 shadow-soft sm:block">
                <p class="inline-flex items-center gap-1.5 text-[10px] font-semibold text-fg"><span class="h-1.5 w-1.5 rounded-full bg-positive sp-pulse-soft" /> System ready</p>
              </div>
            </div>
          </div>
        </div>

        <div class="sp-hero-rule mt-16" />
        <div class="mt-5 grid gap-3 text-[10px] font-semibold uppercase tracking-[.12em] text-fg-subtle sm:grid-cols-4">
          <span>01 · image intelligence</span><span>02 · media workflows</span><span>03 · global coverage</span><span>04 · one visual system</span>
        </div>
      </div>
    </section>

    <!-- CAPABILITY BENTO -->
    <section class="border-b border-line bg-surface-2 py-[72px] sm:py-24">
      <div class="sp-container-wide">
        <div class="sp-reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div class="sp-kicker">Capability map</div>
            <h2 class="mt-4 max-w-3xl text-[clamp(2.4rem,5vw,4.4rem)] font-[760] leading-[.92] tracking-[-.064em] text-fg">One place. Different jobs. <span class="text-fg-subtle">No visual chaos.</span></h2>
          </div>
          <NuxtLink to="/tools" class="group inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition hover:text-fg">Explore every workflow <span class="sp-hover-arrow text-accent">↗</span></NuxtLink>
        </div>

        <div class="sp-stagger mt-10 grid auto-rows-[190px] gap-4 md:grid-cols-6">
          <NuxtLink
            v-for="(tool, index) in featuredTools"
            :key="tool.slug"
            :to="tool.href"
            class="sp-lens-card sp-depth-hover group relative overflow-hidden rounded-[22px] p-5"
            :class="index === 0 ? 'md:col-span-3 md:row-span-2' : index === 1 ? 'md:col-span-3' : index === 2 ? 'md:col-span-2' : index === 3 ? 'md:col-span-2' : 'md:col-span-2'"
          >
            <div class="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full blur-3xl opacity-25 transition duration-500 group-hover:scale-125" :style="{ background: tool.accent }" />
            <div class="relative flex h-full flex-col">
              <div class="flex items-start justify-between">
                <span class="flex h-11 w-11 items-center justify-center rounded-[14px] border border-line bg-surface-3" :style="{ color: tool.accent }"><svg class="h-5 w-5" viewBox="0 0 24 24" :fill="tool.iconStyle === 'fill' ? 'currentColor' : 'none'" :stroke="tool.iconStyle === 'stroke' ? 'currentColor' : 'none'" stroke-width="1.7" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" :d="tool.icon" /></svg></span>
                <span class="text-[9px] font-bold uppercase tracking-[.14em] text-fg-subtle">0{{ index + 1 }}</span>
              </div>
              <div class="mt-auto">
                <p class="text-[9px] font-bold uppercase tracking-[.13em] text-accent">{{ index < 2 ? 'AI image system' : 'Media workflow' }}</p>
                <h3 class="mt-2 font-[720] leading-[1.04] tracking-[-.035em] text-fg" :class="index === 0 ? 'text-[2rem]' : 'text-[18px]'">{{ tool.name }}</h3>
                <p class="mt-2 max-w-md text-[11px] leading-5 text-fg-muted">{{ tool.tagline }}</p>
              </div>
              <span class="sp-hover-arrow absolute bottom-0 right-0 text-fg-subtle">↗</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- PREMIUM DARK STORY SECTION -->
    <section class="relative overflow-hidden border-b border-line bg-[#0b0f17] py-[72px] text-white sm:py-24">
      <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[.08]" />
      <div class="pointer-events-none absolute -left-32 top-[-180px] h-[420px] w-[420px] rounded-full bg-violet-500/20 blur-[120px]" />
      <div class="pointer-events-none absolute -right-20 bottom-[-180px] h-[380px] w-[380px] rounded-full bg-cyan-400/14 blur-[110px]" />
      <div class="sp-container-wide relative grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
        <div class="sp-reveal-left">
          <p class="text-[10px] font-bold uppercase tracking-[.18em] text-violet-300">Designed to disappear into your workflow</p>
          <h2 class="mt-5 max-w-2xl text-[clamp(2.8rem,5.5vw,5.2rem)] font-[760] leading-[.88] tracking-[-.07em] text-white">Less interface.<br><span class="text-white/38">More momentum.</span></h2>
          <p class="mt-6 max-w-xl text-[14px] leading-7 text-white/55">The experience is built around clear actions, visible state and restrained motion—so the site feels alive without fighting for your attention.</p>
          <div class="mt-8 flex flex-wrap gap-2"><span class="sp-chip !border-white/10 !bg-white/[.05] !text-white/55">Fast feedback</span><span class="sp-chip !border-white/10 !bg-white/[.05] !text-white/55">Consistent controls</span><span class="sp-chip !border-white/10 !bg-white/[.05] !text-white/55">Motion-aware</span></div>
        </div>

        <div class="sp-stagger grid gap-3 sm:grid-cols-2">
          <div class="sp-scanline min-h-[330px] rounded-[24px] border border-white/10 bg-white/[.055] p-6 backdrop-blur sm:row-span-2 sm:min-h-[500px]">
            <div class="flex h-full flex-col"><span class="flex h-12 w-12 items-center justify-center rounded-[15px] border border-white/10 bg-white/[.07] text-violet-300">⌘</span><div class="mt-auto"><p class="text-[10px] font-bold uppercase tracking-[.15em] text-violet-300">01 · Focus</p><h3 class="mt-3 text-[2rem] font-[700] leading-[1] tracking-[-.04em]">One action gets the spotlight.</h3><p class="mt-4 text-[12px] leading-6 text-white/48">Important controls are strong. Supporting content is quieter. Everything else waits its turn.</p><div class="mt-7 h-1.5 overflow-hidden rounded-full bg-white/8"><div class="sp-progress-beam h-full rounded-full" /></div></div></div>
          </div>
          <div class="min-h-[240px] rounded-[22px] border border-white/10 bg-white/[.04] p-6"><p class="text-[10px] font-bold uppercase tracking-[.15em] text-cyan-300">02 · Motion</p><h3 class="mt-3 text-[21px] font-[690]">Quiet motion, clear feedback.</h3><p class="mt-3 text-[12px] leading-6 text-white/48">Hover depth, progress cues and live state make the interface feel responsive rather than decorative.</p></div>
          <div class="min-h-[240px] rounded-[22px] border border-white/10 bg-gradient-to-br from-violet-500/14 to-cyan-500/8 p-6"><p class="text-[10px] font-bold uppercase tracking-[.15em] text-violet-300">03 · System</p><h3 class="mt-3 text-[21px] font-[690]">Tools and News share one language.</h3><p class="mt-3 text-[12px] leading-6 text-white/48">Product interfaces stay sharp and sans-serif; editorial moments get more expressive without breaking the brand.</p></div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="border-b border-line bg-surface py-[72px] sm:py-24">
      <div class="sp-container-wide grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
        <div class="sp-reveal-left lg:sticky lg:top-28 lg:self-start">
          <div class="sp-kicker">Questions</div>
          <h2 class="mt-4 max-w-md text-[clamp(2.3rem,4vw,3.8rem)] font-[740] leading-[.95] tracking-[-.058em] text-fg">Everything useful. <span class="text-fg-subtle">Nothing buried.</span></h2>
          <p class="mt-5 max-w-md text-[14px] leading-7 text-fg-muted">Quick answers about access, formats, devices and what SP-Tools can do today.</p>
        </div>

        <div class="sp-reveal overflow-hidden rounded-[22px] border border-line bg-elevated shadow-lift">
          <div v-for="(item, index) in faqs" :key="item.question" class="transition-colors duration-300" :class="[index ? 'border-t border-line' : '', openFaq === index ? 'bg-accent-soft/50' : 'hover:bg-surface-3/50']">
            <button type="button" class="group grid w-full grid-cols-[42px_minmax(0,1fr)_34px] items-center gap-3 px-5 py-5 text-left sm:px-6" :aria-expanded="openFaq === index" @click="toggleFaq(index)">
              <span class="text-[9px] font-bold tracking-[.12em] text-fg-subtle">0{{ index + 1 }}</span>
              <span class="text-[15px] font-[660] text-fg">{{ item.question }}</span>
              <span class="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface-2 text-fg-subtle transition duration-300" :class="openFaq === index ? 'rotate-45 border-accent/30 text-accent' : 'group-hover:border-line-strong group-hover:text-fg'">+</span>
            </button>
            <Transition enter-active-class="transition duration-250 ease-out" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150" leave-to-class="opacity-0 -translate-y-1">
              <div v-if="openFaq === index" class="grid grid-cols-[42px_minmax(0,1fr)] gap-3 px-5 pb-6 sm:px-6"><span/><p class="max-w-2xl text-[13px] leading-7 text-fg-muted">{{ item.answer }}</p></div>
            </Transition>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
