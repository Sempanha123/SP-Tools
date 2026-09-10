<script setup lang="ts">
const props = defineProps<{ exclude?: string }>()
const { tools } = useTools()
const suggestions = computed(() => tools.filter((tool) => tool.slug !== props.exclude).slice(0, 4))
</script>

<template>
  <section class="relative overflow-hidden border-t border-line bg-surface-2 py-16 sm:py-20">
    <div class="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-accent/8 blur-[90px]" />
    <div class="sp-container relative">
      <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <UiSectionHeading eyebrow="More tools" title="Keep your workflow moving" description="Fast utilities that share the same focused interaction system." />
        <NuxtLink to="/tools" class="group inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition hover:text-fg">Browse all tools <span class="sp-hover-arrow text-accent">↗</span></NuxtLink>
      </div>

      <div class="sp-stagger mt-9 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <NuxtLink v-for="(tool, index) in suggestions" :key="tool.slug" :to="tool.href" class="sp-card-interactive group relative min-h-[235px] rounded-[19px] border border-line bg-elevated p-5">
          <div class="pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full opacity-[0.10] blur-3xl transition duration-500 group-hover:scale-125 group-hover:opacity-[0.17]" :style="{ background: tool.accent }" />
          <div class="relative flex h-full flex-col">
            <div class="flex items-start justify-between">
              <span class="flex h-11 w-11 items-center justify-center rounded-[14px] border border-line bg-surface-3 shadow-xs" :style="{ color: tool.accent }">
                <svg class="h-5 w-5" viewBox="0 0 24 24" :fill="tool.iconStyle === 'fill' ? 'currentColor' : 'none'" :stroke="tool.iconStyle === 'stroke' ? 'currentColor' : 'none'" stroke-width="1.7" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" :d="tool.icon" /></svg>
              </span>
              <span class="text-[10px] font-semibold text-fg-subtle">0{{ index + 1 }}</span>
            </div>
            <div class="mt-auto">
              <p class="text-[9px] font-bold uppercase tracking-[0.14em] text-fg-subtle">{{ tool.slug.includes('download') ? 'Downloader' : 'AI image tool' }}</p>
              <h3 class="mt-2 text-[17px] font-[690] text-fg">{{ tool.shortName }}</h3>
              <p class="mt-2 text-[12px] leading-5 text-fg-muted">{{ tool.tagline }}</p>
              <span class="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-fg">Open tool <span class="sp-hover-arrow text-accent">→</span></span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
