import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';
import { getBoundedInteger, getRunId, getTargetSettings } from './utils/config';

dotenv.config({ quiet: true });

const requiredEnvironment = [
  'ECMS_ENVIRONMENT',
  'ECMS_BASE_URL',
  'ECMS_MDA',
  'ECMS_EMAIL',
  'ECMS_PASSWORD',
] as const;

const missingEnvironment = requiredEnvironment.filter(name => !process.env[name]);
if (missingEnvironment.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvironment.join(', ')}. ` +
      'Run from the project root and create an ignored .env file from .env.example, ' +
      'or set the variables in the current shell/CI secret store.',
  );
}

const target = getTargetSettings();
const navRetries = getBoundedInteger('ECMS_NAV_RETRIES', 2, 5);
const authRetries = getBoundedInteger('ECMS_AUTH_RETRIES', 1, 3);
const configuredRetries = getBoundedInteger('ECMS_RETRIES', 0, 3);
const writesEnabled = process.env.ECMS_ALLOW_WRITES === 'true';
const negativeAuthEnabled = process.env.ECMS_ALLOW_NEGATIVE_AUTH === 'true';
const isCI = ['1', 'true'].includes((process.env.CI ?? '').toLowerCase());
const runId = getRunId();
const outputDir = path.join('test-results', runId);
const htmlOutputDir = path.join('playwright-report', runId);
const captureRawEvidence = process.env.ECMS_CAPTURE_TRACE === 'true';

if (isCI && (writesEnabled || negativeAuthEnabled)) {
  throw new Error('Write and negative-authentication tests are disabled in CI; run them in an approved test job');
}

const browserProjects = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
].map(project => ({
  ...project,
  testIgnore: /.*\.setup\.ts/,
}));

export default defineConfig({
  testDir: './tests',
  outputDir,
  fullyParallel: false,
  forbidOnly: isCI,
  // Never retry a write test: the remote API has no idempotency guarantee.
  retries: writesEnabled ? 0 : isCI ? 2 : configuredRetries,
  workers: 3,
  timeout: 120_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: htmlOutputDir }],
    ['junit', { outputFile: path.join(outputDir, 'junit.xml') }],
  ],
  use: {
    baseURL: target.baseURL,
    headless: process.env.HEADED !== 'true',
    actionTimeout: 20_000,
    navigationTimeout: 90_000,
    screenshot: process.env.CI ? 'off' : 'only-on-failure',
    // Raw traces and videos can contain session material. Enable them only
    // for a controlled local run and review artifacts before sharing.
    video: captureRawEvidence ? 'retain-on-failure' : 'off',
    trace: captureRawEvidence ? 'retain-on-failure' : 'off',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    ...browserProjects,
  ],
  metadata: {
    ecmsEnvironment: target.environment,
    ecmsBaseURL: target.baseURL,
    ecmsMDA: process.env.ECMS_MDA,
    runId,
    navigationRetries: navRetries,
    authRetries,
    rawEvidenceCapture: captureRawEvidence,
  },
});
