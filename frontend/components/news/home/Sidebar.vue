<template>
  <aside class="min-w-0 space-y-6 lg:sticky lg:top-32">

    <!-- Existing Left widget -->
    <section
      class="overflow-hidden rounded-[30px]
      border border-line bg-surface
      shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
    >
      <header
        class="border-b border-line
        bg-gradient-to-r from-slate-50
        to-indigo-50/60 px-6 py-5"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-[10px] font-bold uppercase
              tracking-[0.18em] text-indigo-600"
            >
              Newsroom
            </p>

            <h2 class="mt-2 text-xl font-bold text-fg">
              Discover more
            </h2>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center
            rounded-2xl bg-gradient-to-br from-indigo-600
            to-violet-600 text-white shadow-lg
            shadow-indigo-500/20"
          >
            ◇
          </div>
        </div>
      </header>

      <div class="p-4 sm:p-5">
        <NewsWidgetsLeft />
      </div>
    </section>

    <!-- AI tool advertisement -->
    <section
      class="relative overflow-hidden rounded-[30px]
      bg-accent text-accent-fg p-7 text-white"
    >
      <div
        class="pointer-events-none absolute -right-20 -top-20
        h-52 w-52 rounded-full bg-indigo-600/30 blur-3xl"
      />

      <div
        class="pointer-events-none absolute -bottom-20 -left-20
        h-44 w-44 rounded-full bg-cyan-500/15 blur-3xl"
      />

      <div class="relative">
        <div
          class="flex h-11 w-11 items-center justify-center
          rounded-xl bg-surface/10 text-xl"
        >
          ✦
        </div>

        <p
          class="mt-6 text-[10px] font-bold uppercase
          tracking-[0.18em] text-indigo-300"
        >
          SP-Tools AI
        </p>

        <h3
          class="mt-3 text-2xl font-bold
          tracking-[-0.03em]"
        >
          Turn ideas into better content.
        </h3>

        <p
          class="mt-3 text-sm leading-7 text-fg-subtle"
        >
          Remove image backgrounds and enhance resolution
          using our AI-powered creative tools.
        </p>

        <div class="mt-6 flex flex-col gap-3">
          <NuxtLink
            to="/tools/bg-remover"
            class="group inline-flex items-center justify-between
            rounded-xl bg-surface px-5 py-3 text-xs font-bold
            text-fg transition-all hover:bg-indigo-50"
          >
            Background Remover

            <span
              class="transition-transform
              group-hover:translate-x-1"
            >
              →
            </span>
          </NuxtLink>

          <NuxtLink
            to="/tools/image-upscaler"
            class="group inline-flex items-center justify-between
            rounded-xl border border-line/10 bg-surface/[0.05]
            px-5 py-3 text-xs font-bold text-white
            transition-all hover:bg-surface/10"
          >
            Image Upscaler

            <span
              class="transition-transform
              group-hover:translate-x-1"
            >
              →
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Small newsletter -->
    <section
      class="rounded-[30px] border border-indigo-100
      bg-gradient-to-br from-indigo-50 to-white p-7"
    >
      <div
        class="flex h-11 w-11 items-center justify-center
        rounded-xl bg-indigo-600 text-white"
      >
        ✉
      </div>

      <h3 class="mt-5 text-xl font-bold text-fg">
        Weekly news brief
      </h3>

      <p class="mt-2 text-sm leading-6 text-fg-subtle">
        Receive selected AI, technology, and creator stories.
      </p>

      <NuxtLink
        to="#newsletter"
        class="mt-5 inline-flex items-center gap-2
        text-xs font-bold text-indigo-600"
      >
        Join newsletter →
      </NuxtLink>
    </section>
  </aside>
</template>