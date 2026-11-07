grant select, update(status, updated_at) on public.wheel_enquiries to authenticated;
create policy wheel_enquiries_staff_read_all
  on public.wheel_enquiries for select to authenticated
  using ((auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));
create policy wheel_enquiries_staff_update_status
  on public.wheel_enquiries for update to authenticated
  using ((auth.jwt()->'app_metadata'->>'role') in ('staff','admin'))
  with check ((auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));

create policy wheel_enquiry_messages_staff_read_all
  on public.wheel_enquiry_messages for select to authenticated
  using ((auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));
create policy wheel_enquiry_messages_staff_insert
  on public.wheel_enquiry_messages for insert to authenticated
  with check (
    sender_type = 'staff'
    and sender_user_id = (select auth.uid())
    and (auth.jwt()->'app_metadata'->>'role') in ('staff','admin')
  );