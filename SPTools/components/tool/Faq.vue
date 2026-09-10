<script setup lang="ts">
defineProps<{ items: { question: string; answer: string }[]; title?: string }>()
const openIndex = ref<number | null>(0)
const toggle = (index: number) => { openIndex.value = openIndex.value === index ? null : index }
</script>

<template>
  <section class="border-t border-line bg-surface py-16 sm:py-20">
    <div class="sp-container grid gap-8 lg:grid-cols-[.52fr_1.48fr] lg:gap-14">
      <div class="sp-reveal-left lg:sticky lg:top-28 lg:self-start">
        <div class="sp-kicker">FAQ</div>
        <h2 class="mt-3 max-w-sm text-[clamp(2rem,4vw,3rem)] font-[720] leading-[1] tracking-[-0.05em] text-fg">{{ title ?? 'Frequently asked questions' }}</h2>
        <p class="mt-4 max-w-sm text-[13px] leading-6 text-fg-muted">Quick answers about this workflow, output quality and supported content.</p>
      </div>

      <dl class="sp-reveal overflow-hidden rounded-[20px] border border-line bg-elevated shadow-soft">
        <div v-for="(item, index) in items" :key="item.question" class="transition-colors duration-200" :class="[index ? 'border-t border-line' : '', openIndex === index ? 'bg-accent-soft/38' : 'hover:bg-surface-3/52']">
          <dt>
            <button type="button" class="group flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6" :aria-expanded="openIndex === index" @click="toggle(index)">
              <span class="text-[15px] font-[650] text-fg sm:text-[16px]">{{ item.question }}</span>
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-fg-subtle transition duration-300" :class="openIndex === index ? 'rotate-45 border-accent/35 text-accent' : 'group-hover:border-line-strong group-hover:text-fg'">+</span>
            </button>
          </dt>
          <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150" leave-to-class="opacity-0 -translate-y-1">
            <dd v-if="openIndex === index" class="px-5 pb-6 sm:px-6"><p class="max-w-2xl text-[14px] leading-7 text-fg-muted">{{ item.answer }}</p></dd>
          </Transition>
        </div>
      </dl>
    </div>
  </section>
</template>
