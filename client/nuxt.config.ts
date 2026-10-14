import { fileURLToPath } from 'node:url'
import { API_CONFIG, SITE_CONFIG } from './app/constants'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  alias: {
    '@': fileURLToPath(new URL('./app', import.meta.url))
  },
  css: ['~/assets/scss/main.scss'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || API_CONFIG.defaultBaseUrl
    }
  },
  app: {
    head: {
      titleTemplate: SITE_CONFIG.titleTemplate,
      title: SITE_CONFIG.name,
      meta: [
        { name: 'description', content: SITE_CONFIG.description },
        { name: 'theme-color', content: SITE_CONFIG.themeColor }
      ]
    }
  }
})