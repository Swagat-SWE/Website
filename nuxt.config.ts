// nuxt.config.ts
export default defineNuxtConfig({
  imports: { dirs: ["composables"] },

  nitro: {
    devProxy: {
      "/api": { target: "http://localhost:3001", changeOrigin: true },
    },
  },

  devServer: {
    https: {
      key: "./certs/localhost-key.pem",
      cert: "./certs/localhost.pem",
    },
  },
});
