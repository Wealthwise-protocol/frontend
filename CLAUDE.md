# CLAUDE.md

This file provides context for Claude Code when working on the WealthWise frontend.

## Project Overview

WealthWise is a mutual fund investment platform with AI-powered insights. This is the React frontend that connects to a Spring Boot backend deployed on Render.

## Commands

```bash
npm run dev          # Start dev server (Vite, localhost:5173)
npm run build        # TypeScript check + production build (tsc -b && vite build)
npm run typecheck    # Type-check only (tsc --noEmit)
npm run lint         # ESLint
npm run format       # Prettier
npm run preview      # Preview production build (localhost:4173)
npm run test         # Vitest watch mode
npm run test:run     # Vitest single run (154 tests)
npm run test:coverage # Vitest with coverage report
npm run test:e2e     # Playwright E2E tests (9 tests, auto-starts dev server)
npm run test:e2e:ui  # Playwright interactive UI mode
```

Always run `npm run typecheck` after making changes to verify nothing is broken.

## Architecture

### Tech Stack
- React 19, TypeScript, Vite 7
- Tailwind CSS v4 with OKLch color system
- shadcn/ui components (Radix UI primitives, style: `radix-mira`, base color: `stone`)
- Zustand for client state (auth only, persisted to localStorage)
- TanStack React Query for all server state
- Axios for HTTP (JWT auth via cookie `ww-token`)
- React Router v7
- Sentry for error tracking (production only)
- Vitest + React Testing Library for unit tests
- Playwright for E2E tests

### Directory Layout
- `src/pages/` -- Route-level page components (each calls `usePageTitle()`)
- `src/components/dashboard/` -- Dashboard-specific components (sidebar, charts, tables, AI insight card)
- `src/components/explore/` -- Fund card, fund detail drawer, fund search dialog
- `src/components/landing/` -- Landing page sections
- `src/components/ui/` -- shadcn/ui primitives (do NOT edit manually -- use `npx shadcn@latest add <component>`)
- `src/services/` -- API call functions (api.ts has axios instance, auth.ts, chat.ts, funds.ts)
- `src/stores/` -- Zustand stores (auth-store.ts only)
- `src/hooks/` -- Custom hooks (use-auth.ts, use-media-query.ts, use-portfolio.ts, use-page-title.ts, use-focus-on-navigate.ts)
- `src/data/` -- Static data (funds.ts has Fund type + hardcoded fund array for landing page)
- `src/types/` -- Shared TypeScript types
- `src/lib/` -- Utilities (utils.ts, env.ts, logger.ts, sentry.ts, error-messages.ts)
- `src/test/` -- Unit tests (Vitest)
- `e2e/` -- E2E tests (Playwright)

### Path Alias
`@/*` maps to `./src/*` (configured in tsconfig and vite.config.ts).

## API

Backend base URL is set via `VITE_API_BASE_URL` env variable (required -- app fails fast if missing).

### Axios Setup (`src/services/api.ts`)
- Request interceptor attaches JWT from `ww-token` cookie + `X-Requested-With` CSRF header
- Response interceptor auto-signs-out on 401 (except `/auth/` routes)
- Timeout: 60s
- Base URL imported from `src/lib/env.ts` (validated at startup)

### Endpoints
- Auth: `/auth/signin`, `/auth/signup`, `/auth/signout`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/change-password`, `/auth/profile`, `/auth/account`
- Funds: `GET /funds`, `POST /funds/:fundId/invest`, `GET /funds/:fundId/nav-history?period=`
- Bookmarks: `GET /bookmarks`, `POST /bookmarks/:fundId`, `DELETE /bookmarks/:fundId`
- Portfolio: `GET /portfolio/all-details?period=`
- SIPs: `GET /sips`, `POST /sips`, `PATCH /sips`, `DELETE /sips?id=`
- Transactions: `GET /transactions`
- AI: `POST /api/ai/chat`, `GET /api/ai/history`, `DELETE /api/ai/history`, `GET /api/ai/insight`

## Environment Variables

Configured in `.env` (gitignored). Use `.env.example` as template.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | Yes | Backend API base URL |
| `VITE_SENTRY_DSN` | No | Sentry DSN for error tracking (only active in production builds) |

Env validation lives in `src/lib/env.ts`. Required vars crash the app at startup if missing. Optional vars return `undefined`.

## State Management

### Zustand Store
- `ww-auth` -- User session (user object, isAuthenticated). Token is NOT persisted to localStorage (stored in cookie only for security).

### React Query Keys
- `["funds"]` -- Paginated fund list from `/funds`
- `["funds", "search"]` -- Full fund list for search dialog
- `["bookmarks"]` -- Bookmarked fund IDs from `/bookmarks`
- `["portfolio", period?]` -- Portfolio overview (holdings, history, allocation, summary) from `/portfolio/all-details`
- `["sips"]` -- SIP list from `/sips`
- `["transactions"]` -- Transaction list from `/transactions`
- `["nav-history", fundId, period]` -- NAV history for a specific fund
- `["ai-insight"]` -- AI-generated portfolio insight (30min stale time)

## Auth Flow

1. Sign in/up -> API returns `{ user, token }`
2. Token stored in cookie `ww-token` (7-day expiry, sameSite: strict)
3. User + isAuthenticated stored in Zustand auth store (persisted to `ww-auth` in localStorage)
4. Sentry user context set on sign-in, cleared on sign-out
5. `AuthGuard` component checks `isAuthenticated`, redirects to `/signin` if false
6. Axios interceptor attaches token from cookie to all requests
7. 401 response -> auto sign-out, redirect to `/signin`

## Routing

Public: `/`, `/signin`, `/signup`, `/forgot-password`, `/reset-password`
Protected (wrapped in `AuthGuard`): `/dashboard`, `/dashboard/explore`, `/dashboard/sip`, `/dashboard/transactions`, `/dashboard/profile`, `/dashboard/chat`

All routes are lazy-loaded with `React.lazy()`. Each page sets its own `document.title` via `usePageTitle()`. Focus moves to `<main>` on route changes via `useFocusOnNavigate()`.

## Security

- **CSRF**: `X-Requested-With: XMLHttpRequest` header on all requests
- **CSP**: Content Security Policy meta tag in `index.html` (allows self, backend URL, Sentry ingest)
- **Cookie**: `sameSite: strict`, 7-day expiry. Token NOT stored in localStorage.
- **Error logging**: Production errors go to Sentry only (no `console.error` in prod)

## Observability

- **Sentry** (`src/lib/sentry.ts`): Initialized before React renders. Only active when `VITE_SENTRY_DSN` is set AND `import.meta.env.PROD` is true. Strips Authorization headers from breadcrumbs. Ignores common noise (ResizeObserver, network errors).
- **Logger** (`src/lib/logger.ts`): `logger.error()` logs to console in dev, sends to Sentry in prod. `logger.warn()` and `logger.info()` are dev-only.
- **Error Boundary** (`src/components/error-boundary.tsx`): Catches React rendering errors, reports to Sentry with component stack context.
- **Auth context**: `Sentry.setUser()` called on sign-in/out so errors are tied to users.

## Testing

### Unit Tests (Vitest)
- Config: `vite.config.ts` test section (globals, jsdom, setup file)
- Setup: `src/test/setup.ts` (jest-dom matchers, matchMedia/ResizeObserver/IntersectionObserver mocks)
- Utils: `src/test/utils/test-utils.tsx` (custom render with QueryClient + ThemeProvider + BrowserRouter)
- Structure: `src/test/{unit,components,forms,hooks,store,services}/`
- 154 tests across 20 files covering: services, hooks, stores, components, forms

### E2E Tests (Playwright)
- Config: `playwright.config.ts` (auto-starts Vite dev server, Chromium only)
- Fixtures: `e2e/fixtures.ts` (API mocking via `page.route()`, auth injection via localStorage + cookie)
- Tests: `e2e/{auth,navigation,explore}.spec.ts` -- 9 tests covering auth flow, navigation, fund explorer
- Tests use mocked API (never hit real backend)
- Run with `npm run test:e2e` or `npm run test:e2e:ui` for interactive mode

## Styling

- Tailwind CSS v4 with CSS variables defined in `src/index.css`
- OKLch color space for all theme colors
- Dark mode via `next-themes` -- toggled with ThemeToggle component or pressing `d`
- Font: JetBrains Mono Variable (monospace)
- Animations via `motion` library -- custom components in `src/components/ui/animated.tsx` (FadeIn, StaggerContainer, StaggerItem, CountUp)

## Code Style

- No semicolons
- Double quotes
- 2-space indentation
- Trailing commas (ES5)
- Prettier with `prettier-plugin-tailwindcss`
- ESLint flat config (v9) with typescript-eslint and react-hooks plugins

## Key Conventions

- Fund type is defined in `src/data/funds.ts`, NOT in `src/types/index.ts`
- All other shared types (User, SIP, Transaction, Holding, Installment) are in `src/types/index.ts`
- Adding UI components: `npx shadcn@latest add <name>` -- places them in `src/components/ui/`
- Icons: use `@tabler/icons-react` (e.g., `IconSearch`, `IconBookmark`)
- Toast notifications: use `toast` from `sonner`
- Responsive: mobile-first, sidebar collapses on mobile, bottom nav shown instead
- Use `useMediaQuery("(min-width: 768px)")` for responsive logic in components
- All API data flows through React Query -- do not use Zustand for server state
- Backend error messages are surfaced in toasts via `err.response.data.message`
- Use `logger.error()` instead of `console.error()` -- it routes to Sentry in production
- FundCard is memoized with `React.memo` -- ensure parent stabilizes callbacks with `useCallback`
- Form inputs with errors should use `aria-invalid` and `aria-describedby`

## Things to Watch Out For

- The `src/data/funds.ts` exports both the `Fund` type and a hardcoded `funds` array. The explore page fetches from the API, but the hardcoded array is still used by `src/components/landing/fund-preview.tsx`.
- Portfolio chart period filter passes `period` param to `/portfolio/all-details` -- the backend filters the `portfolioHistory` array server-side.
- The `usePortfolio(period?)` hook is shared by all dashboard components. Stat cards, asset allocation, and holdings table call it without a period (defaults to no filter). The portfolio chart passes the active period. React Query deduplicates calls with the same key.
- Sentry is disabled in dev mode (`enabled: import.meta.env.PROD`). To test Sentry locally, temporarily set `enabled: true` in `src/lib/sentry.ts`, then revert.
- E2E tests mock all API calls via `page.route()` in `e2e/fixtures.ts`. If you add new API endpoints, add mocks there too.
- The `tsconfig.app.json` excludes `src/test/` so test files don't break `tsc -b` builds. Test types come from Vitest globals.
