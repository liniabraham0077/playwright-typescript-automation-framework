import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { PageUtils } from './tests/utils/page-utils';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  globalSetup: './tests/utils/global-setup.ts',
  globalTeardown: './tests/utils/global-teardown.ts',
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 5 * 1000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env.CI),
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['allure-playwright']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    screenshot: `only-on-failure`,
    video: `retain-on-failure`,
    trace: `retain-on-failure`,
    launchOptions: {
      slowMo: 100,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        testIdAttribute: 'data-automation-id',
        ...devices['Desktop Chrome'],
        viewport: { width: parseInt(process.env.SCREEN_WIDTH!), height: parseInt(process.env.SCREEN_HEIGHT!) },
        headless: PageUtils.parseStringToBoolean(process.env.HEADLESS!),
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
      },
      grep: new RegExp(process.env.TAGS!),
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: parseInt(process.env.SCREEN_WIDTH!), height: parseInt(process.env.SCREEN_HEIGHT!) },
        headless: PageUtils.parseStringToBoolean(process.env.HEADLESS!),
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
      },
      grep: new RegExp(process.env.TAGS!),
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: parseInt(process.env.SCREEN_WIDTH!), height: parseInt(process.env.SCREEN_HEIGHT!) },
        headless: PageUtils.parseStringToBoolean(process.env.HEADLESS!),
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
