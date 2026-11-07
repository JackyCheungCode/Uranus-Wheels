alter table public.wheel_enquiries
  drop constraint if exists wheel_enquiries_request_type_check;

alter table public.wheel_enquiries
  add constraint wheel_enquiries_request_type_check
  check (
    request_type = any (
      array['configured', 'design_upload', 'contact', 'dealer_application']::text[]
    )
  );

create index if not exists wheel_enquiries_type_created_at_idx
  on public.wheel_enquiries (request_type, created_at desc);
