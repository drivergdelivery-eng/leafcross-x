-- Run this in Supabase Dashboard → SQL Editor
create table if not exists site_settings (
  key  text primary key default 'main',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table site_settings enable row level security;

-- Anyone can read (public pages need the content)
create policy "Public read site_settings"
  on site_settings for select using (true);

-- Only service role can write (admin API uses service role key)
create policy "Service role write site_settings"
  on site_settings for all using (auth.role() = 'service_role');
