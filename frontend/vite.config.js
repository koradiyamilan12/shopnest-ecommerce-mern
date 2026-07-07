import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://shopnest-ecommerce-mern-12tk.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
