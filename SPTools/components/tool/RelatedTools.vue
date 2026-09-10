<script setup lang="ts">
const props = defineProps<{ exclude?: string }>()
const { tools } = useTools()
const suggestions = computed(() => tools.filter(tool => tool.slug !== props.exclude).slice(0, 4))
</script>

<template>
  <section class="relative overflow-hidden border-t border-line bg-surface py-[72px] sm:py-[88px]">
    <div class="sp-quiet-grid pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[.14]" />
    <div class="sp-container-wide relative">
      <div class="sp-reveal flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <UiSectionHeading eyebrow="More tools" title="Keep your workflow moving" description="Switch jobs without switching visual systems." />
        <NuxtLink to="/tools" class="group inline-flex items-center gap-2 text-[12px] font-semibold text-fg-muted transition hover:text-fg">Browse all tools <span class="sp-hover-arrow text-accent">↗</span></NuxtLink>
      </div>

      <div class="sp-stagger mt-9 grid gap-4 md:grid-cols-6">
        <NuxtLink
          v-for="(tool, index) in suggestions"
          :key="tool.slug"
          :to="tool.href"
          class="sp-lens-card sp-depth-hover group relative min-h-[230px] overflow-hidden rounded-[21px] p-5"
          :class="index === 0 ? 'md:col-span-3' : index === 1 ? 'md:col-span-3' : 'md:col-span-3 lg:col-span-3'"
        >
          <div class="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full opacity-20 blur-3xl transition duration-500 group-hover:scale-125 group-hover:opacity-30" :style="{ background: tool.accent }" />
          <div class="relative flex h-full flex-col">
            <div class="flex items-start justify-between gap-5">
              <span class="flex h-12 w-12 items-center justify-center rounded-[15px] border border-line bg-surface-3 shadow-xs" :style="{ color: tool.accent }">
                <svg class="h-5 w-5" viewBox="0 0 24 24" :fill="tool.iconStyle === 'fill' ? 'currentColor' : 'none'" :stroke="tool.iconStyle === 'stroke' ? 'currentColor' : 'none'" stroke-width="1.7" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" :d="tool.icon" /></svg>
              </span>
              <span class="text-[9px] font-bold uppercase tracking-[.13em] text-fg-subtle">0{{ index + 1 }}</span>
            </div>

            <div class="mt-auto pt-7">
              <p class="text-[9px] font-bold uppercase tracking-[.13em] text-accent">{{ tool.slug.includes('download') ? 'Downloader' : 'AI image tool' }}</p>
              <div class="mt-2 flex items-end justify-between gap-5">
                <div>
                  <h3 class="text-[20px] font-[710] tracking-[-.035em] text-fg">{{ tool.shortName }}</h3>
                  <p class="mt-2 max-w-md text-[12px] leading-6 text-fg-muted">{{ tool.tagline }}</p>
                </div>
                <span class="sp-hover-arrow flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-fg-subtle">↗</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
