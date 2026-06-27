import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        favoritos: resolve(__dirname, "favoritos.html"),
      },
    },
  },
  server: {
    historyApiFallback: true,
  },
});
