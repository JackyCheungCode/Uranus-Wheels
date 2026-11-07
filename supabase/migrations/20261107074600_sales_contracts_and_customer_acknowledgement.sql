create table if not exists public.wheel_sales_contracts (
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references public.wheel_orders(id) on delete restrict,
 contract_number text not null unique,
 revision integer not null default 1 check(revision>0),
 status text not null default 'draft' check(status in ('draft','issued','accepted','declined','void')),
 issue_date date not null default current_date,
 effective_date date,
 seller_snapshot jsonb not null default '{}'::jsonb,
 buyer_snapshot jsonb not null default '{}'::jsonb,
 order_snapshot jsonb not null default '{}'::jsonb,
 governing_law text not null default '', dispute_resolution text not null default '',
 arbitration_institution text not null default '', arbitration_seat text not null default '',
 contract_language text not null default '', warranty_period text not null default '',
 inspection_standard text not null default '', inspection_window text not null default '',
 claims_window text not null default '', force_majeure_clause text not null default '',
 cancellation_terms text not null default '', fitment_responsibility text not null default '',
 change_control text not null default '', packing_standard text not null default '',
 quality_standard text not null default '', additional_terms text not null default '',
 legal_reviewed_by uuid references auth.users(id) on delete set null,
 legal_reviewed_at timestamptz, created_by uuid not null references auth.users(id) on delete restrict,
 issued_at timestamptz, created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(), unique(order_id,revision)
);
create index if not exists wheel_sales_contracts_order_idx on public.wheel_sales_contracts(order_id,revision desc);
alter table public.wheel_sales_contracts enable row level security;
grant select,insert,update on public.wheel_sales_contracts to authenticated;
create policy wheel_sales_contracts_select_staff_or_customer on public.wheel_sales_contracts for select to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin') or
(status in ('issued','accepted','declined','void') and exists(select 1 from public.wheel_orders o where o.id=order_id and o.customer_user_id=(select auth.uid()))));
create policy wheel_sales_contracts_staff_insert on public.wheel_sales_contracts for insert to authenticated
with check ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin') and created_by=(select auth.uid()));
create policy wheel_sales_contracts_staff_update on public.wheel_sales_contracts for update to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin'))
with check ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));

create table if not exists public.wheel_sales_contract_responses (
 id uuid primary key default gen_random_uuid(),
 contract_id uuid not null references public.wheel_sales_contracts(id) on delete restrict,
 customer_user_id uuid not null references auth.users(id) on delete restrict,
 decision text not null check(decision in ('accepted','declined')),
 message text not null default '' check(char_length(message)<=3000),
 acknowledgement text not null default 'In-app response record; not a qualified electronic signature.',
 created_at timestamptz not null default now(), unique(contract_id,customer_user_id)
);
create index if not exists wheel_sales_contract_responses_contract_idx on public.wheel_sales_contract_responses(contract_id,created_at desc);
alter table public.wheel_sales_contract_responses enable row level security;
grant select,insert on public.wheel_sales_contract_responses to authenticated;
create policy wheel_sales_contract_responses_select_staff_or_owner on public.wheel_sales_contract_responses for select to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') in ('staff','admin') or customer_user_id=(select auth.uid()));
create policy wheel_sales_contract_responses_customer_insert on public.wheel_sales_contract_responses for insert to authenticated
with check (customer_user_id=(select auth.uid()) and exists(
 select 1 from public.wheel_sales_contracts c join public.wheel_orders o on o.id=c.order_id
 where c.id=contract_id and c.status='issued' and o.customer_user_id=(select auth.uid())
));

create or replace function public.snapshot_order_to_sales_contract()
returns trigger language plpgsql security invoker set search_path=public as $$
declare o public.wheel_orders%rowtype; c public.wheel_company_settings%rowtype; p public.wheel_proforma_invoices%rowtype;
begin
 select * into o from public.wheel_orders where id=new.order_id;
 if not found then raise exception 'Sales order not found'; end if;
 select * into p from public.wheel_proforma_invoices where order_id=o.id and status='issued' order by revision desc limit 1;
 if not found then raise exception 'Issue a proforma invoice before creating the sales contract'; end if;
 select * into c from public.wheel_company_settings where singleton=true;
 if not found or coalesce(c.legal_name,'')='' or coalesce(c.registered_address,'')='' then
  raise exception 'Complete seller legal identity before creating a sales contract';
 end if;
 new.seller_snapshot:=p.seller_snapshot; new.buyer_snapshot:=p.buyer_snapshot;
 new.order_snapshot:=jsonb_build_object('order_number',o.order_number,'currency',o.currency,'items',o.items,
 'subtotal',o.subtotal,'shipping_amount',o.shipping_amount,'total_amount',o.total_amount,'incoterm',o.incoterm,
 'named_place',o.named_place,'payment_terms',o.payment_terms,'delivery_estimate',o.delivery_estimate,
 'pi_number',p.pi_number,'pi_revision',p.revision,'country_of_origin',p.country_of_origin,'hs_code',p.hs_code,
 'packing_details',p.packing_details,'port_of_loading',p.port_of_loading,'destination_port',p.destination_port);
 new.created_by:=auth.uid(); new.updated_at:=now(); return new;
end; $$;
drop trigger if exists wheel_sales_contract_snapshot on public.wheel_sales_contracts;
create trigger wheel_sales_contract_snapshot before insert on public.wheel_sales_contracts for each row execute function public.snapshot_order_to_sales_contract();
revoke all on function public.snapshot_order_to_sales_contract() from public,anon,authenticated;

create or replace function public.guard_sales_contract_lifecycle()
returns trigger language plpgsql security invoker set search_path=public as $$
declare role_name text;
begin
 role_name:=coalesce(auth.jwt()->'app_metadata'->>'role','');
 if tg_op='UPDATE' then
  if (new.governing_law,new.dispute_resolution,new.arbitration_institution,new.arbitration_seat,new.contract_language,
      new.warranty_period,new.inspection_standard,new.inspection_window,new.claims_window,new.force_majeure_clause,
      new.cancellation_terms,new.fitment_responsibility,new.change_control,new.packing_standard,new.quality_standard,new.additional_terms)
     is distinct from
     (old.governing_law,old.dispute_resolution,old.arbitration_institution,old.arbitration_seat,old.contract_language,
      old.warranty_period,old.inspection_standard,old.inspection_window,old.claims_window,old.force_majeure_clause,
      old.cancellation_terms,old.fitment_responsibility,old.change_control,old.packing_standard,old.quality_standard,old.additional_terms) then
    new.legal_reviewed_by:=null; new.legal_reviewed_at:=null;
    if new.status='issued' then raise exception 'Contract terms changed; legal review is required again before issue'; end if;
  end if;
  if (new.legal_reviewed_by,new.legal_reviewed_at) is distinct from (old.legal_reviewed_by,old.legal_reviewed_at) and role_name<>'admin' then
   raise exception 'Only an admin can record legal review';
  end if;
  if new.status='issued' and old.status is distinct from 'issued' then
   if new.legal_reviewed_by is null or new.legal_reviewed_at is null then raise exception 'Admin legal review is required before issuing this contract'; end if;
   if new.governing_law='' or new.dispute_resolution='' or new.arbitration_institution='' or new.arbitration_seat=''
    or new.contract_language='' or new.warranty_period='' or new.inspection_standard='' or new.inspection_window=''
    or new.claims_window='' or new.force_majeure_clause='' or new.cancellation_terms=''
    or new.fitment_responsibility='' or new.change_control='' or new.packing_standard='' or new.quality_standard='' then
    raise exception 'Complete every legal and commercial clause before issuing this contract';
   end if;
   if coalesce(new.seller_snapshot->>'legal_name','')='' or coalesce(new.seller_snapshot->>'registered_address','')=''
    or coalesce(new.buyer_snapshot->>'email','')='' then raise exception 'Seller and buyer legal snapshots are incomplete'; end if;
   new.issued_at:=coalesce(new.issued_at,now());
  end if;
  new.updated_at:=now();
 end if;
 return new;
end; $$;
drop trigger if exists wheel_sales_contract_guard on public.wheel_sales_contracts;
create trigger wheel_sales_contract_guard before update on public.wheel_sales_contracts for each row execute function public.guard_sales_contract_lifecycle();
revoke all on function public.guard_sales_contract_lifecycle() from public,anon,authenticated;

create or replace function public.apply_sales_contract_customer_response()
returns trigger language plpgsql security definer set search_path=public as $$
declare c public.wheel_sales_contracts%rowtype;
begin
 if auth.uid() is null or new.customer_user_id<>auth.uid() then raise exception 'Customer identity mismatch'; end if;
 select * into c from public.wheel_sales_contracts where id=new.contract_id for update;
 if not found or c.status<>'issued' then raise exception 'Only an issued contract can receive a customer response'; end if;
 if not exists(select 1 from public.wheel_orders o where o.id=c.order_id and o.customer_user_id=auth.uid()) then raise exception 'Contract does not belong to this customer'; end if;
 update public.wheel_sales_contracts set status=new.decision,updated_at=now() where id=c.id and status='issued';
 if not found then raise exception 'Contract has already received a response'; end if;
 return new;
end; $$;
drop trigger if exists wheel_sales_contract_response_apply on public.wheel_sales_contract_responses;
create trigger wheel_sales_contract_response_apply after insert on public.wheel_sales_contract_responses for each row execute function public.apply_sales_contract_customer_response();
revoke all on function public.apply_sales_contract_customer_response() from public,anon,authenticated;
