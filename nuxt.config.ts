export default defineNuxtConfig({
    srcDir: "src/",
    
    devtools: { enabled: true },
    telemetry: false,

    modules: ["@vueuse/nuxt", "@nuxt/image", "nuxt-icon"]
})