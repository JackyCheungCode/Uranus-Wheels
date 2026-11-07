drop policy if exists wheel_enquiries_anon_insert on public.wheel_enquiries;
create policy wheel_enquiries_anon_insert on public.wheel_enquiries
for insert to anon
with check (
  char_length(customer_name) between 1 and 120
  and customer_email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
  and jsonb_typeof(configuration) = 'object'
  and jsonb_typeof(attachments) = 'array'
  and jsonb_array_length(attachments) <= 12
);

drop policy if exists wheel_enquiries_authenticated_insert_own on public.wheel_enquiries;
create policy wheel_enquiries_authenticated_insert_own on public.wheel_enquiries
for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and char_length(customer_name) between 1 and 120
  and customer_email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
  and jsonb_typeof(configuration) = 'object'
  and jsonb_typeof(attachments) = 'array'
  and jsonb_array_length(attachments) <= 12
);
