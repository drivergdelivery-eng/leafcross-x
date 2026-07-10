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
