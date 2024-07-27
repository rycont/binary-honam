import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    experimental: {
        env: {
            schema: {
                KMA_API_KEY: envField.string({
                    context: "server",
                    access: "secret",
                    optional: false
                }),
            }
        }
    }
});
