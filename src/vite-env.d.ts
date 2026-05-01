/// <reference typrs = "vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_IDP_URL?: string;
  readonly VITE_KEYCLOAK_CLIENT?: string;
  readonly VITE_IDP_CLIENT_ID?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
