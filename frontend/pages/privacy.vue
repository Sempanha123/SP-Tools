<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy | SP-Tools',
  description:
    'How SP-Tools handles uploads, newsletter subscriptions and analytics. What we store, what we do not, and how long we keep it.',
  ogTitle: 'Privacy Policy | SP-Tools',
  ogDescription: 'What SP-Tools collects and what it does not.',
})

const sections = [
  {
    heading: 'What this policy covers',
    body: [
      'SP-Tools runs two things: a set of browser-based media utilities, and a world news reader. This policy describes what each one does with your data.',
      'We have written it plainly rather than legally, because a policy you cannot read is not consent.',
    ],
  },
  {
    heading: 'Images you upload',
    body: [
      'The background remover and image upscaler send your file to our processing service, run the model, and stream the result back to your browser.',
      'While a job runs, the file is written to disk on the processing server so the model can read it. It is not indexed, shared, or used for training. If you handle sensitive images, treat this the same way you would any upload service and avoid it for confidential material.',
      'The finished image exists in your browser as a temporary object URL and is discarded when you close the tab or start another job.',
    ],
  },
  {
    heading: 'Links you paste into the downloaders',
    body: [
      'The TikTok, Facebook and YouTube tools send the URL you paste to our service, which asks the platform for the available media formats.',
      'We do not require an account on any of those platforms, and we never ask for your credentials. The URL is used for that single request and is not retained for profiling.',
    ],
  },
  {
    heading: 'Newsletter subscriptions',
    body: [
      'If you subscribe, we store your email address so we can send the briefing. That is the only thing we store, and we do not sell or share it.',
      'Every email includes an unsubscribe link. Unsubscribing deletes your address from the list.',
    ],
  },
  {
    heading: 'Cookies',
    body: [
      'We set one cookie, sp-theme, which remembers whether you chose light mode, dark mode, or system default. It contains that single value and nothing else.',
      'It is not a tracking cookie, it is not shared with third parties, and clearing it simply returns the site to following your system setting.',
    ],
  },
  {
    heading: 'Third-party requests',
    body: [
      'Fonts are loaded from Google Fonts, which means your browser makes a request to Google’s servers when you first load a page. Video thumbnails shown in the downloader results are loaded from the originating platform’s CDN.',
      'Those providers see the request as any web request: your IP address and user agent. We do not send them any additional information about you.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      'You can ask us what we hold about you, ask for it to be corrected, or ask for it to be deleted. For the newsletter, unsubscribing achieves deletion immediately.',
      'For anything else, use the contact page and we will respond.',
    ],
  },
]
</script>

<template>
  <LegalPage
    eyebrow="Privacy"
    title="Privacy Policy"
    intro="SP-Tools collects as little as possible: one theme cookie, and your email only if you ask for the newsletter. Here is the complete picture."
    updated="3 September 2026"
    :sections="sections"
  >
    <div class="mt-14">
      <UiAlert tone="accent" title="Questions about your data?">
        Use the
        <NuxtLink to="/contact" class="font-semibold underline">
          contact page
        </NuxtLink>
        and we will get back to you.
      </UiAlert>
    </div>
  </LegalPage>
</template>
