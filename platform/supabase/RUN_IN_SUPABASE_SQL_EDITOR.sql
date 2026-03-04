-- ═══════════════════════════════════════════════════════════════
-- APOTHEOS JOURNEY — Run this entire file in Supabase SQL Editor
-- (The project connected to Vercel.) New query → paste all → Run.
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. JOURNEY TABLES ────────────────────────────────────────
create table if not exists public.locations (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  name                text not null,
  address             text,
  status              text not null default 'active'
    check (status in ('active','coming_soon')),
  description_for_ai  text,
  sort_order          integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
alter table public.locations enable row level security;
create policy "Anyone can read locations" on public.locations for select using (true);
create policy "Admins manage locations" on public.locations for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','instructor'))
);

create table if not exists public.location_spaces (
  id                  uuid primary key default gen_random_uuid(),
  location_id         uuid not null references public.locations(id) on delete cascade,
  name                text not null,
  description_for_ai  text,
  capacity            integer,
  suggested_use       text,
  sort_order          integer not null default 0,
  created_at          timestamptz not null default now()
);
alter table public.location_spaces enable row level security;
create policy "Anyone can read location_spaces" on public.location_spaces for select using (true);
create policy "Admins manage location_spaces" on public.location_spaces for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','instructor'))
);

create table if not exists public.location_amenities (
  id                  uuid primary key default gen_random_uuid(),
  location_id         uuid not null references public.locations(id) on delete cascade,
  name                text not null,
  description_for_ai text,
  sort_order          integer not null default 0,
  created_at          timestamptz not null default now()
);
alter table public.location_amenities enable row level security;
create policy "Anyone can read location_amenities" on public.location_amenities for select using (true);
create policy "Admins manage location_amenities" on public.location_amenities for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','instructor'))
);

create table if not exists public.journeys (
  id                    uuid primary key default gen_random_uuid(),
  host_id               uuid not null references public.users(id) on delete cascade,
  title                 text,
  type                  text not null default 'solo'
    check (type in ('solo','group')),
  status                text not null default 'draft'
    check (status in ('draft','collecting_inputs','generating','ready','archived')),
  start_at              timestamptz not null,
  end_at                timestamptz not null,
  location_id           uuid references public.locations(id) on delete set null,
  selected_modalities   text[] not null default '{}',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists idx_journeys_host on public.journeys(host_id);
create index if not exists idx_journeys_status on public.journeys(status);
alter table public.journeys enable row level security;
create policy "Users read own journeys" on public.journeys for select using (auth.uid() = host_id);
create policy "Users create own journeys" on public.journeys for insert with check (auth.uid() = host_id);
create policy "Users update own journeys" on public.journeys for update using (auth.uid() = host_id);
create policy "Users delete own journeys" on public.journeys for delete using (auth.uid() = host_id);

create table if not exists public.journey_participants (
  id          uuid primary key default gen_random_uuid(),
  journey_id  uuid not null references public.journeys(id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  role        text not null default 'invitee'
    check (role in ('host','invitee')),
  invited_at  timestamptz not null default now(),
  joined_at   timestamptz,
  unique (journey_id, user_id)
);
create index if not exists idx_journey_participants_journey on public.journey_participants(journey_id);
create index if not exists idx_journey_participants_user on public.journey_participants(user_id);
alter table public.journey_participants enable row level security;
create policy "Participants read own rows" on public.journey_participants for select using (
  auth.uid() = user_id or exists (
    select 1 from public.journeys j where j.id = journey_participants.journey_id and j.host_id = auth.uid()
  )
);
create policy "Host inserts participants" on public.journey_participants for insert with check (
  exists (select 1 from public.journeys j where j.id = journey_id and j.host_id = auth.uid())
);
create policy "Host updates participants" on public.journey_participants for update using (
  exists (select 1 from public.journeys j where j.id = journey_id and j.host_id = auth.uid())
);
create policy "User updates own joined_at" on public.journey_participants for update using (auth.uid() = user_id);

-- Participants can read journey they're part of (must come after journey_participants exists)
create policy "Participants read journey" on public.journeys for select using (
  exists (select 1 from public.journey_participants jp where jp.journey_id = journeys.id and jp.user_id = auth.uid())
);

create table if not exists public.journey_inputs (
  id                  uuid primary key default gen_random_uuid(),
  journey_id          uuid not null references public.journeys(id) on delete cascade,
  user_id             uuid not null references public.users(id) on delete cascade,
  goals_text          text not null default '',
  food_preferences    text,
  other_preferences   jsonb not null default '{}',
  modality_interests  text[] default '{}',
  completed_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (journey_id, user_id)
);
create index if not exists idx_journey_inputs_journey on public.journey_inputs(journey_id);
alter table public.journey_inputs enable row level security;
create policy "Participant reads own inputs" on public.journey_inputs for select using (
  auth.uid() = user_id or exists (select 1 from public.journeys j where j.id = journey_id and j.host_id = auth.uid())
);
create policy "Participant inserts own input" on public.journey_inputs for insert with check (auth.uid() = user_id);
create policy "Participant updates own input" on public.journey_inputs for update using (auth.uid() = user_id);

create table if not exists public.journey_outputs (
  id                        uuid primary key default gen_random_uuid(),
  journey_id                 uuid not null references public.journeys(id) on delete cascade,
  version                    integer not null default 1,
  narrative_arc              text,
  schedule                   jsonb not null default '[]',
  spaces_decor               jsonb not null default '[]',
  memorabilia_sacred_objects jsonb not null default '[]',
  rituals                    jsonb not null default '[]',
  moodboard                  jsonb not null default '[]',
  generated_images          jsonb not null default '[]',
  personal_arcs              jsonb not null default '{}',
  model_used                 text,
  generated_at               timestamptz not null default now(),
  unique (journey_id, version)
);
create index if not exists idx_journey_outputs_journey on public.journey_outputs(journey_id);
alter table public.journey_outputs enable row level security;
create policy "Participants read journey output" on public.journey_outputs for select using (
  exists (select 1 from public.journeys j where j.id = journey_id and j.host_id = auth.uid())
  or exists (select 1 from public.journey_participants jp where jp.journey_id = journey_outputs.journey_id and jp.user_id = auth.uid())
);

create table if not exists public.journey_invites (
  id          uuid primary key default gen_random_uuid(),
  journey_id  uuid not null references public.journeys(id) on delete cascade,
  email       text not null,
  token       text not null unique,
  status      text not null default 'pending'
    check (status in ('pending','accepted','declined')),
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);
create index if not exists idx_journey_invites_token on public.journey_invites(token);
create index if not exists idx_journey_invites_journey on public.journey_invites(journey_id);
alter table public.journey_invites enable row level security;
create policy "Host reads invites" on public.journey_invites for select using (
  exists (select 1 from public.journeys j where j.id = journey_id and j.host_id = auth.uid())
);
create policy "Host inserts invites" on public.journey_invites for insert with check (
  exists (select 1 from public.journeys j where j.id = journey_id and j.host_id = auth.uid())
);
create policy "Anyone can read by token" on public.journey_invites for select using (true);

-- ─── 2. PARTICIPANT COUNT (for group “how many people”) ─────────
alter table public.journeys
  add column if not exists participant_count integer not null default 1;

-- ─── 3. NEVADA CITY LOCATION SEED ──────────────────────────────
insert into public.locations (slug, name, address, status, description_for_ai, sort_order)
values (
  'nevada-city',
  'Nevada City, CA',
  'Nevada City, California',
  'active',
  'Apotheos founding campus in the Sierra Nevada foothills. Converted Victorian building with dedicated spaces for movement, meditation, tech, arts, and community. Atmosphere: warm, intentional, blend of heritage and modern practice.',
  0
)
on conflict (slug) do update set
  name = excluded.name,
  address = excluded.address,
  description_for_ai = excluded.description_for_ai,
  updated_at = now();
