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
        { name: 'description', content: 'Greenhouse automation and monitoring system' },
        { name: 'X-Frame-Options', content: 'DENY' },
        { name: 'X-Content-Type-Options', content: 'nosniff' },
        { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
        { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=()' },
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
          integrity: 'sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz',
          crossorigin: 'anonymous',
        },
      ],
    },
  },

  routeRules: {
    '/api/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      },
    },
  },
})
