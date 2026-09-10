<script setup lang="ts">
const { featuredArticles, timeAgo, formatViews, getCategoryClasses } = useNewsData()
const mainArticle = computed(() => featuredArticles.value[0])
const secondaryArticles = computed(() => featuredArticles.value.slice(1, 4))
</script>

<template>
  <section v-if="mainArticle" id="top-stories" class="scroll-mt-28 border-b border-line bg-surface py-[72px] sm:py-[88px]">
    <div class="sp-container-wide">
      <div class="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div class="sp-reveal-left">
          <div class="sp-kicker text-danger">Top stories</div>
          <h2 class="mt-4 max-w-4xl font-display text-[clamp(2.8rem,5.5vw,4.9rem)] font-[650] leading-[.88] tracking-[-.064em] text-fg">The stories worth <span class="text-fg-subtle">your attention.</span></h2>
        </div>
        <p class="text-[9px] font-semibold uppercase tracking-[.12em] text-fg-subtle">Updated throughout the day</p>
      </div>

      <div class="grid gap-4 lg:grid-cols-12 lg:grid-rows-[220px_220px]">
        <!-- Lead -->
        <article class="sp-reveal group relative min-h-[520px] overflow-hidden rounded-[26px] border border-line bg-[#0d1119] shadow-pop lg:col-span-8 lg:row-span-2 lg:min-h-0">
          <NuxtLink :to="`/news/posts/${mainArticle.slug}`" class="absolute inset-0">
            <img v-if="mainArticle.image" :src="mainArticle.image" :alt="mainArticle.title" loading="eager" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
            <div v-else class="sp-dot-grid flex h-full items-center justify-center bg-[#101620] text-white/40"><div class="text-center"><span class="text-4xl">📰</span><p class="mt-3 text-xs font-semibold">Cover image unavailable</p></div></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/92 via-black/32 to-black/4" />
            <div class="pointer-events-none absolute -left-20 -top-32 h-72 w-72 rounded-full bg-violet-500/15 blur-[90px]" />

            <div class="absolute left-5 top-5 flex flex-wrap gap-2 sm:left-7 sm:top-7">
              <span class="rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.12em] text-white backdrop-blur" :class="getCategoryClasses(mainArticle.category)">{{ mainArticle.categoryName }}</span>
              <span v-if="mainArticle.isBreaking" class="rounded-full bg-danger px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.12em] text-white">Breaking</span>
            </div>

            <div class="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <p class="text-[9px] font-bold uppercase tracking-[.15em] text-white/40">Lead report</p>
              <h3 class="mt-3 max-w-4xl font-display text-[clamp(2.7rem,5.8vw,5.25rem)] font-[650] leading-[.86] tracking-[-.064em] text-white">{{ mainArticle.title }}</h3>
              <p class="mt-4 max-w-2xl text-[13px] leading-6 text-white/62 sm:text-[15px]">{{ mainArticle.excerpt }}</p>
              <div class="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] font-medium text-white/40">
                <span>{{ mainArticle.source }}</span><span>·</span><time :datetime="mainArticle.publishedAt">{{ timeAgo(mainArticle.publishedAt) }}</time><span>·</span><span>{{ mainArticle.readTime }}</span><span>·</span><span>{{ formatViews(mainArticle.views) }} views</span>
              </div>
            </div>

            <span class="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 sm:right-7 sm:top-7">↗</span>
          </NuxtLink>
        </article>

        <!-- Side stories -->
        <NuxtLink
          v-for="(article, index) in secondaryArticles"
          :key="article.id"
          :to="`/news/posts/${article.slug}`"
          class="sp-lens-card sp-depth-hover group relative min-h-[190px] overflow-hidden rounded-[22px] lg:col-span-4"
          :class="index === 2 ? 'lg:hidden' : ''"
        >
          <div class="grid h-full grid-cols-[128px_minmax(0,1fr)] sm:grid-cols-[160px_minmax(0,1fr)] lg:grid-cols-[42%_58%]">
            <div class="relative overflow-hidden bg-surface-3">
              <img v-if="article.image" :src="article.image" :alt="article.title" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div v-else class="sp-dot-grid flex h-full items-center justify-center text-xl">📰</div>
              <span class="absolute left-3 top-3 flex h-7 min-w-7 items-center justify-center rounded-lg bg-black/58 px-1.5 text-[8px] font-bold text-white backdrop-blur">0{{ index + 2 }}</span>
            </div>
            <div class="flex min-w-0 flex-col p-4 sm:p-5">
              <p class="text-[8px] font-bold uppercase tracking-[.12em] text-accent">{{ article.categoryName }}</p>
              <h3 class="secondary-title mt-2 text-[16px] font-[700] leading-[1.22] tracking-[-.03em] text-fg transition group-hover:text-accent">{{ article.title }}</h3>
              <div class="mt-auto flex items-center gap-2 pt-3 text-[9px] text-fg-subtle"><time :datetime="article.publishedAt">{{ timeAgo(article.publishedAt) }}</time><span>·</span><span>{{ article.readTime }}</span></div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <NuxtLink v-if="secondaryArticles[2]" :to="`/news/posts/${secondaryArticles[2].slug}`" class="sp-lens-card sp-depth-hover group mt-4 hidden grid-cols-[220px_minmax(0,1fr)_42px] items-center gap-5 overflow-hidden rounded-[22px] p-3 lg:grid">
        <div class="relative h-[104px] overflow-hidden rounded-[16px] bg-surface-3"><img v-if="secondaryArticles[2].image" :src="secondaryArticles[2].image" :alt="secondaryArticles[2].title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"/><div v-else class="sp-dot-grid flex h-full items-center justify-center">📰</div></div>
        <div><p class="text-[8px] font-bold uppercase tracking-[.12em] text-accent">{{ secondaryArticles[2].categoryName }}</p><h3 class="mt-2 text-[18px] font-[700] leading-[1.2] tracking-[-.03em] text-fg group-hover:text-accent">{{ secondaryArticles[2].title }}</h3><p class="mt-2 line-clamp-1 text-[11px] text-fg-muted">{{ secondaryArticles[2].excerpt }}</p></div>
        <span class="sp-hover-arrow text-fg-subtle">↗</span>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.secondary-title { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
</style>
