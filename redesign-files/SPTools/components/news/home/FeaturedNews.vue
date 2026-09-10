<script setup lang="ts">
const {
  featuredArticles,
  timeAgo,
  formatViews,
  getCategoryClasses,
} = useNewsData()

const mainArticle = computed(() => featuredArticles.value[0])
const secondaryArticles = computed(() => featuredArticles.value.slice(1, 4))
</script>

<template>
  <section v-if="mainArticle" id="top-stories" class="scroll-mt-28 bg-surface py-12 sm:py-14">
    <div class="sp-container">
      <div class="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div class="sp-kicker">
            <span class="h-1.5 w-1.5 rounded-full bg-danger" />
            Top stories
          </div>
          <h2 class="mt-3 text-[2rem] font-[700] leading-[1.05] tracking-[-0.04em] text-fg sm:text-[2.6rem]">
            The stories worth your attention.
          </h2>
        </div>
        <p class="text-[11px] text-fg-subtle">Updated throughout the day</p>
      </div>

      <div class="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,.75fr)]">
        <article class="overflow-hidden rounded-[18px] border border-line bg-elevated shadow-soft">
          <NuxtLink :to="`/news/posts/${mainArticle.slug}`" class="group block">
            <div class="relative aspect-[16/9] overflow-hidden bg-surface-3">
              <img
                v-if="mainArticle.image"
                :src="mainArticle.image"
                :alt="mainArticle.title"
                loading="eager"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              />
              <div v-else class="flex h-full items-center justify-center text-fg-subtle">
                <div class="text-center">
                  <span class="text-3xl" aria-hidden="true">📰</span>
                  <p class="mt-2 text-xs font-medium">Cover image unavailable</p>
                </div>
              </div>

              <div class="absolute left-4 top-4 flex flex-wrap gap-2">
                <span v-if="mainArticle.isBreaking" class="rounded-lg bg-danger px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                  Breaking
                </span>
                <span v-if="mainArticle.isLive" class="rounded-lg border border-white/20 bg-black/45 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur">
                  Live
                </span>
              </div>
            </div>

            <div class="p-5 sm:p-6">
              <span class="inline-flex rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em]" :class="getCategoryClasses(mainArticle.category)">
                {{ mainArticle.categoryName }}
              </span>

              <h3 class="mt-4 max-w-3xl font-display text-[2rem] font-[650] leading-[1.02] tracking-[-0.04em] text-fg transition group-hover:text-accent sm:text-[2.7rem]">
                {{ mainArticle.title }}
              </h3>

              <p class="mt-4 max-w-3xl text-[14px] leading-7 text-fg-muted sm:text-[15px]">
                {{ mainArticle.excerpt }}
              </p>

              <div class="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-medium text-fg-subtle">
                <span>{{ mainArticle.source }}</span>
                <span>·</span>
                <time :datetime="mainArticle.publishedAt">{{ timeAgo(mainArticle.publishedAt) }}</time>
                <span>·</span>
                <span>{{ mainArticle.readTime }}</span>
                <span>·</span>
                <span>{{ formatViews(mainArticle.views) }} views</span>
              </div>
            </div>
          </NuxtLink>
        </article>

        <div class="overflow-hidden rounded-[18px] border border-line bg-elevated">
          <NuxtLink
            v-for="(article, index) in secondaryArticles"
            :key="article.id"
            :to="`/news/posts/${article.slug}`"
            class="group grid grid-cols-[112px_minmax(0,1fr)] gap-4 p-4 transition hover:bg-surface-3/60"
            :class="index ? 'border-t border-line' : ''"
          >
            <div class="aspect-square overflow-hidden rounded-[12px] bg-surface-3">
              <img
                v-if="article.image"
                :src="article.image"
                :alt="article.title"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-400 group-hover:scale-[1.04]"
              />
              <div v-else class="flex h-full items-center justify-center text-xl" aria-hidden="true">📰</div>
            </div>

            <div class="min-w-0">
              <div class="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.1em] text-accent">
                <span>{{ article.categoryName }}</span>
                <span v-if="article.isBreaking" class="text-danger">Breaking</span>
              </div>

              <h3 class="secondary-title mt-2 text-[15px] font-[680] leading-[1.35] tracking-[-0.02em] text-fg transition group-hover:text-accent">
                {{ article.title }}
              </h3>

              <div class="mt-3 flex items-center gap-2 text-[10px] text-fg-subtle">
                <time :datetime="article.publishedAt">{{ timeAgo(article.publishedAt) }}</time>
                <span>·</span>
                <span>{{ article.readTime }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.secondary-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
