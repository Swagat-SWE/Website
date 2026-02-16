// nuxt.config.ts
export default defineNuxtConfig({

  // ===============================
  // Runtime Config (VERY IMPORTANT)
  // ===============================
  // In Render → Website → Environment:
  // NUXT_PUBLIC_API_BASE = https://backend-rj5c.onrender.com
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
    },
  },

  // ==================================
  // Nitro Dev Proxy (Server-side dev)
  // ==================================
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },

  // ==================================
  // Vite Dev Proxy (Browser-side dev)
  // ==================================
  vite: {
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },

  // ==================================
  // Local HTTPS (Development only)
  // ==================================
  devServer: {
    https: {
      key: "./certs/localhost-key.pem",
      cert: "./certs/localhost.pem",
    },
  },

  // ==================================
  // Compatibility + Stability
  // ==================================
  compatibilityDate: "2024-10-01",

});
