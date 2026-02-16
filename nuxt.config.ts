// nuxt.config.ts
export default defineNuxtConfig({
  // ✅ Runtime config for production API base
  // In Render Website env vars set:
  // NUXT_PUBLIC_API_BASE = https://backend-rj5c.onrender.com
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
    },
  },

  // ✅ Dev proxy (Nitro) - helps server-side / dev requests
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },

  // ✅ Dev proxy (Vite) - helps browser requests in dev
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

  // ✅ Local HTTPS
  devServer: {
    https: {
      key: "./certs/localhost-key.pem",
      cert: "./certs/localhost.pem",
    },
  },
});
