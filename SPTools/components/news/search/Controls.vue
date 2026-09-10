<script setup lang="ts">
import type {
    NewsSearchDateRange,
    NewsSearchFilter,
    NewsSearchSortMode,
} from '~/composables/useNewsSearch'

interface CategoryOption {
    slug: string
    name: string
}

interface Props {
    categories: CategoryOption[]
    regions: string[]

    selectedCategory: string
    selectedRegion: string

    dateRange:
    NewsSearchDateRange

    sortMode:
    NewsSearchSortMode

    activeFilters:
    NewsSearchFilter[]
}

defineProps<Props>()

const emit = defineEmits<{
    (
        event:
            'update:selectedCategory',
        value: string,
    ): void

    (
        event:
            'update:selectedRegion',
        value: string,
    ): void

    (
        event:
            'update:dateRange',
        value:
            NewsSearchDateRange,
    ): void

    (
        event:
            'update:sortMode',
        value:
            NewsSearchSortMode,
    ): void

    (
        event:
            'removeFilter',
        key:
            NewsSearchFilter['key'],
    ): void

    (
        event:
            'clearAll',
    ): void
}>()

const readSelectValue = (
    event: Event,
) => {
    return (
        event.target as
        HTMLSelectElement
    ).value
}
</script>

<template>
    <section class="rounded-[28px]
    border border-line
    bg-surface p-5
    shadow-[0_14px_40px_rgba(15,23,42,0.05)]
    sm:p-6">
        <div class="flex flex-col
      justify-between gap-5
      xl:flex-row
      xl:items-center">
            <!-- Filters -->

            <div class="grid flex-1
        gap-3 sm:grid-cols-3">
                <!-- Category -->

                <label>
                    <span class="mb-2 block
            text-[10px] font-bold
            uppercase tracking-[0.14em]
            text-fg-subtle">
                        Category
                    </span>

                    <select :value="selectedCategory
                        " class="h-12 w-full
            rounded-xl border
            border-line
            bg-surface-2 px-4
            text-sm font-semibold
            text-fg-muted
            outline-none
            transition-all
            focus:border-indigo-400
            focus:bg-surface
            focus:ring-4
            focus:ring-indigo-500/10" @change="
                emit(
                    'update:selectedCategory',
                    readSelectValue(
                        $event,
                    ),
                )
                ">
                        <option v-for="category in categories" :key="category.slug" :value="category.slug">
                            {{ category.name }}
                        </option>
                    </select>
                </label>

                <!-- Region -->

                <label>
                    <span class="mb-2 block
            text-[10px] font-bold
            uppercase tracking-[0.14em]
            text-fg-subtle">
                        Region
                    </span>

                    <select :value="selectedRegion
                        " class="h-12 w-full
            rounded-xl border
            border-line
            bg-surface-2 px-4
            text-sm font-semibold
            text-fg-muted
            outline-none
            transition-all
            focus:border-indigo-400
            focus:bg-surface
            focus:ring-4
            focus:ring-indigo-500/10" @change="
                emit(
                    'update:selectedRegion',
                    readSelectValue(
                        $event,
                    ),
                )
                ">
                        <option value="all">
                            All regions
                        </option>

                        <option v-for="region in regions.filter(
                            (item) =>
                                item !== 'all',
                        )" :key="region" :value="region">
                            {{ region }}
                        </option>
                    </select>
                </label>

                <!-- Date -->

                <label>
                    <span class="mb-2 block
            text-[10px] font-bold
            uppercase tracking-[0.14em]
            text-fg-subtle">
                        Date published
                    </span>

                    <select :value="dateRange" class="h-12 w-full
            rounded-xl border
            border-line
            bg-surface-2 px-4
            text-sm font-semibold
            text-fg-muted
            outline-none
            transition-all
            focus:border-indigo-400
            focus:bg-surface
            focus:ring-4
            focus:ring-indigo-500/10" @change="
                emit(
                    'update:dateRange',
                    readSelectValue(
                        $event,
                    ) as NewsSearchDateRange,
                )
                ">
                        <option value="all">
                            Any date
                        </option>

                        <option value="24h">
                            Past 24 hours
                        </option>

                        <option value="7d">
                            Past 7 days
                        </option>

                        <option value="30d">
                            Past 30 days
                        </option>
                    </select>
                </label>
            </div>

            <!-- Sort mode -->

            <div>
                <span class="mb-2 block
          text-[10px] font-bold
          uppercase tracking-[0.14em]
          text-fg-subtle">
                    Sort results
                </span>

                <div class="flex rounded-xl
          border border-line
          bg-surface-2 p-1">
                    <button type="button" class="rounded-lg
            px-5 py-2.5
            text-xs font-bold
            transition-all" :class="sortMode === 'latest'
                    ? 'bg-accent text-accent-fg text-white shadow-sm'
                    : 'text-fg-subtle hover:text-fg'
                " @click="
                emit(
                    'update:sortMode',
                    'latest',
                )
                ">
                        Latest
                    </button>

                    <button type="button" class="rounded-lg
            px-5 py-2.5
            text-xs font-bold
            transition-all" :class="sortMode === 'popular'
                    ? 'bg-accent text-accent-fg text-white shadow-sm'
                    : 'text-fg-subtle hover:text-fg'
                " @click="
                emit(
                    'update:sortMode',
                    'popular',
                )
                ">
                        Popular
                    </button>
                </div>
            </div>
        </div>

        <!-- Active filters -->

        <div v-if="
            activeFilters.length
        " class="mt-6 flex
      flex-wrap items-center
      gap-2 border-t
      border-line pt-5">
            <span class="mr-1
        text-[10px] font-bold
        uppercase tracking-[0.14em]
        text-fg-subtle">
                Active filters
            </span>

            <button v-for="filter in activeFilters" :key="filter.key" type="button" class="group inline-flex
        items-center gap-2
        rounded-full
        border border-indigo-100
        bg-indigo-50
        px-3.5 py-2
        text-[10px] font-semibold
        text-indigo-700
        transition-all
        hover:border-red-200
        hover:bg-red-50
        hover:text-red-600" @click="
            emit(
                'removeFilter',
                filter.key,
            )
            ">
                {{ filter.label }}

                <span class="text-sm
          text-indigo-400
          group-hover:text-red-500">
                    ×
                </span>
            </button>

            <button type="button" class="ml-auto
        text-[10px] font-bold
        text-fg-subtle
        transition-colors
        hover:text-red-600" @click="
            emit('clearAll')
            ">
                Clear all
            </button>
        </div>
    </section>
</template>