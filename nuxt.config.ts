export default defineNuxtConfig({
  nitro: {
    preset: "node-server",
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
