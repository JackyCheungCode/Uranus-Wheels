drop policy if exists wheel_orders_staff_read on public.wheel_orders;
drop policy if exists wheel_orders_customer_read on public.wheel_orders;
create policy wheel_orders_select_own_or_staff on public.wheel_orders for select to authenticated
using (customer_user_id=(select auth.uid()) or (select auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));
drop policy if exists wheel_orders_staff_insert_accepted_quote on public.wheel_orders;
create policy wheel_orders_staff_insert_accepted_quote on public.wheel_orders for insert to authenticated
with check (
 (select auth.jwt()->'app_metadata'->>'role') in ('staff','admin')
 and created_by=(select auth.uid())
 and exists (select 1 from public.wheel_quotes q join public.wheel_enquiries e on e.id=q.enquiry_id
   where q.id=quote_id and q.status='accepted' and e.user_id=customer_user_id)
);
drop policy if exists wheel_orders_staff_update_status on public.wheel_orders;
create policy wheel_orders_staff_update_status on public.wheel_orders for update to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin'))
with check ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));
drop policy if exists wheel_order_events_staff_read on public.wheel_order_events;
drop policy if exists wheel_order_events_customer_read on public.wheel_order_events;
create policy wheel_order_events_select_own_or_staff on public.wheel_order_events for select to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin') or (
 visibility='customer' and exists (select 1 from public.wheel_orders o where o.id=order_id and o.customer_user_id=(select auth.uid()))
));
drop policy if exists wheel_order_events_staff_insert on public.wheel_order_events;
create policy wheel_order_events_staff_insert on public.wheel_order_events for insert to authenticated
with check (
 (select auth.jwt()->'app_metadata'->>'role') in ('staff','admin')
 and created_by=(select auth.uid())
 and exists (select 1 from public.wheel_orders o where o.id=order_id)
);
create index if not exists wheel_orders_enquiry_idx on public.wheel_orders(enquiry_id);
create index if not exists wheel_orders_created_by_idx on public.wheel_orders(created_by);
create index if not exists wheel_order_events_created_by_idx on public.wheel_order_events(created_by);
