drop policy if exists wheel_company_settings_admin_write on public.wheel_company_settings;
create policy wheel_company_settings_admin_insert on public.wheel_company_settings for insert to authenticated
with check ((select auth.jwt()->'app_metadata'->>'role')='admin');
create policy wheel_company_settings_admin_update on public.wheel_company_settings for update to authenticated
using ((select auth.jwt()->'app_metadata'->>'role')='admin')
with check ((select auth.jwt()->'app_metadata'->>'role')='admin');
create index if not exists wheel_company_settings_updated_by_idx on public.wheel_company_settings(updated_by);
create index if not exists wheel_order_payments_verified_by_idx on public.wheel_order_payments(verified_by);
create index if not exists wheel_pi_created_by_idx on public.wheel_proforma_invoices(created_by);
