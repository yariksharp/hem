import { defineConfig, devices } from "@playwright/test";

// Integration (end-to-end) tests: a real browser against a real build of the app.
// Locally the values come from .env.local; in CI from GitHub secrets.
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local (e.g. in CI): the variables are already in the environment.
}

const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    // No traces or videos: they would record what is typed, including the test password.
    trace: "off",
    video: "off",
    screenshot: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Runs the production build, so run `npm run build` first.
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}/sign-in`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
