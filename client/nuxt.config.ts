import { fileURLToPath } from 'node:url'
import { API_CONFIG, SITE_CONFIG } from './app/constants'

const apiUpstream = (process.env.NUXT_API_BASE || API_CONFIG.defaultBaseUrl).replace(/\/$/, '')
const mediaUpstream = apiUpstream.replace(/\/api\/v1\/?$/, '')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  experimental: {
    granularCachedData: true
  },
  alias: {
    '@': fileURLToPath(new URL('./app', import.meta.url))
  },
  css: ['~/assets/scss/main.scss'],
  runtimeConfig: {
    apiBase: apiUpstream,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api/v1',
      mediaBase: process.env.NUXT_PUBLIC_MEDIA_BASE || mediaUpstream
    }
  },
  nitro: {
    devProxy: {
      '/api/v1': {
        target: apiUpstream,
        changeOrigin: true
      },
      '/media/**': {
        target: `${mediaUpstream}/media/**`,
        changeOrigin: true
      }
    }
  },
  routeRules: {
    '/api/v1/**': {
      proxy: `${apiUpstream}/**`
    },
    '/media/**': {
      proxy: `${mediaUpstream}/media/**`
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: SITE_CONFIG.titleTemplate,
      title: SITE_CONFIG.name,
      meta: [
        { name: 'description', content: SITE_CONFIG.description },
        { name: 'theme-color', content: SITE_CONFIG.themeColor }
      ]
    }
  }
})