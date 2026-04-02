-- ============================================================
-- MBS Hunt Platform — Supabase Schema
-- Paste this into the Supabase SQL Editor and run it.
-- ============================================================

-- ── 1. Hunts ────────────────────────────────────────────────
-- Each hunt is a scavenger hunt event (e.g. "Portland Art Walk 2026")
create table if not exists hunts (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,          -- URL-friendly: "portland-art-walk-2026"
  name        text not null,
  city        text not null,
  emoji       text default '🎨',
  description text default '',
  status      text not null default 'draft'  -- draft | published | archived
    check (status in ('draft', 'published', 'archived')),
  stops_count int default 0,                 -- denormalized for quick display
  reward_url  text,                          -- coloring page download link
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── 2. Stops ────────────────────────────────────────────────
-- Individual QR-scannable locations within a hunt
create table if not exists stops (
  id          uuid primary key default gen_random_uuid(),
  hunt_id     uuid not null references hunts(id) on delete cascade,
  slug        text not null,                 -- unique within hunt, used in QR URL
  name        text not null,
  hint        text default '',
  artist      text default '',
  description text default '',
  photo_url   text,                          -- reveal image after scan
  sort_order  int default 0,
  created_at  timestamptz default now(),
  unique (hunt_id, slug)
);

-- ── 3. Players ──────────────────────────────────────────────
-- Public registrations (no auth passwords — session token in localStorage)
create table if not exists players (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text unique not null,
  marketing_opt_in boolean default false,    -- newsletter / promo consent
  registered_at   timestamptz default now()
);

-- ── 4. Scans (collection events) ────────────────────────────
-- Each row = one player scanned one stop's QR code
create table if not exists scans (
  id          uuid primary key default gen_random_uuid(),
  player_id   uuid not null references players(id) on delete cascade,
  hunt_id     uuid not null references hunts(id) on delete cascade,
  stop_id     uuid not null references stops(id) on delete cascade,
  scanned_at  timestamptz default now(),
  unique (player_id, stop_id)                -- one scan per stop per player
);

-- ── 5. Photos (optional player uploads) ─────────────────────
-- Players can upload a selfie / snapshot at each stop
create table if not exists photos (
  id          uuid primary key default gen_random_uuid(),
  scan_id     uuid not null references scans(id) on delete cascade,
  player_id   uuid not null references players(id) on delete cascade,
  storage_path text not null,                -- Supabase Storage path
  caption     text default '',
  uploaded_at timestamptz default now()
);

-- ── Indexes ─────────────────────────────────────────────────
create index if not exists idx_stops_hunt      on stops(hunt_id);
create index if not exists idx_scans_player    on scans(player_id);
create index if not exists idx_scans_hunt      on scans(hunt_id);
create index if not exists idx_scans_stop      on scans(stop_id);
create index if not exists idx_photos_scan     on photos(scan_id);
create index if not exists idx_photos_player   on photos(player_id);
create index if not exists idx_players_email   on players(email);

-- ── Auto-update timestamps ──────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger hunts_updated_at
  before update on hunts
  for each row execute function update_updated_at();

-- ── Row Level Security ──────────────────────────────────────
-- Published hunts and stops are publicly readable.
-- Players can read/insert their own rows. Admin does full CRUD via service key.

alter table hunts enable row level security;
alter table stops enable row level security;
alter table players enable row level security;
alter table scans enable row level security;
alter table photos enable row level security;

-- Hunts: anyone can read published hunts
create policy "Public can read published hunts"
  on hunts for select
  using (status = 'published');

-- Stops: anyone can read stops of published hunts
create policy "Public can read stops of published hunts"
  on stops for select
  using (
    exists (
      select 1 from hunts where hunts.id = stops.hunt_id and hunts.status = 'published'
    )
  );

-- Players: insert (register) allowed for anon, select own row by email
create policy "Anyone can register"
  on players for insert
  with check (true);

create policy "Players can read own row"
  on players for select
  using (true);  -- relaxed for now; tighten once auth is added

-- Scans: insert and read own
create policy "Players can insert scans"
  on scans for insert
  with check (true);

create policy "Players can read own scans"
  on scans for select
  using (true);  -- relaxed; tighten with auth

-- Photos: insert and read own
create policy "Players can insert photos"
  on photos for insert
  with check (true);

create policy "Players can read own photos"
  on photos for select
  using (true);

-- ── Seed helper view ────────────────────────────────────────
-- Leaderboard: how many stops each player has collected per hunt
create or replace view leaderboard as
  select
    s.hunt_id,
    s.player_id,
    p.name as player_name,
    count(*) as stops_collected,
    max(s.scanned_at) as last_scan
  from scans s
  join players p on p.id = s.player_id
  group by s.hunt_id, s.player_id, p.name;
