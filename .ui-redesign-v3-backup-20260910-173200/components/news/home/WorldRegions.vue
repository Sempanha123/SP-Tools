<script setup lang="ts">
const { articles, timeAgo } = useNewsData()

const regionCards = computed(() => {
  const regions = [
    { name: 'Asia', description: 'Politics, economy and regional developments.', route: '/news/category/asia', accent: '#ff6b57', code: 'AS' },
    { name: 'Europe', description: 'European policy, business and society.', route: '/news/category/europe', accent: '#8b65f5', code: 'EU' },
    { name: 'Americas', description: 'News across North and Latin America.', route: '/news/category/americas', accent: '#1ba7c8', code: 'AM' },
    { name: 'Middle East', description: 'Diplomacy, security and regional affairs.', route: '/news/category/middle-east', accent: '#f59c45', code: 'ME' },
  ]

  return regions.map((region) => ({
    ...region,
    latestArticle: articles.value
      .filter(article => article.region.toLowerCase() === region.name.toLowerCase())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0],
  }))
})
</script>

<template>
  <section class="relative overflow-hidden border-y border-line bg-surface py-16 sm:py-20">
    <div class="sp-quiet-grid pointer-events-none absolute inset-x-0 top-0 h-80 opacity-[0.18]" />
    <div class="sp-container-wide relative">
      <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div class="sp-reveal-left">
          <div class="sp-kicker">Around the world</div>
          <h2 class="mt-3 font-display text-[clamp(2.7rem,5vw,4.2rem)] font-[650] leading-[.96] tracking-[-0.055em] text-fg">Explore by region.</h2>
        </div>
        <NuxtLink to="/news/category/world" class="group inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition hover:text-fg">All world news <span class="sp-hover-arrow text-accent">↗</span></NuxtLink>
      </div>

      <div class="sp-stagger mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink v-for="region in regionCards" :key="region.name" :to="region.route" class="group relative min-h-[360px] overflow-hidden rounded-[22px] border border-line bg-[#10131b] text-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
          <img v-if="region.latestArticle?.image" :src="region.latestArticle.image ?? undefined" :alt="region.name" loading="lazy" class="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-[1.045]" />
          <div v-else class="sp-dot-grid absolute inset-0 opacity-[0.13]" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/5" />
          <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-25 blur-3xl transition duration-500 group-hover:scale-125" :style="{ background: region.accent }" />
          <span class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/12 bg-white/7 text-[10px] font-bold text-white backdrop-blur">{{ region.code }}</span>
          <div class="absolute inset-x-0 bottom-0 p-5">
            <p class="text-[9px] font-bold uppercase tracking-[.14em] text-white/45">Region</p>
            <h3 class="mt-2 font-display text-[2rem] font-[650] leading-none">{{ region.name }}</h3>
            <p class="mt-3 text-[12px] leading-5 text-white/62">{{ region.description }}</p>
            <div v-if="region.latestArticle" class="mt-5 border-t border-white/10 pt-4">
              <p class="region-title text-[12px] font-semibold leading-5 text-white/86">{{ region.latestArticle.title }}</p>
              <time :datetime="region.latestArticle.publishedAt" class="mt-2 block text-[9px] text-white/42">{{ timeAgo(region.latestArticle.publishedAt) }}</time>
            </div>
            <span class="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold text-white/75">Open region <span class="sp-hover-arrow">↗</span></span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.region-title { display:-webkit-box; overflow:hidden; -webkit-box-orient:vertical; -webkit-line-clamp:2; }
</style>
