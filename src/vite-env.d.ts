/// <reference types = "vite/client" />
/// <reference types = "vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_IDP_URL?: string;
  readonly VITE_KEYCLOAK_CLIENT?: string;
  readonly VITE_IDP_CLIENT_ID?: string;
  readonly VITE_ENVIRONMENT?: string;
  readonly VITE_URL_BASE_PATH?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
