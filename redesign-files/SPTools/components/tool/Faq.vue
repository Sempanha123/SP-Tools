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
  <section class="border-t border-line bg-surface py-14 sm:py-16">
    <div class="sp-container max-w-[860px]">
      <UiSectionHeading
        :title="title ?? 'Frequently asked questions'"
        eyebrow="FAQ"
        align="center"
      />

      <div class="mt-9 overflow-hidden rounded-[16px] border border-line bg-elevated shadow-soft">
        <div
          v-for="(item, index) in items"
          :key="item.question"
          class="transition-colors"
          :class="[
            index ? 'border-t border-line' : '',
            openIndex === index ? 'bg-surface-3/[0.65]' : 'bg-elevated',
          ]"
        >
          <h3>
            <button
              type="button"
              class="flex w-full items-center justify-between gap-6 px-5 py-[18px] text-left sm:px-6"
              :aria-expanded="openIndex === index"
              @click="toggle(index)"
            >
              <span class="text-[15px] font-[650] tracking-[-0.015em] text-fg sm:text-base">
                {{ item.question }}
              </span>

              <svg
                class="h-4 w-4 shrink-0 text-fg-subtle transition-transform duration-200"
                :class="openIndex === index ? 'rotate-180 text-accent' : ''"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m7 10 5 5 5-5" />
              </svg>
            </button>
          </h3>

          <div v-show="openIndex === index" class="px-5 pb-5 sm:px-6 sm:pb-6">
            <p class="max-w-[730px] text-[14px] leading-7 text-fg-muted">
              {{ item.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
