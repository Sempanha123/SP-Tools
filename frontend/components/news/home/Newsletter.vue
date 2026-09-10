<script setup lang="ts">
const email = ref('')
const message = ref('')
const isSuccess = ref(false)
const subscribe = () => {
  message.value = ''
  isSuccess.value = false
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { message.value = 'Please enter a valid email address.'; return }
  isSuccess.value = true
  message.value = 'Thank you. You have joined the SP-Tools news briefing.'
  email.value = ''
}
</script>

<template>
  <section id="newsletter" class="scroll-mt-28 bg-surface py-[72px] sm:py-[88px]">
    <div class="sp-container-wide">
      <div class="sp-reveal sp-noise relative overflow-hidden rounded-[30px] border border-white/10 bg-[#090e16] p-6 text-white shadow-pop sm:p-8 lg:p-10">
        <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[.07]" />
        <div class="pointer-events-none absolute -left-24 -top-40 h-80 w-80 rounded-full bg-violet-500/24 blur-[105px]" />
        <div class="pointer-events-none absolute -right-20 -bottom-40 h-80 w-80 rounded-full bg-cyan-400/16 blur-[105px]" />

        <div class="relative grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-14">
          <div>
            <p class="text-[9px] font-bold uppercase tracking-[.17em] text-violet-300">The Daily Brief</p>
            <h2 class="mt-4 max-w-2xl font-display text-[clamp(2.8rem,5.5vw,5rem)] font-[650] leading-[.86] tracking-[-.064em] text-white">The signal, before <span class="text-white/34">the noise.</span></h2>
            <p class="mt-5 max-w-xl text-[13px] leading-6 text-white/52">Selected world news, technology, business and science in one calmer briefing designed to be read—not scrolled forever.</p>

            <div class="mt-7 flex flex-wrap gap-2">
              <span class="sp-chip !border-white/10 !bg-white/[.05] !text-white/52">Selected stories</span>
              <span class="sp-chip !border-white/10 !bg-white/[.05] !text-white/52">Clear timestamps</span>
              <span class="sp-chip !border-white/10 !bg-white/[.05] !text-white/52">No feed clutter</span>
            </div>
          </div>

          <div class="sp-border-flow relative rounded-[22px] p-[1px]">
            <div class="overflow-hidden rounded-[21px] border border-white/10 bg-white/[.055] p-3 backdrop-blur-xl sm:p-4">
              <div class="flex items-center justify-between border-b border-white/8 pb-3">
                <div><p class="text-[8px] font-bold uppercase tracking-[.14em] text-white/30">Briefing terminal</p><p class="mt-1 text-[11px] font-semibold text-white/78">One useful email</p></div>
                <span class="inline-flex items-center gap-1.5 text-[9px] font-semibold text-emerald-300"><span class="h-1.5 w-1.5 rounded-full bg-emerald-300 sp-pulse-soft" /> open</span>
              </div>

              <div class="mt-4 grid grid-cols-3 gap-2">
                <div class="rounded-[12px] border border-white/8 bg-black/12 p-3"><p class="text-[7px] uppercase tracking-[.12em] text-white/26">pace</p><p class="mt-1 text-[10px] font-semibold text-violet-300">Daily</p></div>
                <div class="rounded-[12px] border border-white/8 bg-black/12 p-3"><p class="text-[7px] uppercase tracking-[.12em] text-white/26">focus</p><p class="mt-1 text-[10px] font-semibold text-cyan-300">Global</p></div>
                <div class="rounded-[12px] border border-white/8 bg-black/12 p-3"><p class="text-[7px] uppercase tracking-[.12em] text-white/26">noise</p><p class="mt-1 text-[10px] font-semibold text-emerald-300">Low</p></div>
              </div>

              <form class="mt-4 sm:flex sm:gap-2" @submit.prevent="subscribe">
                <label for="news-email" class="sr-only">Email address</label>
                <input id="news-email" v-model="email" type="email" placeholder="Enter your email address" class="h-12 w-full min-w-0 flex-1 rounded-[12px] border border-white/10 bg-black/18 px-4 text-[12px] text-white outline-none placeholder:text-white/30 focus:border-violet-400/55 focus:ring-4 focus:ring-violet-500/10" />
                <button type="submit" class="sp-shimmer mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-white px-5 text-[12px] font-bold text-[#0b1018] transition hover:-translate-y-0.5 sm:mt-0 sm:w-auto">Subscribe <span>→</span></button>
              </form>
              <p v-if="message" class="mt-3 text-[10px]" :class="isSuccess ? 'text-emerald-300' : 'text-red-300'">{{ message }}</p>

              <div class="mt-4 h-1.5 overflow-hidden rounded-full bg-white/7"><div class="sp-progress-beam h-full rounded-full" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
