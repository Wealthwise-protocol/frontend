# WealthWise

A modern mutual fund investment platform built with React, TypeScript, and Tailwind CSS. Browse funds, manage SIPs, track your portfolio, and bookmark your favorites — all in a responsive, dark-mode-ready interface.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 (OKLch color space) |
| UI Components | shadcn/ui + Radix UI |
| State Management | Zustand (persisted to localStorage) |
| Server State | TanStack React Query |
| HTTP Client | Axios (JWT interceptors) |
| Routing | React Router v7 |
| Charts | Recharts |
| Animations | Motion |
| Icons | Tabler Icons |
| Font | JetBrains Mono Variable |
| Notifications | Sonner |

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
git clone https://github.com/Wealthwise-protocol/frontend.git
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://wealthwise-backend-7zqx.onrender.com
```

For local backend development:

```env
VITE_API_BASE_URL=http://localhost:9095
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Other Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | Type-check without emitting |

## Project Structure

```
src/
├── components/
│   ├── dashboard/       # Sidebar, stats, charts, holdings table
│   ├── explore/         # Fund cards, fund detail drawer
│   ├── landing/         # Navbar, hero, steps, CTA, footer
│   ├── ui/              # shadcn/ui primitives (40+ components)
│   ├── auth-guard.tsx   # Route protection
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── pages/
│   ├── landing.tsx      # Public landing page
│   ├── signin.tsx       # Sign in
│   ├── signup.tsx       # Sign up
│   ├── forgot-password.tsx
│   ├── reset-password.tsx
│   ├── dashboard.tsx    # Portfolio overview
│   ├── explore.tsx      # Fund explorer
│   ├── sip.tsx          # SIP management
│   ├── transactions.tsx # Transaction history
│   ├── profile.tsx      # User profile
│   └── not-found.tsx    # 404
├── services/
│   ├── api.ts           # Axios instance + interceptors
│   ├── auth.ts          # Auth API calls
│   └── funds.ts         # Funds + bookmarks API calls
├── stores/
│   ├── auth-store.ts    # User session
│   ├── portfolio-store.ts
│   ├── sip-store.ts
│   ├── transaction-store.ts
│   └── explore-store.ts
├── hooks/
│   ├── use-auth.ts      # Auth mutations (sign in/up/out)
│   └── use-media-query.ts
├── data/
│   ├── funds.ts         # Fund type + fallback data
│   └── mock.ts          # Mock portfolio/SIP/transaction data
├── types/
│   └── index.ts         # Shared TypeScript types
├── lib/
│   └── utils.ts         # cn() helper
├── App.tsx              # Route definitions
├── main.tsx             # Entry point + providers
└── index.css            # Tailwind config + CSS variables
```

## Routes

### Public

| Path | Page |
|---|---|
| `/` | Landing page |
| `/signin` | Sign in |
| `/signup` | Sign up |
| `/forgot-password` | Forgot password |
| `/reset-password` | Reset password (token in query) |

### Protected (requires authentication)

| Path | Page |
|---|---|
| `/dashboard` | Portfolio overview |
| `/dashboard/explore` | Fund explorer |
| `/dashboard/sip` | SIP management |
| `/dashboard/transactions` | Transaction history |
| `/dashboard/profile` | User profile |

## Features

- **Fund Explorer** — Browse, search, and filter mutual funds by category (Equity, Debt, Hybrid, ELSS, Index). View detailed fund info, NAV history charts, and returns comparison.
- **Bookmarks** — Save/unsave funds with optimistic UI updates backed by the API.
- **SIP Management** — Create, pause, resume, edit, and cancel Systematic Investment Plans.
- **Portfolio Dashboard** — Track holdings, portfolio value over time (bar chart), and asset allocation (donut chart).
- **Transaction History** — View and filter past investment transactions.
- **Authentication** — JWT-based auth with auto sign-out on 401, password reset flow, and protected routes.
- **Dark Mode** — System-aware theme toggle (press `d` to switch).
- **Responsive** — Mobile-first with collapsible sidebar and bottom navigation.

## API Integration

The frontend connects to the WealthWise backend at the URL specified by `VITE_API_BASE_URL`.

### Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register |
| POST | `/auth/signin` | Login |
| POST | `/auth/signout` | Logout |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |
| POST | `/auth/change-password` | Change password |
| PATCH | `/auth/profile` | Update profile |
| DELETE | `/auth/account` | Delete account |
| GET | `/funds` | List all funds |
| GET | `/bookmarks` | Get saved fund IDs |
| POST | `/bookmarks/:fundId` | Bookmark a fund |
| DELETE | `/bookmarks/:fundId` | Remove bookmark |

## License

This project is proprietary. All rights reserved.
