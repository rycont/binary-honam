/// <reference path="../.astro/env.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly KMA_API_KEY: string
}

interface ImportMeta {
    /**
     * Astro and Vite expose environment variables through `import.meta.env`. For a complete list of the environment variables available, see the two references below.
     *
     * - [Astro reference](https://docs.astro.build/en/guides/environment-variables/#default-environment-variables)
     * - [Vite reference](https://vitejs.dev/guide/env-and-mode.html#env-variables)
     */
    readonly env: ImportMetaEnv
}
