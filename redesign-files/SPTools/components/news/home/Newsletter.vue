<script setup lang="ts">
const email = ref('')
const message = ref('')
const isSuccess = ref(false)

const subscribe = () => {
  message.value = ''
  isSuccess.value = false

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)

  if (!validEmail) {
    message.value = 'Please enter a valid email address.'
    return
  }

  isSuccess.value = true
  message.value = 'Thank you. You have joined the SP-Tools news briefing.'
  email.value = ''
}
</script>

<template>
  <section id="newsletter" class="scroll-mt-28 border-t border-line bg-surface py-14 sm:py-16">
    <div class="sp-container">
      <div class="relative overflow-hidden rounded-[18px] border border-line bg-elevated p-6 shadow-soft sm:p-8 lg:grid lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-10">
        <div class="sp-quiet-grid pointer-events-none absolute inset-0 opacity-30" />
        <div class="pointer-events-none absolute -left-20 -top-28 h-52 w-72 rounded-full bg-accent/10 blur-[90px]" />

        <div class="relative">
          <div class="sp-kicker">The Daily Brief</div>
          <h2 class="mt-3 max-w-xl font-display text-[2rem] font-[650] leading-[1.03] tracking-[-0.04em] text-fg sm:text-[2.6rem]">
            The day's important stories, without the clutter.
          </h2>
          <p class="mt-4 max-w-xl text-[14px] leading-7 text-fg-muted">
            Selected world news, business, technology, science and regional coverage in one useful briefing.
          </p>
        </div>

        <div class="relative mt-7 lg:mt-0">
          <form class="rounded-[16px] border border-line bg-surface-2 p-2 shadow-xs sm:flex sm:items-center sm:gap-2" @submit.prevent="subscribe">
            <label for="news-email" class="sr-only">Email address</label>

            <input
              id="news-email"
              v-model="email"
              type="email"
              placeholder="Enter your email address"
              class="h-12 w-full min-w-0 flex-1 rounded-xl bg-transparent px-3 text-sm text-fg outline-none placeholder:text-fg-subtle"
            />

            <button
              type="submit"
              class="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover sm:mt-0 sm:w-auto"
            >
              Subscribe
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p
            v-if="message"
            class="mt-3 text-xs"
            :class="isSuccess ? 'text-positive' : 'text-danger'"
          >
            {{ message }}
          </p>

          <p class="mt-3 text-[10px] text-fg-subtle">
            One useful briefing. No unnecessary messages.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
