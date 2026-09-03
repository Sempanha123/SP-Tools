<script setup lang="ts">
import type {
  NewsAuthor,
} from '~/types/news'

interface Props {
  author: NewsAuthor
}

const props = defineProps<Props>()

const {
  formatDate,
  formatDateTime,
  formatViews,
} = useNewsData()

const authorInitials = computed(() => {
  return (
    props.author.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(word =>
        word.charAt(0).toUpperCase(),
      )
      .join('')
    || 'A'
  )
})

const authorRole = computed(() => {
  return (
    props.author.role?.trim()
    || 'News Author'
  )
})

const authorBio = computed(() => {
  return (
    props.author.bio?.trim()
    || `Read the latest reporting and analysis by ${props.author.name}.`
  )
})
</script>

<template>
  <section
    class="relative overflow-hidden
    bg-slate-950 pb-20 pt-32
    text-white sm:pb-24 sm:pt-40"
  >
    <!-- Grid -->

    <div
      class="pointer-events-none
      absolute inset-0 opacity-[0.07]"
      style="
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
      "
    />

    <!-- Glows -->

    <div
      class="pointer-events-none
      absolute -left-40 -top-32
      h-[500px] w-[500px]
      rounded-full bg-indigo-600/25
      blur-[130px]"
    />

    <div
      class="pointer-events-none
      absolute -right-40 top-0
      h-[500px] w-[500px]
      rounded-full bg-cyan-500/15
      blur-[130px]"
    />

    <div
      class="relative mx-auto
      max-w-7xl px-6"
    >
      <!-- Breadcrumb -->

      <nav
        aria-label="Breadcrumb"
        class="flex flex-wrap items-center
        gap-2 text-xs font-medium
        text-slate-400"
      >
        <NuxtLink
          to="/"
          class="transition-colors
          hover:text-white"
        >
          Home
        </NuxtLink>

        <span>/</span>

        <NuxtLink
          to="/news"
          class="transition-colors
          hover:text-white"
        >
          News
        </NuxtLink>

        <span>/</span>

        <span class="text-indigo-300">
          {{ author.name }}
        </span>
      </nav>

      <div
        class="mt-10 grid gap-10
        lg:grid-cols-[220px_minmax(0,1fr)]
        lg:items-center"
      >
        <!-- Profile visual -->

        <div>
          <div
            class="relative mx-auto
            h-48 w-48 lg:mx-0"
          >
            <div
              class="absolute -inset-4
              rounded-[42px]
              bg-gradient-to-br
              from-indigo-500/30
              via-violet-500/20
              to-cyan-500/20
              blur-2xl"
            />

            <img
              v-if="author.avatar"
              :src="author.avatar"
              :alt="author.name"
              class="relative h-48 w-48
              rounded-[38px] object-cover
              shadow-2xl
              ring-1 ring-white/20"
            >

            <div
              v-else
              class="relative flex h-48 w-48
              items-center justify-center
              rounded-[38px]
              bg-gradient-to-br
              from-indigo-600
              via-violet-600
              to-cyan-500
              text-5xl font-bold
              text-white shadow-2xl
              ring-1 ring-white/20"
            >
              {{ authorInitials }}
            </div>

            <span
              v-if="author.verified"
              class="absolute -bottom-3
              -right-3 flex h-12 w-12
              items-center justify-center
              rounded-2xl border-4
              border-slate-950
              bg-blue-500 text-lg
              font-bold text-white
              shadow-lg"
              title="Verified author"
            >
              ✓
            </span>
          </div>
        </div>

        <!-- Information -->

        <div>
          <div
            class="flex flex-wrap
            items-center gap-3"
          >
            <span
              class="rounded-full
              border border-white/10
              bg-white/[0.06]
              px-4 py-2
              text-[10px] font-bold
              uppercase tracking-[0.18em]
              text-indigo-300"
            >
              SP-Tools News Author
            </span>

            <span
              v-if="author.verified"
              class="inline-flex
              items-center gap-2
              rounded-full
              border border-blue-400/20
              bg-blue-500/10
              px-4 py-2
              text-[10px] font-bold
              uppercase tracking-[0.15em]
              text-blue-300"
            >
              ✓ Verified
            </span>
          </div>

          <h1
            class="mt-6 text-5xl
            font-bold tracking-[-0.05em]
            sm:text-6xl lg:text-7xl"
          >
            {{ author.name }}
          </h1>

          <p
            class="mt-3 text-lg
            font-semibold text-indigo-300"
          >
            {{ authorRole }}
          </p>

          <p
            class="mt-6 max-w-3xl
            text-base leading-8
            text-slate-400 sm:text-lg"
          >
            {{ authorBio }}
          </p>

          <!-- Metadata -->

          <div
            class="mt-7 flex flex-wrap
            gap-x-7 gap-y-3
            text-xs text-slate-400"
          >
            <span
              v-if="author.location"
              class="flex items-center gap-2"
            >
              <span
                class="h-1.5 w-1.5
                rounded-full bg-indigo-400"
              />

              {{ author.location }}
            </span>

            <span
              v-if="author.joinedAt"
              class="flex items-center gap-2"
            >
              <span
                class="h-1.5 w-1.5
                rounded-full bg-violet-400"
              />

              Joined
              {{ formatDate(author.joinedAt) }}
            </span>

            <span
              v-if="author.latestPublishedAt"
              class="flex items-center gap-2"
            >
              <span
                class="h-1.5 w-1.5
                rounded-full bg-cyan-400"
              />

              Latest article
              {{
                formatDateTime(
                  author.latestPublishedAt,
                )
              }}
            </span>
          </div>

          <!-- Stats -->

          <div
            class="mt-9 grid max-w-3xl
            grid-cols-2 gap-3
            sm:grid-cols-4"
          >
            <div
              class="rounded-2xl
              border border-white/10
              bg-white/[0.05]
              p-4 backdrop-blur"
            >
              <p class="text-2xl font-bold">
                {{
                  author.articlesCount
                    .toLocaleString('en-US')
                }}
              </p>

              <p
                class="mt-1 text-[10px]
                uppercase tracking-wider
                text-slate-500"
              >
                Articles
              </p>
            </div>

            <div
              class="rounded-2xl
              border border-white/10
              bg-white/[0.05]
              p-4 backdrop-blur"
            >
              <p class="text-2xl font-bold">
                {{
                  formatViews(
                    author.totalViews,
                  )
                }}
              </p>

              <p
                class="mt-1 text-[10px]
                uppercase tracking-wider
                text-slate-500"
              >
                Total views
              </p>
            </div>

            <div
              class="rounded-2xl
              border border-white/10
              bg-white/[0.05]
              p-4 backdrop-blur"
            >
              <p class="text-2xl font-bold">
                {{ author.categories.length }}
              </p>

              <p
                class="mt-1 text-[10px]
                uppercase tracking-wider
                text-slate-500"
              >
                Categories
              </p>
            </div>

            <div
              class="rounded-2xl
              border border-white/10
              bg-white/[0.05]
              p-4 backdrop-blur"
            >
              <p class="text-2xl font-bold">
                {{ author.regions.length }}
              </p>

              <p
                class="mt-1 text-[10px]
                uppercase tracking-wider
                text-slate-500"
              >
                Regions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>