import { defineConfig, envField } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
    experimental: {
        env: {
            schema: {
                KMA_API_KEY: envField.string({
                    context: 'server',
                    access: 'secret',
                    optional: false,
                }),
                NO_CACHE: envField.boolean({
                    context: 'server',
                    access: 'public',
                    optional: true,
                }),
            },
        },
    },
    output: 'server',
    adapter: cloudflare(),
})
