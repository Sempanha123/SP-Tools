<script setup lang="ts">
const { imageTools, downloadTools } = useTools()
const route = useRoute()

const isMobileMenuOpen = ref(false)
const activeMobileSection = ref<string | null>(null)
const openDesktopMenu = ref<string | null>(null)
const isScrolled = ref(false)

const headerRef = ref<HTMLElement | null>(null)
let closeTimer: ReturnType<typeof setTimeout> | null = null

const onScroll = () => {
  isScrolled.value = window.scrollY > 20
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

watch(() => route.fullPath, () => {
  closeMenuNow()
  closeMobileMenu()
})

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
    class="sticky top-0 z-50 transition-all duration-200"
    :class="isScrolled ? 'bg-surface/90 backdrop-blur-md border-b border-line shadow-xs' : 'bg-surface/60 backdrop-blur-sm border-b border-transparent'"
  >
    <div class="sp-container">
      <div class="flex h-16 items-center justify-between">
        <!-- ============================================ LOGO -->
        <NuxtLink
          to="/"
          class="flex items-center gap-2.5 rounded-lg py-1 transition-opacity hover:opacity-85"
          @click="closeMobileMenu"
        >
          <span
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-fg shadow-xs"
          >
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </span>

          <span class="text-[17px] font-semibold tracking-tight text-fg">
            SP<span class="text-accent font-bold">-Tools</span>
          </span>
        </NuxtLink>

        <!-- ================================= DESKTOP NAV -->
        <nav class="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          <!-- Tools Dropdown -->
          <div
            class="relative"
            @mouseenter="openMenu('tools')"
            @mouseleave="scheduleCloseMenu"
          >
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
              :class="
                isSectionActive('/tools')
                  ? 'text-accent bg-accent-soft'
                  : 'text-fg-muted hover:text-fg hover:bg-surface-3'
              "
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
              <div
                v-if="openDesktopMenu === 'tools'"
                class="absolute left-0 top-full w-[380px] pt-2"
              >
                <div
                  class="overflow-hidden rounded-xl border border-line bg-surface-2 p-2 shadow-pop"
                >
                  <p
                    class="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle"
                  >
                    Image Enhancement
                  </p>

                  <SiteNavToolItem
                    v-for="tool in imageTools"
                    :key="tool.slug"
                    :tool="tool"
                    @navigate="closeMenuNow"
                  />

                  <div class="mt-1.5 border-t border-line/60 pt-1.5">
                    <NuxtLink
                      to="/tools"
                      class="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent-soft"
                      @click="closeMenuNow"
                    >
                      Browse all tools
                      <span aria-hidden="true">→</span>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Downloaders Dropdown -->
          <div
            class="relative"
            @mouseenter="openMenu('downloads')"
            @mouseleave="scheduleCloseMenu"
          >
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
              :class="
                isSectionActive('/download')
                  ? 'text-accent bg-accent-soft'
                  : 'text-fg-muted hover:text-fg hover:bg-surface-3'
              "
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
              <div
                v-if="openDesktopMenu === 'downloads'"
                class="absolute left-0 top-full w-[380px] pt-2"
              >
                <div
                  class="overflow-hidden rounded-xl border border-line bg-surface-2 p-2 shadow-pop"
                >
                  <p
                    class="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle"
                  >
                    Social Media Grabbers
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
            class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            :class="
              isSectionActive('/news')
                ? 'text-accent bg-accent-soft'
                : 'text-fg-muted hover:text-fg hover:bg-surface-3'
            "
          >
            News & Articles
          </NuxtLink>
        </nav>

        <!-- ============================= DESKTOP ACTIONS -->
        <div class="hidden items-center gap-2.5 lg:flex">
          <NuxtLink
            to="/news/search"
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface-2 text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
            aria-label="Search news"
          >
            <svg
              class="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path stroke-linecap="round" d="M16 16l4.5 4.5" />
            </svg>
          </NuxtLink>

          <ClientOnly>
            <UiThemeToggle />
            <template #fallback>
              <div class="h-8 w-8 rounded-lg border border-line bg-surface-2" />
            </template>
          </ClientOnly>

          <NuxtLink
            to="/tools"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-accent-fg shadow-xs transition hover:bg-accent-hover active:scale-95"
          >
            Explore Tools
            <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>

        <!-- ============================== MOBILE TRIGGER -->
        <div class="flex items-center gap-2 lg:hidden">
          <ClientOnly>
            <UiThemeToggle />
            <template #fallback>
              <div class="h-8 w-8 rounded-lg border border-line bg-surface-2" />
            </template>
          </ClientOnly>

          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface-2 text-fg transition hover:border-line-strong"
            :aria-expanded="isMobileMenuOpen"
            aria-label="Toggle navigation menu"
            @click="toggleMobileMenu"
          >
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
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
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="border-b border-line bg-surface-2 px-4 py-4 shadow-pop lg:hidden"
      >
        <div class="space-y-1">
          <!-- Tools Accordion -->
          <div class="border-b border-line/60 pb-2">
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-fg hover:bg-surface-3"
              :aria-expanded="activeMobileSection === 'tools'"
              @click="toggleMobileSection('tools')"
            >
              <span>AI Tools</span>
              <svg
                class="h-4 w-4 text-fg-subtle transition-transform"
                :class="activeMobileSection === 'tools' ? 'rotate-180 text-accent' : ''"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <div v-show="activeMobileSection === 'tools'" class="mt-1 space-y-1 pl-3">
              <NuxtLink
                v-for="tool in imageTools"
                :key="tool.slug"
                :to="tool.href"
                class="flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-fg-muted hover:bg-surface-3 hover:text-fg"
                @click="closeMobileMenu"
              >
                {{ tool.name }}
                <span aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Downloaders Accordion -->
          <div class="border-b border-line/60 pb-2">
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-fg hover:bg-surface-3"
              :aria-expanded="activeMobileSection === 'downloads'"
              @click="toggleMobileSection('downloads')"
            >
              <span>Downloaders</span>
              <svg
                class="h-4 w-4 text-fg-subtle transition-transform"
                :class="activeMobileSection === 'downloads' ? 'rotate-180 text-accent' : ''"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <div v-show="activeMobileSection === 'downloads'" class="mt-1 space-y-1 pl-3">
              <NuxtLink
                v-for="tool in downloadTools"
                :key="tool.slug"
                :to="tool.href"
                class="flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-fg-muted hover:bg-surface-3 hover:text-fg"
                @click="closeMobileMenu"
              >
                {{ tool.name }}
                <span aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </div>

          <NuxtLink
            to="/news"
            class="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-fg hover:bg-surface-3"
            @click="closeMobileMenu"
          >
            News & Articles
            <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-2 pt-2 border-t border-line">
          <NuxtLink
            to="/news/search"
            class="flex items-center justify-center rounded-lg border border-line bg-surface py-2 text-xs font-semibold text-fg"
            @click="closeMobileMenu"
          >
            Search News
          </NuxtLink>
          <NuxtLink
            to="/tools"
            class="flex items-center justify-center rounded-lg bg-accent py-2 text-xs font-semibold text-accent-fg"
            @click="closeMobileMenu"
          >
            All Tools
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>
