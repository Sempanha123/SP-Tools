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
    eyebrow: 'Image workspace',
    title: 'AI image tools',
    description: 'Focused workflows for editing and enhancing images.',
    items: imageTools,
  },
  {
    id: 'download',
    eyebrow: 'Media workspace',
    title: 'Media downloaders',
    description: 'Paste a supported link, resolve available formats and save the file you need.',
    items: downloadTools,
  },
]
</script>

<template>
  <main>
    <ToolHero
      eyebrow="Tool Directory"
      title="A focused toolkit for everyday media work"
      description="Pick a single task and start immediately. Every utility shares the same calm, responsive SP-Tools interface."
    >
      <div class="mx-auto grid max-w-[520px] grid-cols-3 overflow-hidden rounded-[15px] border border-line bg-elevated shadow-soft">
        <div class="px-4 py-4 text-center">
          <p class="text-xl font-[720] tracking-[-0.035em] text-fg">{{ tools.length }}</p>
          <p class="mt-1 text-[9px] font-bold uppercase tracking-[0.11em] text-fg-subtle">Tools</p>
        </div>
        <div class="border-x border-line px-4 py-4 text-center">
          <p class="text-xl font-[720] tracking-[-0.035em] text-fg">Free</p>
          <p class="mt-1 text-[9px] font-bold uppercase tracking-[0.11em] text-fg-subtle">No sign-up</p>
        </div>
        <div class="px-4 py-4 text-center">
          <p class="text-xl font-[720] tracking-[-0.035em] text-fg">Fast</p>
          <p class="mt-1 text-[9px] font-bold uppercase tracking-[0.11em] text-fg-subtle">Browser first</p>
        </div>
      </div>
    </ToolHero>

    <section
      v-for="(group, index) in groups"
      :key="group.id"
      class="border-b border-line py-14 sm:py-16"
      :class="index % 2 === 1 ? 'bg-surface-2' : 'bg-surface'"
    >
      <div class="sp-container">
        <UiSectionHeading
          :eyebrow="group.eyebrow"
          :title="group.title"
          :description="group.description"
        />

        <div class="mt-8 grid gap-3 md:grid-cols-2">
          <NuxtLink
            v-for="tool in group.items"
            :key="tool.slug"
            :to="tool.href"
            class="group grid gap-5 rounded-[16px] border border-line bg-elevated p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-soft sm:grid-cols-[52px_minmax(0,1fr)]"
          >
            <span
              class="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] border border-line bg-surface-3"
              :style="{ color: tool.accent }"
            >
              <svg
                class="h-6 w-6"
                viewBox="0 0 24 24"
                :fill="tool.iconStyle === 'fill' ? 'currentColor' : 'none'"
                :stroke="tool.iconStyle === 'stroke' ? 'currentColor' : 'none'"
                stroke-width="1.7"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" :d="tool.icon" />
              </svg>
            </span>

            <div class="min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-[17px] font-[690] tracking-[-0.025em] text-fg">
                      {{ tool.name }}
                    </h3>
                    <UiBadge v-if="tool.badge" tone="accent">{{ tool.badge }}</UiBadge>
                  </div>
                  <p class="mt-2 text-[13px] leading-6 text-fg-muted">{{ tool.description }}</p>
                </div>
                <span class="shrink-0 text-fg-subtle transition group-hover:translate-x-1 group-hover:text-accent">↗</span>
              </div>

              <ul class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-medium text-fg-subtle">
                <li v-for="feature in tool.features" :key="feature" class="inline-flex items-center gap-1.5">
                  <span class="h-1 w-1 rounded-full bg-positive" />
                  {{ feature }}
                </li>
              </ul>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="bg-surface py-10">
      <div class="sp-container">
        <div class="flex flex-col gap-4 rounded-[16px] border border-line bg-surface-3 p-5 sm:flex-row sm:items-center">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-elevated text-fg-muted">i</span>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-fg">Local development note</p>
            <p class="mt-1 text-[12px] leading-5 text-fg-muted">
              Image processing and downloaders use the FastAPI service in
              <code class="rounded bg-elevated px-1.5 py-0.5 text-[11px]">u2net-project</code>.
              Start it locally on port 8001 when testing those tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
