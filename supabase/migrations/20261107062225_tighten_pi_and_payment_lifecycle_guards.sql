drop trigger if exists wheel_payment_submission_order_status on public.wheel_order_payments;
drop function if exists public.note_payment_submission();
create or replace function public.snapshot_order_to_pi()
returns trigger language plpgsql security invoker set search_path=public as $$
declare o public.wheel_orders%rowtype; e public.wheel_enquiries%rowtype; c public.wheel_company_settings%rowtype;
begin
 select * into o from public.wheel_orders where id=new.order_id;
 if not found then raise exception 'Sales order not found'; end if;
 if not exists(select 1 from public.wheel_company_settings where singleton=true) then raise exception 'Configure seller legal and bank details before creating a proforma invoice'; end if;
 select * into e from public.wheel_enquiries where id=o.enquiry_id;
 select * into c from public.wheel_company_settings where singleton=true;
 new.currency:=o.currency; new.items:=o.items; new.subtotal:=o.subtotal; new.shipping_amount:=o.shipping_amount; new.total_amount:=o.total_amount;
 new.incoterm:=o.incoterm; new.named_place:=o.named_place; new.payment_terms:=o.payment_terms; new.delivery_estimate:=o.delivery_estimate;
 new.seller_snapshot:=jsonb_build_object('legal_name',c.legal_name,'trading_name',c.trading_name,'registered_address',c.registered_address,'country',c.country,'business_registration_no',c.business_registration_no,'tax_id',c.tax_id,'contact_email',c.contact_email,'contact_phone',c.contact_phone);
 new.bank_snapshot:=jsonb_build_object('beneficiary',c.bank_beneficiary,'bank_name',c.bank_name,'bank_address',c.bank_address,'account_no',c.bank_account_no,'swift',c.bank_swift,'iban',c.bank_iban);
 new.buyer_snapshot:=jsonb_build_object('name',e.customer_name,'email',e.customer_email,'configuration',e.configuration);
 new.status:='draft'; new.issued_at:=null; new.created_by:=auth.uid(); new.updated_at:=now(); return new;
end; $$;
create or replace function public.prepare_customer_payment_submission()
returns trigger language plpgsql security invoker set search_path=public as $$
declare o public.wheel_orders%rowtype;
begin
 select * into o from public.wheel_orders where id=new.order_id and customer_user_id=auth.uid();
 if not found then raise exception 'Order not found for this customer'; end if;
 if new.currency<>o.currency then raise exception 'Payment currency must match the sales order'; end if;
 if new.amount>o.total_amount then raise exception 'Payment amount cannot exceed the sales order total'; end if;
 if not exists(select 1 from public.wheel_proforma_invoices where order_id=new.order_id and status='issued') then raise exception 'A proforma invoice must be issued before submitting payment proof'; end if;
 if new.proof_path not like new.order_id::text||'/'||auth.uid()::text||'/%' then raise exception 'Payment proof must be stored in the order folder for this customer'; end if;
 if not exists(select 1 from storage.objects where bucket_id='order-payment-proofs' and name=new.proof_path) then raise exception 'Upload the payment proof before submitting the payment record'; end if;
 new.status:='submitted'; new.verified_by:=null; new.verified_at:=null; new.review_message:=''; new.updated_at:=now(); return new;
end; $$;
create or replace function public.sync_verified_payment_to_order()
returns trigger language plpgsql security invoker set search_path=public as $$
declare paid numeric(14,2); total numeric(14,2); oid uuid;
begin
 oid:=coalesce(new.order_id,old.order_id);
 select coalesce(sum(amount),0) into paid from public.wheel_order_payments where order_id=oid and status='verified';
 select total_amount into total from public.wheel_orders where id=oid;
 if paid>=total then update public.wheel_orders set status='payment_received' where id=oid and status in ('pi_issued','awaiting_payment','deposit_received','partially_paid');
 elsif paid>0 then update public.wheel_orders set status='partially_paid' where id=oid and status in ('pi_issued','awaiting_payment','deposit_received','payment_received');
 elsif paid=0 then update public.wheel_orders set status='awaiting_payment' where id=oid and status in ('partially_paid','deposit_received','payment_received'); end if;
 return coalesce(new,old);
end; $$;
create or replace function public.guard_order_payment_status()
returns trigger language plpgsql security invoker set search_path=public as $$
declare paid numeric(14,2);
begin
 if new.status in ('payment_received','partially_paid','deposit_received') and new.status is distinct from old.status then
  select coalesce(sum(amount),0) into paid from public.wheel_order_payments where order_id=new.id and status='verified';
  if new.status='payment_received' and paid<new.total_amount then raise exception 'Order cannot be marked payment received until verified payments cover the full total'; end if;
  if new.status in ('partially_paid','deposit_received') and (paid<=0 or paid>=new.total_amount) then raise exception 'Partial payment status must match verified payment totals'; end if;
 end if;
 return new;
end; $$;
drop trigger if exists wheel_order_payment_status_guard on public.wheel_orders;
create trigger wheel_order_payment_status_guard before update of status on public.wheel_orders for each row execute function public.guard_order_payment_status();
revoke all on function public.snapshot_order_to_pi() from public,anon,authenticated;
revoke all on function public.prepare_customer_payment_submission() from public,anon,authenticated;
revoke all on function public.sync_verified_payment_to_order() from public,anon,authenticated;
revoke all on function public.guard_order_payment_status() from public,anon,authenticated;
