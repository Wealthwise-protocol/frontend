# CLAUDE.md

This file provides context for Claude Code when working on the WealthWise frontend.

## Project Overview

WealthWise is a mutual fund investment platform. This is the React frontend that connects to a Spring Boot backend deployed on Render.

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + production build (tsc -b && vite build)
npm run typecheck    # Type-check only (tsc --noEmit)
npm run lint         # ESLint
npm run format       # Prettier
npm run preview      # Preview production build
```

## Architecture

### Tech Stack
- React 19, TypeScript, Vite 7
- Tailwind CSS v4 with OKLch color system
- shadcn/ui components (Radix UI primitives, style: `radix-mira`, base color: `stone`)
- Zustand for client state (persisted to localStorage)
- TanStack React Query for server state
- Axios for HTTP (JWT auth via cookie `ww-token`)
- React Router v7

### Directory Layout
- `src/pages/` — Route-level page components
- `src/components/dashboard/` — Dashboard-specific components (sidebar, charts, tables)
- `src/components/explore/` — Fund card, fund detail drawer
- `src/components/landing/` — Landing page sections
- `src/components/ui/` — shadcn/ui primitives (do NOT edit manually — use `npx shadcn@latest add <component>`)
- `src/services/` — API call functions (api.ts has axios instance, auth.ts, funds.ts)
- `src/stores/` — Zustand stores (auth, portfolio, sip, transaction, explore)
- `src/hooks/` — Custom hooks (use-auth.ts, use-media-query.ts)
- `src/data/` — Static/mock data (funds.ts has Fund type + fallback data, mock.ts has mock portfolio data)
- `src/types/` — Shared TypeScript types
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

### Path Alias
`@/*` maps to `./src/*` (configured in tsconfig and vite.config.ts).

## API

Backend base URL is set via `VITE_API_BASE_URL` env variable.
Default: `https://wealthwise-backend-7zqx.onrender.com`
Local: `http://localhost:9095`

### Axios Setup (`src/services/api.ts`)
- Request interceptor attaches JWT from `ww-token` cookie
- Response interceptor auto-signs-out on 401 (except `/auth/` routes)
- Timeout: 60s

### Endpoints
- Auth: `/auth/signin`, `/auth/signup`, `/auth/signout`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/change-password`, `/auth/profile`, `/auth/account`
- Funds: `GET /funds`
- Bookmarks: `GET /bookmarks`, `POST /bookmarks/:fundId`, `DELETE /bookmarks/:fundId`

## State Management

### Zustand Stores (localStorage keys)
- `ww-auth` — User session (user object, token, isAuthenticated)
- `ww-portfolio` — Holdings, portfolio history, asset allocation
- `ww-sips` — SIP list with installment history
- `ww-transactions` — Transaction list
- `ww-explore` — Saved fund IDs (legacy, being replaced by API bookmarks)

### React Query Keys
- `["funds"]` — Fund list from `/funds`
- `["bookmarks"]` — Bookmarked fund IDs from `/bookmarks`

## Auth Flow

1. Sign in/up → API returns `{ user, token }`
2. Token stored in cookie `ww-token` (7-day expiry, sameSite: lax)
3. User + token stored in Zustand auth store (persisted to `ww-auth`)
4. `AuthGuard` component checks `isAuthenticated`, redirects to `/signin` if false
5. Axios interceptor attaches token to all requests
6. 401 response → auto sign-out, redirect to `/signin`

## Routing

Public: `/`, `/signin`, `/signup`, `/forgot-password`, `/reset-password`
Protected (wrapped in `AuthGuard`): `/dashboard`, `/dashboard/explore`, `/dashboard/sip`, `/dashboard/transactions`, `/dashboard/profile`

## Styling

- Tailwind CSS v4 with CSS variables defined in `src/index.css`
- OKLch color space for all theme colors
- Dark mode via `next-themes` — toggled with ThemeToggle component or pressing `d`
- Font: JetBrains Mono Variable (monospace)
- Animations via `motion` library — custom components in `src/components/ui/animated.tsx` (FadeIn, StaggerContainer, StaggerItem, CountUp)

## Code Style

- No semicolons
- Double quotes
- 2-space indentation
- Trailing commas (ES5)
- Prettier with `prettier-plugin-tailwindcss`
- ESLint flat config (v9) with typescript-eslint and react-hooks plugins

## Key Conventions

- Fund type is defined in `src/data/funds.ts`, NOT in `src/types/index.ts`
- All other shared types (User, SIP, Transaction, Holding, etc.) are in `src/types/index.ts`
- Adding UI components: `npx shadcn@latest add <name>` — places them in `src/components/ui/`
- Icons: use `@tabler/icons-react` (e.g., `IconSearch`, `IconBookmark`)
- Toast notifications: use `toast` from `sonner`
- Responsive: mobile-first, sidebar collapses on mobile, bottom nav shown instead
- Use `useMediaQuery("(min-width: 768px)")` for responsive logic in components

## Things to Watch Out For

- The `explore-store.ts` is legacy — bookmarks now use React Query + API. The store file still exists but is unused.
- Portfolio, SIP, and transaction stores still use mock data from `src/data/mock.ts` — these will be migrated to API calls in the future.
- The `src/data/funds.ts` exports both the `Fund` type and a hardcoded `funds` array. The explore page now fetches from the API, but the hardcoded array is still used by `src/components/landing/fund-preview.tsx`.
- NAV history chart in fund-detail.tsx uses procedurally generated data, not real data.
