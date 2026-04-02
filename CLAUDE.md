# MBS Hunt Platform — Project Context

Public art scavenger hunt app for **Mike Bennett Scavenger Hunts**. Players register (name + email), scan QR codes at public art installations, collect 15 photos per hunt, and unlock a downloadable coloring page reward.

## Architecture
- **Multi-hunt**: Each city gets its own hunt instance (slug-based routing)
- **Player flow**: Register → Pick Hunt → Scan QR at stops → Collect photos → All 15 = unlock reward
- **Admin flow**: Create hunts, add stops (name, hint, photo, artist), publish, upload reward file

## Tech Stack
- **Frontend**: React 18 + Vite 5, React Router 7
- **State**: Zustand 5 with persist (localStorage)
- **Styling**: Tailwind CSS 4 — bright, colorful, light theme (joyful public art aesthetic)
- **Backend**: Supabase (auth, Postgres, storage) — env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **Testing**: Vitest + @testing-library/react
- **Deployment**: Vercel
- **Fonts**: Fredoka (display/headings), Inter (body)

## Project Structure
```
src/
├── pages/           # Route pages (lazy-loaded)
├── components/
│   ├── layout/      # AppShell, Header
│   └── shared/      # ErrorBoundary, ToastContainer
├── stores/          # Zustand stores (hunt, player, ui)
├── lib/             # supabase client, api service, constants, id generation
└── hooks/           # useHydration
```

## Key Conventions
- **Dual-mode API**: `lib/api.js` — Supabase when env vars set, localStorage fallback otherwise
- **ID format**: `HNT-xxxxxxxx` (hunts), `STP-xxxxxxxx` (stops), `PLR-xxxxxxxx` (players)
- **Toasts**: `useUiStore(s => s.addToast)({ type, message })`
- **Routing**: `/hunt/:huntSlug` for hunt pages, `/scan/:huntSlug/:stopId` for QR scan landing
- **Persistence**: localStorage keys: `mbs-hunts`, `mbs-player`

## Business Rules
- 15 stops per hunt (configurable via `STOPS_PER_HUNT` constant)
- Player must collect ALL stops to unlock coloring page reward
- Each stop collected only once per player
- QR codes at physical locations link to `/scan/:huntSlug/:stopId`
- Hunt statuses: draft → published → archived
- No payments, no booking, no scheduling

## Team
- **Pat McNamara** — Developer
- **Mike Bennett** — Client / hunt organizer

## Git Workflow
- `main` — production (deploys to Vercel)
- `develop` — staging
