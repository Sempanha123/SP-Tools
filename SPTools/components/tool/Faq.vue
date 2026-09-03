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
  <section class="border-t border-line bg-surface-2 py-16 sm:py-24">
    <div class="sp-container max-w-3xl">
      <UiSectionHeading
        :title="title ?? 'Frequently asked questions'"
        eyebrow="FAQ"
        align="center"
      />

      <dl class="mt-10 space-y-3">
        <div
          v-for="(item, index) in items"
          :key="item.question"
          class="overflow-hidden rounded-card border border-line bg-elevated"
        >
          <dt>
            <button
              type="button"
              class="flex w-full items-center justify-between gap-4 px-5 py-4
                text-left"
              :aria-expanded="openIndex === index"
              @click="toggle(index)"
            >
              <span class="text-sm font-semibold text-fg sm:text-base">
                {{ item.question }}
              </span>

              <svg
                class="h-4 w-4 shrink-0 text-fg-subtle transition-transform duration-300"
                :class="openIndex === index ? 'rotate-45' : ''"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </dt>

          <dd v-show="openIndex === index" class="px-5 pb-5">
            <p class="text-sm leading-7 text-fg-muted">{{ item.answer }}</p>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
