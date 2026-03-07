-- Index for dashboard "My Journeys" list: list journeys by host, newest first
create index if not exists idx_journeys_host_created_at
  on public.journeys(host_id, created_at desc);
