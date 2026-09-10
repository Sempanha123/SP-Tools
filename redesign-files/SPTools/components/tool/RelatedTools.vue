<script setup lang="ts">
const props = defineProps<{ exclude?: string }>()

const { tools } = useTools()

const suggestions = computed(() =>
  tools.filter((tool) => tool.slug !== props.exclude).slice(0, 4),
)

const toolType = (href: string) =>
  href.startsWith('/download') ? 'Downloader' : 'AI image tool'
</script>

<template>
  <section class="border-t border-line bg-surface-2 py-14 sm:py-16">
    <div class="sp-container">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <UiSectionHeading
          eyebrow="More tools"
          title="Keep your workflow moving"
          description="Fast utilities that share the same simple, privacy-minded experience."
        />

        <NuxtLink
          to="/tools"
          class="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition hover:text-accent"
        >
          Browse all tools
          <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>

      <div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="tool in suggestions"
          :key="tool.slug"
          :to="tool.href"
          class="group relative overflow-hidden rounded-[16px] border border-line bg-elevated p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-soft"
        >
          <div
            class="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[0.07] blur-2xl"
            :style="{ background: tool.accent }"
          />

          <div class="flex items-start justify-between gap-4">
            <span
              class="flex h-11 w-11 items-center justify-center rounded-[13px] border border-line bg-surface-3"
              :style="{ color: tool.accent }"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                :fill="tool.iconStyle === 'fill' ? 'currentColor' : 'none'"
                :stroke="tool.iconStyle === 'stroke' ? 'currentColor' : 'none'"
                stroke-width="1.7"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" :d="tool.icon" />
              </svg>
            </span>

            <span class="text-lg text-fg-subtle transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true">
              ↗
            </span>
          </div>

          <p class="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
            {{ toolType(tool.href) }}
          </p>

          <h3 class="mt-1.5 text-[17px] font-[680] tracking-[-0.025em] text-fg">
            {{ tool.shortName }}
          </h3>

          <p class="mt-2 min-h-[48px] text-[13px] leading-6 text-fg-muted">
            {{ tool.tagline }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
