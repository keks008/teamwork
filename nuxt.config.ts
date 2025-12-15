export default defineNuxtConfig({
  compatibilityDate: '2025-12-15',
  devtools: { enabled: true },
  
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      }
    }
  },
  
  css: [
    '@/assets/scss/main.scss'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_variables.scss" as *;'
        }
      }
    }
  }
})