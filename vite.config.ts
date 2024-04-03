import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte({
        compilerOptions: {
            customElement: true
        },
        emitCss: false,
    })],
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
        },
    },
})
