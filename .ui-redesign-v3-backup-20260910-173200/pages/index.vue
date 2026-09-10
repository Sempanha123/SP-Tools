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
    <!-- HERO -->
    <section class="sp-spotlight relative border-b border-line bg-surface">
      <div class="sp-quiet-grid pointer-events-none absolute inset-x-0 top-0 h-[720px] opacity-[0.42]" />
      <div class="pointer-events-none absolute -right-28 top-28 h-56 w-56 rounded-full border border-accent/10" />
      <div class="pointer-events-none absolute -right-14 top-42 h-28 w-28 rounded-full border border-accent-2/10" />

      <div class="sp-container-wide relative py-14 sm:py-20 lg:py-24">
        <div class="grid items-center gap-12 lg:grid-cols-[.92fr_1.08fr] lg:gap-16">
          <div class="relative z-10">
            <div class="sp-kicker">One focused web toolkit</div>

            <h1 class="mt-6 max-w-[720px] text-[clamp(3.2rem,6.2vw,5.5rem)] font-[760] leading-[0.94] tracking-[-0.067em] text-fg">
              Useful tools for
              <span class="relative inline-block">
                <span class="relative z-10 bg-gradient-to-r from-accent via-accent to-accent-2 bg-clip-text text-transparent">real work.</span>
                <span class="absolute inset-x-0 -bottom-1 h-[5px] -rotate-1 rounded-full bg-accent/12" aria-hidden="true" />
              </span>
            </h1>

            <p class="mt-7 max-w-[610px] text-[16px] leading-7 text-fg-muted sm:text-[18px]">
              Image tools, practical media downloaders and a focused global news desk—designed to get you from intent to result without visual clutter.
            </p>

            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <NuxtLink to="/tools" class="sp-btn sp-btn-primary sp-shimmer h-12 w-full px-6 text-sm sm:w-auto">
                Explore all tools
                <span aria-hidden="true">→</span>
              </NuxtLink>
              <NuxtLink to="/news" class="sp-btn sp-btn-secondary h-12 w-full px-6 text-sm sm:w-auto">
                Open global news
                <span aria-hidden="true" class="text-fg-subtle">↗</span>
              </NuxtLink>
            </div>

            <div class="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-[12px] font-medium text-fg-muted">
              <span class="inline-flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-positive shadow-[0_0_0_4px_var(--sp-positive-soft)]" /> No account required</span>
              <span class="inline-flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-positive shadow-[0_0_0_4px_var(--sp-positive-soft)]" /> Browser-first</span>
              <span class="inline-flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-positive shadow-[0_0_0_4px_var(--sp-positive-soft)]" /> Mobile ready</span>
            </div>
          </div>

          <!-- Product preview / bento -->
          <div class="relative mx-auto w-full max-w-[720px] lg:mx-0">
            <div class="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[90px]" />
            <div class="sp-float relative rounded-[24px] p-[1px] sp-gradient-ring">
              <div class="sp-glass overflow-hidden rounded-[23px] p-2.5 sm:p-3">
                <div class="overflow-hidden rounded-[18px] border border-line bg-surface-2">
                  <div class="flex h-12 items-center justify-between border-b border-line bg-surface-3/55 px-4">
                    <div class="flex items-center gap-1.5">
                      <span class="h-2.5 w-2.5 rounded-full bg-fg-subtle/35" />
                      <span class="h-2.5 w-2.5 rounded-full bg-fg-subtle/25" />
                      <span class="h-2.5 w-2.5 rounded-full bg-fg-subtle/15" />
                    </div>
                    <div class="rounded-full border border-line bg-elevated px-3 py-1 text-[9px] font-semibold text-fg-subtle">sptools / workspace</div>
                    <span class="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-elevated text-[10px] text-accent">✦</span>
                  </div>

                  <div class="grid gap-3 p-3 sm:grid-cols-5 sm:p-4">
                    <NuxtLink
                      v-if="primaryTool"
                      :to="primaryTool.href"
                      class="group relative min-h-[300px] overflow-hidden rounded-[18px] border border-line bg-elevated p-5 sm:col-span-3"
                    >
                      <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[0.32]" />
                      <div class="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent/16 blur-3xl transition duration-500 group-hover:scale-125" />
                      <div class="relative flex h-full flex-col">
                        <div class="flex items-center justify-between">
                          <span class="flex h-11 w-11 items-center justify-center rounded-[14px] border border-line bg-surface-3 text-accent shadow-xs">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" :fill="primaryTool.iconStyle === 'fill' ? 'currentColor' : 'none'" :stroke="primaryTool.iconStyle === 'stroke' ? 'currentColor' : 'none'" stroke-width="1.7" aria-hidden="true">
                              <path stroke-linecap="round" stroke-linejoin="round" :d="primaryTool.icon" />
                            </svg>
                          </span>
                          <span class="sp-hover-arrow text-xl text-fg-subtle">↗</span>
                        </div>
                        <div class="mt-auto">
                          <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">Featured workflow</p>
                          <h2 class="mt-2 max-w-sm text-[2rem] font-[720] leading-[1.02] tracking-[-0.045em] text-fg">{{ primaryTool.name }}</h2>
                          <p class="mt-3 max-w-md text-[13px] leading-6 text-fg-muted">{{ primaryTool.description }}</p>
                          <span class="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-fg">
                            Open workflow <span class="sp-hover-arrow text-accent">→</span>
                          </span>
                        </div>
                      </div>
                    </NuxtLink>

                    <div class="grid gap-3 sm:col-span-2">
                      <NuxtLink
                        v-for="(tool, index) in secondaryTools.slice(0, 2)"
                        :key="tool.slug"
                        :to="tool.href"
                        class="group relative min-h-[144px] overflow-hidden rounded-[18px] border border-line bg-elevated p-4 transition hover:border-accent/30"
                      >
                        <div class="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full blur-2xl transition group-hover:scale-125" :style="{ background: `${tool.accent}18` }" />
                        <div class="relative flex h-full flex-col justify-between">
                          <div class="flex items-start justify-between">
                            <span class="text-[10px] font-bold uppercase tracking-[0.13em] text-fg-subtle">0{{ index + 2 }}</span>
                            <span class="sp-hover-arrow text-fg-subtle">↗</span>
                          </div>
                          <div>
                            <p class="text-[15px] font-[680] text-fg">{{ tool.shortName }}</p>
                            <p class="mt-1.5 text-[11px] leading-5 text-fg-muted">{{ tool.tagline }}</p>
                          </div>
                        </div>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="sp-float-delayed absolute -bottom-5 -left-5 hidden rounded-[14px] border border-line bg-elevated px-3.5 py-2.5 shadow-soft sm:block">
              <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-fg-subtle">Status</p>
              <p class="mt-1 inline-flex items-center gap-2 text-[11px] font-semibold text-fg"><span class="h-1.5 w-1.5 rounded-full bg-positive" /> Ready when you are</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tool directory strip -->
    <section class="border-b border-line bg-surface-2 py-16 sm:py-20">
      <div class="sp-container-wide sp-reveal">
        <div class="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div class="sp-kicker">Toolkit</div>
            <h2 class="mt-3 text-[clamp(2rem,4vw,3.1rem)] font-[730] leading-[1] tracking-[-0.052em] text-fg">Pick a job. Get it done.</h2>
            <p class="mt-3 max-w-2xl text-[14px] leading-7 text-fg-muted">A small set of tools with clear inputs, predictable outputs and enough polish to stay out of your way.</p>
          </div>
          <NuxtLink to="/tools" class="group inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition hover:text-fg">View directory <span class="sp-hover-arrow text-accent">↗</span></NuxtLink>
        </div>

        <div class="sp-stagger mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <NuxtLink
            v-for="(tool, index) in featuredTools"
            :key="tool.slug"
            :to="tool.href"
            class="sp-card-interactive group relative min-h-[220px] rounded-[18px] border border-line bg-elevated p-5"
          >
            <div class="flex items-start justify-between">
              <span class="flex h-11 w-11 items-center justify-center rounded-[14px] border border-line bg-surface-3" :style="{ color: tool.accent }">
                <svg class="h-5 w-5" viewBox="0 0 24 24" :fill="tool.iconStyle === 'fill' ? 'currentColor' : 'none'" :stroke="tool.iconStyle === 'stroke' ? 'currentColor' : 'none'" stroke-width="1.7" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="tool.icon" />
                </svg>
              </span>
              <span class="text-[10px] font-semibold text-fg-subtle">0{{ index + 1 }}</span>
            </div>
            <div class="mt-8">
              <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-fg-subtle">{{ index < 2 ? 'AI image' : 'Downloader' }}</p>
              <h3 class="mt-2 text-[17px] font-[690] text-fg">{{ tool.shortName }}</h3>
              <p class="mt-2 text-[12px] leading-5 text-fg-muted">{{ tool.tagline }}</p>
            </div>
            <span class="absolute bottom-5 right-5 sp-hover-arrow text-fg-subtle">↗</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Bento value section -->
    <section class="border-b border-line bg-surface py-16 sm:py-20">
      <div class="sp-container-wide grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-center">
        <div class="sp-reveal-left">
          <div class="sp-kicker">Why SP-Tools</div>
          <h2 class="mt-4 max-w-xl text-[clamp(2.2rem,4vw,3.5rem)] font-[730] leading-[.98] tracking-[-0.052em] text-fg">
            Fast enough to feel simple. Polished enough to feel intentional.
          </h2>
          <p class="mt-5 max-w-lg text-[14px] leading-7 text-fg-muted">The visual system gives important actions more contrast, keeps secondary content quiet, and uses motion only where it helps you understand what changed.</p>
        </div>

        <div class="sp-stagger grid gap-3 sm:grid-cols-2">
          <div class="sp-card-interactive relative min-h-[230px] rounded-[20px] border border-line bg-elevated p-6 sm:row-span-2 sm:min-h-[475px]">
            <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[0.26]" />
            <div class="relative flex h-full flex-col">
              <span class="flex h-12 w-12 items-center justify-center rounded-[15px] bg-accent-soft text-accent">⌘</span>
              <div class="mt-auto">
                <p class="text-[11px] font-bold uppercase tracking-[0.13em] text-accent">01 · Focus</p>
                <h3 class="mt-3 text-[1.7rem] font-[700] leading-tight text-fg">One primary action per workflow.</h3>
                <p class="mt-3 text-[13px] leading-6 text-fg-muted">The interface shows the tool first and supporting explanation second, so every page feels useful before it feels decorative.</p>
              </div>
            </div>
          </div>

          <div class="sp-card-interactive min-h-[230px] rounded-[20px] border border-line bg-surface-3/55 p-6">
            <p class="text-[11px] font-bold uppercase tracking-[0.13em] text-accent-2">02 · Motion</p>
            <h3 class="mt-3 text-[20px] font-[690] text-fg">Subtle, not sleepy.</h3>
            <p class="mt-3 text-[13px] leading-6 text-fg-muted">Hover depth, reveal motion and progress cues add energy without turning basic interactions into a demo reel.</p>
            <div class="mt-7 h-1.5 overflow-hidden rounded-full bg-line"><div class="sp-progress-beam h-full rounded-full" /></div>
          </div>

          <div class="sp-card-interactive min-h-[230px] rounded-[20px] border border-line bg-elevated p-6">
            <p class="text-[11px] font-bold uppercase tracking-[0.13em] text-accent">03 · System</p>
            <h3 class="mt-3 text-[20px] font-[690] text-fg">Tools and News still feel related.</h3>
            <p class="mt-3 text-[13px] leading-6 text-fg-muted">Product UI stays clean and sans-serif; editorial pages can use richer Newsreader typography without changing the core brand.</p>
            <div class="mt-6 flex -space-x-2">
              <span v-for="n in 4" :key="n" class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-elevated bg-surface-3 text-[10px] font-bold text-fg-muted">{{ n }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="border-b border-line bg-surface-2 py-16 sm:py-20">
      <div class="sp-container grid gap-8 lg:grid-cols-[.55fr_1.45fr] lg:gap-14">
        <div class="sp-reveal-left">
          <div class="sp-kicker">FAQ</div>
          <h2 class="mt-3 text-[2.1rem] font-[710] leading-[1.02] tracking-[-0.045em] text-fg">Useful answers, without a wall of text.</h2>
          <p class="mt-4 text-[14px] leading-7 text-fg-muted">The essentials about access, formats, devices and the current tool set.</p>
        </div>

        <div class="sp-reveal overflow-hidden rounded-[20px] border border-line bg-elevated shadow-soft">
          <div v-for="(item, index) in faqs" :key="item.question" class="transition-colors" :class="[index ? 'border-t border-line' : '', openFaq === index ? 'bg-accent-soft/45' : 'hover:bg-surface-3/55']">
            <button type="button" class="group flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6" :aria-expanded="openFaq === index" @click="toggleFaq(index)">
              <span class="text-[15px] font-[650] text-fg">{{ item.question }}</span>
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-fg-subtle transition duration-300" :class="openFaq === index ? 'rotate-45 border-accent/25 text-accent' : 'group-hover:border-line-strong group-hover:text-fg'">+</span>
            </button>
            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150" leave-to-class="opacity-0 -translate-y-1">
              <div v-if="openFaq === index" class="px-5 pb-6 sm:px-6"><p class="max-w-2xl text-[14px] leading-7 text-fg-muted">{{ item.answer }}</p></div>
            </Transition>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
