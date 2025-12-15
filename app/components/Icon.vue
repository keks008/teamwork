<script setup>

const props = defineProps({
  name: {
    type: String,
    required: true,
    validator: (value) => ['chevron-down', 'error', 'close'].includes(value)
  },
  width: {
    type: [Number, String],
    default: null
  },
  height: {
    type: [Number, String],
    default: null
  },
  size: {
    type: [Number, String],
    default: 24
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  ariaLabel: {
    type: String,
    default: null
  },
  ariaHidden: {
    type: Boolean,
    default: false
  }
})

const iconWidth = computed(() => {
  if (props.width) return typeof props.width === 'number' ? `${props.width}px` : props.width
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})

const iconHeight = computed(() => {
  if (props.height) return typeof props.height === 'number' ? `${props.height}px` : props.height
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})

const icons = {
  'chevron-down': {
    viewBox: '0 0 14 8',
    path: 'M0 0L6.96866 8L14 0H0Z',
    fillRule: 'evenodd',
    clipRule: 'evenodd',
    fill: true
  },
  'error': {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z',
      'M12 8V12M12 16H12.01'
    ],
    stroke: true
  },
  'close': {
    viewBox: '0 0 24 24',
    path: 'M6 18L18 6M6 6L18 18',
    stroke: true
  }
}

const currentIcon = computed(() => icons[props.name])

const defaultLabels = {
  'chevron-down': 'Toggle',
  'error': 'Error',
  'close': 'Close'
}

const effectiveAriaLabel = computed(() => {
  return props.ariaLabel || defaultLabels[props.name]
})
</script>

<template>
  <svg
    :width="iconWidth"
    :height="iconHeight"
    :viewBox="currentIcon.viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="icon"
    :class="`icon--${name}`"
    :aria-hidden="ariaHidden ? 'true' : undefined"
    :aria-label="!ariaHidden ? effectiveAriaLabel : undefined"
    :role="!ariaHidden ? 'img' : undefined"
  >
    <title v-if="!ariaHidden">{{ effectiveAriaLabel }}</title>
    <path
      v-if="currentIcon.path"
      :d="currentIcon.path"
      :fill="currentIcon.fill ? color : undefined"
      :stroke="currentIcon.stroke ? color : undefined"
      :fill-rule="currentIcon.fillRule"
      :clip-rule="currentIcon.clipRule"
      :stroke-width="currentIcon.stroke ? 2 : undefined"
      :stroke-linecap="currentIcon.stroke ? 'round' : undefined"
      :stroke-linejoin="currentIcon.stroke ? 'round' : undefined"
    />
    <template v-else-if="currentIcon.paths">
      <path
        v-for="(path, index) in currentIcon.paths"
        :key="index"
        :d="path"
        :fill="currentIcon.fill ? color : undefined"
        :stroke="currentIcon.stroke ? color : undefined"
        :fill-rule="currentIcon.fillRule"
        :clip-rule="currentIcon.clipRule"
        :stroke-width="currentIcon.stroke ? 2 : undefined"
        :stroke-linecap="currentIcon.stroke ? 'round' : undefined"
        :stroke-linejoin="currentIcon.stroke ? 'round' : undefined"
      />
    </template>
  </svg>
</template>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>