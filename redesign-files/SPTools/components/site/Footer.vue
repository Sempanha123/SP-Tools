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
  <footer class="border-t border-line bg-surface-2">
    <div class="sp-container py-12 sm:py-14">
      <div class="grid gap-10 lg:grid-cols-[1.45fr_.75fr_.75fr_.75fr]">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[11px] bg-fg text-surface-2">
              <span class="absolute inset-x-0 bottom-0 h-[3px] bg-accent" />
              <svg class="h-[17px] w-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 3 5 13h6l-1 8 9-12h-6V3Z" />
              </svg>
            </span>
            <span class="text-[18px] font-[720] tracking-[-0.035em] text-fg">
              SP<span class="text-accent">-Tools</span>
            </span>
          </div>

          <p class="mt-4 max-w-md text-[13px] leading-6 text-fg-muted">
            Practical web tools for images and media, paired with a focused global news desk. Built to be quick, clear, and easy to use.
          </p>

          <form class="mt-6 max-w-md" @submit.prevent="subscribe">
            <label for="footer-email" class="text-[11px] font-bold uppercase tracking-[0.12em] text-fg-subtle">
              Weekly product & news briefing
            </label>
            <div class="mt-2 flex gap-2">
              <input
                id="footer-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                class="sp-input h-10 text-sm"
                :aria-invalid="state === 'error'"
              />
              <UiButton type="submit" size="sm" :loading="state === 'loading'" :disabled="state === 'loading'">
                Join
              </UiButton>
            </div>

            <p
              v-if="message"
              class="mt-2 text-xs"
              :class="state === 'error' ? 'text-danger' : 'text-positive'"
              role="status"
            >
              {{ message }}
            </p>
          </form>
        </div>

        <div>
          <h3 class="text-[11px] font-bold uppercase tracking-[0.12em] text-fg-subtle">AI Tools</h3>
          <ul class="mt-4 space-y-2.5 text-[13px]">
            <li v-for="tool in imageTools" :key="tool.slug">
              <NuxtLink :to="tool.href" class="text-fg-muted transition hover:text-fg">
                {{ tool.shortName }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/tools" class="text-fg-muted transition hover:text-fg">All tools</NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-[11px] font-bold uppercase tracking-[0.12em] text-fg-subtle">Downloaders</h3>
          <ul class="mt-4 space-y-2.5 text-[13px]">
            <li v-for="tool in downloadTools" :key="tool.slug">
              <NuxtLink :to="tool.href" class="text-fg-muted transition hover:text-fg">
                {{ tool.shortName }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-[11px] font-bold uppercase tracking-[0.12em] text-fg-subtle">News</h3>
          <ul class="mt-4 space-y-2.5 text-[13px]">
            <li><NuxtLink to="/news" class="text-fg-muted transition hover:text-fg">Latest</NuxtLink></li>
            <li><NuxtLink to="/news/search" class="text-fg-muted transition hover:text-fg">Search</NuxtLink></li>
            <li><NuxtLink to="/news/category/world" class="text-fg-muted transition hover:text-fg">World</NuxtLink></li>
            <li><NuxtLink to="/news/category/technology" class="text-fg-muted transition hover:text-fg">Technology</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="mt-10 flex flex-col gap-4 border-t border-line pt-6 text-[11px] text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>© {{ year }} SP-Tools. Built for fast everyday workflows.</p>
        <div class="flex flex-wrap gap-5">
          <NuxtLink v-for="link in legalLinks" :key="link.href" :to="link.href" class="transition hover:text-fg">
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
