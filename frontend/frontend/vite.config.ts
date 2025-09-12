import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    // 这样可将前端的/api请求代理到Django后端。
    proxy: {
      "/api/v1/": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        // 不要重写路径，保持/api前缀
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  // 解决浏览器url出现#的问题，强制使用history模式（即HTML5 history路由模式）
  // 这样前端路由不会带#，而是正常的路径
  // base: "./",
});
