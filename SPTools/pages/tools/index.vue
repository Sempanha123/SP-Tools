<script setup lang="ts">
const { tools, imageTools, downloadTools } = useTools()

useSeoMeta({
  title: 'All Tools — AI Image Editing and Media Downloaders | SP-Tools',
  description: 'Browse every SP-Tools utility: AI background removal, image upscaling, and downloaders for TikTok, Facebook and YouTube.',
  ogTitle: 'All Tools | SP-Tools',
  ogDescription: 'Every SP-Tools utility in one place.',
})

const groups = [
  { id: 'image', title: 'AI image systems', description: 'Focused workflows for clean cutouts and higher-resolution images.', items: imageTools },
  { id: 'download', title: 'Media resolvers', description: 'Paste supported public links, inspect available streams and save what you need.', items: downloadTools },
]
</script>

<template>
  <main class="min-h-screen bg-surface text-fg">
    <section class="sp-prism-field sp-noise relative border-b border-line">
      <div class="sp-container-wide relative py-16 sm:py-20 lg:py-24">
        <div class="grid items-center gap-12 lg:grid-cols-[.92fr_1.08fr] lg:gap-16">
          <div class="sp-reveal-left">
            <div class="sp-kicker">Tool directory</div>
            <h1 class="mt-6 max-w-[760px] text-[clamp(3.5rem,6.6vw,6.2rem)] font-[780] leading-[.86] tracking-[-.074em] text-fg">Pick the job.<span class="sp-gradient-text block">Launch the workflow.</span></h1>
            <p class="mt-7 max-w-[610px] text-[16px] leading-7 text-fg-muted sm:text-[18px]">A small set of focused tools arranged like a product workspace—not a crowded utility directory.</p>
            <div class="mt-8 flex flex-wrap gap-2.5"><span class="sp-chip"><span class="h-1.5 w-1.5 rounded-full bg-positive" /> {{ tools.length }} live workflows</span><span class="sp-chip">No account</span><span class="sp-chip">Browser-first</span></div>
          </div>

          <div class="sp-reveal relative mx-auto w-full max-w-[690px] lg:mx-0">
            <div class="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[90px]" />
            <div class="sp-border-flow sp-depth-hover rounded-[27px] p-[1px]">
              <div class="sp-lens-card overflow-hidden rounded-[26px] p-3">
                <div class="overflow-hidden rounded-[20px] border border-line bg-surface-2">
                  <div class="flex items-center justify-between border-b border-line bg-surface-3/55 px-4 py-3"><p class="text-[9px] font-bold uppercase tracking-[.14em] text-fg-subtle">Workflow map</p><span class="inline-flex items-center gap-1.5 text-[9px] font-semibold text-positive"><span class="h-1.5 w-1.5 rounded-full bg-positive sp-pulse-soft" /> ready</span></div>
                  <div class="grid grid-cols-5 gap-2 p-4">
                    <NuxtLink v-for="(tool,index) in tools.slice(0,5)" :key="tool.slug" :to="tool.href" class="group relative flex min-h-[190px] flex-col overflow-hidden rounded-[16px] border border-line bg-elevated p-3 transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-soft">
                      <div class="pointer-events-none absolute -right-10 -top-12 h-24 w-24 rounded-full opacity-15 blur-2xl" :style="{ background: tool.accent }" />
                      <span class="relative flex h-9 w-9 items-center justify-center rounded-[11px] border border-line bg-surface-3" :style="{ color: tool.accent }"><svg class="h-4 w-4" viewBox="0 0 24 24" :fill="tool.iconStyle === 'fill' ? 'currentColor' : 'none'" :stroke="tool.iconStyle === 'stroke' ? 'currentColor' : 'none'" stroke-width="1.7" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" :d="tool.icon" /></svg></span>
                      <div class="relative mt-auto"><p class="text-[8px] font-bold uppercase tracking-[.12em] text-fg-subtle">0{{ index + 1 }}</p><p class="mt-1.5 text-[11px] font-[670] leading-4 text-fg">{{ tool.shortName }}</p></div>
                    </NuxtLink>
                  </div>
                  <div class="grid grid-cols-3 border-t border-line bg-surface-3/45 px-4 py-3 text-center"><div><p class="text-[8px] uppercase tracking-[.12em] text-fg-subtle">image</p><p class="mt-1 text-[10px] font-bold text-accent">{{ imageTools.length }}</p></div><div class="border-x border-line"><p class="text-[8px] uppercase tracking-[.12em] text-fg-subtle">media</p><p class="mt-1 text-[10px] font-bold text-accent-2">{{ downloadTools.length }}</p></div><div><p class="text-[8px] uppercase tracking-[.12em] text-fg-subtle">state</p><p class="mt-1 text-[10px] font-bold text-positive">Online</p></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-line bg-[#0a0f17] py-[72px] text-white sm:py-[88px]">
      <div class="sp-container-wide">
        <div class="sp-reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div><p class="text-[9px] font-bold uppercase tracking-[.16em] text-violet-300">Workspace index</p><h2 class="mt-4 max-w-3xl text-[clamp(2.6rem,5vw,4.6rem)] font-[750] leading-[.9] tracking-[-.064em]">Choose by outcome, <span class="text-white/34">not by menu depth.</span></h2></div>
          <p class="max-w-md text-[12px] leading-6 text-white/45">Jump directly into image intelligence or media resolution. Every route uses the same interaction language.</p>
        </div>

        <div class="sp-stagger mt-10 grid gap-4 lg:grid-cols-2">
          <a href="#image" class="sp-scanline group relative min-h-[260px] overflow-hidden rounded-[24px] border border-white/10 bg-white/[.05] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[.07]">
            <div class="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-violet-500/20 blur-[80px]" />
            <div class="relative flex h-full flex-col"><div class="flex items-center justify-between"><span class="flex h-12 w-12 items-center justify-center rounded-[15px] border border-white/10 bg-white/[.06] text-violet-300">✦</span><span class="text-[9px] font-bold text-white/25">01</span></div><div class="mt-auto"><p class="text-[9px] font-bold uppercase tracking-[.14em] text-violet-300">Image intelligence</p><h3 class="mt-3 text-[2rem] font-[710] tracking-[-.045em]">Remove. Enhance. Export.</h3><p class="mt-3 text-[12px] leading-6 text-white/45">Background removal and image upscaling in focused visual workspaces.</p></div><span class="sp-hover-arrow absolute bottom-0 right-0 text-white/38">↓</span></div>
          </a>
          <a href="#download" class="group relative min-h-[260px] overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-cyan-400/[.07] to-violet-500/[.08] p-6 transition duration-300 hover:-translate-y-1">
            <div class="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-cyan-400/15 blur-[80px]" />
            <div class="relative flex h-full flex-col"><div class="flex items-center justify-between"><span class="flex h-12 w-12 items-center justify-center rounded-[15px] border border-white/10 bg-white/[.06] text-cyan-300">↗</span><span class="text-[9px] font-bold text-white/25">02</span></div><div class="mt-auto"><p class="text-[9px] font-bold uppercase tracking-[.14em] text-cyan-300">Media resolution</p><h3 class="mt-3 text-[2rem] font-[710] tracking-[-.045em]">Paste. Resolve. Save.</h3><p class="mt-3 text-[12px] leading-6 text-white/45">Supported TikTok, Facebook and YouTube workflows with consistent states.</p></div><span class="sp-hover-arrow absolute bottom-0 right-0 text-white/38">↓</span></div>
          </a>
        </div>
      </div>
    </section>

    <section v-for="(group, groupIndex) in groups" :id="group.id" :key="group.id" class="scroll-mt-24 border-b border-line py-[72px] sm:py-[88px]" :class="groupIndex % 2 ? 'bg-surface-2' : 'bg-surface'">
      <div class="sp-container-wide">
        <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <UiSectionHeading :eyebrow="groupIndex === 0 ? 'Image systems' : 'Media systems'" :title="group.title" :description="group.description" />
          <span class="text-[9px] font-semibold uppercase tracking-[.12em] text-fg-subtle">{{ group.items.length }} {{ group.items.length === 1 ? 'workflow' : 'workflows' }}</span>
        </div>

        <div class="sp-stagger mt-9 grid gap-4 lg:grid-cols-6">
          <NuxtLink
            v-for="(tool,index) in group.items"
            :key="tool.slug"
            :to="tool.href"
            class="sp-lens-card sp-depth-hover group relative min-h-[300px] overflow-hidden rounded-[24px] p-6"
            :class="index === 0 ? 'lg:col-span-4' : 'lg:col-span-2'"
          >
            <div class="sp-dot-grid pointer-events-none absolute inset-0 opacity-[.1]" />
            <div class="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full opacity-[.14] blur-[65px] transition duration-500 group-hover:scale-125 group-hover:opacity-[.24]" :style="{ background: tool.accent }" />
            <div class="relative flex h-full flex-col">
              <div class="flex items-start justify-between"><span class="flex h-[52px] w-[52px] items-center justify-center rounded-[16px] border border-line bg-surface-3 shadow-xs" :style="{ color: tool.accent }"><svg class="h-6 w-6" viewBox="0 0 24 24" :fill="tool.iconStyle === 'fill' ? 'currentColor' : 'none'" :stroke="tool.iconStyle === 'stroke' ? 'currentColor' : 'none'" stroke-width="1.6" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" :d="tool.icon" /></svg></span><span class="text-[9px] font-bold uppercase tracking-[.13em] text-fg-subtle">0{{ index + 1 }}</span></div>
              <div class="mt-auto pt-10"><p class="text-[9px] font-bold uppercase tracking-[.13em] text-accent">{{ groupIndex === 0 ? 'AI image workflow' : 'Media resolver' }}</p><h3 class="mt-2 font-[730] tracking-[-.045em] text-fg" :class="index === 0 ? 'text-[2.25rem]' : 'text-[24px]'">{{ tool.name }}</h3><p class="mt-3 max-w-xl text-[13px] leading-6 text-fg-muted">{{ tool.description }}</p><div class="mt-5 flex flex-wrap gap-2"><span v-for="feature in tool.features" :key="feature" class="sp-chip !min-h-7 !px-2.5 !text-[9px]">{{ feature }}</span></div><span class="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold text-fg">Open {{ tool.shortName }} <span class="sp-hover-arrow text-accent">↗</span></span></div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
