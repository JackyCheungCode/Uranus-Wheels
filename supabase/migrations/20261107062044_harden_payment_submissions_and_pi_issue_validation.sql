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
drop trigger if exists wheel_payment_prepare_submission on public.wheel_order_payments;
create trigger wheel_payment_prepare_submission before insert on public.wheel_order_payments for each row execute function public.prepare_customer_payment_submission();
revoke all on function public.prepare_customer_payment_submission() from public,anon,authenticated;

create or replace function public.validate_pi_issue()
returns trigger language plpgsql security invoker set search_path=public as $$
begin
 if new.status='issued' and old.status is distinct from 'issued' then
  if coalesce(new.seller_snapshot->>'legal_name','')='' or coalesce(new.seller_snapshot->>'registered_address','')=''
   or coalesce(new.bank_snapshot->>'beneficiary','')='' or coalesce(new.bank_snapshot->>'bank_name','')=''
   or coalesce(new.bank_snapshot->>'account_no','')='' then
   raise exception 'Complete seller legal name, registered address and bank beneficiary details before issuing the PI';
  end if;
  if coalesce(new.buyer_snapshot->>'email','')='' then raise exception 'Buyer contact details are incomplete'; end if;
 end if;
 return new;
end; $$;
drop trigger if exists wheel_pi_validate_issue on public.wheel_proforma_invoices;
create trigger wheel_pi_validate_issue before update of status on public.wheel_proforma_invoices for each row execute function public.validate_pi_issue();
revoke all on function public.validate_pi_issue() from public,anon,authenticated;
