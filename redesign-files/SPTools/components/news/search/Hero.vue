<script setup lang="ts">
interface Props {
  modelValue: string
  resultCount: number
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'submit'): void
}>()

const updateValue = (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).value)
const clearSearch = () => emit('update:modelValue', '')
</script>

<template>
  <section class="relative overflow-hidden bg-surface px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-9">
    <div class="sp-container-wide">
      <div class="news-v4-ink sp-noise relative overflow-hidden rounded-[30px] border border-white/10 px-5 py-10 shadow-[0_35px_110px_rgba(9,14,22,.20)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div class="sp-quiet-grid pointer-events-none absolute inset-0 opacity-[.12]" />
        <div class="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-cyan-400/10 blur-[80px]" />
        <div class="pointer-events-none absolute -bottom-40 left-[15%] h-96 w-96 rounded-full bg-violet-500/15 blur-[100px]" />

        <div class="relative grid items-end gap-10 lg:grid-cols-[.82fr_1.18fr] lg:gap-14">
          <div class="sp-reveal-left">
            <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-white/35">
              <NuxtLink to="/" class="transition hover:text-white/75">Home</NuxtLink><span>/</span>
              <NuxtLink to="/news" class="transition hover:text-white/75">News</NuxtLink><span>/</span>
              <span class="text-violet-300">Search</span>
            </nav>

            <div class="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.055] px-3 py-2 text-[9px] font-bold uppercase tracking-[.16em] text-violet-200">
              <span class="h-1.5 w-1.5 rounded-full bg-cyan-300 sp-pulse-soft" /> Newsroom search
            </div>

            <h1 class="mt-5 max-w-[640px] font-display text-[clamp(3rem,6vw,6.2rem)] font-[700] leading-[.86] tracking-[-.065em] text-white">
              Find signal,<br><span class="text-white/32">not noise.</span>
            </h1>
            <p class="mt-6 max-w-xl text-[14px] leading-7 text-white/52 sm:text-[16px]">
              Search reporting by story, country, author, region or topic—then refine the desk with focused filters.
            </p>
          </div>

          <div class="sp-reveal relative">
            <div class="absolute -inset-5 rounded-full bg-violet-500/8 blur-3xl" />
            <div class="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[.055] p-3 backdrop-blur-xl sm:p-4">
              <div class="flex items-center justify-between px-2 pb-3 text-[9px] font-bold uppercase tracking-[.14em] text-white/32">
                <span>Search console</span>
                <span class="inline-flex items-center gap-1.5 text-emerald-300"><span class="h-1.5 w-1.5 rounded-full bg-emerald-300 sp-pulse-soft" /> index ready</span>
              </div>

              <form class="grid gap-2 sm:grid-cols-[1fr_auto]" @submit.prevent="emit('submit')">
                <div class="relative min-w-0">
                  <svg class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                  <input :value="modelValue" type="search" autofocus placeholder="Search stories, topics, authors or regions…" class="h-14 w-full rounded-[14px] border border-white/10 bg-black/20 pl-11 pr-11 text-[13px] text-white outline-none transition placeholder:text-white/28 focus:border-violet-300/45 focus:bg-black/28 focus:ring-4 focus:ring-violet-400/10" @input="updateValue">
                  <button v-if="modelValue" type="button" aria-label="Clear search" class="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/8 hover:text-white" @click="clearSearch">×</button>
                </div>
                <button type="submit" class="sp-shimmer h-14 rounded-[14px] bg-white px-6 text-[12px] font-bold text-[#10141d] shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-50">Search news →</button>
              </form>

              <div class="mt-3 grid grid-cols-3 gap-2">
                <div class="rounded-[12px] border border-white/8 bg-white/[.035] px-3 py-2"><p class="text-[8px] uppercase tracking-[.12em] text-white/25">scope</p><p class="mt-1 text-[10px] font-semibold text-white/72">Global desk</p></div>
                <div class="rounded-[12px] border border-white/8 bg-white/[.035] px-3 py-2"><p class="text-[8px] uppercase tracking-[.12em] text-white/25">filters</p><p class="mt-1 text-[10px] font-semibold text-cyan-200">Live refine</p></div>
                <div class="rounded-[12px] border border-white/8 bg-white/[.035] px-3 py-2"><p class="text-[8px] uppercase tracking-[.12em] text-white/25">results</p><p class="mt-1 text-[10px] font-semibold text-violet-200">{{ resultCount }}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
