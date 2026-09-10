<script setup lang="ts">
const { categories } = useNewsData()

const categoryAccentMap: Record<
  string,
  string
> = {
  slate:
    'from-slate-500 to-slate-700',

  red:
    'from-red-500 to-rose-600',

  orange:
    'from-orange-500 to-red-600',

  amber:
    'from-amber-400 to-orange-600',

  yellow:
    'from-yellow-400 to-amber-600',

  green:
    'from-green-500 to-emerald-700',

  emerald:
    'from-emerald-500 to-teal-700',

  teal:
    'from-teal-500 to-cyan-700',

  cyan:
    'from-cyan-500 to-blue-600',

  blue:
    'from-blue-500 to-indigo-700',

  indigo:
    'from-indigo-500 to-violet-700',

  violet:
    'from-violet-500 to-purple-700',

  purple:
    'from-purple-500 to-fuchsia-700',

  rose:
    'from-rose-500 to-pink-700',
}

const categoryIconMap: Record<
  string,
  string
> = {
  globe: '🌍',
  map: '🗺️',
  landmark: '🏛️',
  briefcase: '💼',
  cpu: '💻',
  flask: '🔬',
  leaf: '🌿',
  heart: '❤️',
}

const getCategoryAccent = (
  color: string | null | undefined,
): string => {
  const normalizedColor =
    color?.trim().toLowerCase() ?? ''

  return (
    categoryAccentMap[
    normalizedColor
    ] ??
    categoryAccentMap.slate
  )
}

const getCategoryIcon = (
  icon: string | null | undefined,
): string => {
  const normalizedIcon =
    icon?.trim().toLowerCase() ?? ''

  return (
    categoryIconMap[
    normalizedIcon
    ] ??
    '📰'
  )
}
</script>

<template>
  <section class="bg-surface-2 py-24 sm:py-28">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mx-auto max-w-3xl text-center">
        <span class="text-xs font-bold uppercase
          tracking-[0.2em] text-indigo-600">
          Explore coverage
        </span>

        <h2 class="mt-5 text-4xl font-bold
          tracking-[-0.04em] sm:text-5xl">
          News for every
          <span class="text-fg-subtle">
            major topic.
          </span>
        </h2>

        <p class="mx-auto mt-5 max-w-2xl
          text-sm leading-7 text-fg-subtle sm:text-base">
          Browse international news, markets, technology,
          health, science, climate and regional developments.
        </p>
      </div>

      <div class="mt-14 grid gap-4
        sm:grid-cols-2 lg:grid-cols-5">
        <NuxtLink v-for="category in categories" :key="category.slug" :to="`/news/category/${category.slug}`" class="group relative overflow-hidden
          rounded-[26px] border border-line
          bg-surface p-6 transition-all duration-300
          hover:-translate-y-1 hover:border-indigo-200
          hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div class="pointer-events-none absolute
            -right-10 -top-10 h-28 w-28
            rounded-full bg-gradient-to-br
            opacity-10 blur-2xl transition-opacity
            group-hover:opacity-25" :class="getCategoryAccent(category.color)" />

          <div class="relative flex h-12 w-12
            items-center justify-center rounded-2xl
            bg-gradient-to-br text-sm font-bold
            text-white shadow-lg" :class="getCategoryAccent(category.color)">
            {{ getCategoryIcon(category.icon) }}
          </div>

          <h3 class="relative mt-6 text-base font-bold
            text-fg transition-colors
            group-hover:text-indigo-600">
            {{ category.name }}
          </h3>

          <p class="relative mt-2 text-xs
            leading-6 text-fg-subtle">
            {{ category.description }}
          </p>

          <div class="relative mt-5 flex items-center
            gap-2 text-xs font-bold text-fg">
            View coverage

            <span class="transition-transform
              group-hover:translate-x-1">
              →
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>