/// <reference types="vitest" />
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
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    exclude: ["e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/test/**",
        "src/components/ui/**",
        "src/main.tsx",
        "src/App.tsx",
        "src/vite-env.d.ts",
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@sentry")) return "sentry"
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
