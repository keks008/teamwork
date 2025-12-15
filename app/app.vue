<script setup>
const { 
  items, 
  title, 
  tag,
  isLoading, 
  hasError, 
  errorMessage, 
  refresh 
} = useAccordionData()

// Track which accordion item is currently open
const openItemId = ref(null)

// Track image loading errors
const imageErrors = ref(new Set())

// Live region for screen reader announcements
const liveRegionMessage = ref('')

// Get the currently open item's image (defaults to first item)
const currentImage = computed(() => {
  if (openItemId.value) {
    const openItem = items.value.find(item => item.id === openItemId.value)
    return openItem?.image || null
  }
  // Default to first item's image
  return items.value[0]?.image || null
})

// Get the currently open item for better alt text
const currentItem = computed(() => {
  if (openItemId.value) {
    return items.value.find(item => item.id === openItemId.value)
  }
  return items.value[0] || null
})

// Check if an image has failed to load
const hasImageError = (imageUrl) => {
  return imageErrors.value.has(imageUrl)
}

// Handle image load error
const handleImageError = (imageUrl) => {
  imageErrors.value.add(imageUrl)
  // Announce to screen readers
  liveRegionMessage.value = 'Image failed to load'
  setTimeout(() => liveRegionMessage.value = '', 1000)
}

const handleToggle = (id, isOpen) => {
  openItemId.value = isOpen ? id : null
  
  // Announce state change to screen readers
  const item = items.value.find(i => i.id === id)
  if (item) {
    liveRegionMessage.value = isOpen 
      ? `${item.title} section expanded` 
      : `${item.title} section collapsed`
    
    // Clear after announcement
    setTimeout(() => liveRegionMessage.value = '', 1000)
  }
}

// Watch for items to load and set first as open
watch(items, (newItems) => {
  if (newItems.length > 0 && !openItemId.value) {
    openItemId.value = newItems[0].id
  }
}, { immediate: true })

useHead({
  title: 'FAQ - Teamwork',
  meta: [
    { name: 'description', content: 'Frequently asked questions about Teamwork' }
  ]
})
</script>

<template>
  <main>
  <div>
    <a href="#features-accordion" class="skip-link">Skip to features section</a>
    
    <!-- Live region for screen reader announcements -->
    <div 
      aria-live="polite" 
      aria-atomic="true" 
      class="sr-only"
      role="status"
    >
      {{ liveRegionMessage }}
    </div>
    
    <section 
      id="features-accordion"
      class="page"
      aria-labelledby="features-title"
      :aria-busy="isLoading"
    >
      <div class="container">
        <div v-if="isLoading" class="loading-state" role="status" aria-live="polite">
          <div class="loading-spinner" aria-hidden="true">
            <Spinner :size="48" />
          </div>
          <p class="sr-only">Loading content, please wait...</p>
        </div>

        <div v-else-if="hasError" class="error-state" role="alert" aria-live="assertive">
          <div class="error-icon" aria-hidden="true">
            <Icon name="error" :size="48" />
          </div>
          <p class="error-message">{{ errorMessage }}</p>
          <button 
            class="retry-button" 
            type="button"
            @click="refresh()"
            :aria-label="`Retry loading content. ${errorMessage}`"
          >
            Try Again
          </button>
        </div>

        <div v-else class="accordion-layout">
          <!-- Desktop single image -->
          <div 
            v-if="currentImage" 
            class="accordion-layout__image"
            role="img"
            :aria-label="currentItem ? `Illustration for ${currentItem.title}` : 'Feature illustration'"
          >
            <picture v-if="!hasImageError(currentImage)">
              <source 
                :srcset="currentImage" 
                type="image/webp"
              >
              <img 
                :key="currentImage"
                :src="currentImage" 
                :alt="currentItem ? `${currentItem.title} - Visual representation of the feature` : 'Feature illustration'"
                width="650"
                height="570"
                loading="eager"
                decoding="async"
                @error="handleImageError(currentImage)"
              />
            </picture>
            <div 
              v-else 
              class="image-placeholder"
              role="img"
              aria-label="Image unavailable - failed to load illustration"
            >
              <Icon name="error" :size="48" color="#9ca3af" aria-hidden="true" />
              <p aria-hidden="true">Image unavailable</p>
            </div>
          </div>

          <!-- Accordion column with header inside -->
          <div class="accordion-layout__content">
            <header class="section-header">
              <span v-if="tag" class="section-tag">{{ tag }}</span>
              <h2 v-if="title" id="features-title" class="section-title">{{ title }}</h2>
            </header>
            <!-- Lazy loading, assuming that accordeon component will be below the flold -->
            <LazyAccordion
              :items="items"
              :allow-multiple="false"
              :default-open-ids="items.length > 0 ? [items[0].id] : []"
              :heading-level="3"
              @toggle="handleToggle"
            >
              <template #content="{ item, isOpen }">
                <p>{{ item.content }}</p>
                <!-- Mobile image inside each accordion panel -->
                <div v-if="item.image && isOpen" class="accordion__image">
                  <picture v-if="!hasImageError(item.image)">
                    <source 
                      :srcset="item.image" 
                      type="image/webp"
                    >
                    <img 
                      :src="item.image" 
                      :alt="`${item.title} - Visual representation of the feature`"
                      width="282"
                      height="120"
                      loading="lazy"
                      decoding="async"
                      @error="handleImageError(item.image)"
                    />
                  </picture>
                  <div 
                    v-else 
                    class="image-placeholder image-placeholder--small"
                    role="img"
                    aria-label="Image unavailable - failed to load illustration"
                  >
                    <Icon name="error" :size="32" color="#9ca3af" aria-hidden="true" />
                    <p aria-hidden="true">Image unavailable</p>
                  </div>
                </div>
              </template>
              
              <template #empty>
                <div class="empty-state" role="status" aria-live="polite">
                  <p>No items available at the moment.</p>
                </div>
              </template>
            </LazyAccordion>
          </div>
        </div>
      </div>
    </section>
  </div>
  </main>
</template>