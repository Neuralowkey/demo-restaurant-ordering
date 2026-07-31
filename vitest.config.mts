import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
    // The closure logic is written against Israel wall-clock time; pinning the
    // zone keeps these assertions stable wherever CI happens to run.
    env: { TZ: "Asia/Jerusalem" },
  },
});
