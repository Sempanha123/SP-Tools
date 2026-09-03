<script setup lang="ts">
const { imageTools, downloadTools } = useTools()
const route = useRoute()

const isMobileMenuOpen = ref(false)
const activeMobileSection = ref<string | null>(null)
const openDesktopMenu = ref<string | null>(null)
const isScrolled = ref(false)

const headerRef = ref<HTMLElement | null>(null)
let closeTimer: ReturnType<typeof setTimeout> | null = null

/* ---------------------------------------------------------------- scroll */

const onScroll = () => {
  isScrolled.value = window.scrollY > 16
}

/* ------------------------------------------------------- desktop menus */

/**
 * Menus open on hover but stay controlled by state rather than CSS
 * `group-hover`, so they also work via keyboard and close on Escape.
 * The small close delay stops the panel vanishing while the pointer
 * crosses the gap between trigger and panel.
 */
const openMenu = (id: string) => {
  if (closeTimer) clearTimeout(closeTimer)
  openDesktopMenu.value = id
}

const scheduleCloseMenu = () => {
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    openDesktopMenu.value = null
  }, 140)
}

const closeMenuNow = () => {
  if (closeTimer) clearTimeout(closeTimer)
  openDesktopMenu.value = null
}

const toggleMenu = (id: string) => {
  openDesktopMenu.value = openDesktopMenu.value === id ? null : id
}

/* -------------------------------------------------------- mobile menu */

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

/* ------------------------------------------------------------- helpers */

const isActive = (href: string) => route.path === href
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
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('pointerdown', onPointerDown)
  if (closeTimer) clearTimeout(closeTimer)
})

// Route change closes everything.
watch(() => route.fullPath, () => {
  closeMenuNow()
  closeMobileMenu()
})

// Lock body scroll while the mobile sheet is open.
watch(isMobileMenuOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
})

onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <header
    ref="headerRef"
    class="sticky top-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'pt-0' : 'pt-3'"
  >
    <div
      class="mx-auto transition-all duration-300"
      :class="isScrolled ? 'max-w-none px-0' : 'max-w-[1320px] px-3 sm:px-5'"
    >
      <div
        class="relative flex h-16 items-center justify-between border
          px-2 transition-all duration-300 sm:px-3"
        :class="
          isScrolled
            ? 'sp-glass rounded-none border-x-0 border-t-0 shadow-soft'
            : 'sp-glass rounded-2xl shadow-lift'
        "
      >
        <!-- ============================================ LOGO -->

        <NuxtLink
          to="/"
          class="group flex shrink-0 items-center gap-2.5 rounded-xl px-2 py-1.5
            transition-colors hover:bg-surface-2"
          @click="closeMobileMenu"
        >
          <span
            class="relative flex h-9 w-9 items-center justify-center
              overflow-hidden rounded-xl bg-accent text-accent-fg
              shadow-glow transition-transform duration-300
              group-hover:scale-105"
          >
            <svg
              class="h-5 w-5 transition-transform duration-500 group-hover:rotate-12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3l1.25 5.75L19 10l-5.75 1.25L12 17l-1.25-5.75L5 10l5.75-1.25L12 3z"
              />
            </svg>
          </span>

          <span class="flex items-center gap-1.5">
            <span
              class="font-display text-[19px] font-bold tracking-tight text-fg"
            >
              SP<span class="text-fg-subtle">-Tools</span>
            </span>
          </span>
        </NuxtLink>

        <!-- ================================= DESKTOP NAV -->

        <nav class="hidden items-center gap-1 lg:flex" aria-label="Main">
          <!-- Tools -->
          <div
            class="relative"
            @mouseenter="openMenu('tools')"
            @mouseleave="scheduleCloseMenu"
          >
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm
                font-medium transition-colors"
              :class="
                isSectionActive('/tools')
                  ? 'bg-accent-soft text-accent'
                  : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
              "
              :aria-expanded="openDesktopMenu === 'tools'"
              aria-haspopup="true"
              @click="toggleMenu('tools')"
            >
              Tools
              <svg
                class="h-3.5 w-3.5 transition-transform duration-300"
                :class="openDesktopMenu === 'tools' ? 'rotate-180' : ''"
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
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-1.5 scale-[0.98]"
              leave-active-class="transition duration-150 ease-in"
              leave-to-class="opacity-0 -translate-y-1.5 scale-[0.98]"
            >
              <div
                v-if="openDesktopMenu === 'tools'"
                class="absolute left-0 top-full w-[430px] pt-2.5"
              >
                <div
                  class="overflow-hidden rounded-panel border border-line
                    bg-elevated p-2 shadow-pop"
                >
                  <p
                    class="px-3 pb-2 pt-2 text-[11px] font-bold uppercase
                      tracking-[0.16em] text-accent"
                  >
                    AI Image Tools
                  </p>

                  <SiteNavToolItem
                    v-for="tool in imageTools"
                    :key="tool.slug"
                    :tool="tool"
                    @navigate="closeMenuNow"
                  />

                  <NuxtLink
                    to="/tools"
                    class="mt-1.5 flex items-center justify-between rounded-xl
                      bg-surface-2 px-4 py-3 text-xs font-semibold
                      text-fg-muted transition-colors hover:bg-surface-3
                      hover:text-fg"
                    @click="closeMenuNow"
                  >
                    Browse all tools
                    <span aria-hidden="true">→</span>
                  </NuxtLink>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Downloaders -->
          <div
            class="relative"
            @mouseenter="openMenu('downloads')"
            @mouseleave="scheduleCloseMenu"
          >
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm
                font-medium transition-colors"
              :class="
                isSectionActive('/download')
                  ? 'bg-accent-soft text-accent'
                  : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
              "
              :aria-expanded="openDesktopMenu === 'downloads'"
              aria-haspopup="true"
              @click="toggleMenu('downloads')"
            >
              Downloaders
              <svg
                class="h-3.5 w-3.5 transition-transform duration-300"
                :class="openDesktopMenu === 'downloads' ? 'rotate-180' : ''"
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
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-1.5 scale-[0.98]"
              leave-active-class="transition duration-150 ease-in"
              leave-to-class="opacity-0 -translate-y-1.5 scale-[0.98]"
            >
              <div
                v-if="openDesktopMenu === 'downloads'"
                class="absolute left-1/2 top-full w-[420px] -translate-x-1/2 pt-2.5"
              >
                <div
                  class="overflow-hidden rounded-panel border border-line
                    bg-elevated p-2 shadow-pop"
                >
                  <p
                    class="px-3 pb-2 pt-2 text-[11px] font-bold uppercase
                      tracking-[0.16em] text-accent"
                  >
                    Media Downloaders
                  </p>

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

          <!-- News -->
          <NuxtLink
            to="/news"
            class="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm
              font-medium transition-colors"
            :class="
              isSectionActive('/news')
                ? 'bg-accent-soft text-accent'
                : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
            "
          >
            News
          </NuxtLink>
        </nav>

        <!-- ============================= DESKTOP ACTIONS -->

        <div class="hidden items-center gap-2 lg:flex">
          <NuxtLink
            to="/news/search"
            class="flex h-9 w-9 items-center justify-center rounded-xl border
              border-line bg-surface-2 text-fg-muted transition-colors
              hover:bg-surface-3 hover:text-fg"
            aria-label="Search news"
          >
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path stroke-linecap="round" d="M16 16l4.5 4.5" />
            </svg>
          </NuxtLink>

          <ClientOnly>
            <UiThemeToggle />
            <template #fallback>
              <div class="h-9 w-9 rounded-xl border border-line bg-surface-2" />
            </template>
          </ClientOnly>

          <UiButton to="/tools" size="sm" class="ml-1">
            Explore tools
            <span aria-hidden="true">→</span>
          </UiButton>
        </div>

        <!-- ============================== MOBILE TRIGGER -->

        <div class="flex items-center gap-2 lg:hidden">
          <ClientOnly>
            <UiThemeToggle />
            <template #fallback>
              <div class="h-9 w-9 rounded-xl border border-line bg-surface-2" />
            </template>
          </ClientOnly>

          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-xl border
              border-line bg-surface-2 text-fg transition-colors
              hover:bg-surface-3"
            :aria-expanded="isMobileMenuOpen"
            aria-label="Toggle navigation menu"
            @click="toggleMobileMenu"
          >
            <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 7h16M4 12h16M4 17h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ================================== MOBILE SHEET -->

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-3"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0 -translate-y-3"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-x-3 top-[76px] max-h-[calc(100vh-92px)]
          overflow-y-auto rounded-panel border border-line bg-elevated p-3
          shadow-pop lg:hidden"
      >
        <!-- Tools -->
        <div class="border-b border-line">
          <button
            type="button"
            class="flex w-full items-center justify-between px-3 py-4 text-sm
              font-semibold text-fg"
            :aria-expanded="activeMobileSection === 'tools'"
            @click="toggleMobileSection('tools')"
          >
            AI Tools
            <svg
              class="h-4 w-4 text-fg-subtle transition-transform duration-300"
              :class="activeMobileSection === 'tools' ? 'rotate-180' : ''"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div v-show="activeMobileSection === 'tools'" class="space-y-1 pb-3">
            <NuxtLink
              v-for="tool in imageTools"
              :key="tool.slug"
              :to="tool.href"
              class="flex items-center justify-between rounded-xl px-3 py-3
                text-sm font-medium transition-colors"
              :class="
                isActive(tool.href)
                  ? 'bg-accent-soft text-accent'
                  : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
              "
              @click="closeMobileMenu"
            >
              {{ tool.shortName }}
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Downloaders -->
        <div class="border-b border-line">
          <button
            type="button"
            class="flex w-full items-center justify-between px-3 py-4 text-sm
              font-semibold text-fg"
            :aria-expanded="activeMobileSection === 'downloads'"
            @click="toggleMobileSection('downloads')"
          >
            Downloaders
            <svg
              class="h-4 w-4 text-fg-subtle transition-transform duration-300"
              :class="activeMobileSection === 'downloads' ? 'rotate-180' : ''"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div
            v-show="activeMobileSection === 'downloads'"
            class="space-y-1 pb-3"
          >
            <NuxtLink
              v-for="tool in downloadTools"
              :key="tool.slug"
              :to="tool.href"
              class="flex items-center justify-between rounded-xl px-3 py-3
                text-sm font-medium transition-colors"
              :class="
                isActive(tool.href)
                  ? 'bg-accent-soft text-accent'
                  : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
              "
              @click="closeMobileMenu"
            >
              {{ tool.shortName }}
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>

        <NuxtLink
          to="/news"
          class="flex items-center justify-between border-b border-line px-3
            py-4 text-sm font-semibold text-fg"
          @click="closeMobileMenu"
        >
          News
          <span aria-hidden="true">→</span>
        </NuxtLink>

        <div class="grid grid-cols-2 gap-2 pt-4">
          <UiButton to="/news/search" variant="secondary" block @click="closeMobileMenu">
            Search
          </UiButton>
          <UiButton to="/tools" block @click="closeMobileMenu">
            All tools
          </UiButton>
        </div>
      </div>
    </Transition>
  </header>
</template>
