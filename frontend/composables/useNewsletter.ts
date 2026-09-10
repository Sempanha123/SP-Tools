export type NewsletterState = 'idle' | 'loading' | 'success' | 'error'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Newsletter signup, backed by POST /api/v1/newsletter/subscribe.
 *
 * Each call site gets its own state (footer and the news page both render a
 * form), so this is deliberately not shared via useState.
 */
export const useNewsletter = () => {
  const { baseURL } = useNewsApi()

  const email = ref('')
  const state = ref<NewsletterState>('idle')
  const message = ref('')

  const subscribe = async (source = 'website') => {
    const value = email.value.trim()

    if (!EMAIL_PATTERN.test(value)) {
      state.value = 'error'
      message.value = 'Please enter a valid email address.'
      return
    }

    state.value = 'loading'
    message.value = ''

    try {
      const response = await $fetch<{
        data: { email: string; status: string }
        message: string
      }>('/newsletter/subscribe', {
        baseURL,
        method: 'POST',
        body: { email: value, source },
      })

      state.value = 'success'
      message.value =
        response.message || 'You are subscribed. Check your inbox to confirm.'
      email.value = ''
    } catch (error: unknown) {
      state.value = 'error'

      // Laravel validation errors surface as 422 with a `message` field.
      const payload = (error as { data?: { message?: string } })?.data
      message.value =
        payload?.message ||
        'Subscription failed. Please try again in a moment.'
    }
  }

  const reset = () => {
    state.value = 'idle'
    message.value = ''
  }

  return { email, state, message, subscribe, reset }
}
