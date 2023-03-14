export default defineNuxtConfig({
    modules: ['@sidebase/nuxt-auth'],
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
    auth: {
        enableGlobalAppMiddleware: true,
    },
    runtimeConfig: {
        public: {
            apiBaseUrl: '',
            wssBaseUrl: ''
        },
        auth0: {
            clientId: '',
            clientSecret: '',
            issuer: 'https://greenhouse-home-webserver.eu.auth0.com'
        },
    }
})
