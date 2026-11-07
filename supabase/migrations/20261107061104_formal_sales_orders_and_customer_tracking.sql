create table if not exists public.wheel_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  enquiry_id uuid not null references public.wheel_enquiries(id) on delete restrict,
  quote_id uuid not null unique references public.wheel_quotes(id) on delete restrict,
  customer_user_id uuid not null references auth.users(id) on delete restrict,
  status text not null default 'order_confirmed'
    check (status in ('order_confirmed','pi_issued','awaiting_payment','payment_received','in_production','quality_inspection','ready_to_ship','shipped','delivered','completed','cancelled')),
  currency char(3) not null,
  items jsonb not null check (jsonb_typeof(items)='array' and jsonb_array_length(items) between 1 and 30),
  subtotal numeric(14,2) not null check (subtotal >= 0),
  shipping_amount numeric(14,2) not null check (shipping_amount >= 0),
  total_amount numeric(14,2) not null check (total_amount >= 0),
  incoterm text not null default '',
  named_place text not null default '',
  payment_terms text not null default '',
  delivery_estimate text not null default '',
  valid_until date,
  customer_notes text not null default '',
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists wheel_orders_customer_created_idx on public.wheel_orders(customer_user_id,created_at desc);
create index if not exists wheel_orders_status_created_idx on public.wheel_orders(status,created_at desc);
alter table public.wheel_orders enable row level security;
grant select,insert on public.wheel_orders to authenticated;
grant update(status,updated_at) on public.wheel_orders to authenticated;
create policy wheel_orders_staff_read on public.wheel_orders for select to authenticated
using ((auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));
create policy wheel_orders_customer_read on public.wheel_orders for select to authenticated
using (customer_user_id=(select auth.uid()));
create policy wheel_orders_staff_insert_accepted_quote on public.wheel_orders for insert to authenticated
with check (
 (auth.jwt()->'app_metadata'->>'role') in ('staff','admin')
 and created_by=(select auth.uid())
 and exists (
   select 1 from public.wheel_quotes q
   join public.wheel_enquiries e on e.id=q.enquiry_id
   where q.id=quote_id and q.status='accepted'
     and e.user_id=customer_user_id
 )
);
create policy wheel_orders_staff_update_status on public.wheel_orders for update to authenticated
using ((auth.jwt()->'app_metadata'->>'role') in ('staff','admin'))
with check ((auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));

create table if not exists public.wheel_order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.wheel_orders(id) on delete restrict,
  status text not null check (status in ('order_confirmed','pi_issued','awaiting_payment','payment_received','in_production','quality_inspection','ready_to_ship','shipped','delivered','completed','cancelled')),
  visibility text not null default 'customer' check (visibility in ('customer','staff')),
  message text not null default '' check (char_length(message) <= 3000),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists wheel_order_events_timeline_idx on public.wheel_order_events(order_id,created_at asc);
alter table public.wheel_order_events enable row level security;
grant select,insert on public.wheel_order_events to authenticated;
create policy wheel_order_events_staff_read on public.wheel_order_events for select to authenticated
using ((auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));
create policy wheel_order_events_customer_read on public.wheel_order_events for select to authenticated
using (visibility='customer' and exists (
 select 1 from public.wheel_orders o where o.id=order_id and o.customer_user_id=(select auth.uid())
));
create policy wheel_order_events_staff_insert on public.wheel_order_events for insert to authenticated
with check (
 (auth.jwt()->'app_metadata'->>'role') in ('staff','admin')
 and created_by=(select auth.uid())
 and exists (select 1 from public.wheel_orders o where o.id=order_id)
);

create or replace function public.snapshot_accepted_quote_to_order()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  q public.wheel_quotes%rowtype;
  e public.wheel_enquiries%rowtype;
begin
  select * into q from public.wheel_quotes where id=new.quote_id and status='accepted';
  if not found then
    raise exception 'Only an accepted quotation can be converted to an order';
  end if;
  select * into e from public.wheel_enquiries where id=q.enquiry_id;
  if not found or e.user_id is null then
    raise exception 'The accepted quotation must belong to a registered customer account';
  end if;
  new.enquiry_id := q.enquiry_id;
  new.customer_user_id := e.user_id;
  new.currency := q.currency;
  new.items := q.items;
  new.subtotal := q.subtotal;
  new.shipping_amount := q.shipping_amount;
  new.total_amount := q.total_amount;
  new.incoterm := q.incoterm;
  new.named_place := q.named_place;
  new.payment_terms := q.payment_terms;
  new.delivery_estimate := q.delivery_estimate;
  new.valid_until := q.valid_until;
  new.customer_notes := q.customer_notes;
  new.status := 'order_confirmed';
  new.created_by := auth.uid();
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists wheel_order_snapshot_accepted_quote on public.wheel_orders;
create trigger wheel_order_snapshot_accepted_quote
before insert on public.wheel_orders
for each row execute function public.snapshot_accepted_quote_to_order();
revoke all on function public.snapshot_accepted_quote_to_order() from public;
revoke all on function public.snapshot_accepted_quote_to_order() from anon;
revoke all on function public.snapshot_accepted_quote_to_order() from authenticated;

create or replace function public.record_wheel_order_creation()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  insert into public.wheel_order_events(order_id,status,visibility,message,created_by)
  values(new.id,new.status,'customer','Your sales order has been created.',new.created_by);
  return new;
end;
$$;
drop trigger if exists wheel_order_created_event on public.wheel_orders;
create trigger wheel_order_created_event
after insert on public.wheel_orders
for each row execute function public.record_wheel_order_creation();
revoke all on function public.record_wheel_order_creation() from public;
revoke all on function public.record_wheel_order_creation() from anon;
revoke all on function public.record_wheel_order_creation() from authenticated;

create or replace function public.record_wheel_order_status_change()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  status_label text;
begin
  if new.status is distinct from old.status then
    status_label := case new.status
      when 'order_confirmed' then 'Order confirmed'
      when 'pi_issued' then 'Proforma invoice issued'
      when 'awaiting_payment' then 'Awaiting payment'
      when 'payment_received' then 'Payment received'
      when 'in_production' then 'In production'
      when 'quality_inspection' then 'Quality inspection'
      when 'ready_to_ship' then 'Ready to ship'
      when 'shipped' then 'Shipped'
      when 'delivered' then 'Delivered'
      when 'completed' then 'Completed'
      when 'cancelled' then 'Cancelled'
      else new.status
    end;
    insert into public.wheel_order_events(order_id,status,visibility,message,created_by)
    values(new.id,new.status,'customer',status_label,auth.uid());
    new.updated_at := now();
  end if;
  return new;
end;
$$;
drop trigger if exists wheel_order_status_event on public.wheel_orders;
create trigger wheel_order_status_event
before update of status on public.wheel_orders
for each row execute function public.record_wheel_order_status_change();
revoke all on function public.record_wheel_order_status_change() from public;
revoke all on function public.record_wheel_order_status_change() from anon;
revoke all on function public.record_wheel_order_status_change() from authenticated;
