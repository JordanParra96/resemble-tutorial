// @ts-check
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Carpeta con los archivos de prueba.
  testDir: "./e2e",
  // Carpeta donde cada prueba guarda sus archivos (las capturas y la comparación).
  outputDir: "./test-results",
  fullyParallel: true,
  reporter: "html",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
