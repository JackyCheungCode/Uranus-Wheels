alter table public.wheel_enquiries
  add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists wheel_enquiries_user_created_idx
  on public.wheel_enquiries(user_id, created_at desc)
  where user_id is not null;

create table if not exists public.customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  phone text,
  country_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_profiles_full_name_len check (full_name is null or char_length(full_name) <= 120),
  constraint customer_profiles_company_name_len check (company_name is null or char_length(company_name) <= 160),
  constraint customer_profiles_phone_len check (phone is null or char_length(phone) <= 40),
  constraint customer_profiles_country_code_len check (country_code is null or char_length(country_code) = 2)
);
alter table public.customer_profiles enable row level security;

grant select, insert, update on public.customer_profiles to authenticated;
create policy customer_profiles_select_own on public.customer_profiles
  for select to authenticated using ((select auth.uid()) = user_id);
create policy customer_profiles_insert_own on public.customer_profiles
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy customer_profiles_update_own on public.customer_profiles
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert on public.wheel_enquiries to authenticated;
create policy wheel_enquiries_select_own on public.wheel_enquiries
  for select to authenticated using ((select auth.uid()) = user_id);
create policy wheel_enquiries_authenticated_insert_own on public.wheel_enquiries
  for insert to authenticated with check (
    (select auth.uid()) = user_id
    and char_length(customer_name) between 1 and 120
    and customer_email ~* '^[^[:space:]@]+@[^[:space:]@]+\\.[^[:space:]@]+$'
    and jsonb_typeof(configuration) = 'object'
    and jsonb_typeof(attachments) = 'array'
    and jsonb_array_length(attachments) <= 12
  );
