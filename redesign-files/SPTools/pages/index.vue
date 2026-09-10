<script setup lang="ts">
const { tools } = useTools()

const openFaq = ref<number | null>(0)

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

const featuredTools = computed(() => tools.slice(0, 5))

const faqs = [
  {
    question: 'Is SP-Tools free to use without registration?',
    answer:
      'Yes. The current tools are available directly in the browser without creating an SP-Tools account.',
  },
  {
    question: 'Which image formats are supported?',
    answer:
      'The image workspace supports the formats shown inside each tool. The upload control validates format and file size before processing.',
  },
  {
    question: 'Can I use SP-Tools on mobile and desktop?',
    answer:
      'Yes. The interface is responsive and designed for phones, tablets, laptops and desktop browsers.',
  },
  {
    question: 'What can I do from one place?',
    answer:
      'You can remove image backgrounds, upscale images, resolve supported public media links, and browse the SP-Tools global news section.',
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
    <section class="relative overflow-hidden border-b border-line bg-surface">
      <div class="sp-quiet-grid pointer-events-none absolute inset-x-0 top-0 h-[440px] opacity-50" />
      <div class="pointer-events-none absolute left-1/2 top-[-240px] h-[430px] w-[760px] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]" />

      <div class="sp-container relative py-16 sm:py-20 lg:py-24">
        <div class="mx-auto max-w-4xl text-center">
          <div class="sp-kicker justify-center">
            <span class="h-1.5 w-1.5 rounded-full bg-accent" />
            One focused web toolkit
          </div>

          <h1 class="mt-5 text-[clamp(3rem,7vw,5rem)] font-[740] leading-[0.98] tracking-[-0.06em] text-fg">
            Useful tools, without the noisy interface.
          </h1>

          <p class="mx-auto mt-6 max-w-2xl text-[16px] leading-7 text-fg-muted sm:text-[18px]">
            Clean image utilities, practical media downloaders and a focused global news desk—built into one fast browser experience.
          </p>

          <div class="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
            <NuxtLink
              to="/tools"
              class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-fg shadow-xs transition hover:bg-accent-hover sm:w-auto"
            >
              Explore all tools
              <span aria-hidden="true">→</span>
            </NuxtLink>

            <NuxtLink
              to="/news"
              class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-line bg-elevated px-5 text-sm font-semibold text-fg transition hover:bg-surface-3 sm:w-auto"
            >
              Open global news
            </NuxtLink>
          </div>

          <div class="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-fg-muted">
            <span class="inline-flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-positive" /> No account required</span>
            <span class="inline-flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-positive" /> Mobile friendly</span>
            <span class="inline-flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-positive" /> Focused workflows</span>
          </div>
        </div>

        <div class="mx-auto mt-12 max-w-5xl rounded-[20px] border border-line bg-elevated p-2 shadow-lift sm:p-3">
          <div class="rounded-[15px] border border-line bg-surface-2">
            <div class="flex h-11 items-center justify-between border-b border-line px-4">
              <div class="flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-full bg-fg-subtle/40" />
                <span class="h-2.5 w-2.5 rounded-full bg-fg-subtle/30" />
                <span class="h-2.5 w-2.5 rounded-full bg-fg-subtle/20" />
              </div>
              <p class="text-[10px] font-semibold text-fg-subtle">SP-Tools workspace</p>
              <div class="w-10" />
            </div>

            <div class="grid gap-3 p-4 md:grid-cols-[1.15fr_.85fr]">
              <NuxtLink
                to="/tools/bg-remover"
                class="group relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-[15px] border border-line bg-surface p-5 transition hover:border-accent/25"
              >
                <div class="sp-quiet-grid pointer-events-none absolute inset-0 opacity-35" />
                <div class="relative">
                  <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">✦</span>
                  <p class="mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-fg-subtle">Featured workflow</p>
                  <h2 class="mt-2 text-[1.65rem] font-[700] tracking-[-0.04em] text-fg">Remove an image background</h2>
                  <p class="mt-2 max-w-md text-[13px] leading-6 text-fg-muted">Upload, process and export with a simple workspace designed to keep the task front and center.</p>
                </div>
                <span class="relative mt-5 inline-flex items-center gap-2 text-xs font-semibold text-accent">
                  Open background remover
                  <span class="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </span>
              </NuxtLink>

              <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                <NuxtLink
                  to="/tools/image-upscaler"
                  class="group rounded-[15px] border border-line bg-surface p-4 transition hover:border-accent/25"
                >
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-fg-subtle">Image</p>
                      <h3 class="mt-1.5 text-[16px] font-[680] text-fg">Upscale to 2× or 4×</h3>
                      <p class="mt-1.5 text-[12px] leading-5 text-fg-muted">Restore detail with the image enhancement workflow.</p>
                    </div>
                    <span class="text-fg-subtle transition group-hover:translate-x-1 group-hover:text-accent">↗</span>
                  </div>
                </NuxtLink>

                <NuxtLink
                  to="/download/youtube-download"
                  class="group rounded-[15px] border border-line bg-surface p-4 transition hover:border-accent/25"
                >
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-fg-subtle">Media</p>
                      <h3 class="mt-1.5 text-[16px] font-[680] text-fg">Resolve video & audio</h3>
                      <p class="mt-1.5 text-[12px] leading-5 text-fg-muted">Paste a supported link and choose from available formats.</p>
                    </div>
                    <span class="text-fg-subtle transition group-hover:translate-x-1 group-hover:text-accent">↗</span>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-line bg-surface-2 py-14 sm:py-16">
      <div class="sp-container">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <UiSectionHeading
            eyebrow="Toolkit"
            title="Pick a job. Get it done."
            description="Every workflow is built around one clear task, with the controls you need and very little else."
          />
          <NuxtLink to="/tools" class="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition hover:text-accent">
            View directory <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>

        <div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <NuxtLink
            v-for="tool in featuredTools"
            :key="tool.slug"
            :to="tool.href"
            class="group min-h-[190px] rounded-[16px] border border-line bg-elevated p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-soft"
          >
            <div class="flex items-start justify-between gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface-3" :style="{ color: tool.accent }">
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  :fill="tool.iconStyle === 'fill' ? 'currentColor' : 'none'"
                  :stroke="tool.iconStyle === 'stroke' ? 'currentColor' : 'none'"
                  stroke-width="1.7"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" :d="tool.icon" />
                </svg>
              </span>
              <span class="text-fg-subtle transition group-hover:translate-x-1 group-hover:text-accent">↗</span>
            </div>

            <h3 class="mt-5 text-[16px] font-[680] tracking-[-0.025em] text-fg">{{ tool.shortName }}</h3>
            <p class="mt-2 text-[12px] leading-5 text-fg-muted">{{ tool.tagline }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="border-b border-line bg-surface py-14 sm:py-16">
      <div class="sp-container grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <div>
          <div class="sp-kicker">Why SP-Tools</div>
          <h2 class="mt-3 text-[2rem] font-[700] leading-[1.05] tracking-[-0.04em] text-fg sm:text-[2.5rem]">
            Designed around useful actions, not decoration.
          </h2>
          <p class="mt-4 max-w-lg text-[14px] leading-7 text-fg-muted">
            The interface keeps hierarchy simple: one primary action, calm surfaces, readable content and consistent behavior across light and dark themes.
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <div class="rounded-[16px] border border-line bg-elevated p-5">
            <p class="text-[11px] font-bold uppercase tracking-[0.11em] text-fg-subtle">01 · Fast</p>
            <h3 class="mt-4 text-[16px] font-[680] text-fg">Short workflows</h3>
            <p class="mt-2 text-[12px] leading-5 text-fg-muted">The tool appears early, so you can start without scrolling through a landing page first.</p>
          </div>
          <div class="rounded-[16px] border border-line bg-elevated p-5">
            <p class="text-[11px] font-bold uppercase tracking-[0.11em] text-fg-subtle">02 · Clear</p>
            <h3 class="mt-4 text-[16px] font-[680] text-fg">Consistent controls</h3>
            <p class="mt-2 text-[12px] leading-5 text-fg-muted">Inputs, uploads, cards and actions follow the same visual rules across the suite.</p>
          </div>
          <div class="rounded-[16px] border border-line bg-elevated p-5">
            <p class="text-[11px] font-bold uppercase tracking-[0.11em] text-fg-subtle">03 · Calm</p>
            <h3 class="mt-4 text-[16px] font-[680] text-fg">Less visual noise</h3>
            <p class="mt-2 text-[12px] leading-5 text-fg-muted">Accent color is used intentionally instead of turning every section into a gradient.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-line bg-surface-2 py-14 sm:py-16">
      <div class="sp-container max-w-[860px]">
        <UiSectionHeading eyebrow="FAQ" title="Common questions" align="center" />

        <div class="mt-8 overflow-hidden rounded-[16px] border border-line bg-elevated">
          <div
            v-for="(item, index) in faqs"
            :key="item.question"
            class="transition-colors"
            :class="[index ? 'border-t border-line' : '', openFaq === index ? 'bg-surface-3/60' : '']"
          >
            <button
              type="button"
              class="flex w-full items-center justify-between gap-5 px-5 py-[18px] text-left sm:px-6"
              :aria-expanded="openFaq === index"
              @click="toggleFaq(index)"
            >
              <span class="text-[15px] font-[650] text-fg">{{ item.question }}</span>
              <span class="text-fg-subtle transition-transform" :class="openFaq === index ? 'rotate-180 text-accent' : ''">⌄</span>
            </button>
            <div v-show="openFaq === index" class="px-5 pb-5 sm:px-6">
              <p class="text-[14px] leading-7 text-fg-muted">{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
