import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { tanstackRouter } from "@tanstack/router-plugin/vite"

export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: './src/app/routes',
      generatedRouteTree: "./src/app/routes",
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
})