<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    gallery?: string[]
    youtubeUrl?: string | null
    youtubeCaption?: string | null
  }>(),
  {
    gallery: () => [],
    youtubeUrl: null,
    youtubeCaption: null,
  },
)

const galleryImages = computed(() =>
  (props.gallery ?? []).filter(
    (value): value is string =>
      typeof value === 'string'
      && value.trim().length > 0,
  ),
)

const youtubeEmbedUrl = computed(() => {
  const raw = props.youtubeUrl?.trim()

  if (!raw) return null

  try {
    const url = new URL(raw)
    let id = ''

    if (url.hostname === 'youtu.be') {
      id =
        url.pathname
          .split('/')
          .filter(Boolean)[0]
        ?? ''
    } else if (
      [
        'youtube.com',
        'www.youtube.com',
        'm.youtube.com',
      ].includes(url.hostname)
    ) {
      if (url.pathname === '/watch') {
        id =
          url.searchParams.get('v')
          ?? ''
      } else {
        const parts =
          url.pathname
            .split('/')
            .filter(Boolean)

        if (
          ['embed', 'shorts', 'live']
            .includes(parts[0] ?? '')
        ) {
          id = parts[1] ?? ''
        }
      }
    }

    if (!/^[A-Za-z0-9_-]{6,20}$/.test(id)) {
      return null
    }

    return `https://www.youtube-nocookie.com/embed/${id}`
  } catch {
    return null
  }
})
</script>

<template>
  <div
    v-if="galleryImages.length || youtubeEmbedUrl"
    class="sp-v19-rich-media"
  >
    <figure
      v-if="galleryImages.length"
      class="sp-v19-gallery"
    >
      <div
        class="grid gap-3"
        :class="
          galleryImages.length === 1
            ? 'grid-cols-1'
            : 'sm:grid-cols-2'
        "
      >
        <a
          v-for="(image, index) in galleryImages"
          :key="`${image}-${index}`"
          :href="image"
          target="_blank"
          rel="noopener noreferrer"
          class="sp-v19-gallery-item group"
          :class="
            galleryImages.length >= 3
            && index === 0
              ? 'sm:col-span-2'
              : ''
          "
        >
          <img
            :src="image"
            :alt="`Article image ${index + 1}`"
            loading="lazy"
            class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
            :class="
              galleryImages.length === 1
              || (
                galleryImages.length >= 3
                && index === 0
              )
                ? 'max-h-[560px] min-h-[270px]'
                : 'aspect-[4/3]'
            "
          >

          <span class="sp-v19-gallery-open">
            View ↗
          </span>
        </a>
      </div>
    </figure>

    <figure
      v-if="youtubeEmbedUrl"
      class="sp-v19-video"
    >
      <div class="sp-v19-video-head">
        <div class="flex items-center gap-3">
          <span class="sp-v19-video-icon">
            ▶
          </span>

          <div>
            <p class="text-[8px] font-bold uppercase tracking-[.14em] text-fg-subtle">
              Watch
            </p>

            <p class="mt-0.5 text-[11px] font-bold text-fg">
              Video related to this story
            </p>
          </div>
        </div>

        <span class="text-[8px] font-semibold uppercase tracking-[.12em] text-fg-subtle">
          YouTube
        </span>
      </div>

      <div class="aspect-video bg-black">
        <iframe
          :src="youtubeEmbedUrl"
          class="h-full w-full"
          title="Video related to this article"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        />
      </div>

      <figcaption
        v-if="youtubeCaption"
        class="sp-v19-caption"
      >
        {{ youtubeCaption }}
      </figcaption>
    </figure>
  </div>
</template>
