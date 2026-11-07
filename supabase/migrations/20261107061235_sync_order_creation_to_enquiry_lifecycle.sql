create or replace function public.record_wheel_order_creation()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  insert into public.wheel_order_events(order_id,status,visibility,message,created_by)
  values(new.id,new.status,'customer','Your sales order has been created.',new.created_by);
  update public.wheel_enquiries
     set status='converted_to_order', updated_at=now()
   where id=new.enquiry_id and status='accepted';
  return new;
end;
$$;