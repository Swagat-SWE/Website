// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      // On Render (Website service) set:
      // NUXT_PUBLIC_API_BASE = https://backend-rj5c.onrender.com
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
    },
  },

  // Dev-only proxy (Nitro)
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },

  // Dev-only proxy (Vite) for browser requests
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

  // Local HTTPS (optional)
  devServer: {
    https: {
      key: "./certs/localhost-key.pem",
      cert: "./certs/localhost.pem",
    },
  },
});
