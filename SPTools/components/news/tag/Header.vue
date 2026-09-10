<script setup lang="ts">
interface Props {
  tagName: string
  articleCount: number
  latestPublishedAt?: string
}

const props = withDefaults(
  defineProps<Props>(),
  {
    latestPublishedAt: '',
  },
)

const {
  timeAgo,
} = useNewsData()

const articleLabel = computed(() => {
  return props.articleCount === 1
    ? '1 story'
    : `${props.articleCount} stories`
})
</script>

<template>
  <header
    class="relative overflow-hidden
    bg-accent text-accent-fg pb-20 pt-36
    text-white sm:pb-24 sm:pt-44"
  >
    <!-- Background effects -->

    <div
      class="pointer-events-none absolute
      inset-0"
    >
      <div
        class="absolute -left-40 top-0
        h-[440px] w-[440px]
        rounded-full bg-indigo-600/20
        blur-[120px]"
      />

      <div
        class="absolute -right-40 top-20
        h-[420px] w-[420px]
        rounded-full bg-cyan-500/15
        blur-[120px]"
      />

      <div
        class="absolute bottom-0 left-1/2
        h-[300px] w-[600px]
        -translate-x-1/2 rounded-full
        bg-violet-600/10 blur-[120px]"
      />

      <div
        class="absolute inset-0 opacity-[0.035]"
        style="
          background-image:
            radial-gradient(circle, white 1px, transparent 1px);
          background-size: 28px 28px;
        "
      />
    </div>

    <div
      class="relative mx-auto max-w-5xl
      px-6 text-center"
    >
      <!-- Breadcrumb -->

      <nav
        class="flex flex-wrap items-center
        justify-center gap-2
        text-[10px] text-fg-subtle"
      >
        <NuxtLink
          to="/"
          class="transition-colors
          hover:text-white"
        >
          Home
        </NuxtLink>

        <span>/</span>

        <NuxtLink
          to="/news"
          class="transition-colors
          hover:text-white"
        >
          News
        </NuxtLink>

        <span>/</span>

        <span class="text-fg-subtle">
          {{ tagName }}
        </span>
      </nav>

      <!-- Label -->

      <div
        class="mt-8 inline-flex
        items-center gap-2 rounded-full
        border border-line/10
        bg-surface/[0.06] px-4 py-2
        text-[9px] font-bold uppercase
        tracking-[0.18em]
        text-indigo-200 backdrop-blur"
      >
        <span
          class="h-1.5 w-1.5 rounded-full
          bg-indigo-400"
        />

        News topic
      </div>

      <!-- Title -->

      <h1
        class="mx-auto mt-7 max-w-4xl
        text-5xl font-bold
        tracking-[-0.055em]
        text-white sm:text-6xl
        lg:text-7xl"
      >
        <span
          class="bg-gradient-to-r
          from-indigo-400 via-violet-400
          to-cyan-400 bg-clip-text
          text-transparent"
        >
          #
        </span>

        {{ tagName }}
      </h1>

      <p
        class="mx-auto mt-6 max-w-2xl
        text-sm leading-7 text-fg-subtle
        sm:text-base"
      >
        Follow the latest reports, developments,
        analysis and updates connected to
        <span class="font-semibold text-slate-200">
          #{{ tagName }}
        </span>.
      </p>

      <!-- Tag information -->

      <div
        class="mt-8 flex flex-wrap
        items-center justify-center gap-3
        text-[10px] text-fg-subtle"
      >
        <span
          class="inline-flex items-center
          gap-2 rounded-full border
          border-line/10 bg-surface/[0.04]
          px-4 py-2"
        >
          <span
            class="h-1.5 w-1.5
            rounded-full bg-indigo-400"
          />

          {{ articleLabel }}
        </span>

        <span
          class="inline-flex items-center
          gap-2 rounded-full border
          border-line/10 bg-surface/[0.04]
          px-4 py-2"
        >
          <span
            class="h-1.5 w-1.5
            rounded-full bg-emerald-400"
          />

          Latest and popular coverage
        </span>

        <span
          v-if="latestPublishedAt"
          class="inline-flex items-center
          gap-2 rounded-full border
          border-line/10 bg-surface/[0.04]
          px-4 py-2"
        >
          Updated
          {{ timeAgo(latestPublishedAt) }}
        </span>
      </div>

      <!-- Action -->

      <a
        href="#tag-stories"
        class="group mt-9 inline-flex
        items-center gap-2 rounded-2xl
        bg-surface px-6 py-3.5
        text-xs font-bold text-fg
        shadow-[0_16px_40px_rgba(0,0,0,0.24)]
        transition-all hover:-translate-y-0.5"
      >
        Explore stories

        <span
          class="transition-transform
          group-hover:translate-y-0.5"
        >
          ↓
        </span>
      </a>
    </div>
  </header>
</template>