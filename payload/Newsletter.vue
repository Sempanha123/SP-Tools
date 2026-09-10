<script setup lang="ts">
const email = ref('')
const message = ref('')
const isSuccess = ref(false)

const subscribe = () => {
  message.value = ''
  isSuccess.value = false

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    message.value = 'Please enter a valid email address.'
    return
  }

  isSuccess.value = true
  message.value = 'Thank you. You have joined the SP-Tools news briefing.'
  email.value = ''
}
</script>

<template>
  <section id="newsletter" class="scroll-mt-28 bg-surface py-14 sm:py-16">
    <div class="sp-container-wide">
      <div class="sp-daily-brief sp-reveal sp-noise relative overflow-hidden rounded-[30px] border p-6 shadow-pop sm:p-8 lg:p-10">
        <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[.06]" />
        <div class="sp-daily-brief-glow pointer-events-none absolute inset-0" />

        <div class="relative grid gap-8 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:gap-12">
          <div>
            <p class="sp-daily-brief-kicker text-[9px] font-bold uppercase tracking-[.17em]">
              The Daily Brief
            </p>

            <h2 class="sp-daily-brief-title mt-4 max-w-2xl font-display text-[clamp(2.7rem,5.2vw,4.8rem)] font-[650] leading-[.88] tracking-[-.06em]">
              The signal, before
              <span class="sp-daily-brief-title-muted">the noise.</span>
            </h2>

            <p class="sp-daily-brief-copy mt-5 max-w-xl text-[13px] leading-6">
              Selected world news, technology, business and science in one calmer briefing designed to be read—not scrolled forever.
            </p>

            <div class="mt-6 flex flex-wrap gap-2">
              <span class="sp-daily-brief-chip">Selected stories</span>
              <span class="sp-daily-brief-chip">Clear timestamps</span>
              <span class="sp-daily-brief-chip">No feed clutter</span>
            </div>
          </div>

          <div class="sp-daily-brief-terminal rounded-[22px] border p-4 sm:p-5">
            <div class="flex items-center justify-between border-b border-current/10 pb-3">
              <div>
                <p class="sp-daily-brief-terminal-label text-[8px] font-bold uppercase tracking-[.14em]">
                  Briefing terminal
                </p>
                <p class="sp-daily-brief-terminal-title mt-1 text-[11px] font-semibold">
                  One useful email
                </p>
              </div>

              <span class="inline-flex items-center gap-1.5 text-[9px] font-semibold text-emerald-400">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 sp-pulse-soft" />
                open
              </span>
            </div>

            <div class="mt-4 grid grid-cols-3 gap-2">
              <div class="sp-daily-brief-stat rounded-[12px] border p-3">
                <p class="text-[7px] uppercase tracking-[.12em]">pace</p>
                <strong class="mt-1 block text-[10px]">Daily</strong>
              </div>
              <div class="sp-daily-brief-stat rounded-[12px] border p-3">
                <p class="text-[7px] uppercase tracking-[.12em]">focus</p>
                <strong class="mt-1 block text-[10px]">Global</strong>
              </div>
              <div class="sp-daily-brief-stat rounded-[12px] border p-3">
                <p class="text-[7px] uppercase tracking-[.12em]">noise</p>
                <strong class="mt-1 block text-[10px]">Low</strong>
              </div>
            </div>

            <form class="mt-4 sm:flex sm:gap-2" @submit.prevent="subscribe">
              <label for="news-email" class="sr-only">Email address</label>

              <input
                id="news-email"
                v-model="email"
                type="email"
                placeholder="Enter your email address"
                class="sp-daily-brief-input h-12 w-full min-w-0 flex-1 rounded-[12px] border px-4 text-[12px] outline-none"
              >

              <button
                type="submit"
                class="sp-daily-brief-submit sp-shimmer mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] px-5 text-[12px] font-bold transition hover:-translate-y-0.5 sm:mt-0 sm:w-auto"
              >
                Subscribe <span>→</span>
              </button>
            </form>

            <p
              v-if="message"
              class="mt-3 text-[10px]"
              :class="isSuccess ? 'text-emerald-400' : 'text-red-400'"
            >
              {{ message }}
            </p>

            <div class="sp-daily-brief-progress mt-4 h-1.5 overflow-hidden rounded-full">
              <div class="sp-progress-beam h-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
