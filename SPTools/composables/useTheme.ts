import { computed } from 'vue'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const COOKIE_KEY = 'sp-theme'

/**
 * Theme state.
 *
 * The preference is kept in a cookie rather than localStorage so the server
 * render already emits the correct `class="dark"` on <html>. That removes the
 * light-mode flash you get with a client-only theme script.
 *
 * 'system' is resolved on the client from prefers-color-scheme; during SSR it
 * falls back to light, and plugins/theme.client.ts reconciles on hydration.
 */
export const useTheme = () => {
  const preference = useCookie<ThemePreference>(COOKIE_KEY, {
    default: () => 'system',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })

  // Populated by plugins/theme.client.ts; SSR-safe default.
  const systemTheme = useState<ResolvedTheme>('sp-system-theme', () => 'light')

  const resolved = computed<ResolvedTheme>(() =>
    preference.value === 'system' ? systemTheme.value : preference.value,
  )

  const isDark = computed(() => resolved.value === 'dark')

  /** Suppress colour transitions for one frame so the swap is instant. */
  const applyWithoutTransition = (next: ThemePreference) => {
    if (import.meta.client) {
      const root = document.documentElement
      root.classList.add('sp-theme-changing')
      window.setTimeout(() => root.classList.remove('sp-theme-changing'), 90)
    }

    preference.value = next
  }

  const setTheme = (next: ThemePreference) => applyWithoutTransition(next)

  const toggleTheme = () =>
    applyWithoutTransition(isDark.value ? 'light' : 'dark')

  /** Cycles light → dark → system, for a three-state control. */
  const cycleTheme = () => {
    const order: ThemePreference[] = ['light', 'dark', 'system']
    const index = order.indexOf(preference.value)
    applyWithoutTransition(order[(index + 1) % order.length]!)
  }

  return {
    preference,
    resolved,
    isDark,
    setTheme,
    toggleTheme,
    cycleTheme,
  }
}
