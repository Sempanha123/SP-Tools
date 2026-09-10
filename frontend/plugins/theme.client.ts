/**
 * Keeps the `dark` class on <html> in sync with the resolved theme, and tracks
 * the OS preference so `system` mode reacts to changes live.
 *
 * The initial class is emitted during SSR by app.vue's useHead, so this plugin
 * only reconciles — it does not cause the first paint.
 */
export default defineNuxtPlugin(() => {
  const { resolved } = useTheme()
  const systemTheme = useState<'light' | 'dark'>('sp-system-theme')

  const query = window.matchMedia('(prefers-color-scheme: dark)')

  systemTheme.value = query.matches ? 'dark' : 'light'

  const onChange = (event: MediaQueryListEvent) => {
    systemTheme.value = event.matches ? 'dark' : 'light'
  }

  query.addEventListener('change', onChange)

  watch(
    resolved,
    (theme) => {
      document.documentElement.classList.toggle('dark', theme === 'dark')
      document.documentElement.style.colorScheme = theme
    },
    { immediate: true },
  )
})
