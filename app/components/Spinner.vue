<script setup>
const props = defineProps({
  size: {
    type: [Number, String],
    default: 48
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  strokeWidth: {
    type: [Number, String],
    default: 3
  }
})

const spinnerSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})
</script>

<template>
  <svg
    class="spinner"
    :width="spinnerSize"
    :height="spinnerSize"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="status"
    aria-label="Loading"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      opacity="0.25"
    />
    <path
      d="M12 2C6.47715 2 2 6.47715 2 12"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped>
.spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>