import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    pool: "threads",
    isolate: false,
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/lib/**", "src/components/**", "src/context/**"],
      exclude: ["src/components/ui/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
