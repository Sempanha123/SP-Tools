<script setup lang="ts">
/**
 * Preview of a resolved video: thumbnail, title, author and any stat pills.
 * Shared by the TikTok, Facebook and YouTube pages so a fetched result always
 * looks the same regardless of which service returned it.
 */
withDefaults(
  defineProps<{
    thumbnail?: string | null
    title?: string | null
    author?: string | null
    avatar?: string | null
    /** Small key/value pills under the title, e.g. Duration · 0:42. */
    stats?: { label: string; value: string }[]
    /** Portrait framing for TikTok-style vertical video. */
    portrait?: boolean
    accent?: string
  }>(),
  { stats: () => [] },
)
</script>

<template>
  <div class="sp-card overflow-hidden">
    <div class="flex flex-col gap-5 p-5 sm:flex-row">
      <div
        class="relative shrink-0 overflow-hidden rounded-xl bg-surface-3"
        :class="portrait ? 'mx-auto aspect-[9/16] w-40 sm:mx-0' : 'aspect-video w-full sm:w-60'"
      >
        <img
          v-if="thumbnail"
          :src="thumbnail"
          :alt="title || 'Video thumbnail'"
          class="h-full w-full object-cover"
          referrerpolicy="no-referrer"
          loading="lazy"
        />

        <div
          v-else
          class="flex h-full w-full items-center justify-center text-fg-subtle"
        >
          <svg
            class="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2.5" />
            <path stroke-linecap="round" d="M10.5 9.5l4.5 2.5-4.5 2.5z" />
          </svg>
        </div>
      </div>

      <div class="min-w-0 flex-1">
        <div v-if="author" class="flex items-center gap-2.5">
          <img
            v-if="avatar"
            :src="avatar"
            :alt="author"
            class="h-8 w-8 shrink-0 rounded-full border border-line object-cover"
            referrerpolicy="no-referrer"
            loading="lazy"
          />
          <span
            v-else
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full
              border border-line bg-surface-2 text-xs font-bold text-fg-muted"
            aria-hidden="true"
          >
            {{ author.replace('@', '').charAt(0).toUpperCase() }}
          </span>

          <span class="truncate text-sm font-semibold text-fg">
            {{ author }}
          </span>
        </div>

        <p
          v-if="title"
          class="sp-clamp-3 text-sm leading-6 text-fg-muted"
          :class="author ? 'mt-3' : ''"
        >
          {{ title }}
        </p>

        <dl v-if="stats.length" class="mt-4 flex flex-wrap gap-2">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="rounded-full border border-line bg-surface-2 px-3 py-1
              text-[11px]"
          >
            <dt class="inline text-fg-subtle">{{ stat.label }}</dt>
            <dd class="ml-1 inline font-semibold text-fg">{{ stat.value }}</dd>
          </div>
        </dl>

        <slot />
      </div>
    </div>
  </div>
</template>
