-- Add participant count for group journeys
alter table public.journeys
  add column if not exists participant_count integer not null default 1;

comment on column public.journeys.participant_count is 'Number of participants (for group journeys). Solo = 1.';
