/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_GO_API: string;
  readonly VITE_PYTHON_API: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
