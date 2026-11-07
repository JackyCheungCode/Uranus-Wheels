drop policy if exists wheel_quote_responses_customer_insert on public.wheel_quote_responses;
create policy wheel_quote_responses_customer_insert on public.wheel_quote_responses for insert to authenticated
with check (
 customer_user_id=(select auth.uid())
 and exists (select 1 from public.wheel_quotes q join public.wheel_enquiries e on e.id=q.enquiry_id
   where q.id=quote_id and q.status='issued'
     and (q.valid_until is null or q.valid_until >= current_date)
     and e.user_id=(select auth.uid()))
);