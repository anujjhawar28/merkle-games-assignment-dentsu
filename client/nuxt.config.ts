export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/scss/main.scss'],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:7000/api/v1'
    }
  },
  app: {
    head: {
      titleTemplate: '%s | Merkle Games',
      title: 'Merkle Games',
      meta: [
        { name: 'description', content: 'Discover standout games released between 2015 and 2017.' },
        { name: 'theme-color', content: '#f3f4ef' }
      ]
    }
  }
})