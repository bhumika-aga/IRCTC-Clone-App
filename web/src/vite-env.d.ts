/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_DEV_MODE: string
  readonly VITE_SHOW_REDUX_DEVTOOLS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __APP_VERSION__: string