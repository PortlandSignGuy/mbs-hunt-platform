# MBS Hunt Platform — Project Context

Public art scavenger hunt app for **Mike Bennett Studios** ("Public Joy Creator"). Players register (name + email), scan QR codes at public art installations, collect 15 photos per hunt, and unlock a downloadable coloring page reward.

## Client — Mike Bennett Studios
- **Website**: mikebennettstudios.com
- **Brand**: Whimsical, character-driven, cartoon-forward, family-friendly
- **Properties**: Portland Aquarium, Wonderwood Mini Golf, Mike's Studio (707 NE Fremont St, Portland)
- **Products**: Stickers, enamel pins, plushies, keychains, mystery boxes
- **Tagline**: Interactive art experiences that spark curiosity, creativity, and joy

## Brand Identity
- **Colors**: Purple `#6454cb` (primary), Gold `#fabc70` (secondary), Green `#4EB25C` (nature), Cream `#faf8eb` (background)
- **Fonts**: Lilita One for display (stand-in for Bugbear — swap when woff2 provided), Nunito for body
- **Tone**: Joyful, playful, inviting — "Public Joy" energy throughout
- **Theme**: Light cream background, warm neutrals, colorful accents — NOT dark mode

## Architecture
- **Multi-hunt**: Each city gets its own hunt instance (slug-based routing)
- **Player flow**: Register → Pick Hunt → Scan QR at stops → Collect photos → All 15 = unlock reward
- **Admin flow**: Create hunts, add stops (name, hint, photo, artist), publish, upload reward file

## Tech Stack
- **Frontend**: React 18 + Vite 5, React Router 7
- **State**: Zustand 5 with persist (localStorage)
- **Styling**: Tailwind CSS 4 — Mike Bennett brand palette via @theme in index.css
- **Backend**: Supabase (auth, Postgres, storage) — env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **Testing**: Vitest + @testing-library/react
- **Deployment**: Vercel
- **Fonts**: Lilita One (display), Nunito (body) — via Google Fonts

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
- **ID format**: `HNT-xxxxxxxx` (hunts), `STP-xxxxxxxx` (stops)
- **Toasts**: `useUiStore(s => s.addToast)({ type, message })`
- **Routing**: `/hunt/:huntSlug` for hunt pages, `/scan/:huntSlug/:stopId` for QR scan landing
- **Persistence**: localStorage keys: `mbs-hunts`, `mbs-player`
- **CSS classes**: Use brand color tokens — `primary-*` (purple), `secondary-*` (gold), `nature-*` (green), `cream-*` (backgrounds), `joy-*` (pink accents)
- **Cards**: `bg-cream-50 rounded-card shadow-sm border border-cream-400`
- **Buttons**: `bg-primary-500 text-white font-bold rounded-button`
- **Inputs**: `border border-cream-400 bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-200`

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
- **Teddy's IT team** — Will eventually take ownership of the repo

## Git Workflow
- **Repo**: github.com/PortlandSignGuy/mbs-hunt-platform (transfer to Mike Bennett Studios org when ready)
- `main` — production (deploys to Vercel)
- `develop` — staging
