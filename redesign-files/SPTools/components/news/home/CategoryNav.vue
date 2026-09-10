<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { categories } = useNewsData()

const navSearchQuery = ref(
  typeof route.query.q === 'string' ? route.query.q : '',
)

const isCategoryActive = (slug: string) =>
  route.path === `/news/category/${slug}`

const submitSearch = async () => {
  const query = navSearchQuery.value.trim()
  await router.push({
    path: '/news/search',
    query: query ? { q: query } : {},
  })
}

const categoryShortNameMap: Record<string, string> = {
  world: 'World',
  asia: 'Asia',
  americas: 'Americas',
  europe: 'Europe',
  'middle east': 'M. East',
  business: 'Business',
  technology: 'Tech',
  science: 'Science',
  climate: 'Climate',
  health: 'Health',
}

const getCategoryShortName = (name: string | null | undefined) => {
  const cleanName = name?.trim() ?? ''
  if (!cleanName) return 'News'
  return categoryShortNameMap[cleanName.toLowerCase()] ?? cleanName
}
</script>

<template>
  <section class="sticky top-[68px] z-30 border-b border-line bg-surface/[0.94] backdrop-blur-xl">
    <div class="sp-container flex flex-col gap-3 py-3 xl:flex-row xl:items-center">
      <nav aria-label="News categories" class="category-scroll flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
        <NuxtLink
          to="/news"
          class="shrink-0 border-b-2 px-3 py-2 text-[12px] font-semibold transition"
          :class="route.path === '/news'
            ? 'border-accent text-fg'
            : 'border-transparent text-fg-muted hover:text-fg'"
        >
          Latest
        </NuxtLink>

        <NuxtLink
          v-for="category in categories"
          :key="category.slug"
          :to="`/news/category/${category.slug}`"
          class="shrink-0 border-b-2 px-3 py-2 text-[12px] font-semibold transition"
          :class="isCategoryActive(category.slug)
            ? 'border-accent text-fg'
            : 'border-transparent text-fg-muted hover:text-fg'"
        >
          {{ getCategoryShortName(category.name) }}
        </NuxtLink>
      </nav>

      <form class="relative w-full shrink-0 xl:w-[280px]" role="search" @submit.prevent="submitSearch">
        <label for="news-nav-search" class="sr-only">Search news</label>

        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>

        <input
          id="news-nav-search"
          v-model="navSearchQuery"
          type="search"
          placeholder="Search news"
          autocomplete="off"
          class="h-9 w-full rounded-[11px] border border-line bg-elevated pl-9 pr-9 text-[12px] text-fg outline-none transition placeholder:text-fg-subtle focus:border-accent/[0.55] focus:ring-4 focus:ring-accent/10"
        />

        <button
          type="submit"
          class="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-fg-subtle transition hover:bg-surface-3 hover:text-fg"
          aria-label="Submit news search"
        >
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.category-scroll {
  scrollbar-width: none;
}
.category-scroll::-webkit-scrollbar {
  display: none;
}
</style>
