create or replace function public.sync_issued_quote_to_enquiry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'issued' then
    update public.wheel_enquiries
       set status = 'quoted', updated_at = now()
     where id = new.enquiry_id and status not in ('accepted','converted_to_order','closed');
  end if;
  return new;
end;
$$;
revoke all on function public.sync_issued_quote_to_enquiry() from public;
revoke all on function public.sync_issued_quote_to_enquiry() from anon;
revoke all on function public.sync_issued_quote_to_enquiry() from authenticated;
drop trigger if exists wheel_quote_issued_sync_enquiry on public.wheel_quotes;
create trigger wheel_quote_issued_sync_enquiry
after insert or update of status on public.wheel_quotes
for each row execute function public.sync_issued_quote_to_enquiry();
