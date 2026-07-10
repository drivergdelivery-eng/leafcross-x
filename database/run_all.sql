create type user_role as enum ('admin', 'manager', 'retailer');
create type profile_status as enum ('pending', 'active', 'suspended');
create type application_status as enum ('submitted', 'under_review', 'approved', 'rejected');
create type retailer_status as enum ('active', 'suspended', 'archived', 'expired_license');
create type license_status as enum ('valid', 'expiring_soon', 'expired', 'pending_review');
create type order_status as enum ('submitted', 'awaiting_payment', 'payment_received', 'processing', 'shipped', 'completed', 'cancelled');
create type payment_status as enum ('unpaid', 'payment_received');
create type invoice_status as enum ('generated', 'sent', 'void');
create type email_status as enum ('queued', 'sent', 'failed');
create type subscription_status as enum ('active', 'paused', 'cancelled');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'retailer',
  email text not null,
  full_name text,
  phone text,
  status profile_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table retailer_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  business_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  business_address text not null,
  city text,
  province text,
  postal_code text,
  country text default 'Canada',
  business_license_number text not null,
  license_expiry_date date not null,
  license_document_path text,
  website text,
  notes text,
  status application_status not null default 'submitted',
  reviewed_by uuid references profiles(id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table retailers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  application_id uuid references retailer_applications(id) on delete set null,
  business_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  billing_address jsonb not null default '{}'::jsonb,
  shipping_address jsonb not null default '{}'::jsonb,
  business_license_number text not null,
  license_expiry_date date not null,
  license_status license_status not null default 'valid',
  license_reminder_sent_at timestamptz,
  status retailer_status not null default 'active',
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_path text,
  is_active boolean not null default true,
  sort_order int not null default 0
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  is_active boolean not null default true,
  sort_order int not null default 0
);

create table products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references brands(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  sku text unique not null,
  description text,
  strain_type text,
  thc text,
  cbd text,
  size text,
  unit text,
  case_quantity int,
  price numeric(10,2) not null default 0,
  image_path text,
  is_active boolean not null default true,
  is_private boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table carts (
  id uuid primary key default gen_random_uuid(),
  retailer_id uuid not null references retailers(id) on delete cascade,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payment_instructions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  instructions text not null,
  is_default boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  retailer_id uuid not null references retailers(id) on delete restrict,
  status order_status not null default 'awaiting_payment',
  payment_status payment_status not null default 'unpaid',
  subtotal numeric(10,2) not null,
  gst_rate numeric(5,4) not null default 0.05,
  gst_total numeric(10,2) not null,
  shipping_total numeric(10,2) not null default 28.99,
  grand_total numeric(10,2) not null,
  billing_address jsonb not null default '{}'::jsonb,
  shipping_address jsonb not null default '{}'::jsonb,
  retailer_notes text,
  admin_notes text,
  payment_instructions_id uuid references payment_instructions(id) on delete set null,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  sku text not null,
  product_name text not null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  line_total numeric(10,2) not null
);

create table invoice_sequences (
  id int primary key default 1 check (id = 1),
  last_value bigint not null default 0
);

insert into invoice_sequences (id, last_value) values (1, 0);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  invoice_number text unique not null,
  invoice_sequence bigint not null unique,
  invoice_year int not null,
  pdf_path text,
  status invoice_status not null default 'generated',
  generated_at timestamptz not null default now(),
  sent_at timestamptz
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  retailer_id uuid not null references retailers(id) on delete cascade,
  status subscription_status not null default 'active',
  cadence text not null default 'monthly',
  notes text,
  next_review_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table email_logs (
  id uuid primary key default gen_random_uuid(),
  recipient text not null,
  template text not null,
  related_type text,
  related_id uuid,
  status email_status not null default 'queued',
  provider_message_id text,
  error text,
  created_at timestamptz not null default now()
);

create table site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into site_settings (key, value) values
('allow_manager_application_approval', 'false'::jsonb),
('payment_instructions', '{"e_transfer":"Send E-Transfer payments to info@leafcross.com.","bank_wire":"Bank wire details will be provided by admin.","direct_deposit":"Direct deposit details will be provided by admin.","policy":"Payment must be received before shipment."}'::jsonb),
('order_financials', '{"gst_rate":0.05,"flat_shipping":28.99}'::jsonb);

alter table profiles enable row level security;
alter table retailer_applications enable row level security;
alter table retailers enable row level security;
alter table brands enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table invoices enable row level security;
alter table subscriptions enable row level security;
alter table payment_instructions enable row level security;
alter table email_logs enable row level security;
alter table site_settings enable row level security;
create or replace function public.current_user_role()
returns user_role
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin'
$$;

create or replace function public.is_manager_or_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select public.current_user_role() in ('admin', 'manager')
$$;

create policy "profiles own profile read"
on profiles for select
using (id = auth.uid() or public.is_manager_or_admin());

create policy "profiles admin manage"
on profiles for all
using (public.is_admin())
with check (public.is_admin());

create policy "applications public insert"
on retailer_applications for insert
with check (true);

create policy "applications internal read"
on retailer_applications for select
using (public.is_manager_or_admin() or user_id = auth.uid());

create policy "applications admin update"
on retailer_applications for update
using (
  public.is_admin()
  or (
    public.current_user_role() = 'manager'
    and coalesce((select value::boolean from site_settings where key = 'allow_manager_application_approval'), false)
  )
)
with check (
  public.is_admin()
  or (
    public.current_user_role() = 'manager'
    and coalesce((select value::boolean from site_settings where key = 'allow_manager_application_approval'), false)
  )
);

create policy "retailers own or internal read"
on retailers for select
using (user_id = auth.uid() or public.is_manager_or_admin());

create policy "retailers internal manage"
on retailers for all
using (public.is_manager_or_admin())
with check (public.is_manager_or_admin());

create policy "catalog public brands"
on brands for select
using (is_active = true or public.is_manager_or_admin());

create policy "catalog public categories"
on categories for select
using (is_active = true or public.is_manager_or_admin());

create policy "products approved retailer read"
on products for select
using (
  public.is_manager_or_admin()
  or exists (
    select 1 from retailers
    where retailers.user_id = auth.uid()
      and retailers.status = 'active'
      and retailers.license_status = 'valid'
  )
);

create policy "products internal manage"
on products for all
using (public.is_manager_or_admin())
with check (public.is_manager_or_admin());

create policy "orders own or internal read"
on orders for select
using (
  public.is_manager_or_admin()
  or exists (
    select 1 from retailers
    where retailers.id = orders.retailer_id
      and retailers.user_id = auth.uid()
  )
);

create policy "orders internal manage"
on orders for all
using (public.is_manager_or_admin())
with check (public.is_manager_or_admin());

create policy "order items own or internal read"
on order_items for select
using (
  public.is_manager_or_admin()
  or exists (
    select 1
    from orders
    join retailers on retailers.id = orders.retailer_id
    where orders.id = order_items.order_id
      and retailers.user_id = auth.uid()
  )
);

create policy "invoices own or internal read"
on invoices for select
using (
  public.is_manager_or_admin()
  or exists (
    select 1
    from orders
    join retailers on retailers.id = orders.retailer_id
    where orders.id = invoices.order_id
      and retailers.user_id = auth.uid()
  )
);

create policy "subscriptions own or internal read"
on subscriptions for select
using (
  public.is_manager_or_admin()
  or exists (
    select 1 from retailers
    where retailers.id = subscriptions.retailer_id
      and retailers.user_id = auth.uid()
  )
);

create policy "subscriptions internal manage"
on subscriptions for all
using (public.is_manager_or_admin())
with check (public.is_manager_or_admin());

create policy "settings admin read"
on site_settings for select
using (public.is_manager_or_admin());

create policy "settings admin write"
on site_settings for all
using (public.is_admin())
with check (public.is_admin());
-- Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, status)
  values (new.id, new.email, 'retailer', 'pending')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set rahuls.joshi@icloud.com as admin
insert into public.profiles (id, email, role, status)
select id, email, 'admin', 'active'
from auth.users
where email = 'rahuls.joshi@icloud.com'
on conflict (id) do update set role = 'admin', status = 'active';
