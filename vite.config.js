import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {}, // Keeps process.env available
  },
  server: {
    proxy: {
      "/secure": {
        target: "https://backend.defcomm.ng/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/secure/, ""),
      },
    },
    strictPort: true,
    allowedHosts: true, //allow all external hosts
  },
});
