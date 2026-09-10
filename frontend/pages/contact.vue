<script setup lang="ts">
const { form, state, message, fieldErrors, submit } = useContact()
const { tools } = useTools()

useSeoMeta({
  title: 'Contact SP-Tools — Support, Feedback and Takedowns',
  description:
    'Get in touch about a broken tool, a feature request, a correction to a news article, or a copyright takedown request.',
  ogTitle: 'Contact | SP-Tools',
  ogDescription: 'Support, feedback and takedown requests.',
})

const topics = [
  {
    title: 'A tool is broken',
    description:
      'The downloaders depend on platforms that change without notice. Tell us which tool and paste the link you tried — that is usually enough to reproduce it.',
    icon: 'M12 9v4m0 3h.01M10.3 3.9L2.6 17.2A1.9 1.9 0 0 0 4.3 20h15.4a1.9 1.9 0 0 0 1.7-2.8L13.7 3.9a1.9 1.9 0 0 0-3.4 0z',
  },
  {
    title: 'Feature requests',
    description:
      'Missing a format, a platform, or an export option? We keep a list, and requests that come up repeatedly get built first.',
    icon: 'M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1L12 3z',
  },
  {
    title: 'Corrections and takedowns',
    description:
      'For a factual correction to a news article, or a copyright claim on content served here, include the URL and we will act promptly.',
    icon: 'M4 4h16v16H4zM8 9h8M8 13h8M8 17h5',
  },
]
</script>

<template>
  <div>
    <section class="relative overflow-hidden border-b border-line bg-surface">
      <div class="sp-grid-bg pointer-events-none absolute inset-0" />

      <div
        class="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[700px]
          -translate-x-1/2 rounded-full bg-accent opacity-[0.14] blur-[110px]"
      />

      <div class="sp-container relative py-14 text-center sm:py-20">
        <UiBadge tone="accent" dot pulse>Contact</UiBadge>

        <h1
          class="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold
            tracking-tight text-fg sm:text-5xl"
        >
          Tell us what is not working
        </h1>

        <p class="mx-auto mt-5 max-w-2xl text-sm leading-7 text-fg-muted sm:text-base">
          Bug reports, feature requests, corrections and takedown notices all
          land in the same inbox. No ticket system, no account required.
        </p>
      </div>
    </section>

    <section class="sp-container py-14 sm:py-20">
      <div class="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <!-- Form -->
        <div class="sp-panel p-6 sm:p-8">
          <h2 class="font-display text-2xl font-bold text-fg">Send a message</h2>

          <p class="mt-2 text-sm leading-6 text-fg-muted">
            The more specific you are, the faster we can fix it.
          </p>

          <UiAlert
            v-if="state === 'success'"
            tone="positive"
            title="Message sent"
            class="mt-6"
          >
            {{ message }}
          </UiAlert>

          <UiAlert
            v-else-if="state === 'error' && message"
            tone="danger"
            title="Could not send"
            class="mt-6"
          >
            {{ message }}
          </UiAlert>

          <form class="mt-6 space-y-5" @submit.prevent="submit">
            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  for="contact-name"
                  class="block text-xs font-semibold uppercase tracking-wider
                    text-fg-subtle"
                >
                  Your name
                </label>
                <input
                  id="contact-name"
                  v-model="form.name"
                  type="text"
                  autocomplete="name"
                  class="sp-input mt-2"
                  :aria-invalid="!!fieldErrors.name"
                  placeholder="Alex Doe"
                />
                <p v-if="fieldErrors.name" class="mt-1.5 text-xs text-danger">
                  {{ fieldErrors.name }}
                </p>
              </div>

              <div>
                <label
                  for="contact-email"
                  class="block text-xs font-semibold uppercase tracking-wider
                    text-fg-subtle"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  class="sp-input mt-2"
                  :aria-invalid="!!fieldErrors.email"
                  placeholder="you@example.com"
                />
                <p v-if="fieldErrors.email" class="mt-1.5 text-xs text-danger">
                  {{ fieldErrors.email }}
                </p>
              </div>
            </div>

            <div>
              <label
                for="contact-subject"
                class="block text-xs font-semibold uppercase tracking-wider
                  text-fg-subtle"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                v-model="form.subject"
                type="text"
                class="sp-input mt-2"
                :aria-invalid="!!fieldErrors.subject"
                placeholder="YouTube downloader returns an error"
              />
              <p v-if="fieldErrors.subject" class="mt-1.5 text-xs text-danger">
                {{ fieldErrors.subject }}
              </p>
            </div>

            <div>
              <label
                for="contact-message"
                class="block text-xs font-semibold uppercase tracking-wider
                  text-fg-subtle"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                v-model="form.message"
                rows="6"
                class="sp-input mt-2 h-auto resize-y py-3"
                :aria-invalid="!!fieldErrors.message"
                placeholder="What did you do, what did you expect, and what happened instead?"
              />
              <p v-if="fieldErrors.message" class="mt-1.5 text-xs text-danger">
                {{ fieldErrors.message }}
              </p>
            </div>

            <UiButton
              type="submit"
              size="lg"
              :loading="state === 'loading'"
              :disabled="state === 'loading'"
            >
              {{ state === 'loading' ? 'Sending…' : 'Send message' }}
            </UiButton>
          </form>
        </div>

        <!-- Sidebar -->
        <div class="space-y-5">
          <div
            v-for="topic in topics"
            :key="topic.title"
            class="sp-card p-6"
          >
            <span
              class="flex h-11 w-11 items-center justify-center rounded-xl
                bg-accent-soft text-accent"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :d="topic.icon"
                />
              </svg>
            </span>

            <h3 class="mt-4 text-base font-semibold text-fg">
              {{ topic.title }}
            </h3>

            <p class="mt-2 text-sm leading-6 text-fg-muted">
              {{ topic.description }}
            </p>
          </div>

          <div class="sp-card p-6">
            <h3 class="text-base font-semibold text-fg">Jump back to a tool</h3>

            <ul class="mt-4 flex flex-wrap gap-2">
              <li v-for="tool in tools" :key="tool.slug">
                <NuxtLink
                  :to="tool.href"
                  class="inline-flex rounded-full border border-line bg-surface-2
                    px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors
                    hover:border-accent/50 hover:text-accent"
                >
                  {{ tool.shortName }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
