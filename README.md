# Yocale Automation

This repository contains Playwright-based end-to-end and API tests for Yocale service management workflows. The suite focuses on verifying service creation, editing, deletion, and related UI interactions against the `https://yocale-test.staging.com` environment.

## Contents

- `tests/e2e/`: Playwright E2E test suite, page objects, and fixtures.
- `tests/api/`: API test specs.
- `playwright.config.ts`: Playwright configuration, browser projects, reporter, and global setup/teardown.
- `testData.json`: Static test data and admin credentials used by the suite.
- `global.setup.ts` / `global.teardown.ts`: Optional global setup/cleanup hooks.

## Prerequisites

- Node.js 18+ installed
- npm available in your shell
- Windows, macOS, or Linux supported by Playwright

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with valid admin credentials:

```env
VALID_ADMIN_EMAIL=your-admin-email
VALID_ADMIN_PASSWORD=your-admin-password
```

3. If needed, update `testData.json` values for admin credentials or service details.

## Run Tests

Common commands:

- `npm test`
  - Run the full Playwright test suite.

- `npm run test:ui`
  - Launch the Playwright test runner UI.

- `npm run test:debug`
  - Run tests in debug mode.

- `npm run report`
  - Show the generated HTML report.

- `npm run test:all`
  - Execute tests with 4 workers.

- `npm run test:tag-ui`
  - Run tests tagged with `@UI`.

- `npm run test:tag-api`
  - Run tests tagged with `@API`.

- `npm run test:chrome`
  - Run only Chromium tests.

- `npm run test:serial`
  - Run tests in a single worker.

## Test Structure

- `tests/e2e/specs/service-management.spec.ts`
  - Main service management workflow tests.
  - Includes UI flows for create/edit/delete operations.

- `tests/e2e/pages/serviceManagement.ts`
  - Page object model for service management screens.

- `tests/e2e/pages/login.ts`
  - Login page model for admin authentication.

- `tests/e2e/fixtures/fixtures.ts`
  - Playwright fixture that performs login with `.env` credentials.

## Environment & Configuration

The Playwright config uses the following settings:

- `testDir: ./tests`
- `fullyParallel: true`
- `reporter: html`
- `baseURL: https://yocale-test.staging.com`
- `trace: on-first-retry`
- `globalSetup` / `globalTeardown`
- Projects for `chromium`, `firefox`, and `webkit`

## Notes

- The suite depends on valid admin credentials in `.env`.
- Some tests use API calls with `tenantId` and `authToken` read from `testData.json`.
- The repository currently uses Playwright `^1.60.0`.

## Troubleshooting

- If tests fail due to authentication, verify `.env` values and ensure the staging site is reachable.
- Run `npm run test:debug` for interactive debugging and UI replay.
- Use `npm run report` after a full run to inspect HTML results.
