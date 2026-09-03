export type ContactState = 'idle' | 'loading' | 'success' | 'error'

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Contact form, backed by POST /api/v1/contact.
 *
 * Validation mirrors the Laravel rules so the common failures are caught
 * before a round trip; the server remains the authority.
 */
export const useContact = () => {
  const { baseURL } = useNewsApi()

  const form = reactive<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const state = ref<ContactState>('idle')
  const message = ref('')
  const fieldErrors = ref<Partial<Record<keyof ContactForm, string>>>({})

  const validate = () => {
    const errors: Partial<Record<keyof ContactForm, string>> = {}

    if (form.name.trim().length < 2) {
      errors.name = 'Please enter your name.'
    }

    if (!EMAIL_PATTERN.test(form.email.trim())) {
      errors.email = 'Please enter a valid email address.'
    }

    if (form.subject.trim().length < 3) {
      errors.subject = 'Please add a short subject.'
    }

    if (form.message.trim().length < 20) {
      errors.message = 'Please give us at least 20 characters to work with.'
    }

    fieldErrors.value = errors
    return Object.keys(errors).length === 0
  }

  const submit = async () => {
    if (!validate()) {
      state.value = 'error'
      message.value = 'Please fix the highlighted fields.'
      return
    }

    state.value = 'loading'
    message.value = ''

    try {
      const response = await $fetch<{ message: string }>('/contact', {
        baseURL,
        method: 'POST',
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        },
      })

      state.value = 'success'
      message.value =
        response.message || 'Thanks — your message is on its way.'

      form.name = ''
      form.email = ''
      form.subject = ''
      form.message = ''
    } catch (error: unknown) {
      state.value = 'error'

      const payload = (error as {
        data?: { message?: string; errors?: Record<string, string[]> }
      })?.data

      if (payload?.errors) {
        const mapped: Partial<Record<keyof ContactForm, string>> = {}
        for (const [key, values] of Object.entries(payload.errors)) {
          mapped[key as keyof ContactForm] = values[0]
        }
        fieldErrors.value = mapped
      }

      message.value =
        payload?.message || 'Could not send that message. Please try again.'
    }
  }

  const reset = () => {
    state.value = 'idle'
    message.value = ''
    fieldErrors.value = {}
  }

  return { form, state, message, fieldErrors, submit, reset }
}
