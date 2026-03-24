import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom")) return "vendor"
            if (id.includes("react-router")) return "vendor"
            if (id.includes("recharts") || id.includes("d3-") || id.includes("victory")) return "charts"
            if (id.includes("@tanstack/react-query")) return "query"
            if (id.includes("radix-ui") || id.includes("cmdk")) return "ui-primitives"
            if (id.includes("@tabler/icons-react")) return "icons"
            if (id.includes("motion")) return "motion"
            if (id.includes("axios") || id.includes("zustand")) return "data"
          }
        },
      },
    },
  },
})
