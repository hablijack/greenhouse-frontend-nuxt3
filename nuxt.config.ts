export default defineNuxtConfig({
  css: [
    '@/assets/css/main.css',
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],

  build: {
    transpile: ['vuetify', 'chart.js'],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    optimizeDeps: {
      include: ['vuetify', 'chart.js'],
    },
  },

  devtools: { 
    enabled: true 
  },

  ssr: false,

  runtimeConfig: {
    public: {
      wssBaseUrl: process.env.WSS_BASE_URL || 'ws://localhost:8080',
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080',
    },
  },

  compatibilityDate: '2025-03-20',

  modules: [
    'nuxt-auth-utils',
  ],

  nitro: {
    experimental: {
      wasm: true,
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  app: {
    head: {
      title: 'Greenhouse Control',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Greenhouse automation and monitoring system' }
      ],
    },
  },
})
