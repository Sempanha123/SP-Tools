<script setup lang="ts">
const { categories } = useNewsData()
const accents = ['#6756e8','#e94f67','#1ca6c4','#f59f45','#28a676','#5b7df0','#a263e8','#14a98d','#f16e4b','#db4b8e']
const icons: Record<string,string> = { globe:'🌍',map:'🗺️',landmark:'🏛️',briefcase:'💼',cpu:'💻',flask:'🔬',leaf:'🌿',heart:'❤️' }
const getCategoryIcon = (icon: string | null | undefined) => icons[icon?.trim().toLowerCase() ?? ''] ?? '📰'
</script>

<template>
  <section class="border-b border-line bg-surface-2 py-16 sm:py-20">
    <div class="sp-container-wide">
      <div class="mx-auto max-w-3xl text-center sp-reveal">
        <div class="sp-kicker justify-center">Explore coverage</div>
        <h2 class="mt-3 font-display text-[clamp(2.7rem,5vw,4.1rem)] font-[650] leading-[.96] tracking-[-0.055em] text-fg">One desk. Many lenses.</h2>
        <p class="mx-auto mt-4 max-w-2xl text-[13px] leading-6 text-fg-muted">Move between world affairs, markets, technology, health, science, climate and regional reporting without losing the editorial context.</p>
      </div>

      <div class="sp-stagger mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <NuxtLink v-for="(category,index) in categories" :key="category.slug" :to="`/news/category/${category.slug}`" class="sp-card-interactive group relative min-h-[190px] rounded-[18px] border border-line bg-elevated p-5">
          <div class="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full opacity-[0.08] blur-2xl transition duration-500 group-hover:scale-125 group-hover:opacity-[0.15]" :style="{ background: accents[index % accents.length] }" />
          <div class="relative flex h-full flex-col">
            <div class="flex items-start justify-between">
              <span class="flex h-10 w-10 items-center justify-center rounded-[13px] border border-line bg-surface-3 text-[15px]">{{ getCategoryIcon(category.icon) }}</span>
              <span class="sp-hover-arrow text-fg-subtle">↗</span>
            </div>
            <div class="mt-auto pt-7">
              <h3 class="text-[16px] font-[690] text-fg">{{ category.name }}</h3>
              <p class="mt-2 text-[11px] leading-5 text-fg-muted">{{ category.description }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
