import { defineConfig, devices } from "@playwright/test";
import { env } from "./src/config/env";

export default defineConfig({
  testDir: "./test",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 1,
  workers: '100%',
  timeout: 180_000,
  expect: {
    timeout: 15_000,
  },
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }], ["list"]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: env.baseUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 1440, height: 900 },
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
