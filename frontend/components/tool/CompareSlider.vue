<script setup lang="ts">
/**
 * Before/after comparison with a draggable divider.
 * Pointer events cover mouse, touch and pen; arrow keys move the handle for
 * keyboard users.
 */
const props = withDefaults(
  defineProps<{
    before: string
    after: string
    beforeLabel?: string
    afterLabel?: string
    /** Renders a checkerboard behind the "after" image for transparency. */
    transparent?: boolean
  }>(),
  { beforeLabel: 'Original', afterLabel: 'Result' },
)

const container = ref<HTMLElement | null>(null)
const position = ref(50)
const isDragging = ref(false)

const setFromClientX = (clientX: number) => {
  const bounds = container.value?.getBoundingClientRect()
  if (!bounds) return

  const percent = ((clientX - bounds.left) / bounds.width) * 100
  position.value = Math.min(100, Math.max(0, percent))
}

const onPointerDown = (event: PointerEvent) => {
  isDragging.value = true
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  setFromClientX(event.clientX)
}

const onPointerMove = (event: PointerEvent) => {
  if (!isDragging.value) return
  setFromClientX(event.clientX)
}

const onPointerUp = (event: PointerEvent) => {
  isDragging.value = false
  ;(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId)
}

const nudge = (delta: number) => {
  position.value = Math.min(100, Math.max(0, position.value + delta))
}
</script>

<template>
  <div
    ref="container"
    class="relative aspect-[4/3] w-full touch-none select-none overflow-hidden
      rounded-card border border-line bg-surface-2"
    :class="transparent ? 'sp-checkerboard' : ''"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <!-- After (full width, underneath) -->
    <img
      :src="after"
      :alt="afterLabel"
      class="absolute inset-0 h-full w-full object-contain"
      draggable="false"
    />

    <!-- Before (clipped to the divider) -->
    <div
      class="absolute inset-0 overflow-hidden"
      :style="{ clipPath: `inset(0 ${100 - position}% 0 0)` }"
    >
      <img
        :src="before"
        :alt="beforeLabel"
        class="absolute inset-0 h-full w-full object-contain"
        draggable="false"
      />
    </div>

    <!-- Labels -->
    <span
      class="pointer-events-none absolute left-3 top-3 rounded-lg bg-fg/75
        px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider
        text-fg-inverse backdrop-blur-sm"
    >
      {{ beforeLabel }}
    </span>

    <span
      class="pointer-events-none absolute right-3 top-3 rounded-lg bg-accent
        px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider
        text-accent-fg"
    >
      {{ afterLabel }}
    </span>

    <!-- Divider -->
    <div
      class="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.18)]"
      :style="{ left: `${position}%` }"
    />

    <!-- Handle -->
    <button
      type="button"
      class="absolute top-1/2 z-10 flex h-10 w-10 -translate-x-1/2
        -translate-y-1/2 cursor-ew-resize items-center justify-center
        rounded-full border-2 border-white bg-accent text-white shadow-lift"
      :style="{ left: `${position}%` }"
      role="slider"
      aria-label="Comparison position"
      :aria-valuenow="Math.round(position)"
      aria-valuemin="0"
      aria-valuemax="100"
      @keydown.left.prevent="nudge(-4)"
      @keydown.right.prevent="nudge(4)"
      @keydown.home.prevent="position = 0"
      @keydown.end.prevent="position = 100"
    >
      <svg
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 7l-4 5 4 5m6-10l4 5-4 5" />
      </svg>
    </button>
  </div>
</template>
