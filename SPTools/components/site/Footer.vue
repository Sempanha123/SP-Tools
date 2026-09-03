<script setup lang="ts">
const { imageTools, downloadTools } = useTools()
const { subscribe, email, state, message } = useNewsletter()

const year = new Date().getFullYear()

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Contact', href: '/contact' },
]
</script>

<template>
  <footer class="border-t border-line bg-surface-2">
    <div class="sp-container py-14">
      <div class="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <!-- Brand + newsletter -->
        <div>
          <div class="flex items-center gap-3">
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl
                bg-accent text-accent-fg"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3l1.25 5.75L19 10l-5.75 1.25L12 17l-1.25-5.75L5 10l5.75-1.25L12 3z"
                />
              </svg>
            </span>

            <span class="font-display text-xl font-bold text-fg">
              SP-Tools
            </span>
          </div>

          <p class="mt-5 max-w-sm text-sm leading-7 text-fg-muted">
            Smart online tools for images and media, plus a daily world news
            briefing. No installs, no sign-up required.
          </p>

          <form class="mt-6 max-w-sm" @submit.prevent="subscribe">
            <label for="footer-email" class="sr-only">Email address</label>

            <div class="flex gap-2">
              <input
                id="footer-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                class="sp-input h-11"
                :aria-invalid="state === 'error'"
              />
              <UiButton
                type="submit"
                size="md"
                :loading="state === 'loading'"
                :disabled="state === 'loading'"
              >
                Join
              </UiButton>
            </div>

            <p
              v-if="message"
              class="mt-2.5 text-xs"
              :class="state === 'error' ? 'text-danger' : 'text-positive'"
              role="status"
            >
              {{ message }}
            </p>
          </form>
        </div>

        <!-- Tools -->
        <div>
          <h3 class="text-sm font-bold text-fg">AI Tools</h3>
          <ul class="mt-5 space-y-3 text-sm">
            <li v-for="tool in imageTools" :key="tool.slug">
              <NuxtLink
                :to="tool.href"
                class="text-fg-muted transition-colors hover:text-accent"
              >
                {{ tool.shortName }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/tools"
                class="text-fg-muted transition-colors hover:text-accent"
              >
                All tools
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Downloaders -->
        <div>
          <h3 class="text-sm font-bold text-fg">Downloaders</h3>
          <ul class="mt-5 space-y-3 text-sm">
            <li v-for="tool in downloadTools" :key="tool.slug">
              <NuxtLink
                :to="tool.href"
                class="text-fg-muted transition-colors hover:text-accent"
              >
                {{ tool.shortName }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- News -->
        <div>
          <h3 class="text-sm font-bold text-fg">News</h3>
          <ul class="mt-5 space-y-3 text-sm">
            <li>
              <NuxtLink
                to="/news"
                class="text-fg-muted transition-colors hover:text-accent"
              >
                Latest headlines
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/news/search"
                class="text-fg-muted transition-colors hover:text-accent"
              >
                Search archive
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/news/category/world"
                class="text-fg-muted transition-colors hover:text-accent"
              >
                World
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/news/category/technology"
                class="text-fg-muted transition-colors hover:text-accent"
              >
                Technology
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-14 flex flex-col justify-between gap-4 border-t border-line
          pt-8 text-xs text-fg-subtle sm:flex-row sm:items-center"
      >
        <p>© {{ year }} SP-Tools. All rights reserved.</p>

        <div class="flex flex-wrap gap-5">
          <NuxtLink
            v-for="link in legalLinks"
            :key="link.href"
            :to="link.href"
            class="transition-colors hover:text-fg"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
