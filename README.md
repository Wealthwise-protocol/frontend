# WealthWise

A modern mutual fund investment platform built with React, TypeScript, and Tailwind CSS. Browse funds, manage SIPs, track your portfolio, get AI-powered insights, and bookmark your favorites — all in a responsive, dark-mode-ready interface.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 (OKLch color space) |
| UI Components | shadcn/ui + Radix UI |
| Client State | Zustand (auth only) |
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

Copy the example env file and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `https://wealthwise-backend-7zqx.onrender.com` |

For local backend development, set:

```env
VITE_API_BASE_URL=http://localhost:9095
```

> **Note:** Never commit `.env` files. The `.env.example` file contains placeholder values safe for version control.

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview   # preview the build locally
```

### Available Scripts

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
│   ├── dashboard/       # Sidebar, stats, charts, holdings table, AI insight card
│   ├── explore/         # Fund cards, fund detail drawer, search dialog
│   ├── landing/         # Navbar, hero, steps, CTA, footer
│   ├── ui/              # shadcn/ui primitives (do not edit manually)
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
│   ├── chat.tsx         # AI chat (Ask X)
│   └── not-found.tsx    # 404
├── services/
│   ├── api.ts           # Axios instance + interceptors
│   ├── auth.ts          # Auth API calls
│   ├── chat.ts          # AI chat & insight API calls
│   └── funds.ts         # Funds, portfolio, SIPs, transactions API calls
├── stores/
│   └── auth-store.ts    # User session (only store)
├── hooks/
│   ├── use-auth.ts      # Auth mutations (sign in/up/out)
│   ├── use-media-query.ts
│   └── use-portfolio.ts # Portfolio data via React Query
├── data/
│   └── funds.ts         # Fund type + static data for landing page
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
| `/dashboard/chat` | AI assistant (Ask X) |

## Features

- **Fund Explorer** -- Browse, search (Cmd+K), and filter mutual funds by category (Equity, Debt, Hybrid, ELSS, Index). View detailed fund info, real NAV history charts with period filtering, and returns comparison.
- **Lumpsum & SIP Investing** -- Invest via one-time lumpsum or set up monthly SIPs directly from the fund detail drawer.
- **Bookmarks** -- Save/unsave funds with optimistic UI updates backed by the API.
- **SIP Management** -- Create, pause, resume, edit amount, and cancel SIPs. All mutations persist to the backend with optimistic updates and rollback on failure.
- **Portfolio Dashboard** -- Track holdings, portfolio value over time (bar chart with 1M/3M/6M/1Y/ALL period filter), and asset allocation (donut chart). All data from real API.
- **AI Insights (Ask X)** -- AI-powered financial co-pilot that analyzes your portfolio, suggests funds, and helps plan SIPs.
- **Transaction History** -- View and filter past SIP and lumpsum transactions by type.
- **Authentication** -- JWT-based auth with auto sign-out on 401, password reset flow, and protected routes.
- **Dark Mode** -- System-aware theme toggle (press `d` to switch).
- **Responsive** -- Mobile-first with collapsible sidebar and bottom navigation.
- **Loading & Empty States** -- Skeleton loaders, spinners, and friendly empty states with CTAs across all pages.

## API Integration

The frontend connects to the WealthWise Spring Boot backend at the URL specified by `VITE_API_BASE_URL`.

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
| GET | `/funds?page=&size=` | List funds (paginated) |
| POST | `/funds/:fundId/invest` | Lumpsum investment |
| GET | `/funds/:fundId/nav-history?period=` | Fund NAV history |
| GET | `/bookmarks` | Get saved fund IDs |
| POST | `/bookmarks/:fundId` | Bookmark a fund |
| DELETE | `/bookmarks/:fundId` | Remove bookmark |
| GET | `/portfolio/all-details?period=` | Portfolio overview |
| GET | `/sips` | List user's SIPs |
| POST | `/sips` | Create a new SIP |
| PATCH | `/sips` | Update SIP (pause/resume/edit) |
| DELETE | `/sips?id=` | Cancel a SIP |
| GET | `/transactions` | List user's transactions |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, coding standards, and contribution guidelines.

## License

This project is proprietary. All rights reserved.
