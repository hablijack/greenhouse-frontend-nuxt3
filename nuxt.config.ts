export default defineNuxtConfig({
    modules: ['@sidebase/nuxt-auth'],
    css: [
        '@/assets/css/main.css', 
        'vuetify/lib/styles/main.sass',
        '@mdi/font/css/materialdesignicons.min.css',
    ],
    build: {
        transpile: ['vuetify'],
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
            apiBaseUrl: 'https://greenhouse.home-webserver.de',
            wssBaseUrl: 'wss://greenhouse.home-webserver.de',
        },
        auth0: {
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            issuer: process.env.AUTH0_ISSUER
        },
    }
})
