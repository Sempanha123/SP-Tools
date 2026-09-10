<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const {
  categories,
} = useNewsData()

const navSearchQuery = ref(
  typeof route.query.q === 'string'
    ? route.query.q
    : '',
)
const isCategoryActive = (slug: string) => {
  return route.path === `/news/category/${slug}`
}

const submitSearch = async () => {
  const query = navSearchQuery.value.trim()

  await router.push({
    path: '/news/search',
    query: query
      ? { q: query }
      : {},
  })
}
const categoryAccentMap: Record<string, string> = {
  slate: 'from-slate-500 to-slate-700',
  red: 'from-red-500 to-rose-600',
  orange: 'from-orange-500 to-red-600',
  amber: 'from-amber-400 to-orange-600',
  yellow: 'from-yellow-400 to-amber-600',
  lime: 'from-lime-500 to-green-600',
  green: 'from-green-500 to-emerald-700',
  emerald: 'from-emerald-500 to-teal-700',
  teal: 'from-teal-500 to-cyan-700',
  cyan: 'from-cyan-500 to-blue-600',
  sky: 'from-sky-500 to-blue-700',
  blue: 'from-blue-500 to-indigo-700',
  indigo: 'from-indigo-500 to-violet-700',
  violet: 'from-violet-500 to-purple-700',
  purple: 'from-purple-500 to-fuchsia-700',
  fuchsia: 'from-fuchsia-500 to-pink-700',
  pink: 'from-pink-500 to-rose-700',
  rose: 'from-rose-500 to-red-700',
}

const categoryIconMap: Record<string, string> = {
  globe: '🌍',
  map: '🗺️',
  landmark: '🏛️',
  briefcase: '💼',
  cpu: '💻',
  flask: '🔬',
  leaf: '🌿',
  heart: '❤️',
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

const getCategoryAccent = (
  color: string | null | undefined,
): string => {
  const key = color?.trim().toLowerCase() ?? ''

  return categoryAccentMap[key]
    ?? categoryAccentMap.slate
}

const getCategoryIcon = (
  icon: string | null | undefined,
): string => {
  const key = icon?.trim().toLowerCase() ?? ''

  return categoryIconMap[key] ?? '📰'
}

const getCategoryShortName = (
  name: string | null | undefined,
): string => {
  const cleanName = name?.trim() ?? ''

  if (!cleanName) {
    return 'News'
  }

  return categoryShortNameMap[
    cleanName.toLowerCase()
  ] ?? cleanName
}
</script>

<template>
  <section class="sticky top-[76px] z-30
    border-b border-line
    bg-surface/95 shadow-sm
    backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl
      flex-col gap-4 px-6 py-4
      xl:flex-row xl:items-center">
      <!-- Category navigation -->
      <nav aria-label="News categories" class="category-scroll flex min-w-0
        flex-1 items-center gap-2
        overflow-x-auto pb-1 xl:pb-0">
        <!-- Latest -->
        <NuxtLink to="/news" class="shrink-0 rounded-xl
          border px-4 py-2.5
          text-xs font-bold
          transition-all duration-200" :class="route.path === '/news'
            ? 'border-accent bg-accent text-accent-fg shadow-md'
            : 'border-line bg-surface text-fg-muted hover:border-accent/40 hover:bg-accent-soft hover:text-accent'
            ">
          Latest
        </NuxtLink>

        <!-- Categories -->
        <NuxtLink v-for="category in categories" :key="category.slug" :to="`/news/category/${category.slug}`" class="group flex shrink-0
          items-center gap-2 rounded-xl
          border px-3.5 py-2.5
          text-xs font-semibold
          transition-all duration-200" :class="isCategoryActive(category.slug)
            ? 'border-accent bg-accent text-accent-fg shadow-md'
            : 'border-line bg-surface text-fg-muted hover:border-accent/40 hover:bg-accent-soft hover:text-accent'
            ">
          <span class="flex h-6 w-6
  items-center justify-center
  rounded-lg bg-gradient-to-br
  text-[9px] font-bold
  text-white shadow-sm" :class="getCategoryAccent(category.color)">
            {{ getCategoryIcon(category.icon) }}
          </span>

          {{ getCategoryShortName(category.name) }}
        </NuxtLink>
      </nav>

      <!-- Search form -->
      <form class="relative w-full shrink-0 xl:w-80" role="search" @submit.prevent="submitSearch">
        <label for="news-nav-search" class="sr-only">
          Search news
        </label>

        <svg class="pointer-events-none
          absolute left-4 top-1/2
          h-4 w-4 -translate-y-1/2
          text-fg-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />

          <path d="m20 20-3.5-3.5" />
        </svg>

        <input id="news-nav-search" v-model="navSearchQuery" type="search" placeholder="Search world news..."
          autocomplete="off" class="h-11 w-full rounded-xl
          border border-line
          bg-surface-2 pl-11 pr-12
          text-sm text-fg
          outline-none transition-all
          placeholder:text-fg-subtle
          hover:border-line-strong
          focus:border-accent
          focus:bg-surface
          focus:ring-4
          focus:ring-accent/10" />

        <button type="submit" class="absolute right-1.5 top-1/2
          flex h-8 w-8
          -translate-y-1/2
          items-center justify-center
          rounded-lg text-fg-muted
          transition-all
          hover:bg-accent-soft
          hover:text-accent
          focus:outline-none
          focus:ring-2
          focus:ring-accent/30" aria-label="Submit news search">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            aria-hidden="true">
            <circle cx="11" cy="11" r="7" />

            <path d="m20 20-3.5-3.5" />
          </svg>
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