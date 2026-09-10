<script setup lang="ts">
const { featuredArticles, timeAgo, formatViews, getCategoryClasses } = useNewsData()
const mainArticle = computed(() => featuredArticles.value[0])
const secondaryArticles = computed(() => featuredArticles.value.slice(1, 4))
</script>

<template>
  <section v-if="mainArticle" id="top-stories" class="scroll-mt-28 border-b border-line bg-surface py-16 sm:py-20">
    <div class="sp-container-wide">
      <div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div class="sp-reveal-left">
          <div class="sp-kicker text-danger">Top stories</div>
          <h2 class="mt-3 max-w-3xl font-display text-[clamp(2.5rem,5vw,4.2rem)] font-[650] leading-[.95] tracking-[-0.055em] text-fg">What matters now.</h2>
        </div>
        <p class="text-[10px] font-semibold uppercase tracking-[0.11em] text-fg-subtle">Updated throughout the day</p>
      </div>

      <div class="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(330px,.75fr)]">
        <article class="sp-reveal group relative min-h-[560px] overflow-hidden rounded-[24px] border border-line bg-elevated shadow-lift">
          <NuxtLink :to="`/news/posts/${mainArticle.slug}`" class="absolute inset-0">
            <img v-if="mainArticle.image" :src="mainArticle.image" :alt="mainArticle.title" loading="eager" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
            <div v-else class="sp-dot-grid flex h-full items-center justify-center bg-surface-3 text-fg-subtle"><div class="text-center"><span class="text-4xl">📰</span><p class="mt-3 text-xs font-semibold">Cover image unavailable</p></div></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/28 to-black/5" />
            <div class="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <div class="flex flex-wrap gap-2">
                <span class="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.11em] text-white backdrop-blur" :class="getCategoryClasses(mainArticle.category)">{{ mainArticle.categoryName }}</span>
                <span v-if="mainArticle.isBreaking" class="rounded-full bg-danger px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.11em] text-white">Breaking</span>
              </div>
              <h3 class="mt-5 max-w-4xl font-display text-[clamp(2.4rem,5vw,4.6rem)] font-[650] leading-[.95] tracking-[-.055em] text-white">{{ mainArticle.title }}</h3>
              <p class="mt-4 max-w-2xl text-[13px] leading-6 text-white/72 sm:text-[15px]">{{ mainArticle.excerpt }}</p>
              <div class="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium text-white/58">
                <span>{{ mainArticle.source }}</span><span>·</span><time :datetime="mainArticle.publishedAt">{{ timeAgo(mainArticle.publishedAt) }}</time><span>·</span><span>{{ mainArticle.readTime }}</span><span>·</span><span>{{ formatViews(mainArticle.views) }} views</span>
              </div>
            </div>
            <span class="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
          </NuxtLink>
        </article>

        <div class="sp-stagger grid gap-4">
          <NuxtLink v-for="(article, index) in secondaryArticles" :key="article.id" :to="`/news/posts/${article.slug}`" class="sp-card-interactive group grid min-h-[175px] grid-cols-[120px_minmax(0,1fr)] overflow-hidden rounded-[19px] border border-line bg-elevated sm:grid-cols-[150px_minmax(0,1fr)]">
            <div class="relative overflow-hidden bg-surface-3">
              <img v-if="article.image" :src="article.image" :alt="article.title" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div v-else class="sp-dot-grid flex h-full items-center justify-center text-xl">📰</div>
              <span class="absolute left-3 top-3 flex h-7 min-w-7 items-center justify-center rounded-lg bg-black/55 px-1.5 text-[9px] font-bold text-white backdrop-blur">0{{ index + 2 }}</span>
            </div>
            <div class="flex min-w-0 flex-col p-4 sm:p-5">
              <div class="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.11em] text-accent"><span>{{ article.categoryName }}</span><span v-if="article.isBreaking" class="text-danger">Breaking</span></div>
              <h3 class="secondary-title mt-2 text-[16px] font-[690] leading-[1.3] text-fg transition group-hover:text-accent">{{ article.title }}</h3>
              <div class="mt-auto flex items-center gap-2 pt-3 text-[9px] text-fg-subtle"><time :datetime="article.publishedAt">{{ timeAgo(article.publishedAt) }}</time><span>·</span><span>{{ article.readTime }}</span></div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.secondary-title { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
</style>
