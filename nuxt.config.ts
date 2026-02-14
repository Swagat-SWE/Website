export default defineNuxtConfig({
  imports: {
    dirs: ["composables"],
  },

  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },

  devServer: import.meta.dev
    ? {
        https: {
          key: "./certs/localhost-key.pem",
          cert: "./certs/localhost.pem",
        },
      }
    : undefined,
});
