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
  },
  devtools: { enabled: true },
  ssr: false,
  runtimeConfig: {
      public: {
        wssBaseUrl: 'ws://localhost:8080',
        apiBaseUrl: 'http://localhost:8080',
      },
  },
  compatibilityDate: '2025-03-20',
  modules: ['nuxt-auth-utils']
})
