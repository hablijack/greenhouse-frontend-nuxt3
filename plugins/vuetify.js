// plugins/vuetify.js
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const greenhouseTheme = {
  dark: false,
  colors: {
    primary: '#5cad8a',
    'primary-darken-1': '#5cad8a',
    secondary: '#EA8162',
    accent: '#5cad8a',
    error: '#EA8162',
    warning: '#FFA726',
    info: '#42A5F5',
    success: '#66BB6A',
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false,
    components,
    directives,
    theme: {
      defaultTheme: 'greenhouseTheme',
      themes: {
        greenhouseTheme,
      }
    },
    defaults: {
      VCard: {
        elevation: 2,
      },
      VBtn: {
        color: 'primary',
        variant: 'elevated',
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})