<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    to?: string
    href?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    block?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
  },
)

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-6 text-[15px]',
}

const variantClass: Record<Variant, string> = {
  primary: 'sp-btn-primary',
  secondary: 'sp-btn-secondary',
  ghost: 'sp-btn-ghost',
}

const classes = computed(() => [
  'sp-btn',
  variantClass[props.variant],
  sizeClass[props.size],
  props.block ? 'w-full' : '',
])

const isInert = computed(() => props.disabled || props.loading)

const component = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})
</script>

<template>
  <component
    :is="component"
    :to="to"
    :href="href"
    :type="to || href ? undefined : type"
    :disabled="to || href ? undefined : isInert"
    :aria-disabled="isInert || undefined"
    :tabindex="isInert && (to || href) ? -1 : undefined"
    :class="classes"
  >
    <span
      v-if="loading"
      class="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2
        border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </component>
</template>
