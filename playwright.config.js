// @ts-check
import { defineConfig, devices } from '@playwright/test';

const env = /** @type {{ process?: { env?: Record<string, string | undefined> } }} */ (globalThis).process?.env ?? {};

// Keep each run's reports, traces, and test output in a separate folder.
const runId = new Date().toISOString().replace(/[:.]/g, '-');
const runDir = `playwright-runs/${runId}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!env.CI,
  retries: env.CI ? 2 : 0,
  workers: env.CI ? 1 : undefined,

  // Save a browsable report and machine-readable results for this run.
  reporter: [
    ['html', { outputFolder: `${runDir}/report`, open: 'never' }],
    ['json', { outputFile: `${runDir}/results.json` }],
  ],
  outputDir: `${runDir}/test-results`,

  use: {
    // Keep a trace for every test to make past runs easier to investigate.
    trace: 'on',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: !!env.CI,
        screenshot: 'only-on-failure',
      },
    },
  ],
});
