<script setup lang="ts">
const { imageTools, downloadTools } = useTools()
const { subscribe, email, state, message } = useNewsletter()
const year = new Date().getFullYear()
const legalLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Contact', href: '/contact' },
]
</script>

<template>
  <footer class="relative overflow-hidden border-t border-white/8 bg-[#080d14] text-white">
    <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[.055]" />
    <div class="pointer-events-none absolute -left-36 -bottom-40 h-80 w-80 rounded-full bg-violet-500/18 blur-[110px]" />
    <div class="pointer-events-none absolute -right-28 -top-40 h-80 w-80 rounded-full bg-cyan-400/11 blur-[110px]" />

    <div class="sp-container-wide relative py-14 sm:py-16">
      <div class="grid gap-12 lg:grid-cols-[1.45fr_.75fr_.75fr_.75fr]">
        <div>
          <NuxtLink to="/" class="group inline-flex items-center gap-2.5">
            <span class="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] border border-white/10 bg-white text-[#0a0f17] transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
              <span class="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-violet-500 to-cyan-400" />
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 3 5 13h6l-1 8 9-12h-6V3Z"/></svg>
            </span>
            <span class="text-[19px] font-[740] tracking-[-.04em] text-white">SP<span class="text-violet-300">-Tools</span></span>
          </NuxtLink>

          <p class="mt-5 max-w-md text-[13px] leading-6 text-white/48">Practical image and media workflows with a focused global news desk—built as one premium browser workspace.</p>

          <div class="mt-7 max-w-md">
            <p class="text-[8px] font-bold uppercase tracking-[.15em] text-white/28">Weekly product & news briefing</p>
            <form class="mt-2.5 flex rounded-[14px] border border-white/10 bg-white/[.055] p-1.5 backdrop-blur" @submit.prevent="subscribe">
              <label for="footer-email" class="sr-only">Email address</label>
              <input id="footer-email" v-model="email" type="email" autocomplete="email" placeholder="you@example.com" class="h-10 min-w-0 flex-1 bg-transparent px-3 text-[11px] text-white outline-none placeholder:text-white/28" :aria-invalid="state === 'error'" />
              <UiButton type="submit" size="sm" :loading="state === 'loading'" :disabled="state === 'loading'" class="sp-shimmer !rounded-[10px]">Join <span aria-hidden="true">→</span></UiButton>
            </form>
            <p v-if="message" class="mt-2 text-[10px]" :class="state === 'error' ? 'text-red-300' : 'text-emerald-300'" role="status">{{ message }}</p>
          </div>
        </div>

        <div>
          <h3 class="text-[8px] font-bold uppercase tracking-[.15em] text-white/28">AI tools</h3>
          <ul class="mt-5 space-y-3 text-[11px]"><li v-for="tool in imageTools" :key="tool.slug"><NuxtLink :to="tool.href" class="group inline-flex items-center gap-2 text-white/50 transition hover:text-white">{{ tool.shortName }} <span class="sp-hover-arrow opacity-0 text-violet-300 group-hover:opacity-100">↗</span></NuxtLink></li><li><NuxtLink to="/tools" class="text-white/50 transition hover:text-white">All tools</NuxtLink></li></ul>
        </div>

        <div>
          <h3 class="text-[8px] font-bold uppercase tracking-[.15em] text-white/28">Downloaders</h3>
          <ul class="mt-5 space-y-3 text-[11px]"><li v-for="tool in downloadTools" :key="tool.slug"><NuxtLink :to="tool.href" class="text-white/50 transition hover:text-white">{{ tool.shortName }}</NuxtLink></li></ul>
        </div>

        <div>
          <h3 class="text-[8px] font-bold uppercase tracking-[.15em] text-white/28">News</h3>
          <ul class="mt-5 space-y-3 text-[11px]"><li><NuxtLink to="/news" class="text-white/50 transition hover:text-white">Latest</NuxtLink></li><li><NuxtLink to="/news/search" class="text-white/50 transition hover:text-white">Search</NuxtLink></li><li><NuxtLink to="/news/category/world" class="text-white/50 transition hover:text-white">World</NuxtLink></li><li><NuxtLink to="/news/category/technology" class="text-white/50 transition hover:text-white">Technology</NuxtLink></li></ul>
        </div>
      </div>

      <div class="mt-12 grid gap-4 border-t border-white/8 pt-6 text-[9px] text-white/25 sm:grid-cols-[1fr_auto] sm:items-center">
        <p>© {{ year }} SP-Tools · Focused workflows, built for the browser.</p>
        <div class="flex flex-wrap gap-5"><NuxtLink v-for="link in legalLinks" :key="link.href" :to="link.href" class="transition hover:text-white/60">{{ link.label }}</NuxtLink></div>
      </div>
    </div>
  </footer>
</template>
