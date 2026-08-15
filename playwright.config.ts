import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://127.0.0.1:4321/portfolio/",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4321",
    url: "http://127.0.0.1:4321/portfolio/",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      PUBLIC_WEB3FORMS_ACCESS_KEY: "e2e-test-key",
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
