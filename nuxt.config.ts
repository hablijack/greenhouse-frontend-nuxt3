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
            apiBaseUrl: process.env.HTTP_BACKEND_BASE_URL,
            wssBaseUrl: process.env.WSS_BACKEND_BASE_URL,
        },
        auth0: {
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            issuer: process.env.AUTH0_ISSUER
        },
    }
})
