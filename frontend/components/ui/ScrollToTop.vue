<script setup lang="ts">
const isVisible = ref(false)

const onScroll = () => {
  isVisible.value = window.scrollY > 700
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))

const scrollToTop = () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-3"
    leave-active-class="transition duration-200 ease-in"
    leave-to-class="opacity-0 translate-y-3"
  >
    <button
      v-if="isVisible"
      type="button"
      class="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center
        justify-center rounded-full border border-line bg-elevated
        text-fg-muted shadow-lift transition hover:-translate-y-0.5
        hover:text-accent"
      aria-label="Scroll back to top"
      @click="scrollToTop"
    >
      <svg
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m-7 7l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>
