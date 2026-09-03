<script setup lang="ts">
const { tools, imageTools, downloadTools } = useTools()

useSeoMeta({
  title: 'All Tools — AI Image Editing and Media Downloaders | SP-Tools',
  description:
    'Browse every SP-Tools utility: AI background removal, image upscaling, and downloaders for TikTok, Facebook and YouTube.',
  ogTitle: 'All Tools | SP-Tools',
  ogDescription: 'Every SP-Tools utility in one place.',
})

const groups = [
  {
    id: 'image',
    title: 'AI Image Tools',
    description:
      'Neural models that edit and enhance photos directly from the browser.',
    items: imageTools,
  },
  {
    id: 'download',
    title: 'Media Downloaders',
    description:
      'Paste a link to resolve the available media formats and save them locally.',
    items: downloadTools,
  },
]
</script>

<template>
  <div>
    <ToolHero
      eyebrow="Tool Directory"
      title="Every SP-Tools utility"
      description="Free, browser-based tools for images and media. No account, no installs — pick one and start working."
    >
      <div class="mt-9 flex flex-wrap items-center justify-center gap-6">
        <div class="text-center">
          <p class="font-display text-3xl font-bold text-fg">{{ tools.length }}</p>
          <p class="mt-1 text-xs uppercase tracking-wider text-fg-subtle">
            Tools available
          </p>
        </div>
        <div class="h-10 w-px bg-line" />
        <div class="text-center">
          <p class="font-display text-3xl font-bold text-fg">Free</p>
          <p class="mt-1 text-xs uppercase tracking-wider text-fg-subtle">
            No sign-up
          </p>
        </div>
        <div class="h-10 w-px bg-line" />
        <div class="text-center">
          <p class="font-display text-3xl font-bold text-fg">0</p>
          <p class="mt-1 text-xs uppercase tracking-wider text-fg-subtle">
            Watermarks
          </p>
        </div>
      </div>
    </ToolHero>

    <section
      v-for="(group, index) in groups"
      :key="group.id"
      class="border-b border-line py-16 sm:py-20"
      :class="index % 2 === 1 ? 'bg-surface-2' : 'bg-surface'"
    >
      <div class="sp-container">
        <UiSectionHeading
          :title="group.title"
          :description="group.description"
        />

        <div class="mt-10 grid gap-5 md:grid-cols-2">
          <NuxtLink
            v-for="tool in group.items"
            :key="tool.slug"
            :to="tool.href"
            class="sp-card sp-card-interactive group flex gap-5 p-6"
          >
            <span
              class="flex h-14 w-14 shrink-0 items-center justify-center
                rounded-2xl border border-line bg-surface-2"
              :style="{ color: tool.accent }"
            >
              <svg
                class="h-6 w-6"
                viewBox="0 0 24 24"
                :fill="tool.iconStyle === 'fill' ? 'currentColor' : 'none'"
                :stroke="tool.iconStyle === 'stroke' ? 'currentColor' : 'none'"
                stroke-width="1.6"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" :d="tool.icon" />
              </svg>
            </span>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="font-display text-lg font-bold text-fg">
                  {{ tool.name }}
                </h3>
                <UiBadge v-if="tool.badge" tone="accent">
                  {{ tool.badge }}
                </UiBadge>
              </div>

              <p class="mt-2 text-sm leading-6 text-fg-muted">
                {{ tool.description }}
              </p>

              <ul class="mt-4 flex flex-wrap gap-2">
                <li
                  v-for="feature in tool.features"
                  :key="feature"
                  class="rounded-full bg-surface-2 px-2.5 py-1 text-[11px]
                    font-medium text-fg-muted"
                >
                  {{ feature }}
                </li>
              </ul>

              <span
                class="mt-5 inline-flex items-center gap-1.5 text-sm
                  font-semibold text-accent transition-all group-hover:gap-2.5"
              >
                Open {{ tool.shortName }}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Requirements notice -->
    <section class="sp-container py-14">
      <div class="sp-panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
            bg-warning-soft text-warning"
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
              d="M12 9v4m0 3h.01M10.3 3.9L2.6 17.2A1.9 1.9 0 0 0 4.3 20h15.4a1.9 1.9 0 0 0 1.7-2.8L13.7 3.9a1.9 1.9 0 0 0-3.4 0z"
            />
          </svg>
        </div>

        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-fg">
            The AI tools need the local media service running
          </p>
          <p class="mt-1 text-sm leading-6 text-fg-muted">
            Background removal, upscaling and the downloaders call the FastAPI
            service in <code class="rounded bg-surface-3 px-1.5 py-0.5 text-xs">u2net-project</code>.
            Start it with
            <code class="rounded bg-surface-3 px-1.5 py-0.5 text-xs">uvicorn app.main:app --port 8001</code>.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
