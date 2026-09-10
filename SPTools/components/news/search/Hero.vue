<script setup lang="ts">
interface Props {
    modelValue: string
    resultCount: number
}

defineProps<Props>()

const emit = defineEmits<{
    (
        event:
            'update:modelValue',
        value: string,
    ): void

    (
        event: 'submit',
    ): void
}>()

const updateValue = (
    event: Event,
) => {
    const element =
        event.target as HTMLInputElement

    emit(
        'update:modelValue',
        element.value,
    )
}

const clearSearch = () => {
    emit(
        'update:modelValue',
        '',
    )
}
</script>

<template>
    <section class="relative overflow-hidden
    bg-accent text-accent-fg pb-20 pt-32
    text-white sm:pb-24 sm:pt-40">
        <!-- Background pattern -->

        <div class="pointer-events-none
      absolute inset-0
      opacity-[0.07]" style="
        background-image:
          linear-gradient(
            rgba(255, 255, 255, 0.22) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.22) 1px,
            transparent 1px
          );
        background-size: 52px 52px;
      " />

        <!-- Background glows -->

        <div class="pointer-events-none
      absolute -left-40 -top-32
      h-[500px] w-[500px]
      rounded-full bg-indigo-600/25
      blur-[130px]" />

        <div class="pointer-events-none
      absolute -right-40 top-0
      h-[500px] w-[500px]
      rounded-full bg-cyan-500/15
      blur-[130px]" />

        <div class="pointer-events-none
      absolute bottom-0 left-1/2
      h-[260px] w-[700px]
      -translate-x-1/2
      rounded-full bg-violet-600/10
      blur-[100px]" />

        <div class="relative mx-auto
      max-w-7xl px-6">
            <!-- Breadcrumb -->

            <nav aria-label="Breadcrumb" class="flex flex-wrap
        items-center justify-center
        gap-2 text-xs font-medium
        text-fg-subtle">
                <NuxtLink to="/" class="transition-colors
          hover:text-white">
                    Home
                </NuxtLink>

                <span>/</span>

                <NuxtLink to="/news" class="transition-colors
          hover:text-white">
                    News
                </NuxtLink>

                <span>/</span>

                <span class="text-indigo-300">
                    Search
                </span>
            </nav>

            <div class="mx-auto mt-8
        max-w-4xl text-center">
                <div class="inline-flex
          items-center gap-2
          rounded-full
          border border-line/10
          bg-surface/[0.06]
          px-4 py-2
          backdrop-blur-xl">
                    <span class="text-[10px]
            font-bold uppercase
            tracking-[0.2em]
            text-indigo-300">
                        Search the newsroom
                    </span>
                </div>

                <h1 class="mt-7 text-5xl
          font-bold leading-[1.04]
          tracking-[-0.055em]
          sm:text-6xl lg:text-8xl">
                    Find the stories

                    <span class="block
            bg-gradient-to-r
            from-indigo-400
            via-violet-400
            to-cyan-400
            bg-clip-text
            text-transparent">
                        that matter to you.
                    </span>
                </h1>

                <p class="mx-auto mt-7
          max-w-2xl
          text-base leading-8
          text-fg-subtle sm:text-lg">
                    Search world news,
                    breaking developments,
                    business, technology,
                    science, climate, health,
                    regions, sources and authors.
                </p>

                <!-- Search form -->

                <form class="mx-auto mt-10
          flex max-w-3xl
          flex-col gap-3
          sm:flex-row" @submit.prevent="
            emit('submit')
            ">
                    <div class="relative min-w-0
            flex-1">
                        <svg class="pointer-events-none
              absolute left-5 top-1/2
              h-5 w-5
              -translate-y-1/2
              text-fg-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="7" />

                            <path d="m20 20-3.5-3.5" />
                        </svg>

                        <input :value="modelValue" type="search" autofocus
                            placeholder="Search stories, topics, authors or regions..." class="h-16 w-full
              rounded-2xl
              border border-line/10
              bg-surface/[0.08]
              pl-14 pr-14
              text-base text-white
              outline-none
              backdrop-blur-xl
              transition-all
              placeholder:text-fg-subtle
              focus:border-indigo-400
              focus:bg-surface/[0.11]
              focus:ring-4
              focus:ring-indigo-500/10" @input="updateValue" />

                        <button v-if="modelValue" type="button" aria-label="Clear search" class="absolute
              right-4 top-1/2
              flex h-8 w-8
              -translate-y-1/2
              items-center justify-center
              rounded-lg
              text-lg text-fg-subtle
              transition-all
              hover:bg-surface/10
              hover:text-white" @click="clearSearch">
                            ×
                        </button>
                    </div>

                    <button type="submit" class="h-16
            rounded-2xl
            bg-surface px-8
            text-sm font-bold
            text-fg
            transition-all
            hover:-translate-y-0.5
            hover:bg-indigo-50">
                        Search News →
                    </button>
                </form>

                <p class="mt-5 text-xs
          text-fg-subtle">
                    <template v-if="modelValue.trim()">
                        {{ resultCount }}

                        {{
                            resultCount === 1
                                ? 'story found'
                                : 'stories found'
                        }}
                    </template>

                    <template v-else>
                        Search all available
                        SP-Tools News coverage
                    </template>
                </p>
            </div>
        </div>
    </section>
</template>