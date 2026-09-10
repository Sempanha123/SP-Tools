<script setup lang="ts">
const { imageTools, downloadTools } = useTools()
const route = useRoute()
const isDownloadRoute = computed(() => route.path.startsWith('/download'))

const isMobileMenuOpen = ref(false)
const activeMobileSection = ref<string | null>(null)
const openDesktopMenu = ref<string | null>(null)
const isScrolled = ref(false)
const isHeaderVisible = ref(true)
const lastScrollY = ref(0)
let scrollFrame: number | null = null

const headerRef = ref<HTMLElement | null>(null)
let closeTimer: ReturnType<typeof setTimeout> | null = null

const onScroll = () => {
  if (scrollFrame !== null) return

  scrollFrame = window.requestAnimationFrame(() => {
    const currentY = Math.max(window.scrollY, 0)
    const delta = currentY - lastScrollY.value

    isScrolled.value = currentY > 16

    const menuIsOpen =
      isMobileMenuOpen.value
      || openDesktopMenu.value !== null

    if (menuIsOpen || currentY <= 72) {
      isHeaderVisible.value = true
    } else if (delta > 8) {
      isHeaderVisible.value = false
    } else if (delta < -6) {
      isHeaderVisible.value = true
    }

    lastScrollY.value = currentY
    scrollFrame = null
  })
}

const openMenu = (id: string) => {
  if (closeTimer) clearTimeout(closeTimer)
  openDesktopMenu.value = id
}

const scheduleCloseMenu = () => {
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    openDesktopMenu.value = null
  }, 120)
}

const closeMenuNow = () => {
  if (closeTimer) clearTimeout(closeTimer)
  openDesktopMenu.value = null
}

const toggleMenu = (id: string) => {
  openDesktopMenu.value = openDesktopMenu.value === id ? null : id
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (!isMobileMenuOpen.value) activeMobileSection.value = null
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  activeMobileSection.value = null
}

const toggleMobileSection = (id: string) => {
  activeMobileSection.value = activeMobileSection.value === id ? null : id
}

const isSectionActive = (prefix: string) => route.path.startsWith(prefix)

const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  closeMenuNow()
  closeMobileMenu()
}

const onPointerDown = (event: PointerEvent) => {
  if (!headerRef.value?.contains(event.target as Node)) closeMenuNow()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('pointerdown', onPointerDown)
  lastScrollY.value = window.scrollY
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('pointerdown', onPointerDown)
  if (scrollFrame !== null) {
    window.cancelAnimationFrame(scrollFrame)
    scrollFrame = null
  }
  if (closeTimer) clearTimeout(closeTimer)
  if (import.meta.client) {
    document.body.style.overflow = ''
    document.documentElement.classList.remove(
      'sp-site-header-v36-visible',
      'sp-site-header-v36-hidden',
    )
  }
})

watch(() => route.fullPath, () => {
  closeMenuNow()
  closeMobileMenu()
  isHeaderVisible.value = true

  if (import.meta.client) {
    lastScrollY.value = window.scrollY
  }
})

watch(isMobileMenuOpen, (open) => {
  if (!import.meta.client) return

  if (open) {
    isHeaderVisible.value = true
  }

  document.body.style.overflow = open ? 'hidden' : ''
})

watch(
  isHeaderVisible,
  (visible) => {
    if (!import.meta.client) return

    document.documentElement.classList.toggle(
      'sp-site-header-v36-visible',
      visible,
    )

    document.documentElement.classList.toggle(
      'sp-site-header-v36-hidden',
      !visible,
    )
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <header
    ref="headerRef"
    class="sp-site-header-v17 sp-smart-header-v36 sticky top-0 z-50 transition-all duration-300"
    :class="[
      isHeaderVisible
        ? 'sp-smart-header-visible'
        : 'sp-smart-header-hidden',
      isScrolled
        ? 'sp-smart-header-scrolled'
        : 'sp-smart-header-top',
      isDownloadRoute ? 'sp-header-download' : '',
    ]"
  >
    <div class="sp-smart-header-glow pointer-events-none absolute top-0 h-px bg-gradient-to-r from-transparent via-accent/55 to-transparent" />
    <div
      class="sp-container-wide sp-smart-header-panel border border-line bg-surface/[0.88] shadow-soft backdrop-blur-2xl transition-[width,background-color,box-shadow] duration-500"
      :class="
        isScrolled
          ? 'bg-surface/[0.94] shadow-pop'
          : 'bg-surface/[0.82] shadow-soft'
      "
    >
      <div class="flex h-[68px] items-center justify-between gap-7">
        <NuxtLink
          to="/"
          class="group flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/10"
          @click="closeMobileMenu"
        >
          <span class="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] bg-fg text-surface-2 shadow-xs transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <span class="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-accent to-accent-2" />
            <svg class="h-[19px] w-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 3 5 13h6l-1 8 9-12h-6V3Z" />
            </svg>
          </span>
          <span class="text-[18px] font-[740] tracking-[-0.035em] text-fg">
            SP<span class="text-accent">-Tools</span>
          </span>
        </NuxtLink>

        <nav class="hidden h-[44px] items-center gap-1 rounded-[16px] border border-line bg-elevated/78 p-1 shadow-xs backdrop-blur-xl lg:flex" aria-label="Main navigation">
          <div
            class="relative h-full"
            @mouseenter="openMenu('tools')"
            @mouseleave="scheduleCloseMenu"
          >
            <button
              type="button"
              class="relative flex h-full items-center gap-1.5 rounded-[11px] px-4 text-[13.5px] font-semibold transition-all duration-200"
              :class="isSectionActive('/tools')
                ? 'bg-accent-soft text-accent shadow-xs'
                : 'text-fg-muted hover:bg-surface-3 hover:text-fg'"
              :aria-expanded="openDesktopMenu === 'tools'"
              aria-haspopup="true"
              @click="toggleMenu('tools')"
            >
              AI Tools
              <svg
                class="h-3.5 w-3.5 transition-transform duration-200"
                :class="openDesktopMenu === 'tools' ? 'rotate-180 text-accent' : 'text-fg-subtle'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              leave-active-class="transition duration-100 ease-in"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div v-if="openDesktopMenu === 'tools'" class="absolute left-0 top-full w-[390px] pt-2.5">
                <div class="sp-gradient-ring overflow-hidden rounded-[18px] border border-line bg-elevated p-2.5 shadow-pop">
                  <div class="px-3 pb-2 pt-1.5">
                    <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-fg-subtle">Image workspace</p>
                    <p class="mt-1 text-xs text-fg-muted">Fast browser-based image utilities.</p>
                  </div>

                  <SiteNavToolItem
                    v-for="tool in imageTools"
                    :key="tool.slug"
                    :tool="tool"
                    @navigate="closeMenuNow"
                  />

                  <div class="mt-2 border-t border-line pt-2">
                    <NuxtLink
                      to="/tools"
                      class="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-fg-muted transition hover:bg-surface-3 hover:text-fg"
                      @click="closeMenuNow"
                    >
                      Browse all tools
                      <span class="text-accent" aria-hidden="true">→</span>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <div
            class="relative h-full"
            @mouseenter="openMenu('downloads')"
            @mouseleave="scheduleCloseMenu"
          >
            <button
              type="button"
              class="relative flex h-full items-center gap-1.5 rounded-[11px] px-4 text-[13.5px] font-semibold transition-all duration-200"
              :class="isSectionActive('/download')
                ? 'bg-accent-soft text-accent shadow-xs'
                : 'text-fg-muted hover:bg-surface-3 hover:text-fg'"
              :aria-expanded="openDesktopMenu === 'downloads'"
              aria-haspopup="true"
              @click="toggleMenu('downloads')"
            >
              Downloaders
              <svg
                class="h-3.5 w-3.5 transition-transform duration-200"
                :class="openDesktopMenu === 'downloads' ? 'rotate-180 text-accent' : 'text-fg-subtle'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              leave-active-class="transition duration-100 ease-in"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div v-if="openDesktopMenu === 'downloads'" class="absolute left-0 top-full w-[390px] pt-2.5">
                <div class="sp-gradient-ring overflow-hidden rounded-[18px] border border-line bg-elevated p-2.5 shadow-pop">
                  <div class="px-3 pb-2 pt-1.5">
                    <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-fg-subtle">Media downloaders</p>
                    <p class="mt-1 text-xs text-fg-muted">Save supported public media in a few clicks.</p>
                  </div>

                  <SiteNavToolItem
                    v-for="tool in downloadTools"
                    :key="tool.slug"
                    :tool="tool"
                    @navigate="closeMenuNow"
                  />
                </div>
              </div>
            </Transition>
          </div>

          <NuxtLink
            to="/news"
            class="relative flex h-full items-center rounded-[11px] px-4 text-[13.5px] font-semibold transition-all duration-200"
            :class="isSectionActive('/news')
              ? 'bg-accent-soft text-accent shadow-xs'
              : 'text-fg-muted hover:bg-surface-3 hover:text-fg'"
          >
            News
          </NuxtLink>
        </nav>

        <div class="hidden items-center gap-2 lg:flex">
          <NuxtLink
            to="/news/search"
            class="flex h-10 w-10 items-center justify-center rounded-[12px] border border-line bg-elevated text-fg-muted transition hover:border-line-strong hover:bg-surface-3 hover:text-fg"
            aria-label="Search news"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path stroke-linecap="round" d="M16 16l4.5 4.5" />
            </svg>
          </NuxtLink>

          <ClientOnly>
            <UiThemeToggle />
            <template #fallback>
              <div class="h-9 w-9 rounded-[11px] border border-line bg-elevated" />
            </template>
          </ClientOnly>

          <NuxtLink
            to="/tools"
            class="sp-shimmer ml-1 inline-flex h-10 items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-accent via-accent to-accent-2 px-5 text-[13px] font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft"
          >
            Explore tools
            <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-2 lg:hidden">
          <ClientOnly>
            <UiThemeToggle />
            <template #fallback>
              <div class="h-9 w-9 rounded-[11px] border border-line bg-elevated" />
            </template>
          </ClientOnly>

          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-[11px] border border-line bg-elevated text-fg transition hover:bg-surface-3"
            :aria-expanded="isMobileMenuOpen"
            aria-label="Toggle navigation menu"
            @click="toggleMobileMenu"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" d="M5 7h14M5 12h14M5 17h14" />
              <path v-else stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMobileMenuOpen" class="sp-smart-mobile-menu-v39 border-t border-line bg-elevated shadow-pop lg:hidden">
        <div class="sp-container py-4">
          <div class="space-y-1">
            <div class="border-b border-line pb-2">
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-fg hover:bg-surface-3"
                :aria-expanded="activeMobileSection === 'tools'"
                @click="toggleMobileSection('tools')"
              >
                <span>AI Tools</span>
                <span class="text-fg-subtle" :class="activeMobileSection === 'tools' ? 'rotate-180' : ''">⌄</span>
              </button>

              <div v-show="activeMobileSection === 'tools'" class="space-y-1 pb-1 pl-2">
                <NuxtLink
                  v-for="tool in imageTools"
                  :key="tool.slug"
                  :to="tool.href"
                  class="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-fg-muted hover:bg-surface-3 hover:text-fg"
                  @click="closeMobileMenu"
                >
                  {{ tool.name }}
                  <span aria-hidden="true">→</span>
                </NuxtLink>
              </div>
            </div>

            <div class="border-b border-line pb-2">
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-fg hover:bg-surface-3"
                :aria-expanded="activeMobileSection === 'downloads'"
                @click="toggleMobileSection('downloads')"
              >
                <span>Downloaders</span>
                <span class="text-fg-subtle" :class="activeMobileSection === 'downloads' ? 'rotate-180' : ''">⌄</span>
              </button>

              <div v-show="activeMobileSection === 'downloads'" class="space-y-1 pb-1 pl-2">
                <NuxtLink
                  v-for="tool in downloadTools"
                  :key="tool.slug"
                  :to="tool.href"
                  class="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-fg-muted hover:bg-surface-3 hover:text-fg"
                  @click="closeMobileMenu"
                >
                  {{ tool.name }}
                  <span aria-hidden="true">→</span>
                </NuxtLink>
              </div>
            </div>

            <NuxtLink
              to="/news"
              class="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-fg hover:bg-surface-3"
              @click="closeMobileMenu"
            >
              News & Articles
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-4">
            <NuxtLink
              to="/news/search"
              class="flex h-10 items-center justify-center rounded-xl border border-line bg-surface-2 text-xs font-semibold text-fg"
              @click="closeMobileMenu"
            >
              Search news
            </NuxtLink>
            <NuxtLink
              to="/tools"
              class="flex h-10 items-center justify-center rounded-xl bg-accent text-xs font-semibold text-accent-fg"
              @click="closeMobileMenu"
            >
              Explore tools
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
