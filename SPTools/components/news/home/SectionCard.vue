<script setup lang="ts">
type Tone = 'indigo' | 'violet' | 'cyan' | 'emerald'

interface Props {
  eyebrow: string
  title: string
  description?: string
  tone?: Tone
  status?: string
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  tone: 'indigo',
  status: '',
})

const toneClasses = computed(() => {
  const tones = {
    indigo: {
      eyebrow: 'text-indigo-600',
      icon: 'from-indigo-500 to-violet-600',
      badge: 'bg-indigo-50 text-indigo-600',
    },
    violet: {
      eyebrow: 'text-violet-600',
      icon: 'from-violet-500 to-fuchsia-600',
      badge: 'bg-violet-50 text-violet-600',
    },
    cyan: {
      eyebrow: 'text-cyan-600',
      icon: 'from-cyan-500 to-blue-600',
      badge: 'bg-cyan-50 text-cyan-600',
    },
    emerald: {
      eyebrow: 'text-emerald-600',
      icon: 'from-emerald-500 to-teal-600',
      badge: 'bg-emerald-50 text-emerald-600',
    },
  }

  return tones[props.tone]
})
</script>

<template>
  <section
    class="overflow-hidden rounded-[30px]
    border border-line bg-surface
    shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
  >
    <!-- Section heading -->
    <header
      class="flex flex-col justify-between gap-4
      border-b border-line px-5 py-5
      sm:flex-row sm:items-center sm:px-7"
    >
      <div class="flex items-center gap-4">
        <div
          class="flex h-11 w-11 shrink-0 items-center
          justify-center rounded-2xl bg-gradient-to-br
          text-white shadow-lg"
          :class="toneClasses.icon"
        >
          ✦
        </div>

        <div>
          <p
            class="text-[10px] font-bold uppercase
            tracking-[0.18em]"
            :class="toneClasses.eyebrow"
          >
            {{ eyebrow }}
          </p>

          <h2
            class="mt-1 text-xl font-bold
            tracking-[-0.02em] text-fg"
          >
            {{ title }}
          </h2>

          <p
            v-if="description"
            class="mt-1 text-xs leading-5 text-fg-subtle"
          >
            {{ description }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span
          v-if="status"
          class="inline-flex items-center gap-2 rounded-full
          px-3 py-1.5 text-[9px] font-bold uppercase
          tracking-wider"
          :class="toneClasses.badge"
        >
          <span class="relative flex h-1.5 w-1.5">
            <span
              class="absolute inline-flex h-full w-full
              animate-ping rounded-full bg-current opacity-40"
            />

            <span
              class="relative inline-flex h-1.5 w-1.5
              rounded-full bg-current"
            />
          </span>

          {{ status }}
        </span>

        <slot name="action" />
      </div>
    </header>

    <!-- Existing component content -->
    <div class="p-4 sm:p-6">
      <slot />
    </div>
  </section>
</template>