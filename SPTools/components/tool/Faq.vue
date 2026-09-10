<script setup lang="ts">
defineProps<{
  items: { question: string; answer: string }[]
  title?: string
}>()

const openIndex = ref<number | null>(0)
const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="relative overflow-hidden border-t border-line bg-surface-2 py-[72px] sm:py-[88px]">
    <div class="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-accent/7 blur-[90px]" />
    <div class="sp-container-wide relative grid gap-9 lg:grid-cols-[.7fr_1.3fr] lg:gap-14">
      <div class="sp-reveal-left lg:sticky lg:top-28 lg:self-start">
        <div class="sp-kicker">FAQ</div>
        <h2 class="mt-4 max-w-md text-[clamp(2.2rem,4vw,3.6rem)] font-[740] leading-[.95] tracking-[-.055em] text-fg">{{ title ?? 'Frequently asked questions' }}</h2>
        <p class="mt-4 max-w-md text-[13px] leading-7 text-fg-muted">Clear answers, compact layout, and no unnecessary wall of text.</p>
      </div>

      <dl class="sp-reveal overflow-hidden rounded-[22px] border border-line bg-elevated shadow-lift">
        <div
          v-for="(item, index) in items"
          :key="item.question"
          class="relative transition-colors duration-300"
          :class="[index ? 'border-t border-line' : '', openIndex === index ? 'bg-accent-soft/46' : 'hover:bg-surface-3/52']"
        >
          <dt>
            <button
              type="button"
              class="group grid w-full grid-cols-[40px_minmax(0,1fr)_36px] items-center gap-3 px-5 py-5 text-left sm:px-6 sm:py-[22px]"
              :aria-expanded="openIndex === index"
              @click="toggle(index)"
            >
              <span class="text-[9px] font-bold tracking-[.12em] text-fg-subtle">0{{ index + 1 }}</span>
              <span class="text-[15px] font-[660] leading-6 text-fg sm:text-[16px]">{{ item.question }}</span>
              <span class="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface-2 text-fg-subtle transition duration-300" :class="openIndex === index ? 'rotate-45 border-accent/30 text-accent shadow-xs' : 'group-hover:border-line-strong group-hover:text-fg'">+</span>
            </button>
          </dt>

          <Transition enter-active-class="transition duration-250 ease-out" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150 ease-in" leave-to-class="opacity-0 -translate-y-1">
            <dd v-if="openIndex === index" class="grid grid-cols-[40px_minmax(0,1fr)] gap-3 px-5 pb-6 sm:px-6">
              <span />
              <p class="max-w-2xl text-[13px] leading-7 text-fg-muted sm:text-[14px]">{{ item.answer }}</p>
            </dd>
          </Transition>
        </div>
      </dl>
    </div>
  </section>
</template>
