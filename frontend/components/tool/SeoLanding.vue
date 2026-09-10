<script setup lang="ts">
import type {
  SpToolSeoSlug,
} from '~/composables/useToolSeo'

const props =
  defineProps<{
    slug: SpToolSeoSlug
  }>()

const route = useRoute()

const seo = computed(
  () =>
    useToolSeo(
      props.slug,
    ),
)

const requestUrl =
  useRequestURL()

const canonicalUrl =
  computed(() => {
    const url =
      new URL(
        route.path,
        requestUrl.origin,
      )

    url.search = ''
    url.hash = ''

    return url.toString()
  })

useSeoMeta(() => ({
  title:
    seo.value.seoTitle,
  description:
    seo.value
      .metaDescription,
  keywords:
    seo.value
      .keywords
      .join(', '),
  robots:
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  googlebot:
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  ogType:
    'website',
  ogTitle:
    seo.value.seoTitle,
  ogDescription:
    seo.value
      .metaDescription,
  ogUrl:
    canonicalUrl.value,
  twitterCard:
    'summary',
  twitterTitle:
    seo.value.seoTitle,
  twitterDescription:
    seo.value
      .metaDescription,
  ogImage:
    `${requestUrl.origin}/brand/sp-tools-og.png`,
  ogImageAlt:
    `${seo.value.toolName} by SP-Tools`,
  twitterImage:
    `${requestUrl.origin}/brand/sp-tools-og.png`,
}))

const schemaGraph =
  computed(() => {
    const category =
      props.slug.includes(
        'download',
      )
        ? 'Downloader'
        : 'AI image tool'

    const sectionUrl =
      props.slug.includes(
        'download',
      )
        ? (
            new URL(
              '/download',
              requestUrl.origin,
            ).toString()
          )
        : (
            new URL(
              '/tools',
              requestUrl.origin,
            ).toString()
          )

    return {
      '@context':
        'https://schema.org',
      '@graph': [
        {
          '@type':
            'WebPage',
          '@id':
            `${canonicalUrl.value}#webpage`,
          url:
            canonicalUrl.value,
          name:
            seo.value.seoTitle,
          description:
            seo.value
              .metaDescription,
          inLanguage:
            'en',
          about: {
            '@type':
              'Thing',
            name:
              seo.value
                .primaryKeyword,
          },
          keywords:
            seo.value
              .keywords
              .join(', '),
          isPartOf: {
            '@type':
              'WebSite',
            name:
              'SP-Tools',
            url:
              requestUrl.origin,
          },
          genre:
            category,
        },
        {
          '@type':
            'WebApplication',
          '@id':
            `${canonicalUrl.value}#app`,
          name:
            seo.value.toolName,
          url:
            canonicalUrl.value,
          description:
            seo.value.metaDescription,
          applicationCategory:
            category,
          operatingSystem:
            'Any',
          browserRequirements:
            'Requires a modern web browser',
          offers: {
            '@type':
              'Offer',
            price:
              '0',
            priceCurrency:
              'USD',
          },
          featureList:
            seo.value.benefits
              .map(
                item => item.title,
              )
              .join(', '),
        },
        {
          '@type':
            'BreadcrumbList',
          itemListElement: [
            {
              '@type':
                'ListItem',
              position: 1,
              name:
                'SP-Tools',
              item:
                requestUrl.origin,
            },
            {
              '@type':
                'ListItem',
              position: 2,
              name:
                props.slug.includes(
                  'download',
                )
                  ? 'Downloaders'
                  : 'AI Tools',
              item:
                sectionUrl,
            },
            {
              '@type':
                'ListItem',
              position: 3,
              name:
                seo.value
                  .toolName,
              item:
                canonicalUrl.value,
            },
          ],
        },
      ],
    }
  })

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href:
        canonicalUrl.value,
    },
  ],
  script: [
    {
      type:
        'application/ld+json',
      key:
        `sp-tool-seo-${props.slug}`,
      innerHTML:
        JSON.stringify(
          schemaGraph.value,
        ),
    },
  ],
}))

const freeIntent = computed(() => {
  const content = {
    'bg-remover': {
      title:
        'A genuinely useful free background-removal workflow',
      copy:
        'People searching for a free background remover, remove background free online, transparent PNG maker, or background remover with no signup usually want the same thing: a clean result without an account wall. SP-Tools keeps that workflow focused on upload, preview and transparent PNG download.',
      signals: [
        'Free core tool',
        'No signup',
        'No SP-Tools watermark',
        'Transparent PNG',
      ],
    },
    'image-upscaler': {
      title:
        'Free image upscaling without a complicated upgrade path',
      copy:
        'Searches such as free image upscaler, upscale image free online, AI image upscaler 4×, and increase image resolution usually come from people who want a larger result quickly. SP-Tools keeps 2× and 4× enlargement, before/after comparison and download on one page.',
      signals: [
        'Free 2× upscale',
        'Free 4× upscale',
        'No signup',
        'No SP-Tools watermark',
      ],
    },
    'tiktok-download': {
      title:
        'Free TikTok link resolving with clear format choices',
      copy:
        'People looking for a free TikTok downloader, TikTok MP4 downloader, TikTok HD downloader, or TikTok downloader without watermark usually already have a public post URL. SP-Tools focuses on resolving that link and showing the formats that are actually available.',
      signals: [
        'Free resolver',
        'No SP-Tools account',
        'HD when available',
        'No-watermark option when available',
      ],
    },
    'facebook-video-download': {
      title:
        'A free Facebook video and Reels workflow for public links',
      copy:
        'Searches for a free Facebook video downloader, Facebook Reels downloader free, FB video downloader, or Facebook MP4 downloader usually mean the user wants one public link turned into a small set of useful quality choices. SP-Tools keeps that process direct and browser based.',
      signals: [
        'Free resolver',
        'Public videos',
        'Public Reels',
        'HD when available',
      ],
    },
    'youtube-download': {
      title:
        'A free YouTube format browser for permitted downloads',
      copy:
        'People searching for a free YouTube downloader, YouTube video downloader, YouTube audio downloader, or free YouTube MP4 downloader usually want to inspect the formats available for one public URL. SP-Tools lists ready video and source-audio choices without pretending unavailable merged formats exist.',
      signals: [
        'Free resolver',
        'Video formats',
        'Source audio',
        'No SP-Tools signup',
      ],
    },
  } as const

  return content[props.slug]
})

const relatedHeading =
  computed(
    () =>
      props.slug.includes(
        'download',
      )
        ? 'Related free tools'
        : 'Related AI and media tools',
  )
</script>

<template>
  <div>
    <section
      class="relative border-t border-line bg-surface py-[72px] sm:py-[88px]"
    >
      <div
        class="sp-container-wide"
      >
        <div
          class="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:gap-14"
        >
          <div
            class="lg:sticky lg:top-28 lg:self-start"
          >
            <div
              class="sp-kicker"
            >
              {{ seo.eyebrow }}
            </div>

            <h2
              class="mt-4 max-w-[620px] text-[clamp(2.15rem,4vw,3.65rem)] font-[760] leading-[.96] tracking-[-.055em] text-fg"
            >
              {{ seo.heading }}
            </h2>

            <div
              class="mt-6 rounded-[20px] border border-accent/20 bg-accent-soft/35 p-5 shadow-xs"
            >
              <p
                class="text-[9px] font-black uppercase tracking-[.15em] text-accent"
              >
                Quick answer
              </p>

              <p
                class="mt-3 text-[13px] leading-7 text-fg-muted sm:text-[14px]"
              >
                {{ seo.quickAnswer }}
              </p>
            </div>
          </div>

          <div>
            <div
              class="space-y-5 text-[14px] leading-8 text-fg-muted sm:text-[15px]"
            >
              <p
                v-for="paragraph in seo.intro"
                :key="paragraph"
              >
                {{ paragraph }}
              </p>
            </div>

            <div
              class="mt-8 grid gap-3 sm:grid-cols-2"
            >
              <article
                v-for="item in seo.benefits"
                :key="item.title"
                class="rounded-[18px] border border-line bg-elevated p-5 shadow-xs"
              >
                <h3
                  class="text-[14px] font-bold tracking-[-.02em] text-fg"
                >
                  {{ item.title }}
                </h3>

                <p
                  class="mt-2 text-[12px] leading-6 text-fg-muted"
                >
                  {{ item.text }}
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="border-t border-line bg-elevated py-[54px] sm:py-[64px]"
      aria-labelledby="free-tool-value"
    >
      <div class="sp-container-wide">
        <div
          class="rounded-[24px] border border-line bg-surface p-6 shadow-lift sm:p-8"
        >
          <div
            class="grid gap-7 lg:grid-cols-[1.05fr_.95fr] lg:items-center"
          >
            <div>
              <div class="sp-kicker">
                Free online utility
              </div>

              <h2
                id="free-tool-value"
                class="mt-3 text-[clamp(1.8rem,3vw,2.7rem)] font-[740] leading-[1] tracking-[-.045em] text-fg"
              >
                {{ freeIntent.title }}
              </h2>

              <p
                class="mt-4 max-w-3xl text-[13px] leading-7 text-fg-muted"
              >
                {{ freeIntent.copy }}
              </p>
            </div>

            <div
              class="grid gap-2.5 sm:grid-cols-2"
            >
              <div
                v-for="signal in freeIntent.signals"
                :key="signal"
                class="flex min-h-[52px] items-center gap-3 rounded-[15px] border border-line bg-surface-2 px-4 py-3"
              >
                <span
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-positive-soft text-[11px] font-black text-positive"
                  aria-hidden="true"
                >
                  ✓
                </span>

                <span
                  class="text-[11px] font-bold leading-5 text-fg"
                >
                  {{ signal }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="border-t border-line bg-surface-2 py-[68px] sm:py-[84px]"
    >
      <div
        class="sp-container-wide grid gap-10 lg:grid-cols-[1.02fr_.98fr] lg:gap-14"
      >
        <div>
          <div
            class="sp-kicker"
          >
            Step by step
          </div>

          <h2
            class="mt-4 max-w-2xl text-[clamp(2rem,3.6vw,3.25rem)] font-[740] leading-[.98] tracking-[-.05em] text-fg"
          >
            {{ seo.stepsTitle }}
          </h2>

          <ol
            class="mt-8 space-y-3"
          >
            <li
              v-for="(step, index) in seo.steps"
              :key="step.title"
              class="grid grid-cols-[42px_minmax(0,1fr)] gap-4 rounded-[18px] border border-line bg-elevated p-5"
            >
              <span
                class="flex h-10 w-10 items-center justify-center rounded-[12px] border border-accent/20 bg-accent-soft text-[10px] font-black text-accent"
              >
                0{{ index + 1 }}
              </span>

              <div>
                <h3
                  class="text-[14px] font-bold text-fg"
                >
                  {{ step.title }}
                </h3>

                <p
                  class="mt-2 text-[12px] leading-6 text-fg-muted"
                >
                  {{ step.text }}
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div
          class="rounded-[24px] border border-line bg-elevated p-6 shadow-lift sm:p-7"
        >
          <p
            class="text-[9px] font-black uppercase tracking-[.15em] text-fg-subtle"
          >
            Practical guide
          </p>

          <h2
            class="mt-3 text-[24px] font-bold tracking-[-.04em] text-fg"
          >
            {{ seo.detailsTitle }}
          </h2>

          <div
            class="mt-5 space-y-4"
          >
            <p
              v-for="paragraph in seo.details"
              :key="paragraph"
              class="text-[13px] leading-7 text-fg-muted"
            >
              {{ paragraph }}
            </p>
          </div>

          <div
            class="mt-7 border-t border-line pt-6"
          >
            <h3
              class="text-[14px] font-bold text-fg"
            >
              {{ seo.useCasesTitle }}
            </h3>

            <ul
              class="mt-4 grid gap-2.5"
            >
              <li
                v-for="item in seo.useCases"
                :key="item"
                class="flex gap-3 text-[12px] leading-6 text-fg-muted"
              >
                <span
                  class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />

                <span>
                  {{ item }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section
      class="border-t border-line bg-surface py-[60px] sm:py-[72px]"
    >
      <div
        class="sp-container-wide"
      >
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div
              class="sp-kicker"
            >
              Keep exploring
            </div>

            <h2
              class="mt-3 text-[clamp(1.8rem,3vw,2.65rem)] font-[730] tracking-[-.045em] text-fg"
            >
              {{ relatedHeading }}
            </h2>
          </div>

          <p
            class="max-w-lg text-[12px] leading-6 text-fg-muted"
          >
            Use the next SP-Tools page when your workflow moves from one image or media task to another.
          </p>
        </div>

        <div
          class="mt-7 grid gap-3 md:grid-cols-3"
        >
          <NuxtLink
            v-for="item in seo.related"
            :key="item.href"
            :to="item.href"
            class="group rounded-[18px] border border-line bg-elevated p-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lift"
          >
            <p
              class="text-[13px] font-bold text-fg transition group-hover:text-accent"
            >
              {{ item.name }}
            </p>

            <p
              class="mt-2 text-[11px] leading-6 text-fg-muted"
            >
              {{ item.text }}
            </p>

            <span
              class="mt-4 inline-flex text-[10px] font-bold text-accent"
            >
              Open tool →
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <ToolFaq
      :items="seo.faqs"
      :title="seo.faqTitle"
    />
  </div>
</template>
