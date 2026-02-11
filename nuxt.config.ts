export default defineNuxtConfig({
  // ✅ Production build target for Render/Node hosting
  nitro: {
    preset: "node-server",
  },

  // ✅ Only use HTTPS certs locally (Render won’t have these files)
  devServer: process.env.NODE_ENV === "development"
    ? {
        https: {
          key: "./certs/localhost-key.pem",
          cert: "./certs/localhost.pem",
        },
      }
    : undefined,
});
