create table if not exists public.wheel_company_settings (
 singleton boolean primary key default true check(singleton),
 legal_name text not null default '', trading_name text not null default '', registered_address text not null default '',
 country text not null default 'China', business_registration_no text not null default '', tax_id text not null default '',
 contact_email text not null default '', contact_phone text not null default '',
 bank_beneficiary text not null default '', bank_name text not null default '', bank_address text not null default '',
 bank_account_no text not null default '', bank_swift text not null default '', bank_iban text not null default '',
 updated_by uuid references auth.users(id) on delete set null, updated_at timestamptz not null default now()
);
alter table public.wheel_company_settings enable row level security;
grant select,insert,update on public.wheel_company_settings to authenticated;
create policy wheel_company_settings_staff_read on public.wheel_company_settings for select to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));
create policy wheel_company_settings_admin_write on public.wheel_company_settings for all to authenticated
using ((select auth.jwt()->'app_metadata'->>'role')='admin')
with check ((select auth.jwt()->'app_metadata'->>'role')='admin');

create table if not exists public.wheel_proforma_invoices (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.wheel_orders(id) on delete restrict,
 pi_number text not null unique, revision integer not null default 1 check(revision>0),
 status text not null default 'draft' check(status in ('draft','issued','void')),
 issue_date date not null default current_date, due_date date,
 currency char(3) not null, items jsonb not null check(jsonb_typeof(items)='array' and jsonb_array_length(items) between 1 and 30),
 subtotal numeric(14,2) not null check(subtotal>=0), shipping_amount numeric(14,2) not null check(shipping_amount>=0),
 total_amount numeric(14,2) not null check(total_amount>=0), incoterm text not null default '', named_place text not null default '',
 payment_terms text not null default '', delivery_estimate text not null default '',
 seller_snapshot jsonb not null default '{}'::jsonb, buyer_snapshot jsonb not null default '{}'::jsonb,
 bank_snapshot jsonb not null default '{}'::jsonb, country_of_origin text not null default 'China',
 hs_code text not null default '', packing_details text not null default '', port_of_loading text not null default '',
 destination_port text not null default '', customer_notes text not null default '',
 created_by uuid not null references auth.users(id) on delete restrict, issued_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(order_id,revision)
);
create index if not exists wheel_pi_order_idx on public.wheel_proforma_invoices(order_id,created_at desc);
alter table public.wheel_proforma_invoices enable row level security;
grant select,insert on public.wheel_proforma_invoices to authenticated;
grant update(status,issued_at,updated_at,due_date,hs_code,packing_details,port_of_loading,destination_port,country_of_origin) on public.wheel_proforma_invoices to authenticated;
create policy wheel_pi_select_own_or_staff on public.wheel_proforma_invoices for select to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin') or (status='issued' and exists(select 1 from public.wheel_orders o where o.id=order_id and o.customer_user_id=(select auth.uid()))));
create policy wheel_pi_staff_insert on public.wheel_proforma_invoices for insert to authenticated
with check ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin') and created_by=(select auth.uid()));
create policy wheel_pi_staff_update on public.wheel_proforma_invoices for update to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin'))
with check ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));

create or replace function public.snapshot_order_to_pi()
returns trigger language plpgsql security invoker set search_path=public as $$
declare o public.wheel_orders%rowtype; e public.wheel_enquiries%rowtype; c public.wheel_company_settings%rowtype;
begin
 select * into o from public.wheel_orders where id=new.order_id;
 if not found then raise exception 'Sales order not found'; end if;
 if not exists(select 1 from public.wheel_company_settings where singleton=true) then raise exception 'Configure seller legal and bank details before issuing a proforma invoice'; end if;
 select * into e from public.wheel_enquiries where id=o.enquiry_id;
 select * into c from public.wheel_company_settings where singleton=true;
 new.currency:=o.currency; new.items:=o.items; new.subtotal:=o.subtotal; new.shipping_amount:=o.shipping_amount; new.total_amount:=o.total_amount;
 new.incoterm:=o.incoterm; new.named_place:=o.named_place; new.payment_terms:=o.payment_terms; new.delivery_estimate:=o.delivery_estimate;
 new.seller_snapshot:=jsonb_build_object('legal_name',c.legal_name,'trading_name',c.trading_name,'registered_address',c.registered_address,'country',c.country,'business_registration_no',c.business_registration_no,'tax_id',c.tax_id,'contact_email',c.contact_email,'contact_phone',c.contact_phone);
 new.bank_snapshot:=jsonb_build_object('beneficiary',c.bank_beneficiary,'bank_name',c.bank_name,'bank_address',c.bank_address,'account_no',c.bank_account_no,'swift',c.bank_swift,'iban',c.bank_iban);
 new.buyer_snapshot:=jsonb_build_object('name',e.customer_name,'email',e.customer_email,'configuration',e.configuration);
 new.created_by:=auth.uid(); new.updated_at:=now(); return new;
end; $$;
drop trigger if exists wheel_pi_snapshot_order on public.wheel_proforma_invoices;
create trigger wheel_pi_snapshot_order before insert on public.wheel_proforma_invoices for each row execute function public.snapshot_order_to_pi();
revoke all on function public.snapshot_order_to_pi() from public,anon,authenticated;

create or replace function public.sync_pi_issue_to_order()
returns trigger language plpgsql security invoker set search_path=public as $$
begin
 if new.status='issued' and old.status is distinct from 'issued' then
  new.issued_at:=coalesce(new.issued_at,now()); new.updated_at:=now();
  update public.wheel_orders set status='pi_issued' where id=new.order_id and status='order_confirmed';
 end if;
 return new;
end; $$;
drop trigger if exists wheel_pi_issue_order_status on public.wheel_proforma_invoices;
create trigger wheel_pi_issue_order_status before update of status on public.wheel_proforma_invoices for each row execute function public.sync_pi_issue_to_order();
revoke all on function public.sync_pi_issue_to_order() from public,anon,authenticated;

alter table public.wheel_orders drop constraint if exists wheel_orders_status_check;
alter table public.wheel_orders add constraint wheel_orders_status_check check(status in ('order_confirmed','pi_issued','awaiting_payment','deposit_received','partially_paid','payment_received','in_production','quality_inspection','ready_to_ship','shipped','delivered','completed','cancelled'));

create table if not exists public.wheel_order_payments (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.wheel_orders(id) on delete restrict,
 payment_stage text not null default 'deposit' check(payment_stage in ('deposit','balance','full','other')),
 amount numeric(14,2) not null check(amount>0), currency char(3) not null, payment_reference text not null default '',
 proof_path text not null, customer_note text not null default '' check(char_length(customer_note)<=2000),
 status text not null default 'submitted' check(status in ('submitted','verified','rejected')),
 review_message text not null default '' check(char_length(review_message)<=2000),
 verified_by uuid references auth.users(id) on delete set null, verified_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists wheel_order_payments_order_idx on public.wheel_order_payments(order_id,created_at desc);
alter table public.wheel_order_payments enable row level security;
grant select,insert on public.wheel_order_payments to authenticated;
grant update(status,review_message,verified_by,verified_at,updated_at) on public.wheel_order_payments to authenticated;
create policy wheel_order_payments_select_own_or_staff on public.wheel_order_payments for select to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin') or exists(select 1 from public.wheel_orders o where o.id=order_id and o.customer_user_id=(select auth.uid())));
create policy wheel_order_payments_customer_insert on public.wheel_order_payments for insert to authenticated
with check(status='submitted' and verified_by is null and verified_at is null and exists(select 1 from public.wheel_orders o where o.id=order_id and o.customer_user_id=(select auth.uid()) and o.currency=currency) and proof_path like order_id::text||'/'||(select auth.uid())::text||'/%');
create policy wheel_order_payments_staff_update on public.wheel_order_payments for update to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin'))
with check ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));

create or replace function public.sync_verified_payment_to_order()
returns trigger language plpgsql security invoker set search_path=public as $$
declare paid numeric(14,2); total numeric(14,2); oid uuid;
begin
 oid:=coalesce(new.order_id,old.order_id);
 select coalesce(sum(amount),0) into paid from public.wheel_order_payments where order_id=oid and status='verified';
 select total_amount into total from public.wheel_orders where id=oid;
 if paid>=total then update public.wheel_orders set status='payment_received' where id=oid and status in ('pi_issued','awaiting_payment','deposit_received','partially_paid');
 elsif paid>0 then update public.wheel_orders set status='partially_paid' where id=oid and status in ('pi_issued','awaiting_payment','deposit_received'); end if;
 return coalesce(new,old);
end; $$;
drop trigger if exists wheel_payment_verified_order_sync on public.wheel_order_payments;
create trigger wheel_payment_verified_order_sync after insert or update of status on public.wheel_order_payments for each row execute function public.sync_verified_payment_to_order();
revoke all on function public.sync_verified_payment_to_order() from public,anon,authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('order-payment-proofs','order-payment-proofs',false,10485760,array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists order_payment_proof_customer_upload on storage.objects;
create policy order_payment_proof_customer_upload on storage.objects for insert to authenticated
with check(bucket_id='order-payment-proofs' and (storage.foldername(name))[1] in (select id::text from public.wheel_orders where customer_user_id=(select auth.uid())) and (storage.foldername(name))[2]=(select auth.uid())::text);
drop policy if exists order_payment_proof_customer_read on storage.objects;
create policy order_payment_proof_customer_read on storage.objects for select to authenticated
using(bucket_id='order-payment-proofs' and ((storage.foldername(name))[2]=(select auth.uid())::text or (select auth.jwt()->'app_metadata'->>'role') in ('staff','admin')));
