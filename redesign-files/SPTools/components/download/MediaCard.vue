<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    thumbnail?: string | null
    title?: string | null
    author?: string | null
    avatar?: string | null
    stats?: { label: string; value: string }[]
    portrait?: boolean
    accent?: string
    platform?: 'tiktok' | 'facebook' | 'youtube' | 'generic'
  }>(),
  { stats: () => [], platform: 'generic' },
)

const platform = computed(() => props.platform === 'generic' && props.portrait ? 'tiktok' : props.platform)
const label = computed(() => ({ tiktok: 'TikTok post', facebook: 'Facebook media', youtube: 'YouTube video', generic: 'Media preview' }[platform.value]))
const icon = computed(() => ({ tiktok: '♪', facebook: 'f', youtube: '▶', generic: '↗' }[platform.value]))
</script>

<template>
  <div class="sp-platform-media-card sp-card overflow-hidden" :class="`sp-platform-${platform}`">
    <div class="relative border-b border-line bg-surface-3/55 px-4 py-3">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5"><span class="sp-platform-logo flex h-8 w-8 items-center justify-center rounded-[10px] text-[11px] font-black">{{ icon }}</span><div><p class="text-[8px] font-bold uppercase tracking-[.14em] text-fg-subtle">Resolved content</p><p class="mt-0.5 text-[10px] font-semibold text-fg">{{ label }}</p></div></div>
        <span class="inline-flex items-center gap-1.5 text-[9px] font-semibold text-positive"><span class="h-1.5 w-1.5 rounded-full bg-positive sp-pulse-soft"/> ready</span>
      </div>
    </div>

    <div class="flex flex-col gap-5 p-5 sm:flex-row">
      <div class="relative shrink-0 overflow-hidden rounded-[16px] border border-line bg-[#0d121b] shadow-soft" :class="portrait ? 'mx-auto aspect-[9/16] w-44 sm:mx-0' : 'aspect-video w-full sm:w-[270px]'">
        <img v-if="thumbnail" :src="thumbnail" :alt="title || 'Video thumbnail'" class="h-full w-full object-cover transition duration-700 hover:scale-105" referrerpolicy="no-referrer" loading="lazy">
        <div v-else class="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_30%,var(--sp-platform-soft),transparent_42%),#0d121b]"><span class="sp-platform-logo flex h-14 w-14 items-center justify-center rounded-[17px] text-lg font-black">{{ icon }}</span></div>
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between"><span class="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[.12em] text-white/70 backdrop-blur">{{ label }}</span><span class="sp-platform-pill">HD</span></div>
      </div>

      <div class="min-w-0 flex-1 py-1">
        <div v-if="author" class="flex items-center gap-2.5">
          <img v-if="avatar" :src="avatar" :alt="author" class="h-9 w-9 shrink-0 rounded-full border border-line object-cover" referrerpolicy="no-referrer" loading="lazy">
          <span v-else class="sp-platform-logo flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-black">{{ author.replace('@', '').charAt(0).toUpperCase() }}</span>
          <div class="min-w-0"><p class="truncate text-[12px] font-bold text-fg">{{ author }}</p><p class="mt-0.5 text-[9px] text-fg-subtle">Source account</p></div>
        </div>

        <p v-if="title" class="sp-clamp-3 text-[14px] font-semibold leading-6 text-fg" :class="author ? 'mt-4' : ''">{{ title }}</p>

        <dl v-if="stats.length" class="mt-4 grid gap-2 sm:grid-cols-2">
          <div v-for="stat in stats" :key="stat.label" class="rounded-[12px] border border-line bg-surface-3 px-3 py-2.5"><dt class="text-[8px] font-bold uppercase tracking-[.12em] text-fg-subtle">{{ stat.label }}</dt><dd class="mt-1 text-[11px] font-bold text-fg">{{ stat.value }}</dd></div>
        </dl>

        <div class="sp-platform-meta-line mt-5 h-1 overflow-hidden rounded-full bg-surface-3"><div class="h-full w-[62%] rounded-full" /></div>
        <slot />
      </div>
    </div>
  </div>
</template>
