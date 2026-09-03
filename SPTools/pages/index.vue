<script setup lang="ts">
import { ref } from 'vue'

const openFaq = ref<number | null>(null)

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

const tools = [
  {
    title: 'Background Remover',
    description: 'Remove image backgrounds automatically with powerful AI.',
    href: '/tools/bg-remover',
    icon: '✦',
    gradient: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50',
  },
  {
    title: 'Image Upscaler',
    description: 'Improve image quality and enhance details with AI.',
    href: '/tools/image-upscaler',
    icon: '↗',
    gradient: 'from-violet-500 to-fuchsia-600',
    bg: 'bg-violet-50',
  },
  {
    title: 'TikTok Downloader',
    description: 'Download TikTok videos quickly in available formats.',
    href: '/download/tiktok-download',
    icon: '♪',
    gradient: 'from-slate-700 to-slate-950',
    bg: 'bg-slate-100',
  },
  {
    title: 'Facebook Downloader',
    description: 'Save videos and reels from Facebook with ease.',
    href: '/download/facebook-video-download',
    icon: 'f',
    gradient: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'YouTube Downloader',
    description: 'Download YouTube videos using a simple workflow.',
    href: '/download/youtube-download',
    icon: '▶',
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-50',
  },
]

const faqs = [
  {
    question: 'What is SP-Tools?',
    answer:
      'SP-Tools is a collection of smart online utilities designed to help you work faster with images and digital media.',
  },
  {
    question: 'Do I need to install anything?',
    answer:
      'No. SP-Tools is designed as a web-based platform, so you can access the available tools directly from your browser.',
  },
  {
    question: 'Are the AI tools easy to use?',
    answer:
      'Yes. Our goal is to keep the experience simple. Upload your file, choose your tool, and let the processing do the work.',
  },
  {
    question: 'Can I use SP-Tools on mobile?',
    answer:
      'Yes. The website is designed to work across desktop, tablet, and mobile screen sizes.',
  },
]
</script>

<template>
  <div class="min-h-screen overflow-hidden bg-white text-slate-900">

    <!-- ================================================= -->
    <!-- HERO -->
    <!-- ================================================= -->

    <section
      class="relative min-h-[850px] overflow-hidden
      bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.12),transparent_45%)]
      pt-32 sm:pt-40"
    >

      <!-- Background Grid -->
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.035]"
        style="
          background-image:
          linear-gradient(#0f172a 1px, transparent 1px),
          linear-gradient(90deg, #0f172a 1px, transparent 1px);
          background-size: 50px 50px;
        "
      />

      <!-- Glow -->
      <div
        class="pointer-events-none absolute left-1/2 top-20
        h-[500px] w-[800px] -translate-x-1/2
        rounded-full bg-indigo-500/10 blur-[120px]"
      />

      <div
        class="relative mx-auto max-w-7xl px-6 text-center"
      >

        <!-- Badge -->
        <div
          class="mx-auto mb-8 inline-flex items-center gap-2
          rounded-full border border-indigo-100
          bg-white/80 px-4 py-2
          shadow-sm backdrop-blur-xl"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full
              animate-ping rounded-full bg-indigo-500 opacity-50"
            />

            <span
              class="relative h-2 w-2 rounded-full bg-indigo-600"
            />
          </span>

          <span
            class="text-xs font-semibold
            uppercase tracking-[0.15em] text-indigo-600"
          >
            Smart Tools. Better Workflow.
          </span>
        </div>


        <!-- Heading -->
        <h1
          class="mx-auto max-w-5xl
          text-5xl font-bold leading-[1.05]
          tracking-[-0.05em]
          text-slate-950
          sm:text-6xl
          lg:text-8xl"
        >
          Powerful tools for
          <span
            class="block bg-gradient-to-r
            from-indigo-600 via-violet-600
            to-cyan-500 bg-clip-text text-transparent"
          >
            your digital world.
          </span>
        </h1>


        <!-- Description -->
        <p
          class="mx-auto mt-8 max-w-2xl
          text-base leading-8 text-slate-500
          sm:text-lg"
        >
          Create better images, enhance your content,
          and simplify everyday digital tasks with
          fast and intelligent online tools.
        </p>


        <!-- CTA -->
        <div
          class="mt-10 flex flex-col
          items-center justify-center gap-3
          sm:flex-row"
        >

          <NuxtLink
            to="/tools"
            class="group flex w-full items-center
            justify-center gap-3 rounded-2xl
            bg-slate-950 px-7 py-4
            text-sm font-semibold text-white
            shadow-[0_15px_40px_rgba(15,23,42,0.18)]
            transition-all duration-300
            hover:-translate-y-1
            hover:shadow-[0_20px_50px_rgba(15,23,42,0.25)]
            sm:w-auto"
          >
            Explore All Tools

            <span
              class="transition-transform
              group-hover:translate-x-1"
            >
              →
            </span>
          </NuxtLink>


          <NuxtLink
            to="/tools/bg-remover"
            class="flex w-full items-center
            justify-center gap-2 rounded-2xl
            border border-slate-200
            bg-white px-7 py-4
            text-sm font-semibold text-slate-700
            transition-all
            hover:border-slate-300
            hover:bg-slate-50
            sm:w-auto"
          >
            Try AI Tools
            <span>✦</span>
          </NuxtLink>

        </div>


        <!-- TRUST -->
        <div
          class="mt-12 flex flex-wrap
          items-center justify-center gap-x-8 gap-y-3
          text-xs text-slate-400"
        >
          <span>✓ Simple to use</span>
          <span>✓ Browser based</span>
          <span>✓ Mobile friendly</span>
          <span>✓ Built for creators</span>
        </div>


        <!-- HERO PRODUCT PREVIEW -->
        <div
          class="relative mx-auto mt-20 max-w-5xl"
        >

          <!-- Glow -->
          <div
            class="absolute inset-x-10 bottom-0
            h-40 rounded-full
            bg-indigo-500/20 blur-[100px]"
          />

          <div
            class="relative overflow-hidden rounded-[28px]
            border border-slate-200
            bg-white
            p-2
            shadow-[0_30px_100px_rgba(15,23,42,0.14)]"
          >

            <!-- Browser Top -->
            <div
              class="flex h-12 items-center
              gap-2 border-b border-slate-100
              px-4"
            >

              <span class="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span class="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span class="h-2.5 w-2.5 rounded-full bg-slate-200" />

              <div
                class="mx-auto hidden h-7 w-80
                rounded-lg bg-slate-50 sm:block"
              />

            </div>


            <!-- App Preview -->
            <div
              class="grid min-h-[380px]
              grid-cols-1 bg-slate-50
              lg:grid-cols-[220px_1fr]"
            >

              <!-- Sidebar -->
              <div
                class="hidden border-r border-slate-200
                bg-white p-5 lg:block"
              >

                <div
                  class="mb-8 flex items-center gap-2"
                >
                  <div
                    class="flex h-8 w-8 items-center
                    justify-center rounded-lg
                    bg-indigo-600 text-white"
                  >
                    ✦
                  </div>

                  <span class="font-bold">
                    SP-Tools
                  </span>
                </div>

                <div class="space-y-2">

                  <div
                    class="rounded-xl bg-indigo-50
                    px-3 py-2.5 text-xs
                    font-semibold text-indigo-600"
                  >
                    AI Tools
                  </div>

                  <div
                    class="rounded-xl px-3 py-2.5
                    text-xs text-slate-500"
                  >
                    Downloaders
                  </div>

                  <div
                    class="rounded-xl px-3 py-2.5
                    text-xs text-slate-500"
                  >
                    Recent Files
                  </div>

                </div>
              </div>


              <!-- Main Preview -->
              <div class="p-6 sm:p-10">

                <div
                  class="flex flex-col
                  justify-between gap-5
                  sm:flex-row sm:items-center"
                >

                  <div>
                    <p
                      class="text-xs font-semibold
                      uppercase tracking-wider
                      text-indigo-600"
                    >
                      AI Workspace
                    </p>

                    <h3
                      class="mt-2 text-2xl
                      font-bold tracking-tight
                      text-slate-900"
                    >
                      What do you want to create?
                    </h3>
                  </div>

                  <div
                    class="rounded-xl
                    border border-emerald-100
                    bg-emerald-50 px-3 py-2
                    text-xs font-semibold
                    text-emerald-600"
                  >
                    ● AI Ready
                  </div>

                </div>


                <!-- Tool Cards -->
                <div
                  class="mt-8 grid gap-4
                  sm:grid-cols-3"
                >

                  <div
                    class="rounded-2xl border
                    border-indigo-100
                    bg-white p-5 text-left
                    shadow-sm"
                  >
                    <div
                      class="flex h-10 w-10
                      items-center justify-center
                      rounded-xl bg-indigo-50
                      text-indigo-600"
                    >
                      ✦
                    </div>

                    <p
                      class="mt-5 text-sm
                      font-semibold"
                    >
                      Remove Background
                    </p>

                    <p
                      class="mt-2 text-xs
                      leading-5 text-slate-400"
                    >
                      Clean your images instantly.
                    </p>
                  </div>


                  <div
                    class="rounded-2xl border
                    border-violet-100
                    bg-white p-5 text-left
                    shadow-sm"
                  >
                    <div
                      class="flex h-10 w-10
                      items-center justify-center
                      rounded-xl bg-violet-50
                      text-violet-600"
                    >
                      ↗
                    </div>

                    <p
                      class="mt-5 text-sm
                      font-semibold"
                    >
                      Enhance Image
                    </p>

                    <p
                      class="mt-2 text-xs
                      leading-5 text-slate-400"
                    >
                      Improve quality with AI.
                    </p>
                  </div>


                  <div
                    class="rounded-2xl border
                    border-cyan-100
                    bg-white p-5 text-left
                    shadow-sm"
                  >
                    <div
                      class="flex h-10 w-10
                      items-center justify-center
                      rounded-xl bg-cyan-50
                      text-cyan-600"
                    >
                      ↓
                    </div>

                    <p
                      class="mt-5 text-sm
                      font-semibold"
                    >
                      Download Media
                    </p>

                    <p
                      class="mt-2 text-xs
                      leading-5 text-slate-400"
                    >
                      Save content from the web.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>


    <!-- ================================================= -->
    <!-- TOOLS -->
    <!-- ================================================= -->

    <section
      class="border-y border-slate-100
      bg-slate-50/70 py-24 sm:py-32"
    >

      <div
        class="mx-auto max-w-7xl px-6"
      >

        <div
          class="flex flex-col
          justify-between gap-8
          lg:flex-row lg:items-end"
        >

          <div class="max-w-2xl">

            <span
              class="text-xs font-bold
              uppercase tracking-[0.2em]
              text-indigo-600"
            >
              Explore Tools
            </span>

            <h2
              class="mt-4 text-4xl font-bold
              tracking-[-0.04em]
              text-slate-950
              sm:text-5xl"
            >
              Everything you need,
              <span class="text-slate-400">
                in one place.
              </span>
            </h2>

            <p
              class="mt-5 max-w-xl
              leading-7 text-slate-500"
            >
              A growing collection of useful tools
              designed to make your digital workflow
              faster, simpler, and more efficient.
            </p>

          </div>


          <NuxtLink
            to="/tools"
            class="group flex items-center gap-2
            text-sm font-semibold text-slate-900"
          >
            View all tools

            <span
              class="transition-transform
              group-hover:translate-x-1"
            >
              →
            </span>
          </NuxtLink>

        </div>


        <!-- Cards -->
        <div
          class="mt-14 grid gap-5
          sm:grid-cols-2
          lg:grid-cols-3"
        >

          <NuxtLink
            v-for="tool in tools"
            :key="tool.title"
            :to="tool.href"
            class="group relative overflow-hidden
            rounded-3xl border border-slate-200
            bg-white p-7
            transition-all duration-300
            hover:-translate-y-1
            hover:border-slate-300
            hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
          >

            <!-- Gradient -->
            <div
              class="absolute right-0 top-0
              h-32 w-32 rounded-full
              bg-gradient-to-br opacity-10
              blur-3xl transition-opacity
              group-hover:opacity-30"
              :class="tool.gradient"
            />

            <div
              class="relative flex h-12 w-12
              items-center justify-center
              rounded-2xl text-xl font-bold
              text-white shadow-lg
              transition-transform
              group-hover:scale-110"
              :class="`bg-gradient-to-br ${tool.gradient}`"
            >
              {{ tool.icon }}
            </div>


            <h3
              class="relative mt-7 text-lg
              font-bold text-slate-900"
            >
              {{ tool.title }}
            </h3>

            <p
              class="relative mt-3 text-sm
              leading-6 text-slate-500"
            >
              {{ tool.description }}
            </p>


            <div
              class="relative mt-7 flex
              items-center gap-2
              text-sm font-semibold
              text-slate-900"
            >
              Try it now

              <span
                class="transition-transform
                group-hover:translate-x-1"
              >
                →
              </span>
            </div>

          </NuxtLink>

        </div>

      </div>
    </section>


    <!-- ================================================= -->
    <!-- AI FEATURE -->
    <!-- ================================================= -->

    <section
      class="relative overflow-hidden
      bg-slate-950 py-24 text-white
      sm:py-32"
    >

      <div
        class="absolute left-1/2 top-0
        h-[500px] w-[700px]
        -translate-x-1/2
        rounded-full bg-indigo-600/20
        blur-[120px]"
      />

      <div
        class="relative mx-auto max-w-7xl px-6"
      >

        <div
          class="grid items-center gap-16
          lg:grid-cols-2"
        >

          <!-- Text -->
          <div>

            <span
              class="text-xs font-bold
              uppercase tracking-[0.2em]
              text-indigo-400"
            >
              Built for modern creators
            </span>

            <h2
              class="mt-5 text-4xl font-bold
              tracking-[-0.04em]
              sm:text-6xl"
            >
              Less busywork.
              <span class="text-slate-500">
                More creating.
              </span>
            </h2>

            <p
              class="mt-6 max-w-lg
              text-base leading-8
              text-slate-400"
            >
              Stop jumping between different websites
              and complicated software. SP-Tools brings
              useful tools together in one clean workspace.
            </p>


            <div
              class="mt-10 space-y-5"
            >

              <div
                class="flex gap-4"
              >
                <div
                  class="flex h-10 w-10
                  shrink-0 items-center
                  justify-center rounded-xl
                  bg-white/10 text-indigo-400"
                >
                  01
                </div>

                <div>
                  <h3 class="font-semibold">
                    Simple workflow
                  </h3>

                  <p
                    class="mt-1 text-sm
                    text-slate-500"
                  >
                    Upload, process, and download
                    without unnecessary steps.
                  </p>
                </div>
              </div>


              <div
                class="flex gap-4"
              >
                <div
                  class="flex h-10 w-10
                  shrink-0 items-center
                  justify-center rounded-xl
                  bg-white/10 text-violet-400"
                >
                  02
                </div>

                <div>
                  <h3 class="font-semibold">
                    Powerful technology
                  </h3>

                  <p
                    class="mt-1 text-sm
                    text-slate-500"
                  >
                    Modern tools designed for
                    everyday digital tasks.
                  </p>
                </div>
              </div>


              <div
                class="flex gap-4"
              >
                <div
                  class="flex h-10 w-10
                  shrink-0 items-center
                  justify-center rounded-xl
                  bg-white/10 text-cyan-400"
                >
                  03
                </div>

                <div>
                  <h3 class="font-semibold">
                    Built for everyone
                  </h3>

                  <p
                    class="mt-1 text-sm
                    text-slate-500"
                  >
                    A clean experience for creators,
                    developers, marketers, and teams.
                  </p>
                </div>
              </div>

            </div>

          </div>


          <!-- Visual -->
          <div
            class="relative"
          >

            <div
              class="absolute -inset-5
              rounded-[40px]
              bg-gradient-to-r
              from-indigo-500/20
              via-violet-500/20
              to-cyan-500/20
              blur-2xl"
            />

            <div
              class="relative rounded-[32px]
              border border-white/10
              bg-white/[0.04]
              p-5 backdrop-blur-xl"
            >

              <div
                class="rounded-2xl
                border border-white/10
                bg-slate-900 p-6"
              >

                <div
                  class="flex items-center
                  justify-between"
                >
                  <div>
                    <p
                      class="text-xs
                      text-slate-500"
                    >
                      AI WORKSPACE
                    </p>

                    <p
                      class="mt-1 font-semibold"
                    >
                      Image Processing
                    </p>
                  </div>

                  <span
                    class="rounded-full
                    bg-emerald-500/10
                    px-3 py-1
                    text-xs text-emerald-400"
                  >
                    Processing
                  </span>
                </div>


                <div
                  class="mt-8 h-2
                  overflow-hidden rounded-full
                  bg-white/10"
                >
                  <div
                    class="h-full w-[78%]
                    rounded-full
                    bg-gradient-to-r
                    from-indigo-500
                    to-cyan-400"
                  />
                </div>


                <div
                  class="mt-4 flex
                  justify-between
                  text-xs text-slate-500"
                >
                  <span>
                    Enhancing image...
                  </span>

                  <span>
                    78%
                  </span>
                </div>


                <div
                  class="mt-8 grid grid-cols-2
                  gap-3"
                >

                  <div
                    class="rounded-xl
                    border border-white/10
                    bg-white/[0.03]
                    p-4"
                  >
                    <p
                      class="text-xs
                      text-slate-500"
                    >
                      Resolution
                    </p>

                    <p
                      class="mt-2 font-semibold"
                    >
                      4× Enhanced
                    </p>
                  </div>


                  <div
                    class="rounded-xl
                    border border-white/10
                    bg-white/[0.03]
                    p-4"
                  >
                    <p
                      class="text-xs
                      text-slate-500"
                    >
                      Quality
                    </p>

                    <p
                      class="mt-2 font-semibold"
                    >
                      AI Optimized
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>


    <!-- ================================================= -->
    <!-- HOW IT WORKS -->
    <!-- ================================================= -->

    <section
      class="py-24 sm:py-32"
    >

      <div
        class="mx-auto max-w-7xl px-6"
      >

        <div class="text-center">

          <span
            class="text-xs font-bold
            uppercase tracking-[0.2em]
            text-indigo-600"
          >
            How It Works
          </span>

          <h2
            class="mt-4 text-4xl font-bold
            tracking-[-0.04em]
            sm:text-5xl"
          >
            Simple by design.
          </h2>

          <p
            class="mx-auto mt-5 max-w-xl
            leading-7 text-slate-500"
          >
            Get things done in three simple steps.
          </p>

        </div>


        <div
          class="relative mt-16
          grid gap-10
          md:grid-cols-3"
        >

          <!-- Line -->
          <div
            class="absolute left-[16%]
            right-[16%] top-8
            hidden h-px bg-slate-200
            md:block"
          />


          <div
            class="relative text-center"
          >
            <div
              class="mx-auto flex h-16 w-16
              items-center justify-center
              rounded-2xl border
              border-slate-200
              bg-white text-lg
              font-bold shadow-sm"
            >
              01
            </div>

            <h3
              class="mt-7 font-bold"
            >
              Choose a tool
            </h3>

            <p
              class="mx-auto mt-3 max-w-xs
              text-sm leading-6
              text-slate-500"
            >
              Select the tool that matches
              what you want to accomplish.
            </p>
          </div>


          <div
            class="relative text-center"
          >
            <div
              class="mx-auto flex h-16 w-16
              items-center justify-center
              rounded-2xl
              bg-gradient-to-br
              from-indigo-600
              to-violet-600
              text-lg font-bold
              text-white
              shadow-[0_10px_30px_rgba(99,102,241,0.25)]"
            >
              02
            </div>

            <h3
              class="mt-7 font-bold"
            >
              Upload your content
            </h3>

            <p
              class="mx-auto mt-3 max-w-xs
              text-sm leading-6
              text-slate-500"
            >
              Add your image or use the
              downloader with your content URL.
            </p>
          </div>


          <div
            class="relative text-center"
          >
            <div
              class="mx-auto flex h-16 w-16
              items-center justify-center
              rounded-2xl border
              border-slate-200
              bg-white text-lg
              font-bold shadow-sm"
            >
              03
            </div>

            <h3
              class="mt-7 font-bold"
            >
              Get your result
            </h3>

            <p
              class="mx-auto mt-3 max-w-xs
              text-sm leading-6
              text-slate-500"
            >
              Process your content and
              get the result when ready.
            </p>
          </div>

        </div>

      </div>
    </section>


    <!-- ================================================= -->
    <!-- STATS -->
    <!-- ================================================= -->

    <section
      class="border-y border-slate-100
      bg-slate-50 py-20"
    >

      <div
        class="mx-auto grid max-w-6xl
        grid-cols-2 gap-10 px-6
        lg:grid-cols-4"
      >

        <div class="text-center">
          <p
            class="text-4xl font-bold
            tracking-tight"
          >
            5+
          </p>

          <p
            class="mt-2 text-sm
            text-slate-500"
          >
            Useful Tools
          </p>
        </div>


        <div class="text-center">
          <p
            class="text-4xl font-bold
            tracking-tight"
          >
            AI
          </p>

          <p
            class="mt-2 text-sm
            text-slate-500"
          >
            Powered Workflows
          </p>
        </div>


        <div class="text-center">
          <p
            class="text-4xl font-bold
            tracking-tight"
          >
            24/7
          </p>

          <p
            class="mt-2 text-sm
            text-slate-500"
          >
            Online Access
          </p>
        </div>


        <div class="text-center">
          <p
            class="text-4xl font-bold
            tracking-tight"
          >
            100%
          </p>

          <p
            class="mt-2 text-sm
            text-slate-500"
          >
            Browser Based
          </p>
        </div>

      </div>
    </section>


    <!-- ================================================= -->
    <!-- USE CASES -->
    <!-- ================================================= -->

    <section
      class="py-24 sm:py-32"
    >

      <div
        class="mx-auto max-w-7xl px-6"
      >

        <div
          class="grid gap-16
          lg:grid-cols-2"
        >

          <div>

            <span
              class="text-xs font-bold
              uppercase tracking-[0.2em]
              text-indigo-600"
            >
              Built for you
            </span>

            <h2
              class="mt-5 text-4xl
              font-bold tracking-[-0.04em]
              sm:text-5xl"
            >
              Whatever you create,
              make it easier.
            </h2>

            <p
              class="mt-6 max-w-lg
              leading-8 text-slate-500"
            >
              From social media content to
              marketing assets, SP-Tools helps
              simplify repetitive digital tasks.
            </p>

          </div>


          <div
            class="grid gap-4
            sm:grid-cols-2"
          >

            <div
              class="rounded-3xl
              border border-slate-200
              p-6"
            >
              <div class="text-2xl">
                🎨
              </div>

              <h3
                class="mt-5 font-bold"
              >
                Content Creators
              </h3>

              <p
                class="mt-2 text-sm
                leading-6 text-slate-500"
              >
                Prepare images and media
                faster for your next post.
              </p>
            </div>


            <div
              class="rounded-3xl
              border border-slate-200
              p-6"
            >
              <div class="text-2xl">
                📣
              </div>

              <h3
                class="mt-5 font-bold"
              >
                Marketers
              </h3>

              <p
                class="mt-2 text-sm
                leading-6 text-slate-500"
              >
                Create clean visual assets
                for campaigns and promotions.
              </p>
            </div>


            <div
              class="rounded-3xl
              border border-slate-200
              p-6"
            >
              <div class="text-2xl">
                💻
              </div>

              <h3
                class="mt-5 font-bold"
              >
                Developers
              </h3>

              <p
                class="mt-2 text-sm
                leading-6 text-slate-500"
              >
                Quickly handle common
                digital media tasks.
              </p>
            </div>


            <div
              class="rounded-3xl
              border border-slate-200
              p-6"
            >
              <div class="text-2xl">
                🚀
              </div>

              <h3
                class="mt-5 font-bold"
              >
                Small Teams
              </h3>

              <p
                class="mt-2 text-sm
                leading-6 text-slate-500"
              >
                Keep your everyday tools
                organized in one place.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>


    <!-- ================================================= -->
    <!-- FAQ -->
    <!-- ================================================= -->

    <section
      class="bg-slate-50
      py-24 sm:py-32"
    >

      <div
        class="mx-auto max-w-3xl px-6"
      >

        <div class="text-center">

          <span
            class="text-xs font-bold
            uppercase tracking-[0.2em]
            text-indigo-600"
          >
            FAQ
          </span>

          <h2
            class="mt-4 text-4xl
            font-bold tracking-tight"
          >
            Frequently asked questions
          </h2>

        </div>


        <div
          class="mt-12 divide-y
          divide-slate-200
          rounded-3xl border
          border-slate-200
          bg-white"
        >

          <div
            v-for="(faq, index) in faqs"
            :key="faq.question"
            class="px-6"
          >

            <button
              type="button"
              class="flex w-full
              items-center justify-between
              gap-5 py-6 text-left"
              @click="toggleFaq(index)"
            >

              <span
                class="font-semibold
                text-slate-900"
              >
                {{ faq.question }}
              </span>

              <span
                class="text-xl text-slate-400
                transition-transform"
                :class="
                  openFaq === index
                    ? 'rotate-45'
                    : ''
                "
              >
                +
              </span>

            </button>


            <div
              v-if="openFaq === index"
              class="pb-6"
            >
              <p
                class="text-sm leading-7
                text-slate-500"
              >
                {{ faq.answer }}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>


    <!-- ================================================= -->
    <!-- CTA -->
    <!-- ================================================= -->

    <section
      class="px-6 py-24 sm:py-32"
    >

      <div
        class="relative mx-auto max-w-6xl
        overflow-hidden rounded-[36px]
        bg-slate-950 px-6 py-20
        text-center text-white
        sm:px-12"
      >

        <div
          class="absolute left-1/2 top-0
          h-[400px] w-[600px]
          -translate-x-1/2
          rounded-full
          bg-indigo-600/20
          blur-[100px]"
        />

        <div class="relative">

          <span
            class="text-xs font-bold
            uppercase tracking-[0.2em]
            text-indigo-400"
          >
            Start creating
          </span>

          <h2
            class="mx-auto mt-5 max-w-3xl
            text-4xl font-bold
            tracking-[-0.04em]
            sm:text-6xl"
          >
            Your tools are waiting.
          </h2>

          <p
            class="mx-auto mt-6 max-w-xl
            leading-7 text-slate-400"
          >
            Explore SP-Tools and discover
            a simpler way to handle your
            everyday digital workflow.
          </p>


          <div
            class="mt-10 flex flex-col
            items-center justify-center
            gap-3 sm:flex-row"
          >

            <NuxtLink
              to="/tools"
              class="rounded-2xl
              bg-white px-7 py-4
              text-sm font-bold
              text-slate-950
              transition-all
              hover:-translate-y-1
              hover:bg-slate-100"
            >
              Explore Tools →
            </NuxtLink>

            <NuxtLink
              to="/news"
              class="rounded-2xl
              border border-white/10
              bg-white/5 px-7 py-4
              text-sm font-semibold
              text-white
              transition-all
              hover:bg-white/10"
            >
              Read Our News
            </NuxtLink>

          </div>

        </div>

      </div>

    </section>
  </div>
</template>