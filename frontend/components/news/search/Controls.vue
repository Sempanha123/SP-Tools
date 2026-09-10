<script setup lang="ts">
import type { NewsSearchDateRange, NewsSearchFilter, NewsSearchSortMode } from '~/composables/useNewsSearch'

interface CategoryOption { slug: string; name: string }
interface Props {
  categories: CategoryOption[]
  regions: string[]
  selectedCategory: string
  selectedRegion: string
  dateRange: NewsSearchDateRange
  sortMode: NewsSearchSortMode
  activeFilters: NewsSearchFilter[]
}
defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:selectedCategory', value: string): void
  (event: 'update:selectedRegion', value: string): void
  (event: 'update:dateRange', value: NewsSearchDateRange): void
  (event: 'update:sortMode', value: NewsSearchSortMode): void
  (event: 'removeFilter', key: NewsSearchFilter['key']): void
  (event: 'clearAll'): void
}>()

const readSelectValue = (event: Event) => (event.target as HTMLSelectElement).value
</script>

<template>
  <section class="news-v4-panel rounded-[22px] p-4 sm:p-5">
    <div class="mb-4 flex items-center justify-between gap-4 border-b border-line pb-4">
      <div>
        <p class="sp-kicker">Refine the desk</p>
        <p class="mt-1.5 text-[12px] text-fg-muted">Narrow coverage without leaving the search flow.</p>
      </div>
      <span class="hidden rounded-full border border-line bg-surface-3 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.12em] text-fg-subtle sm:inline-flex">Live filters</span>
    </div>

    <div class="grid gap-3 xl:grid-cols-[1fr_1fr_1fr_auto] xl:items-end">
      <label class="group">
        <span class="mb-2 block text-[9px] font-bold uppercase tracking-[.14em] text-fg-subtle">Category</span>
        <select :value="selectedCategory" class="h-12 w-full rounded-[12px] border border-line bg-surface-3 px-3.5 text-[12px] font-semibold text-fg outline-none transition hover:border-line-strong focus:border-accent focus:ring-4 focus:ring-accent/10" @change="emit('update:selectedCategory', readSelectValue($event))">
          <option v-for="category in categories" :key="category.slug" :value="category.slug">{{ category.name }}</option>
        </select>
      </label>

      <label>
        <span class="mb-2 block text-[9px] font-bold uppercase tracking-[.14em] text-fg-subtle">Region</span>
        <select :value="selectedRegion" class="h-12 w-full rounded-[12px] border border-line bg-surface-3 px-3.5 text-[12px] font-semibold text-fg outline-none transition hover:border-line-strong focus:border-accent focus:ring-4 focus:ring-accent/10" @change="emit('update:selectedRegion', readSelectValue($event))">
          <option value="all">All regions</option>
          <option v-for="region in regions.filter(item => item !== 'all')" :key="region" :value="region">{{ region }}</option>
        </select>
      </label>

      <label>
        <span class="mb-2 block text-[9px] font-bold uppercase tracking-[.14em] text-fg-subtle">Date published</span>
        <select :value="dateRange" class="h-12 w-full rounded-[12px] border border-line bg-surface-3 px-3.5 text-[12px] font-semibold text-fg outline-none transition hover:border-line-strong focus:border-accent focus:ring-4 focus:ring-accent/10" @change="emit('update:dateRange', readSelectValue($event) as NewsSearchDateRange)">
          <option value="all">Any date</option><option value="24h">Past 24 hours</option><option value="7d">Past 7 days</option><option value="30d">Past 30 days</option>
        </select>
      </label>

      <div>
        <span class="mb-2 block text-[9px] font-bold uppercase tracking-[.14em] text-fg-subtle">Sort results</span>
        <div class="flex h-12 rounded-[12px] border border-line bg-surface-3 p-1">
          <button type="button" class="rounded-[9px] px-4 text-[11px] font-bold transition" :class="sortMode === 'latest' ? 'bg-fg text-surface-2 shadow-sm' : 'text-fg-muted hover:text-fg'" @click="emit('update:sortMode', 'latest')">Latest</button>
          <button type="button" class="rounded-[9px] px-4 text-[11px] font-bold transition" :class="sortMode === 'popular' ? 'bg-accent text-accent-fg shadow-sm' : 'text-fg-muted hover:text-fg'" @click="emit('update:sortMode', 'popular')">Popular</button>
        </div>
      </div>
    </div>

    <div v-if="activeFilters.length" class="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
      <span class="mr-1 text-[9px] font-bold uppercase tracking-[.12em] text-fg-subtle">Active</span>
      <button v-for="filter in activeFilters" :key="filter.key" type="button" class="group inline-flex items-center gap-2 rounded-full border border-accent/18 bg-accent-soft px-3 py-1.5 text-[10px] font-semibold text-accent transition hover:border-danger/25 hover:bg-danger-soft hover:text-danger" @click="emit('removeFilter', filter.key)">
        {{ filter.label }} <span class="opacity-55 group-hover:opacity-100">×</span>
      </button>
      <button type="button" class="ml-auto text-[10px] font-bold text-fg-subtle transition hover:text-danger" @click="emit('clearAll')">Clear all</button>
    </div>
  </section>
</template>
