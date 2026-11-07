create or replace function public.sync_verified_payment_to_order()
returns trigger language plpgsql security invoker set search_path=public as $$
declare paid numeric(14,2); total numeric(14,2); oid uuid;
begin
 oid:=coalesce(new.order_id,old.order_id);
 select coalesce(sum(amount),0) into paid from public.wheel_order_payments where order_id=oid and status='verified';
 select total_amount into total from public.wheel_orders where id=oid;
 if paid>total then
  raise exception 'Verified payment total cannot exceed the sales order total';
 elsif paid=total then
  update public.wheel_orders set status='payment_received' where id=oid and status in ('pi_issued','awaiting_payment','deposit_received','partially_paid');
 elsif paid>0 then
  update public.wheel_orders set status='partially_paid' where id=oid and status in ('pi_issued','awaiting_payment','deposit_received','payment_received');
 elsif paid=0 then
  update public.wheel_orders set status='awaiting_payment' where id=oid and status in ('partially_paid','deposit_received','payment_received');
 end if;
 return coalesce(new,old);
end; $$;
