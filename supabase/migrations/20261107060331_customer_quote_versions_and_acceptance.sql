create table if not exists public.wheel_quotes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.wheel_enquiries(id) on delete restrict,
  quote_number text not null unique,
  version integer not null default 1 check (version > 0),
  status text not null default 'draft' check (status in ('draft','issued','accepted','rejected','expired','superseded')),
  currency char(3) not null default 'USD',
  items jsonb not null default '[]'::jsonb check (jsonb_typeof(items)='array' and jsonb_array_length(items) between 1 and 30),
  subtotal numeric(14,2) not null check (subtotal >= 0),
  shipping_amount numeric(14,2) not null default 0 check (shipping_amount >= 0),
  total_amount numeric(14,2) not null check (total_amount >= 0),
  incoterm text not null default '',
  named_place text not null default '',
  payment_terms text not null default '',
  delivery_estimate text not null default '',
  valid_until date,
  customer_notes text not null default '',
  internal_notes text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  issued_at timestamptz
);
create index if not exists wheel_quotes_enquiry_version_idx on public.wheel_quotes(enquiry_id,version desc);
alter table public.wheel_quotes enable row level security;
grant select,insert,update on public.wheel_quotes to authenticated;
create policy wheel_quotes_staff_read on public.wheel_quotes for select to authenticated
using ((auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));
create policy wheel_quotes_customer_read_issued on public.wheel_quotes for select to authenticated
using (status in ('issued','accepted','rejected','expired') and exists (
  select 1 from public.wheel_enquiries e where e.id=enquiry_id and e.user_id=(select auth.uid())
));
create policy wheel_quotes_staff_insert on public.wheel_quotes for insert to authenticated
with check ((auth.jwt()->'app_metadata'->>'role') in ('staff','admin') and created_by=(select auth.uid()));
create policy wheel_quotes_staff_update on public.wheel_quotes for update to authenticated
using ((auth.jwt()->'app_metadata'->>'role') in ('staff','admin'))
with check ((auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));

create table if not exists public.wheel_quote_responses (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.wheel_quotes(id) on delete restrict,
  customer_user_id uuid not null references auth.users(id) on delete restrict,
  decision text not null check (decision in ('accepted','rejected')),
  message text not null default '' check (char_length(message) <= 3000),
  created_at timestamptz not null default now(),
  unique(quote_id,customer_user_id)
);
alter table public.wheel_quote_responses enable row level security;
grant select,insert on public.wheel_quote_responses to authenticated;
create policy wheel_quote_responses_customer_read on public.wheel_quote_responses for select to authenticated
using (customer_user_id=(select auth.uid()) or (auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));
create policy wheel_quote_responses_customer_insert on public.wheel_quote_responses for insert to authenticated
with check (
 customer_user_id=(select auth.uid())
 and exists (select 1 from public.wheel_quotes q join public.wheel_enquiries e on e.id=q.enquiry_id
   where q.id=quote_id and q.status='issued' and e.user_id=(select auth.uid()))
);
create policy wheel_quote_responses_staff_read on public.wheel_quote_responses for select to authenticated
using ((auth.jwt()->'app_metadata'->>'role') in ('staff','admin'));