<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4
        focus:z-[100] focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2.5
        focus:text-sm focus:font-semibold focus:text-accent-fg"
    >
      Skip to main content
    </a>

    <SiteHeader />

    <SiteContextRail />

    <main id="main-content" class="flex-1">
      <NuxtPage />
    </main>

    <SiteFooter />

    <UiScrollToTop />
  </div>
</template>
