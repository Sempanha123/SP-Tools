<script setup lang="ts">
const lastUpdated = ref('')

onMounted(() => {
  lastUpdated.value = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())
})
</script>

<template>
  <section
    class="relative overflow-hidden bg-accent text-accent-fg
    pb-20 pt-32 text-white sm:pb-24 sm:pt-40"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.07]"
      style="
        background-image:
          linear-gradient(
            rgba(255, 255, 255, 0.22) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.22) 1px,
            transparent 1px
          );
        background-size: 52px 52px;
      "
    />

    <div
      class="pointer-events-none absolute -left-40 -top-32
      h-[520px] w-[520px] rounded-full
      bg-indigo-600/25 blur-[130px]"
    />

    <div
      class="pointer-events-none absolute -right-40 top-0
      h-[500px] w-[500px] rounded-full
      bg-cyan-500/15 blur-[130px]"
    />

    <div
      class="pointer-events-none absolute bottom-0 left-1/2
      h-[260px] w-[760px] -translate-x-1/2
      rounded-full bg-violet-600/10 blur-[100px]"
    />

    <div class="relative mx-auto max-w-7xl px-6">
      <nav
        aria-label="Breadcrumb"
        class="flex items-center justify-center gap-2
        text-xs font-medium text-fg-subtle"
      >
        <NuxtLink
          to="/"
          class="transition-colors hover:text-white"
        >
          Home
        </NuxtLink>

        <span>/</span>

        <span class="text-indigo-300">
          World News
        </span>
      </nav>

      <div class="mx-auto mt-8 max-w-5xl text-center">
        <div
          class="inline-flex items-center gap-2 rounded-full
          border border-line/10 bg-surface/[0.06]
          px-4 py-2 backdrop-blur-xl"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full
              animate-ping rounded-full bg-red-400 opacity-50"
            />

            <span
              class="relative inline-flex h-2 w-2
              rounded-full bg-red-500"
            />
          </span>

          <span
            class="text-[10px] font-bold uppercase
            tracking-[0.2em] text-fg-subtle"
          >
            Live Global News Desk
          </span>
        </div>

        <h1
          class="mt-7 text-5xl font-bold leading-[1.04]
          tracking-[-0.055em] sm:text-6xl lg:text-8xl"
        >
          The stories shaping

          <span
            class="block bg-gradient-to-r from-indigo-400
            via-violet-400 to-cyan-400
            bg-clip-text text-transparent"
          >
            our world today.
          </span>
        </h1>

        <p
          class="mx-auto mt-7 max-w-2xl
          text-base leading-8 text-fg-subtle sm:text-lg"
        >
          Follow breaking news, world events, business,
          technology, science, climate and regional developments
          through a clear and modern news experience.
        </p>

        <div
          class="mt-9 flex flex-col items-center
          justify-center gap-3 sm:flex-row"
        >
          <a
            href="#top-stories"
            class="group inline-flex w-full items-center
            justify-center gap-2 rounded-2xl bg-surface
            px-7 py-4 text-sm font-bold text-fg
            transition-all hover:-translate-y-0.5
            hover:bg-surface-2 sm:w-auto"
          >
            Read Top Stories

            <span
              class="transition-transform
              group-hover:translate-x-1"
            >
              →
            </span>
          </a>

          <NuxtLink
            to="/news/category/world"
            class="inline-flex w-full items-center
            justify-center gap-2 rounded-2xl
            border border-line/10 bg-surface/[0.05]
            px-7 py-4 text-sm font-semibold text-white
            backdrop-blur transition-all hover:bg-surface/10
            sm:w-auto"
          >
            Browse World News
          </NuxtLink>
        </div>

        <div
          class="mt-11 flex flex-wrap items-center
          justify-center gap-x-8 gap-y-3
          text-xs font-medium text-fg-subtle"
        >
          <span class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-red-400" />
            Breaking updates
          </span>

          <span class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Global coverage
          </span>

          <span class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Clear timestamps
          </span>
        </div>

        <p
          v-if="lastUpdated"
          class="mt-6 text-[10px] uppercase
          tracking-[0.14em] text-fg-muted"
        >
          Last updated {{ lastUpdated }}
        </p>
      </div>
    </div>
  </section>
</template>