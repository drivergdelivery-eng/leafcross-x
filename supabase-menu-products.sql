-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)

create table if not exists menu_products (
  slug           text primary key,
  name           text not null,
  type           text not null default 'Sativa',
  brand          text,
  image          text default '',
  images         jsonb default '[]'::jsonb,
  sku            text,
  price          numeric not null default 0,
  price_per_case numeric,
  unit           text default '3.5g',
  units_per_case integer,
  inventory      integer default 0,
  max_order_qty  integer,
  description    text,
  package_size   text,
  status         text default 'Available',
  terpene1       text,
  terpene2       text,
  terpene3       text,
  thc            text,
  cbd            text,
  cbg            text,
  active         boolean default true,
  sort_order     integer default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- Allow public reads (needed for retailer portal)
alter table menu_products enable row level security;
create policy "Public read menu_products" on menu_products for select using (true);
create policy "Service role all menu_products" on menu_products for all using (auth.role() = 'service_role');
