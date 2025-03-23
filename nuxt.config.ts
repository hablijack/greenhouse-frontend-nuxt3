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
  runtimeConfig: {
      public: {
          wssBaseUrl: ''
      },
  },
  compatibilityDate: '2025-03-20',
  modules: ['nuxt-auth-utils']
})
