<script setup lang="ts">
const { tools, imageTools, downloadTools } = useTools()

useSeoMeta({
  title: 'All Tools — AI Image Editing and Media Downloaders | SP-Tools',
  description: 'Browse every SP-Tools utility: AI background removal, image upscaling, and downloaders for TikTok, Facebook and YouTube.',
  ogTitle: 'All Tools | SP-Tools',
  ogDescription: 'Every SP-Tools utility in one place.',
})

const groups = [
  { id: 'image', title: 'AI image tools', description: 'Edit and enhance images with focused browser workflows.', items: imageTools },
  { id: 'download', title: 'Media downloaders', description: 'Paste a supported public link, inspect available streams and save the format you need.', items: downloadTools },
]
</script>

<template>
  <div>
    <ToolHero eyebrow="Tool directory" title="A small toolkit for getting useful things done." description="Image workflows and media utilities that keep the action close, the interface calm and the output easy to understand." />

    <section class="border-b border-line bg-surface-2 py-16 sm:py-20">
      <div class="sp-container-wide">
        <div class="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <div class="sp-reveal relative overflow-hidden rounded-[24px] border border-line bg-elevated p-6 shadow-soft sm:p-8">
            <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[0.18]" />
            <div class="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent/12 blur-[85px]" />
            <div class="relative">
              <div class="sp-kicker">Workspace map</div>
              <h2 class="mt-4 max-w-xl text-[clamp(2rem,4vw,3.2rem)] font-[720] leading-[1] tracking-[-0.05em] text-fg">Choose by task, not by feature overload.</h2>
              <p class="mt-4 max-w-lg text-[13px] leading-6 text-fg-muted">The directory is grouped into two jobs: image processing and supported-media resolution.</p>
              <div class="mt-8 grid gap-3 sm:grid-cols-3">
                <div class="rounded-[15px] border border-line bg-surface-3/65 p-4"><p class="text-[10px] font-bold uppercase tracking-[.12em] text-fg-subtle">Available</p><p class="mt-2 text-[1.8rem] font-[720] text-fg">{{ tools.length }}</p><p class="mt-1 text-[11px] text-fg-muted">focused tools</p></div>
                <div class="rounded-[15px] border border-line bg-surface-3/65 p-4"><p class="text-[10px] font-bold uppercase tracking-[.12em] text-fg-subtle">Access</p><p class="mt-2 text-[1.8rem] font-[720] text-fg">Free</p><p class="mt-1 text-[11px] text-fg-muted">no sign-up</p></div>
                <div class="rounded-[15px] border border-line bg-surface-3/65 p-4"><p class="text-[10px] font-bold uppercase tracking-[.12em] text-fg-subtle">Output</p><p class="mt-2 text-[1.8rem] font-[720] text-fg">Direct</p><p class="mt-1 text-[11px] text-fg-muted">clear results</p></div>
              </div>
            </div>
          </div>

          <div class="sp-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <a href="#image" class="sp-card-interactive group relative overflow-hidden rounded-[20px] border border-line bg-elevated p-5"><div class="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-accent/10 blur-3xl"/><div class="relative flex items-start justify-between"><div><p class="text-[9px] font-bold uppercase tracking-[.13em] text-accent">01 · Image</p><h3 class="mt-2 text-[20px] font-[690] text-fg">AI image workflows</h3><p class="mt-2 text-[12px] leading-5 text-fg-muted">Remove backgrounds and upscale images.</p></div><span class="sp-hover-arrow text-fg-subtle">↓</span></div></a>
            <a href="#download" class="sp-card-interactive group relative overflow-hidden rounded-[20px] border border-line bg-elevated p-5"><div class="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-accent-2/10 blur-3xl"/><div class="relative flex items-start justify-between"><div><p class="text-[9px] font-bold uppercase tracking-[.13em] text-accent-2">02 · Media</p><h3 class="mt-2 text-[20px] font-[690] text-fg">Media downloaders</h3><p class="mt-2 text-[12px] leading-5 text-fg-muted">Resolve TikTok, Facebook and YouTube streams.</p></div><span class="sp-hover-arrow text-fg-subtle">↓</span></div></a>
          </div>
        </div>
      </div>
    </section>

    <section v-for="(group, groupIndex) in groups" :id="group.id" :key="group.id" class="scroll-mt-24 border-b border-line py-16 sm:py-20" :class="groupIndex % 2 ? 'bg-surface-2' : 'bg-surface'">
      <div class="sp-container-wide">
        <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <UiSectionHeading :eyebrow="groupIndex === 0 ? 'Image workspace' : 'Media workspace'" :title="group.title" :description="group.description" />
          <span class="text-[10px] font-semibold uppercase tracking-[.12em] text-fg-subtle">{{ group.items.length }} {{ group.items.length === 1 ? 'tool' : 'tools' }}</span>
        </div>

        <div class="sp-stagger mt-9 grid gap-4 md:grid-cols-2">
          <NuxtLink v-for="(tool,index) in group.items" :key="tool.slug" :to="tool.href" class="sp-card-interactive group relative min-h-[260px] overflow-hidden rounded-[22px] border border-line bg-elevated p-6 sm:p-7">
            <div class="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full opacity-[0.09] blur-[60px] transition duration-500 group-hover:scale-125 group-hover:opacity-[0.16]" :style="{ background: tool.accent }" />
            <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[0.12]" />
            <div class="relative flex h-full flex-col">
              <div class="flex items-start justify-between">
                <span class="flex h-13 w-13 items-center justify-center rounded-[16px] border border-line bg-surface-3 shadow-xs" :style="{ color: tool.accent }">
                  <svg class="h-6 w-6" viewBox="0 0 24 24" :fill="tool.iconStyle === 'fill' ? 'currentColor' : 'none'" :stroke="tool.iconStyle === 'stroke' ? 'currentColor' : 'none'" stroke-width="1.6" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" :d="tool.icon" /></svg>
                </span>
                <span class="flex h-9 min-w-9 items-center justify-center rounded-full border border-line bg-surface-2 px-2 text-[9px] font-bold text-fg-subtle">0{{ index + 1 }}</span>
              </div>

              <div class="mt-auto pt-8">
                <div class="flex flex-wrap items-center gap-2"><p class="text-[9px] font-bold uppercase tracking-[.13em] text-fg-subtle">{{ groupIndex === 0 ? 'AI image tool' : 'Downloader' }}</p><UiBadge v-if="tool.badge" tone="accent">{{ tool.badge }}</UiBadge></div>
                <h3 class="mt-2 text-[24px] font-[710] tracking-[-0.035em] text-fg">{{ tool.name }}</h3>
                <p class="mt-3 max-w-xl text-[13px] leading-6 text-fg-muted">{{ tool.description }}</p>
                <div class="mt-5 flex flex-wrap gap-2"><span v-for="feature in tool.features" :key="feature" class="rounded-full border border-line bg-surface-3 px-2.5 py-1 text-[9px] font-medium text-fg-muted">{{ feature }}</span></div>
                <span class="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold text-fg">Open {{ tool.shortName }} <span class="sp-hover-arrow text-accent">↗</span></span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
