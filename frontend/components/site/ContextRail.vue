<script setup lang="ts">
const route = useRoute()
const {
  tools,
} = useTools()

const currentTool = computed(() =>
  tools.find(
    tool => tool.href === route.path,
  ),
)

const isDownloader = computed(
  () =>
    currentTool.value?.category
      === 'download',
)

const isAiTool = computed(
  () =>
    currentTool.value?.category
      === 'image',
)

const visible = computed(
  () =>
    Boolean(
      currentTool.value
      && (
        isDownloader.value
        || isAiTool.value
      ),
    ),
)

const contextMeta = computed(() => {
  const tool =
    currentTool.value

  if (!tool) {
    return null
  }

  if (tool.category === 'download') {
    const product =
      tool.slug === 'tiktok-download'
        ? 'TikTok download studio'
        : tool.slug === 'facebook-video-download'
          ? 'Facebook media studio'
          : tool.slug === 'youtube-download'
            ? 'YouTube stream studio'
            : tool.shortName

    return {
      eyebrow:
        'Interactive downloader',
      product,
      status:
        'ready for link',
      chips:
        tool.slug === 'tiktok-download'
          ? [
              'HD',
              'No watermark',
              'MP4',
            ]
          : tool.slug === 'facebook-video-download'
            ? [
                'Public video',
                'HD',
                'MP4',
              ]
            : [
                'Video',
                'Audio',
                'Streams',
              ],
    }
  }

  return {
    eyebrow:
      'AI image workspace',
    product:
      tool.slug === 'bg-remover'
        ? 'Background remover studio'
        : tool.slug === 'image-upscaler'
          ? 'Image upscaler studio'
          : tool.shortName,
    status:
      'ready',
    chips:
      tool.slug === 'bg-remover'
        ? [
            'PNG',
            'Transparent',
            'AI',
          ]
        : [
            '2×',
            '4×',
            'AI',
          ],
  }
})

const iconPath = computed(
  () =>
    currentTool.value?.icon
    || '',
)

const iconStyle = computed(
  () =>
    currentTool.value?.iconStyle
    || 'stroke',
)

const accentStyle = computed(
  () => ({
    '--sp-context-accent':
      currentTool.value?.accent
      || 'var(--sp-accent)',
  }),
)
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    leave-active-class="transition duration-200 ease-in"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="visible && contextMeta"
      class="sp-context-header-v39"
      :class="[
        isDownloader
          ? 'sp-context-download'
          : 'sp-context-ai',
      ]"
      :style="accentStyle"
    >
      <div
        class="sp-context-header-v39__panel"
      >
        <div
          class="flex min-w-0 items-center gap-3"
        >
          <span
            class="sp-context-header-v39__icon"
            aria-hidden="true"
          >
            <svg
              class="h-[18px] w-[18px]"
              viewBox="0 0 24 24"
              :fill="
                iconStyle === 'fill'
                  ? 'currentColor'
                  : 'none'
              "
              :stroke="
                iconStyle === 'stroke'
                  ? 'currentColor'
                  : 'none'
              "
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path :d="iconPath" />
            </svg>
          </span>

          <div class="min-w-0">
            <p
              class="truncate text-[8px] font-black uppercase tracking-[.17em] text-fg-subtle"
            >
              {{ contextMeta.eyebrow }}
            </p>

            <p
              class="mt-0.5 truncate text-[12px] font-bold tracking-[-.015em] text-fg"
            >
              {{ contextMeta.product }}
            </p>
          </div>
        </div>

        <div
          class="flex min-w-0 items-center justify-end gap-2"
        >
          <span
            v-for="chip in contextMeta.chips"
            :key="chip"
            class="sp-context-header-v39__chip hidden md:inline-flex"
          >
            {{ chip }}
          </span>

          <span
            class="sp-context-header-v39__status"
          >
            <span
              class="sp-context-header-v39__dot"
            />
            <span
              class="hidden sm:inline"
            >
              {{ contextMeta.status }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </Transition>
</template>
