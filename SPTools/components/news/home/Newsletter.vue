<script setup lang="ts">
const email = ref('')
const message = ref('')
const isSuccess = ref(false)

const subscribe = () => {
  message.value = ''
  isSuccess.value = false

  const validEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)

  if (!validEmail) {
    message.value = 'Please enter a valid email address.'
    return
  }

  isSuccess.value = true
  message.value =
    'Thank you. You have joined the SP-Tools news briefing.'

  email.value = ''
}
</script>

<template>
  <section
    id="newsletter"
    class="scroll-mt-28 px-6 py-24 sm:py-32"
  >
    <div
      class="relative mx-auto max-w-6xl
      overflow-hidden rounded-[40px]
      bg-accent text-accent-fg px-6 py-16
      text-center text-white sm:px-12 sm:py-20"
    >
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.08]"
        style="
          background-image:
            radial-gradient(
              circle at 2px 2px,
              white 1px,
              transparent 0
            );
          background-size: 32px 32px;
        "
      />

      <div
        class="pointer-events-none absolute
        left-1/2 top-0 h-80 w-[600px]
        -translate-x-1/2 rounded-full
        bg-indigo-600/25 blur-[110px]"
      />

      <div class="relative">
        <div
          class="mx-auto flex h-14 w-14
          items-center justify-center rounded-2xl
          bg-gradient-to-br from-indigo-600
          to-violet-600 text-2xl
          shadow-xl shadow-indigo-500/25"
        >
          ✦
        </div>

        <span
          class="mt-7 inline-block text-xs
          font-bold uppercase tracking-[0.2em]
          text-indigo-300"
        >
          The Daily Brief
        </span>

        <h2
          class="mx-auto mt-5 max-w-3xl
          text-4xl font-bold tracking-[-0.04em]
          sm:text-6xl"
        >
          The day's most important stories.
        </h2>

        <p
          class="mx-auto mt-6 max-w-xl
          text-sm leading-7 text-fg-subtle
          sm:text-base"
        >
          Receive selected world news, breaking updates,
          business, technology, science and regional coverage.
        </p>

        <form
          class="mx-auto mt-9 flex max-w-xl
          flex-col gap-3 sm:flex-row"
          @submit.prevent="subscribe"
        >
          <label
            for="news-email"
            class="sr-only"
          >
            Email address
          </label>

          <input
            id="news-email"
            v-model="email"
            type="email"
            placeholder="Enter your email address"
            class="h-14 min-w-0 flex-1
            rounded-2xl border border-line/10
            bg-surface/[0.07] px-5 text-sm
            text-white outline-none
            placeholder:text-fg-subtle
            focus:border-indigo-400
            focus:ring-4 focus:ring-indigo-500/10"
          />

          <button
            type="submit"
            class="group h-14 rounded-2xl
            bg-surface px-7 text-sm font-bold
            text-fg transition-all
            hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            Subscribe

            <span
              class="ml-1 inline-block
              transition-transform
              group-hover:translate-x-1"
            >
              →
            </span>
          </button>
        </form>

        <p
          v-if="message"
          class="mx-auto mt-4 max-w-lg text-xs"
          :class="
            isSuccess
              ? 'text-emerald-300'
              : 'text-red-300'
          "
        >
          {{ message }}
        </p>

        <p class="mt-4 text-[10px] text-fg-subtle">
          One useful briefing. No unnecessary messages.
        </p>
      </div>
    </div>
  </section>
</template>