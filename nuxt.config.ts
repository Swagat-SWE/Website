export default defineNuxtConfig({
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },

  // 👇 Add this too (important in dev because the browser hits Vite first)
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

  devServer: {
    https: {
      key: "./certs/localhost-key.pem",
      cert: "./certs/localhost.pem",
    },
  },
});
