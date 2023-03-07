// plugins/vuetify.js
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const greenhouseTheme = {
  dark: false,
  colors: {
    primary: '#5cad8a',
    'primary-darken-1': '#5cad8a',
  }
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'greenhouseTheme',
      themes: {
        greenhouseTheme,
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})