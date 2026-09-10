<script setup lang="ts">
import { ref } from 'vue'

const openFaq = ref<number | null>(0)

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

const tools = [
  {
    title: 'AI Background Remover',
    badge: 'AI Powered',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    description: 'Erase image backgrounds instantly with pixel-perfect edge precision and high-res export.',
    href: '/tools/bg-remover',
    icon: '✨',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    glow: 'rgba(99, 102, 241, 0.25)',
    accentBorder: 'hover:border-indigo-500/50',
    stats: 'Instant & Lossless',
  },
  {
    title: 'AI Image Upscaler',
    badge: 'Real-ESRGAN',
    badgeColor: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20',
    description: 'Boost photo resolution up to 4× with neural detail restoration and crisp enhancement.',
    href: '/tools/image-upscaler',
    icon: '⚡',
    gradient: 'from-fuchsia-500 via-rose-500 to-amber-500',
    glow: 'rgba(217, 70, 239, 0.25)',
    accentBorder: 'hover:border-fuchsia-500/50',
    stats: '2× & 4× Scale',
  },
  {
    title: 'TikTok Video Saver',
    badge: 'No Watermark',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description: 'Download HD TikTok clips, reels, and audio tracks cleanly without embedded watermarks.',
    href: '/download/tiktok-download',
    icon: '🎵',
    gradient: 'from-teal-400 via-emerald-500 to-cyan-500',
    glow: 'rgba(16, 185, 129, 0.25)',
    accentBorder: 'hover:border-emerald-500/50',
    stats: 'HD Quality MP4',
  },
  {
    title: 'Facebook Media Grabber',
    badge: 'Reels & Videos',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    description: 'Extract full HD Facebook public reels, live clips, and video streams in one tap.',
    href: '/download/facebook-video-download',
    icon: '🎬',
    gradient: 'from-blue-500 via-indigo-600 to-violet-600',
    glow: 'rgba(59, 130, 246, 0.25)',
    accentBorder: 'hover:border-blue-500/50',
    stats: 'Multi-Format Audio/Video',
  },
  {
    title: 'YouTube Stream Extractor',
    badge: 'Adaptive Bitrate',
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    description: 'Save YouTube videos in 1080p/4K or rip high-fidelity audio streams at up to 320kbps.',
    href: '/download/youtube-download',
    icon: '▶️',
    gradient: 'from-rose-500 via-red-500 to-amber-500',
    glow: 'rgba(244, 63, 94, 0.25)',
    accentBorder: 'hover:border-rose-500/50',
    stats: 'Up to 4K & MP3',
  },
  {
    title: 'Global News Daily',
    badge: 'Live Feed',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    description: 'Stay ahead with curated global headlines across tech, markets, culture, and science.',
    href: '/news',
    icon: '🌍',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    glow: 'rgba(245, 158, 11, 0.25)',
    accentBorder: 'hover:border-amber-500/50',
    stats: 'Real-time Editorial',
  },
]

const faqs = [
  {
    question: 'Is SP-Tools free to use without registration?',
    answer:
      'Yes, 100%! All our tools work right inside your browser without accounts, sign-ups, subscriptions, or credit cards.',
  },
  {
    question: 'What image formats and file limits are supported?',
    answer:
      'We accept PNG, JPEG, WebP, and AVIF formats with files up to 25MB for lightning-fast serverless AI processing.',
  },
  {
    question: 'Are my uploaded media files kept private and secure?',
    answer:
      'Your privacy is our priority. Processed files are automatically purged from temporary buffers directly after delivery.',
  },
  {
    question: 'Can I download media on both mobile phones and desktop?',
    answer:
      'Yes, SP-Tools is fully responsive with seamless touch controls optimized for iPhone, Android, tablets, and desktop workstations.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-surface text-fg transition-colors duration-300">

    <!-- ================================================= -->
    <!-- HERO SECTION WITH VIBRANT AURORA BACKGROUND -->
    <!-- ================================================= -->
    <section class="relative min-h-[860px] overflow-hidden pt-28 pb-20 sm:pt-36">
      <!-- Aurora Gradient Spheres -->
      <div class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[650px] w-[900px] rounded-full bg-gradient-to-tr from-indigo-500/30 via-fuchsia-500/25 to-cyan-400/25 blur-[140px] dark:from-indigo-600/20 dark:via-fuchsia-600/15 dark:to-cyan-500/15" />
      <div class="pointer-events-none absolute top-1/3 -left-32 h-[450px] w-[500px] rounded-full bg-gradient-to-br from-amber-400/20 to-rose-500/20 blur-[130px] dark:opacity-40" />
      <div class="pointer-events-none absolute top-1/4 -right-32 h-[450px] w-[500px] rounded-full bg-gradient-to-bl from-cyan-400/20 to-blue-600/20 blur-[130px] dark:opacity-40" />

      <!-- Decorative subtle grid -->
      <div class="pointer-events-none absolute inset-0 sp-grid-bg opacity-40" />

      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">

        <!-- Glowing Interactive Badge -->
        <div class="mx-auto mb-8 inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-surface/80 px-5 py-2.5 shadow-lg shadow-accent/10 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-accent">
          <span class="relative flex h-2.5 w-2.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span class="bg-gradient-to-r from-accent via-fuchsia-500 to-cyan-500 bg-clip-text text-xs font-bold uppercase tracking-[0.18em] text-transparent">
            AI Magic & Media Powerhouse
          </span>
        </div>

        <!-- Hero Headline -->
        <h1 class="mx-auto max-w-5xl text-5xl font-black leading-[1.08] tracking-tight sm:text-7xl lg:text-8xl">
          Supercharge your
          <span class="block bg-gradient-to-r from-indigo-500 via-fuchsia-500 via-rose-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
            creative workflow.
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="mx-auto mt-7 max-w-2xl text-lg font-normal leading-relaxed text-fg-muted sm:text-xl">
          Remove backgrounds, upscale photos to 4K, save high-speed HD videos, and explore global daily news — all in one ultra-fast browser suite.
        </p>

        <!-- Dynamic CTA Buttons -->
        <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <NuxtLink
            to="/tools/bg-remover"
            class="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/40 sm:w-auto"
          >
            <span class="relative z-10 flex items-center gap-2">
              <span>✨ Remove Background</span>
              <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </NuxtLink>

          <NuxtLink
            to="/tools/image-upscaler"
            class="flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-surface-2/80 px-8 py-4 text-base font-bold text-fg backdrop-blur-lg transition-all duration-300 hover:border-accent hover:bg-surface-3 hover:shadow-lg sm:w-auto"
          >
            <span>⚡ Upscale to 4K</span>
          </NuxtLink>

          <NuxtLink
            to="/download/youtube-download"
            class="flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-surface-2/80 px-8 py-4 text-base font-bold text-fg backdrop-blur-lg transition-all duration-300 hover:border-rose-500 hover:bg-surface-3 hover:shadow-lg sm:w-auto"
          >
            <span>🎬 HD Downloaders</span>
          </NuxtLink>
        </div>

        <!-- Trust Badges with Colorful Glowing Dots -->
        <div class="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-wider text-fg-muted">
          <span class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 100% Free & No Sign-Up</span>
          <span class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-cyan-500" /> Neural AI Processing</span>
          <span class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-fuchsia-500" /> High-Resolution 4K</span>
          <span class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-amber-500" /> Instant Download</span>
        </div>

        <!-- HERO INTERACTIVE WORKSPACE MOCKUP -->
        <div class="relative mx-auto mt-16 max-w-5xl">
          <div class="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 opacity-30 blur-2xl transition duration-1000 group-hover:opacity-60" />

          <div class="relative overflow-hidden rounded-[28px] border border-line bg-surface-2/90 shadow-2xl backdrop-blur-2xl">
            <!-- Browser Bar -->
            <div class="flex h-12 items-center justify-between border-b border-line px-5 bg-surface-3/50">
              <div class="flex items-center gap-2">
                <span class="h-3 w-3 rounded-full bg-rose-500/80" />
                <span class="h-3 w-3 rounded-full bg-amber-500/80" />
                <span class="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <div class="flex items-center gap-2 rounded-lg bg-surface px-4 py-1 text-xs font-mono text-fg-muted border border-line">
                <span class="text-accent">https://</span>sp-tools.com/ai-suite
              </div>
              <div class="h-2 w-12 rounded-full bg-line" />
            </div>

            <!-- Interactive App Dashboard Content -->
            <div class="grid grid-cols-1 p-6 lg:grid-cols-[240px_1fr] gap-6 text-left">
              <!-- Mock Sidebar -->
              <div class="hidden lg:flex flex-col gap-2 rounded-2xl bg-surface/60 p-4 border border-line">
                <div class="mb-4 flex items-center gap-2.5 px-2">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white font-black shadow-md">
                    SP
                  </div>
                  <span class="font-bold text-sm text-fg">Studio Cloud</span>
                </div>
                <div class="flex items-center gap-2.5 rounded-xl bg-accent-soft px-3 py-2 text-xs font-bold text-accent">
                  <span>✨</span> Background AI
                </div>
                <div class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-fg-muted hover:bg-surface-3 transition">
                  <span>⚡</span> Ultra Upscale 4×
                </div>
                <div class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-fg-muted hover:bg-surface-3 transition">
                  <span>🎬</span> Media Grabber
                </div>
                <div class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-fg-muted hover:bg-surface-3 transition">
                  <span>📰</span> News Bulletin
                </div>
              </div>

              <!-- Mock Main Area -->
              <div class="flex flex-col justify-between gap-6 rounded-2xl bg-surface/80 p-6 sm:p-8 border border-line">
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span class="text-xs font-bold uppercase tracking-wider text-accent">Real-Time Neural Engine</span>
                    <h3 class="text-2xl font-black text-fg mt-1">Ready for Instant Processing</h3>
                  </div>
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span class="h-2 w-2 animate-ping rounded-full bg-emerald-500" />
                    GPU Acceleration Online
                  </span>
                </div>

                <!-- Showcase Preview Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <NuxtLink to="/tools/bg-remover" class="group/box relative overflow-hidden rounded-2xl border border-line bg-surface-2 p-4 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 text-xl font-bold mb-3">
                      ✨
                    </div>
                    <h4 class="font-bold text-sm text-fg">AI Cutout</h4>
                    <p class="text-xs text-fg-muted mt-1">One-click transparent PNG generator.</p>
                  </NuxtLink>

                  <NuxtLink to="/tools/image-upscaler" class="group/box relative overflow-hidden rounded-2xl border border-line bg-surface-2 p-4 transition-all duration-300 hover:border-fuchsia-500 hover:shadow-lg">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-500 text-xl font-bold mb-3">
                      ⚡
                    </div>
                    <h4 class="font-bold text-sm text-fg">Super Resolution</h4>
                    <p class="text-xs text-fg-muted mt-1">Restore blur & enhance fine detail.</p>
                  </NuxtLink>

                  <NuxtLink to="/download/youtube-download" class="group/box relative overflow-hidden rounded-2xl border border-line bg-surface-2 p-4 transition-all duration-300 hover:border-cyan-500 hover:shadow-lg">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 text-xl font-bold mb-3">
                      🎵
                    </div>
                    <h4 class="font-bold text-sm text-fg">Media Downloader</h4>
                    <p class="text-xs text-fg-muted mt-1">Direct stream extractor for YouTube & TikTok.</p>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ================================================= -->
    <!-- COLORFUL INTERACTIVE TOOLS GRID -->
    <!-- ================================================= -->
    <section class="relative border-y border-line bg-surface-2/60 py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">

        <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div class="max-w-2xl">
            <span class="inline-block rounded-full bg-accent-soft px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-accent">
              Suite Overview
            </span>
            <h2 class="mt-4 text-4xl font-black tracking-tight text-fg sm:text-5xl lg:text-6xl">
              Precision tools built for
              <span class="bg-gradient-to-r from-accent to-fuchsia-500 bg-clip-text text-transparent">
                creators & builders.
              </span>
            </h2>
            <p class="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
              Every tool is engineered for lightning performance, zero friction, and pristine visual output.
            </p>
          </div>

          <NuxtLink
            to="/tools"
            class="group inline-flex items-center gap-2 text-sm font-bold text-accent transition-transform hover:translate-x-1"
          >
            <span>Explore full catalog</span>
            <span class="transition-transform group-hover:translate-x-1">→</span>
          </NuxtLink>
        </div>

        <!-- 6 Vibrant Cards Grid -->
        <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="tool in tools"
            :key="tool.title"
            :to="tool.href"
            class="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            :class="tool.accentBorder"
          >
            <!-- Glowing ambient backdrop -->
            <div
              class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-30"
              :style="{ background: tool.glow }"
            />

            <div>
              <div class="flex items-center justify-between">
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  :class="`bg-gradient-to-br ${tool.gradient}`"
                >
                  {{ tool.icon }}
                </div>

                <span
                  class="rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                  :class="tool.badgeColor"
                >
                  {{ tool.badge }}
                </span>
              </div>

              <h3 class="mt-6 text-xl font-bold text-fg group-hover:text-accent transition-colors">
                {{ tool.title }}
              </h3>

              <p class="mt-3 text-sm leading-relaxed text-fg-muted">
                {{ tool.description }}
              </p>
            </div>

            <div class="mt-8 flex items-center justify-between border-t border-line/60 pt-4 text-xs font-semibold text-fg-muted">
              <span class="text-accent font-mono">{{ tool.stats }}</span>
              <span class="flex items-center gap-1 text-fg group-hover:text-accent transition-colors">
                Launch tool <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- ================================================= -->
    <!-- ULTRA COLORFUL CREATIVE SHOWCASE BANNER -->
    <!-- ================================================= -->
    <section class="relative overflow-hidden py-24 sm:py-32 bg-surface">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-8 sm:p-14 text-white shadow-2xl border border-white/10">

          <!-- Background Orb -->
          <div class="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-gradient-to-tr from-fuchsia-600/30 to-cyan-500/30 blur-[100px]" />

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span class="inline-block rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-fuchsia-300">
                Next-Gen Experience
              </span>
              <h2 class="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-tight">
                No Watermarks. <br />
                <span class="bg-gradient-to-r from-fuchsia-400 via-rose-300 to-cyan-300 bg-clip-text text-transparent">
                  No Speed Limits.
                </span>
              </h2>
              <p class="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
                Stop struggling with complex desktop photo editors and ad-cluttered downloaders. SP-Tools delivers studio-grade processing straight in your browser.
              </p>

              <div class="mt-8 grid grid-cols-2 gap-4">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <div class="text-2xl font-black text-cyan-400">⚡ 0.8s</div>
                  <p class="text-xs text-slate-400 mt-1">Average Background Removal</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <div class="text-2xl font-black text-fuchsia-400">4K UHD</div>
                  <p class="text-xs text-slate-400 mt-1">Max Upscale Resolution</p>
                </div>
              </div>
            </div>

            <!-- Vibrant Feature Highlights -->
            <div class="space-y-4">
              <div class="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white font-bold text-xl shadow-lg">
                  1
                </div>
                <div>
                  <h3 class="font-bold text-lg text-white">Instant Browser Execution</h3>
                  <p class="text-sm text-slate-400 mt-1">No installers, no bloatware, and no dependencies to configure on your machine.</p>
                </div>
              </div>

              <div class="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-rose-600 text-white font-bold text-xl shadow-lg">
                  2
                </div>
                <div>
                  <h3 class="font-bold text-lg text-white">Lossless Quality Retention</h3>
                  <p class="text-sm text-slate-400 mt-1">Export in crystal-clear PNG with transparent alpha or high-bitrate MP4 video containers.</p>
                </div>
              </div>

              <div class="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold text-xl shadow-lg">
                  3
                </div>
                <div>
                  <h3 class="font-bold text-lg text-white">Safe & Anonymous</h3>
                  <p class="text-sm text-slate-400 mt-1">We respect user privacy with automatic temporary storage purge routines.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ================================================= -->
    <!-- FAQ SECTION WITH MODERN ACCORDIONS -->
    <!-- ================================================= -->
    <section class="border-t border-line bg-surface-2/40 py-24 sm:py-32">
      <div class="mx-auto max-w-3xl px-4 sm:px-6">
        <div class="text-center">
          <span class="rounded-full bg-accent-soft px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-accent">
            FAQ
          </span>
          <h2 class="mt-4 text-3xl font-black tracking-tight text-fg sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p class="mt-3 text-sm text-fg-muted">
            Got questions? We've got quick answers.
          </p>
        </div>

        <div class="mt-12 space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="faq.question"
            class="overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-200"
            :class="openFaq === index ? 'shadow-md border-accent/40' : 'hover:border-line-strong'"
          >
            <button
              type="button"
              class="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-fg sm:p-6"
              @click="toggleFaq(index)"
            >
              <span class="text-base sm:text-lg">{{ faq.question }}</span>
              <span
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-fg-muted transition-transform duration-300"
                :class="openFaq === index ? 'rotate-45 bg-accent text-accent-fg' : ''"
              >
                +
              </span>
            </button>

            <div
              v-show="openFaq === index"
              class="px-5 pb-5 sm:px-6 sm:pb-6 text-sm leading-relaxed text-fg-muted border-t border-line/40 pt-4"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================================================= -->
    <!-- BOTTOM CALL TO ACTION -->
    <!-- ================================================= -->
    <section class="py-20 px-4 sm:px-6">
      <div class="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 sm:p-16 text-center text-white shadow-2xl">
        <div class="relative z-10 max-w-2xl mx-auto">
          <h2 class="text-4xl font-black tracking-tight sm:text-5xl">
            Ready to enhance your media?
          </h2>
          <p class="mt-4 text-base sm:text-lg text-white/90">
            Join thousands of creators using SP-Tools daily for fast, effortless creation.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <NuxtLink
              to="/tools/bg-remover"
              class="w-full sm:w-auto rounded-2xl bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-slate-100"
            >
              Get Started Free →
            </NuxtLink>
            <NuxtLink
              to="/news"
              class="w-full sm:w-auto rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
            >
              Read News Feed
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
