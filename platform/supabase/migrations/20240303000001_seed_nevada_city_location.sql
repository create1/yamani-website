-- Seed Nevada City as a Journey location so the location dropdown has a default option.
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
