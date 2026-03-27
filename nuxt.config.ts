export default defineNuxtConfig({
  modules: ["@pinia/nuxt"],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
    },
  },

  nitro: {
    routeRules: {
      "/api/**": {
        proxy: "http://localhost:3001/api/**",
      },
    },
  },

  // Note: Only runs in dev, won't crash Render build
  devServer: {
    https: {
      key: "./certs/localhost-key.pem",
      cert: "./certs/localhost.pem",
    },
  },
})