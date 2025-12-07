import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // port dev server, giữ nguyên nếu bạn muốn
    proxy: {
      // tất cả request /api/* sẽ được forward tới backend local
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,   // thay đổi origin header thành backend
        secure: false,        // nếu backend HTTP (không HTTPS)
        rewrite: (path) => path.replace(/^\/api/, "/api"), // giữ path nguyên
      },
    },
  },
});