export default defineNuxtConfig({
    srcDir: "src/",

    ssr: false,
    devtools: { enabled: true },
    telemetry: false,

    modules: ["@vueuse/nuxt", "@nuxt/image", "nuxt-icon"],

    runtimeConfig: {
        public: {
            SERVER_URL: "http://localhost:3001"
        }
    },
    
    vite: {
        clearScreen: false,

        envPrefix: ["VITE_", "TAURI_"],

        server: {
            strictPort: true,

            hmr: {
                protocol: "ws",
                host: "0.0.0.0",
                port: 5183
            }
        }
    }
})