/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly WSS_BASE_URL: string
  readonly API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '#app' {
  interface NuxtApp {
    $auth: any
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $auth: any
  }
}