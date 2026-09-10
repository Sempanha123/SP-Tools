<script setup lang="ts">
const {
  articles,
  timeAgo,
} = useNewsData()

const regionCards = computed(() => {
  const regions = [
    {
      name: 'Asia',
      description: 'Politics, economy and regional developments.',
      route: '/news/category/asia',
      accent: 'from-red-500 to-orange-500',
    },
    {
      name: 'Europe',
      description: 'European policy, business and society.',
      route: '/news/category/europe',
      accent: 'from-violet-500 to-fuchsia-500',
    },
    {
      name: 'Americas',
      description: 'News across North and Latin America.',
      route: '/news/category/americas',
      accent: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Middle East',
      description: 'Diplomacy, security and regional affairs.',
      route: '/news/category/middle-east',
      accent: 'from-amber-500 to-orange-600',
    },
  ]

  return regions.map((region) => ({
    ...region,
    latestArticle: articles.value
      .filter(
        (article) =>
          article.region.toLowerCase() === region.name.toLowerCase(),
      )
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime(),
      )[0],
  }))
})
</script>

<template>
  <section class="border-y border-line
    bg-surface py-24 sm:py-28">
    <div class="mx-auto max-w-7xl px-6">
      <div class="flex flex-col justify-between gap-5
        sm:flex-row sm:items-end">
        <div>
          <span class="text-xs font-bold uppercase
            tracking-[0.2em] text-indigo-600">
            Around the world
          </span>

          <h2 class="mt-4 text-4xl font-bold
            tracking-[-0.04em] sm:text-5xl">
            Explore news
            <span class="text-fg-subtle">
              by region.
            </span>
          </h2>
        </div>

        <NuxtLink to="/news/category/world" class="group inline-flex items-center
          gap-2 text-sm font-bold text-fg">
          All world news

          <span class="transition-transform
            group-hover:translate-x-1">
            →
          </span>
        </NuxtLink>
      </div>

      <div class="mt-12 grid gap-5
        sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink v-for="region in regionCards" :key="region.name" :to="region.route" class="group relative min-h-[360px]
          overflow-hidden rounded-[28px] bg-accent text-accent-fg">
          <img v-if="region.latestArticle?.image" :src="region.latestArticle.image ?? undefined" :alt="region.name"
            loading="lazy" class="absolute inset-0 h-full w-full
        object-cover transition-transform duration-700
        group-hover:scale-105" />
          <div v-else class="absolute inset-0 flex items-center
      justify-center bg-gradient-to-br
      from-slate-100 to-slate-200">
            <span class="text-4xl" aria-hidden="true">
              🌍
            </span>
          </div>

          <div class="absolute inset-0 bg-gradient-to-t
            from-slate-950 via-slate-950/55 to-transparent" />

          <div class="absolute right-5 top-5
            flex h-10 w-10 items-center
            justify-center rounded-xl bg-gradient-to-br
            text-white shadow-lg" :class="region.accent">
            →
          </div>

          <div class="absolute inset-x-0 bottom-0 p-6">
            <span class="text-[10px] font-bold uppercase
              tracking-[0.18em] text-indigo-300">
              Region
            </span>

            <h3 class="mt-2 text-2xl font-bold text-white">
              {{ region.name }}
            </h3>

            <p class="mt-2 text-sm leading-6 text-fg-subtle">
              {{ region.description }}
            </p>

            <div v-if="region.latestArticle" class="mt-5 border-t border-line/10 pt-4">
              <p class="region-title text-sm font-semibold
                leading-6 text-slate-200">
                {{ region.latestArticle.title }}
              </p>

              <time :datetime="region.latestArticle.publishedAt" class="mt-2 block text-[10px] text-fg-subtle">
                {{ timeAgo(region.latestArticle.publishedAt) }}
              </time>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.region-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>