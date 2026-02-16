/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ID: string;
  readonly VITE_APP_FUNCTIONS_VERSION: string;
  readonly VITE_APP_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
