import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
        svelte({
            compilerOptions: {
                customElement: true
            },
            emitCss: true,
        }),
    ],
    resolve: {
        alias: {
            $lib: path.resolve("./src/lib"),
        },
    },
    server: {
        port: 5174
    },
    build: {
        lib: {
            entry: './src/main.ts',
            name: 'swcLTagenda',
            fileName: 'swc-lt-agenda',
            cssFileName: 'style',
        },
    },
})
