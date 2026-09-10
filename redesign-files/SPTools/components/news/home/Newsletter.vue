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
  <section id="newsletter" class="scroll-mt-28 bg-surface py-16 sm:py-20">
    <div class="sp-container-wide">
      <div class="sp-reveal relative overflow-hidden rounded-[26px] border border-white/10 bg-[#11151f] p-6 text-white shadow-pop sm:p-8 lg:grid lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-12 lg:p-10">
        <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[0.08]" />
        <div class="pointer-events-none absolute -left-20 -top-36 h-72 w-72 rounded-full bg-violet-500/25 blur-[95px]" />
        <div class="pointer-events-none absolute -right-16 -bottom-36 h-72 w-72 rounded-full bg-cyan-500/16 blur-[95px]" />

        <div class="relative">
          <p class="text-[9px] font-bold uppercase tracking-[.16em] text-violet-300">The Daily Brief</p>
          <h2 class="mt-4 max-w-2xl font-display text-[clamp(2.4rem,5vw,4.1rem)] font-[650] leading-[.93] tracking-[-.055em] text-white">One useful briefing. Then get on with your day.</h2>
          <p class="mt-5 max-w-xl text-[13px] leading-6 text-white/58">Selected world news, business, technology and science—curated into a calmer reading rhythm.</p>
        </div>

        <div class="relative mt-8 lg:mt-0">
          <div class="rounded-[18px] border border-white/10 bg-white/[0.055] p-3 backdrop-blur-xl">
            <div class="flex items-center justify-between border-b border-white/8 pb-3">
              <span class="text-[9px] font-bold uppercase tracking-[.12em] text-white/42">Briefing access</span>
              <span class="inline-flex items-center gap-1.5 text-[9px] font-semibold text-emerald-300"><span class="h-1.5 w-1.5 rounded-full bg-emerald-300 sp-pulse-soft" /> open</span>
            </div>
            <form class="mt-3 sm:flex sm:gap-2" @submit.prevent="subscribe">
              <label for="news-email" class="sr-only">Email address</label>
              <input id="news-email" v-model="email" type="email" placeholder="Enter your email address" class="h-12 w-full min-w-0 flex-1 rounded-[12px] border border-white/10 bg-black/15 px-4 text-[12px] text-white outline-none placeholder:text-white/32 focus:border-violet-400/55 focus:ring-4 focus:ring-violet-500/10" />
              <button type="submit" class="sp-shimmer mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-white px-5 text-[12px] font-bold text-[#11151f] transition hover:-translate-y-0.5 sm:mt-0 sm:w-auto">Subscribe <span>→</span></button>
            </form>
            <p v-if="message" class="mt-3 text-[10px]" :class="isSuccess ? 'text-emerald-300' : 'text-red-300'">{{ message }}</p>
            <div class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[9px] text-white/36"><span>Selected stories</span><span>Clear timestamps</span><span>No feed clutter</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
