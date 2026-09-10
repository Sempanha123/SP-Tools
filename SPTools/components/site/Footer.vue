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
  <footer class="relative overflow-hidden border-t border-line bg-surface-2">
    <div class="sp-quiet-grid pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.16]" />
    <div class="pointer-events-none absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-accent/7 blur-[90px]" />
    <div class="sp-container-wide relative py-14 sm:py-16">
      <div class="grid gap-10 lg:grid-cols-[1.4fr_.8fr_.8fr_.8fr]">
        <div>
          <NuxtLink to="/" class="group inline-flex items-center gap-2.5">
            <span class="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[12px] bg-fg text-surface-2 transition duration-300 group-hover:-rotate-3"><span class="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-accent to-accent-2"/><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 3 5 13h6l-1 8 9-12h-6V3Z"/></svg></span>
            <span class="text-[18px] font-[730] tracking-[-.035em] text-fg">SP<span class="text-accent">-Tools</span></span>
          </NuxtLink>

          <p class="mt-5 max-w-md text-[13px] leading-6 text-fg-muted">Practical web tools for images and media, paired with a focused global news desk. Built to be quick, clear and easy to return to.</p>

          <div class="mt-6 max-w-md">
            <p class="text-[9px] font-bold uppercase tracking-[.14em] text-fg-subtle">Weekly product & news briefing</p>
            <form class="mt-2.5 flex rounded-[14px] border border-line bg-elevated p-1.5 shadow-xs" @submit.prevent="subscribe">
              <label for="footer-email" class="sr-only">Email address</label>
              <input id="footer-email" v-model="email" type="email" autocomplete="email" placeholder="you@example.com" class="h-10 min-w-0 flex-1 bg-transparent px-3 text-[12px] text-fg outline-none placeholder:text-fg-subtle" :aria-invalid="state === 'error'" />
              <UiButton type="submit" size="sm" :loading="state === 'loading'" :disabled="state === 'loading'" class="sp-shimmer">Join <span aria-hidden="true">→</span></UiButton>
            </form>
            <p v-if="message" class="mt-2 text-[10px]" :class="state === 'error' ? 'text-danger' : 'text-positive'" role="status">{{ message }}</p>
          </div>
        </div>

        <div>
          <h3 class="text-[9px] font-bold uppercase tracking-[.14em] text-fg-subtle">AI tools</h3>
          <ul class="mt-5 space-y-3 text-[12px]">
            <li v-for="tool in imageTools" :key="tool.slug"><NuxtLink :to="tool.href" class="group inline-flex items-center gap-2 text-fg-muted transition hover:text-fg">{{ tool.shortName }} <span class="sp-hover-arrow opacity-0 text-accent group-hover:opacity-100">↗</span></NuxtLink></li>
            <li><NuxtLink to="/tools" class="text-fg-muted transition hover:text-fg">All tools</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h3 class="text-[9px] font-bold uppercase tracking-[.14em] text-fg-subtle">Downloaders</h3>
          <ul class="mt-5 space-y-3 text-[12px]"><li v-for="tool in downloadTools" :key="tool.slug"><NuxtLink :to="tool.href" class="text-fg-muted transition hover:text-fg">{{ tool.shortName }}</NuxtLink></li></ul>
        </div>

        <div>
          <h3 class="text-[9px] font-bold uppercase tracking-[.14em] text-fg-subtle">News</h3>
          <ul class="mt-5 space-y-3 text-[12px]"><li><NuxtLink to="/news" class="text-fg-muted transition hover:text-fg">Latest</NuxtLink></li><li><NuxtLink to="/news/search" class="text-fg-muted transition hover:text-fg">Search</NuxtLink></li><li><NuxtLink to="/news/category/world" class="text-fg-muted transition hover:text-fg">World</NuxtLink></li><li><NuxtLink to="/news/category/technology" class="text-fg-muted transition hover:text-fg">Technology</NuxtLink></li></ul>
        </div>
      </div>

      <div class="mt-12 flex flex-col justify-between gap-4 border-t border-line pt-6 text-[10px] text-fg-subtle sm:flex-row sm:items-center">
        <p>© {{ year }} SP-Tools · Built for fast everyday workflows.</p>
        <div class="flex flex-wrap gap-5"><NuxtLink v-for="link in legalLinks" :key="link.href" :to="link.href" class="transition hover:text-fg">{{ link.label }}</NuxtLink></div>
      </div>
    </div>
  </footer>
</template>
