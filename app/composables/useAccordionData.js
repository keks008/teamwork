export const useAccordionData = () => {
  const items = ref([])
  const title = ref('')
  const tag = ref('')
  const isLoading = ref(true)
  const hasError = ref(false)
  const errorMessage = ref('')

  // Timeout duration in milliseconds
  const TIMEOUT_DURATION = 10000 // 10 seconds

  const fetchData = async () => {
    isLoading.value = true
    hasError.value = false
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION)
    
    try {
      const response = await fetch('https://eoyge3duj7xtdqd.m.pipedream.net', {
        signal: controller.signal
      })
      
      // Clear timeout if request completes
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Map items with unique IDs and normalize field names
      items.value = (data.items || []).map((item, index) => ({
        id: `item-${index}`,
        title: item.title,
        content: item.text,
        image: item.image
      }))
      title.value = data.title || ''
      tag.value = data.tag || ''
      
    } catch (error) {
      clearTimeout(timeoutId)
      
      console.error('Error fetching accordion data:', error)
      hasError.value = true
      
      // Handle different error types
      if (error.name === 'AbortError') {
        errorMessage.value = 'Request timed out. The server took too long to respond. Please try again.'
      } else if (error.message.includes('HTTP error')) {
        errorMessage.value = 'Unable to load content from the server. Please try again later.'
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage.value = 'Network error. Please check your internet connection and try again.'
      } else {
        errorMessage.value = 'Failed to load content. Please try again.'
      }
    } finally {
      isLoading.value = false
    }
  }

  const refresh = () => {
    fetchData()
  }

  onMounted(() => {
    fetchData()
  })

  return {
    items,
    title,
    tag,
    isLoading,
    hasError,
    errorMessage,
    refresh
  }
}