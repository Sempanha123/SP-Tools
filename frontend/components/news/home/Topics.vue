<script setup lang="ts">
const { categories } = useNewsData()
const accents = ['#6557f5','#e94f67','#13adbf','#f59f45','#28a676','#5b7df0','#a263e8','#14a98d','#f16e4b','#db4b8e']
const icons: Record<string,string> = { globe:'🌍',map:'🗺️',landmark:'🏛️',briefcase:'💼',cpu:'💻',flask:'🔬',leaf:'🌿',heart:'❤️' }
const getCategoryIcon = (icon: string | null | undefined) => icons[icon?.trim().toLowerCase() ?? ''] ?? '📰'
</script>

<template>
  <section class="relative overflow-hidden border-b border-line bg-surface-2 py-[72px] sm:py-[88px]">
    <div class="sp-quiet-grid pointer-events-none absolute inset-x-0 top-0 h-80 opacity-[.16]" />
    <div class="sp-container-wide relative">
      <div class="sp-reveal mx-auto max-w-3xl text-center">
        <div class="sp-kicker justify-center">Explore coverage</div>
        <h2 class="mt-4 font-display text-[clamp(2.8rem,5vw,4.5rem)] font-[650] leading-[.9] tracking-[-.06em] text-fg">Many lenses. <span class="text-fg-subtle">One editorial system.</span></h2>
        <p class="mx-auto mt-5 max-w-2xl text-[13px] leading-6 text-fg-muted">Move between world affairs, markets, technology, health, science, climate and regional reporting without losing context.</p>
      </div>

      <div class="sp-stagger mt-10 grid auto-rows-[170px] gap-4 md:grid-cols-6">
        <NuxtLink
          v-for="(category,index) in categories"
          :key="category.slug"
          :to="`/news/category/${category.slug}`"
          class="sp-lens-card sp-depth-hover group relative overflow-hidden rounded-[22px] p-5"
          :class="index === 0 ? 'md:col-span-3 md:row-span-2' : index === 1 ? 'md:col-span-3' : index < 5 ? 'md:col-span-2' : 'md:col-span-3'"
        >
          <div class="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full opacity-[.14] blur-3xl transition duration-500 group-hover:scale-125 group-hover:opacity-[.24]" :style="{ background: accents[index % accents.length] }" />
          <div class="relative flex h-full flex-col">
            <div class="flex items-start justify-between">
              <span class="flex h-11 w-11 items-center justify-center rounded-[14px] border border-line bg-surface-3 text-[16px] shadow-xs">{{ getCategoryIcon(category.icon) }}</span>
              <span class="text-[8px] font-bold uppercase tracking-[.13em] text-fg-subtle">0{{ index + 1 }}</span>
            </div>
            <div class="mt-auto pt-5">
              <h3 class="font-[710] tracking-[-.035em] text-fg" :class="index === 0 ? 'text-[2rem]' : 'text-[17px]'">{{ category.name }}</h3>
              <p class="mt-2 max-w-md text-[11px] leading-5 text-fg-muted">{{ category.description }}</p>
            </div>
            <span class="sp-hover-arrow absolute bottom-0 right-0 text-fg-subtle">↗</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
