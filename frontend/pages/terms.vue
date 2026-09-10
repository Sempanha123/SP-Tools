<script setup lang="ts">
useSeoMeta({
  title: 'Terms of Service | SP-Tools',
  description:
    'The terms that apply when you use SP-Tools: acceptable use, the limits of the media downloaders, and what we do and do not warrant.',
  ogTitle: 'Terms of Service | SP-Tools',
  ogDescription: 'The rules that apply when you use SP-Tools.',
})

const sections = [
  {
    heading: 'Using SP-Tools',
    body: [
      'SP-Tools is provided free of charge, with no account required. By using it you agree to these terms. If you do not, please do not use the site.',
      'We may change or remove tools, and we may change these terms. Material changes will be reflected in the revision date above.',
    ],
  },
  {
    heading: 'Acceptable use',
    body: [
      'Do not use SP-Tools to process content you have no right to process, to attempt to overload or probe the service, or to build an automated pipeline on top of it without asking us first.',
      'The image tools accept a single file per request with a size limit. Circumventing those limits, or scripting the endpoints to run at volume, may get your access blocked.',
    ],
  },
  {
    heading: 'The media downloaders — read this',
    body: [
      'The TikTok, Facebook and YouTube tools resolve publicly available media URLs. Downloading from those platforms is generally prohibited by their own terms of service, and the content is copyrighted by whoever created it.',
      'You are responsible for what you download. Use these tools only for content you own, content licensed to you, or content where the rights holder has given you permission. Downloading someone else’s video to republish it is copyright infringement, and nothing on this site changes that.',
      'We provide the technical capability. We do not grant you any rights over the content you retrieve, and we cannot grant rights we do not hold.',
    ],
  },
  {
    heading: 'No warranty',
    body: [
      'SP-Tools is provided as is. The AI models produce a best-effort result, not a guaranteed one: a background mask may cut into fine detail, and an upscale may invent texture that was not in the original.',
      'The downloaders depend on third-party platforms that change their internals without notice. A tool that worked yesterday may return an error today. We fix these when we can, but we do not promise uptime or continuity.',
    ],
  },
  {
    heading: 'Limitation of liability',
    body: [
      'To the extent permitted by law, we are not liable for lost data, lost profits, or consequential damages arising from your use of the site. Since the service is free and requires no account, our total liability is limited accordingly.',
      'Nothing here excludes liability that cannot legally be excluded.',
    ],
  },
  {
    heading: 'News content',
    body: [
      'The news section aggregates and summarises reporting from third-party sources, each of which is credited on the article. Copyright in the underlying reporting remains with the original publisher.',
      'We aim for accuracy but do not guarantee it. Verify anything you intend to rely on against the original source, which is linked on every article.',
    ],
  },
  {
    heading: 'Contact',
    body: [
      'Questions about these terms, or a takedown request, can be sent through the contact page. Takedown requests are handled promptly.',
    ],
  },
]
</script>

<template>
  <LegalPage
    eyebrow="Terms"
    title="Terms of Service"
    intro="Short version: use the tools for content you have the right to use, do not hammer the service, and understand that the AI output and the downloaders come with no guarantees."
    updated="3 September 2026"
    :sections="sections"
  >
    <div class="mt-14">
      <UiAlert tone="warning" title="Copyright is your responsibility">
        The downloaders do not grant you rights over the media you fetch. Only
        download content you own or have permission to use.
      </UiAlert>
    </div>
  </LegalPage>
</template>
