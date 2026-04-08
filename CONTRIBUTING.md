# Contributing to WealthWise Frontend

Thanks for your interest in contributing to WealthWise. This guide covers everything you need to get started.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9
- Git

## Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/<your-username>/frontend.git
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set `VITE_API_BASE_URL` to the backend URL. For local development:

   ```env
   VITE_API_BASE_URL=http://localhost:9095
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   The app runs at `http://localhost:5173`.

## Development Workflow

### Branching

- Create a feature branch from `main`:

  ```bash
  git checkout -b feat/your-feature
  ```

- Use prefixes: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/`

### Before Committing

Run these checks locally:

```bash
npm run typecheck    # TypeScript type-check
npm run lint         # ESLint
npm run format       # Prettier auto-format
npm run build        # Full production build
```

All four should pass before you push.

### Commit Messages

Use clear, concise commit messages that describe what changed and why:

- `feat: add SIP pause/resume functionality`
- `fix: handle 401 on bookmark endpoint`
- `refactor: extract portfolio chart into separate component`
- `docs: update API endpoint table in README`

### Pull Requests

1. Push your branch and open a PR against `main`
2. Fill in the PR template with a summary and test plan
3. Ensure the build passes
4. Request a review

## Code Style

This project enforces consistent style via Prettier and ESLint:

- **No semicolons**
- **Double quotes**
- **2-space indentation**
- **Trailing commas** (ES5)
- Prettier with `prettier-plugin-tailwindcss` for class sorting

ESLint uses flat config (v9) with `typescript-eslint` and `react-hooks` plugins.

Run `npm run format` to auto-fix formatting before committing.

## Project Conventions

### Adding UI Components

shadcn/ui components live in `src/components/ui/`. Do not edit them manually. To add a new one:

```bash
npx shadcn@latest add <component-name>
```

### Icons

Use [Tabler Icons](https://tabler.io/icons) via `@tabler/icons-react`:

```tsx
import { IconSearch } from "@tabler/icons-react"
```

### State Management

- **Client state (auth only):** Zustand store in `src/stores/auth-store.ts`
- **Server state (everything else):** TanStack React Query hooks

Do not use Zustand for server-fetched data. All API data should flow through React Query.

### API Calls

- API functions go in `src/services/`
- The Axios instance in `src/services/api.ts` handles JWT attachment and 401 auto-sign-out
- Surface backend error messages in toasts: `err.response.data.message`

### Types

- The `Fund` type is in `src/data/funds.ts` (not `src/types/`)
- All other shared types (User, SIP, Transaction, etc.) are in `src/types/index.ts`

### Styling

- Tailwind CSS v4 with OKLch color variables defined in `src/index.css`
- Mobile-first responsive design
- Dark mode via `next-themes` (toggle with `d` key)
- Font: JetBrains Mono Variable

### Path Aliases

`@/*` maps to `./src/*`. Use it for all imports:

```tsx
import { Button } from "@/components/ui/button"
```

### Toasts

Use `sonner` for notifications:

```tsx
import { toast } from "sonner"

toast.success("Investment successful")
toast.error(err.response.data.message)
```

## Project Structure

```
src/
├── components/
│   ├── dashboard/       # Dashboard-specific components
│   ├── explore/         # Fund exploration components
│   ├── landing/         # Landing page sections
│   └── ui/              # shadcn/ui primitives (auto-generated)
├── pages/               # Route-level page components
├── services/            # API call functions
├── stores/              # Zustand stores (auth only)
├── hooks/               # Custom React hooks
├── data/                # Static data and types
├── types/               # Shared TypeScript types
└── lib/                 # Utilities (cn helper)
```

## Need Help?

- Check existing issues before opening a new one
- For bugs, include steps to reproduce and browser/OS info
- For feature requests, describe the use case and expected behavior
