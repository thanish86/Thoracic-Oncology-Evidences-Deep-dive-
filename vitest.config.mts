import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "server-only": path.resolve(__dirname, "src/test/server-only-stub.ts"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts?(x)"],
    setupFiles: ["src/test/setup.ts"],
    env: loadEnv(mode, process.cwd(), ""),
    testTimeout: 20_000,
  },
}));
