// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      // keep this but we will NOT use it for browser calls anymore
      apiBase: "",
    },
  },

  nitro: {
    // ✅ DEV proxy (when you run locally)
    devProxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },

    // ✅ PROD proxy (when deployed on Render)
    // Any request to https://einsteinstogo.com/api/... will be proxied to your backend
    routeRules: {
      "/api/**": {
        proxy: "https://backend-rj5c.onrender.com/**",
      },
    },
  },

  // Local HTTPS (optional)
  devServer: {
    https: {
      key: "./certs/localhost-key.pem",
      cert: "./certs/localhost.pem",
    },
  },
});
