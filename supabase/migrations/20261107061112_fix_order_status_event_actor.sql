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