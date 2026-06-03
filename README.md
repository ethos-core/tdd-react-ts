# tdd-react-ts

A hands-on learning repository for practicing **Test-Driven Development (TDD)** with **React** and **TypeScript**.

## Tech Stack

| Category | Tool |
| --- | --- |
| Language | TypeScript |
| UI Library | React |
| Test Runner | Vitest |
| DOM Testing | Testing Library (React / jest-dom / user-event) |
| E2E Testing | Playwright |
| API Mocking | MSW (Mock Service Worker) |
| Test Environment | jsdom |

## Getting Started

```bash
# Install dependencies
npm install

# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Open Vitest UI
npm run test:ui

# Run E2E tests
npm run test:e2e
```

## Project Structure

```
src/
├── test/
│   ├── setup.ts              # Test setup (jest-dom matchers, cleanup)
│   └── smoke.test.ts         # Smoke test to verify the setup
└── utils/
    ├── __tests__/
    │   ├── formatDate.test.ts # Tests for formatDate / formatRelativeDate
    │   └── slugify.test.ts    # Tests for slugify
    ├── formatDate.ts          # Date formatting utilities
    └── slugify.ts             # URL slug generator
```

## TDD Workflow

This project follows the **Red-Green-Refactor** cycle:

1. **Red** — Write a failing test that describes the desired behavior.
2. **Green** — Write the minimum code to make the test pass.
3. **Refactor** — Improve the code while keeping all tests green.

## Implemented Utilities

### `formatDate(date, format?)`

Formats a `Date` object into a string. Defaults to `YYYY/MM/DD`.

Supports custom format tokens: `YYYY`, `MM`, `DD`.

### `formatRelativeDate(date)`

Returns a human-readable relative time string (e.g. "1分前", "3時間前", "5日前"). Falls back to `formatDate` for dates older than 7 days or in the future.

### `slugify(text)`

Converts a string into a URL-friendly slug. Supports Japanese characters.

## License

ISC
