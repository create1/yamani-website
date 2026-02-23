-- ═══════════════════════════════════════════════════════════════
-- APOTHEOS PLATFORM — Supabase PostgreSQL Schema
-- Run this in your Supabase SQL editor to set up all tables.
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── USERS ────────────────────────────────────────────────────
-- Extends Supabase auth.users with profile data
create table if not exists public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  name          text not null default '',
  membership_tier text not null default 'community'
    check (membership_tier in ('community','seeker','founder','visionary')),
  role          text not null default 'student'
    check (role in ('student','instructor','admin')),
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.users enable row level security;
create policy "Users can read own profile"   on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Admins read all users"        on public.users for select using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- ─── COURSES ──────────────────────────────────────────────────
create table if not exists public.courses (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text not null default '',
  track         text not null check (track in ('wellness','ai','founder','community')),
  duration_min  integer not null default 120,
  rotation_week integer,           -- null = every week; 0-5 = specific rotation week
  day_of_week   text not null,     -- 'mon','tue','wed','thu','fri','sat','sun'
  start_time    text not null,     -- '09:00'
  space         text not null default '',
  instructor    text not null default '',
  capacity      integer not null default 20,
  objectives    text[] not null default '{}',
  created_at    timestamptz not null default now()
);

alter table public.courses enable row level security;
create policy "Anyone can read courses" on public.courses for select using (true);
create policy "Admins can manage courses" on public.courses for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','instructor'))
);

-- ─── SESSIONS ─────────────────────────────────────────────────
create table if not exists public.sessions (
  id              uuid primary key default gen_random_uuid(),
  course_id       uuid not null references public.courses(id) on delete cascade,
  scheduled_date  date not null,
  daily_room_url  text,
  daily_room_name text,
  recording_url   text,
  status          text not null default 'scheduled'
    check (status in ('scheduled','live','ended','cancelled')),
  created_at      timestamptz not null default now()
);

alter table public.sessions enable row level security;
create policy "Anyone can read sessions" on public.sessions for select using (true);
create policy "Instructors/admins manage sessions" on public.sessions for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','instructor'))
);

-- ─── ENROLLMENTS ──────────────────────────────────────────────
create table if not exists public.enrollments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  course_id   uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table public.enrollments enable row level security;
create policy "Users read own enrollments" on public.enrollments for select using (auth.uid() = user_id);
create policy "Users enroll themselves"    on public.enrollments for insert with check (auth.uid() = user_id);
create policy "Users unenroll themselves"  on public.enrollments for delete using (auth.uid() = user_id);
create policy "Admins read all enrollments" on public.enrollments for select using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- ─── MESSAGES ─────────────────────────────────────────────────
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references public.sessions(id) on delete cascade,
  user_id         uuid not null references public.users(id) on delete cascade,
  body            text not null,
  attendance_type text not null default 'remote' check (attendance_type in ('remote','in-room')),
  created_at      timestamptz not null default now()
);

alter table public.messages enable row level security;
create policy "Enrolled users read session messages" on public.messages for select using (
  exists (
    select 1 from public.enrollments e
    join public.sessions s on s.course_id = e.course_id
    where e.user_id = auth.uid() and s.id = messages.session_id
  )
);
create policy "Enrolled users send messages" on public.messages for insert with check (
  auth.uid() = user_id and exists (
    select 1 from public.enrollments e
    join public.sessions s on s.course_id = e.course_id
    where e.user_id = auth.uid() and s.id = messages.session_id
  )
);

-- Enable realtime for messages table
alter publication supabase_realtime add table public.messages;

-- ─── MATERIALS ────────────────────────────────────────────────
create table if not exists public.materials (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references public.courses(id) on delete cascade,
  session_id   uuid references public.sessions(id) on delete set null,
  title        text not null,
  type         text not null check (type in ('slide','pdf','link','video')),
  storage_path text not null,
  created_at   timestamptz not null default now()
);

alter table public.materials enable row level security;
create policy "Enrolled users read materials" on public.materials for select using (
  exists (select 1 from public.enrollments e where e.user_id = auth.uid() and e.course_id = materials.course_id)
);
create policy "Instructors/admins manage materials" on public.materials for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','instructor'))
);

-- ─── TRIGGER: auto-create user profile on signup ──────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
