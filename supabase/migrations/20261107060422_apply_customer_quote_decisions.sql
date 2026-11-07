create or replace function public.apply_wheel_quote_response()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.wheel_quotes
     set status = new.decision, updated_at = now()
   where id = new.quote_id and status = 'issued';
  if new.decision = 'accepted' then
    update public.wheel_enquiries e
       set status = 'accepted', updated_at = now()
      from public.wheel_quotes q
     where q.id = new.quote_id and e.id = q.enquiry_id;
  end if;
  return new;
end;
$$;
drop trigger if exists wheel_quote_response_apply on public.wheel_quote_responses;
create trigger wheel_quote_response_apply
after insert on public.wheel_quote_responses
for each row execute function public.apply_wheel_quote_response();