alter table public.wheel_enquiries
  add column if not exists status text not null default 'received',
  add column if not exists updated_at timestamptz not null default now(),
  add constraint wheel_enquiries_status_check
    check (status in ('received','reviewing','needs_information','quoted','accepted','rejected','converted_to_order','closed'));

create index if not exists wheel_enquiries_user_status_created_idx
  on public.wheel_enquiries(user_id,status,created_at desc)
  where user_id is not null;

create table if not exists public.wheel_enquiry_messages (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.wheel_enquiries(id) on delete cascade,
  sender_user_id uuid references auth.users(id) on delete set null,
  sender_type text not null default 'customer' check (sender_type in ('customer','staff','system')),
  message text not null check (char_length(trim(message)) between 1 and 5000),
  created_at timestamptz not null default now()
);
create index if not exists wheel_enquiry_messages_thread_idx
  on public.wheel_enquiry_messages(enquiry_id,created_at asc);
alter table public.wheel_enquiry_messages enable row level security;
grant select,insert on public.wheel_enquiry_messages to authenticated;

create policy wheel_enquiry_messages_customer_read_own
  on public.wheel_enquiry_messages for select to authenticated
  using (exists (
    select 1 from public.wheel_enquiries e
    where e.id = enquiry_id and e.user_id = (select auth.uid())
  ));

create policy wheel_enquiry_messages_customer_insert_own
  on public.wheel_enquiry_messages for insert to authenticated
  with check (
    sender_type = 'customer'
    and sender_user_id = (select auth.uid())
    and exists (
      select 1 from public.wheel_enquiries e
      where e.id = enquiry_id and e.user_id = (select auth.uid())
    )
  );