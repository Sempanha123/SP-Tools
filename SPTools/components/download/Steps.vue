<script setup lang="ts">
/**
 * The "how it works" strip shared by the three downloader pages.
 */
defineProps<{
  steps: { title: string; description: string }[]
  title?: string
  description?: string
}>()
</script>

<template>
  <section class="border-t border-line bg-surface py-16 sm:py-20">
    <div class="sp-container">
      <UiSectionHeading
        eyebrow="How it works"
        :title="title ?? 'Four steps, no account'"
        :description="description"
        align="center"
      />

      <ol class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="(step, index) in steps"
          :key="step.title"
          class="sp-card relative p-6"
        >
          <span
            class="flex h-11 w-11 items-center justify-center rounded-xl
              bg-accent-soft font-display text-lg font-bold text-accent"
            aria-hidden="true"
          >
            {{ index + 1 }}
          </span>

          <h3 class="mt-5 text-base font-semibold text-fg">{{ step.title }}</h3>

          <p class="mt-2 text-sm leading-6 text-fg-muted">
            {{ step.description }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>
