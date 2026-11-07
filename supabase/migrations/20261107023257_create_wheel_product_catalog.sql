create table public.wheel_collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  subtitle text,
  description text,
  construction text not null check (construction in ('monoblock','2_piece','3_piece','mixed')),
  cover_image_path text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wheel_products (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid references public.wheel_collections(id) on delete set null,
  slug text not null unique,
  model_code text not null unique,
  name text not null,
  short_description text,
  description text,
  category text not null default 'forged_wheel',
  construction text not null check (construction in ('monoblock','2_piece','3_piece')),
  design_language text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wheel_finishes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.wheel_products(id) on delete cascade,
  code text,
  name text not null,
  description text,
  finish_type text,
  swatch_hex text check (swatch_hex is null or swatch_hex ~ '^#[0-9A-Fa-f]{6}$'),
  image_path text,
  is_custom boolean not null default false,
  status text not null default 'active' check (status in ('active','inactive')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(product_id, code)
);

create table public.wheel_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.wheel_products(id) on delete cascade,
  finish_id uuid references public.wheel_finishes(id) on delete set null,
  sku text not null unique,
  variant_name text,
  diameter numeric(5,2) check (diameter is null or diameter between 10 and 30),
  width numeric(5,2) check (width is null or width between 3 and 20),
  pcd text,
  offset_et numeric(6,2),
  center_bore numeric(6,2),
  lug_count smallint check (lug_count is null or lug_count between 3 and 12),
  load_rating_kg integer check (load_rating_kg is null or load_rating_kg > 0),
  material text,
  barrel_type text,
  hardware text,
  position text check (position is null or position in ('front','rear','square','universal')),
  price numeric(12,2) check (price is null or price >= 0),
  currency char(3),
  inventory_status text not null default 'made_to_order' check (inventory_status in ('in_stock','made_to_order','discontinued')),
  status text not null default 'draft' check (status in ('draft','active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wheel_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.wheel_products(id) on delete cascade,
  variant_id uuid references public.wheel_variants(id) on delete cascade,
  media_type text not null default 'image' check (media_type in ('image','video','document')),
  role text not null default 'gallery' check (role in ('hero','gallery','detail','engineering','video','spec_sheet')),
  storage_path text not null,
  alt_text text,
  caption text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.wheel_fitments (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.wheel_products(id) on delete cascade,
  variant_id uuid references public.wheel_variants(id) on delete set null,
  vehicle_make text not null,
  vehicle_model text not null,
  year_from smallint,
  year_to smallint,
  trim text,
  market text,
  front_variant_id uuid references public.wheel_variants(id) on delete set null,
  rear_variant_id uuid references public.wheel_variants(id) on delete set null,
  verification_status text not null default 'pending' check (verification_status in ('pending','verified','rejected')),
  verification_notes text,
  created_at timestamptz not null default now(),
  check (year_from is null or year_from between 1900 and 2100),
  check (year_to is null or year_to between 1900 and 2100),
  check (year_from is null or year_to is null or year_to >= year_from)
);

create index wheel_products_collection_idx on public.wheel_products(collection_id, sort_order);
create index wheel_products_catalog_idx on public.wheel_products(status, is_featured desc, sort_order);
create index wheel_variants_product_idx on public.wheel_variants(product_id, status);
create index wheel_variants_specs_idx on public.wheel_variants(diameter, width, pcd, offset_et);
create index wheel_finishes_product_idx on public.wheel_finishes(product_id, status, sort_order);
create index wheel_media_product_idx on public.wheel_media(product_id, sort_order);
create index wheel_media_variant_idx on public.wheel_media(variant_id, sort_order);
create index wheel_fitments_vehicle_idx on public.wheel_fitments(vehicle_make, vehicle_model, year_from, year_to);
create index wheel_fitments_product_idx on public.wheel_fitments(product_id, verification_status);

alter table public.wheel_collections enable row level security;
alter table public.wheel_products enable row level security;
alter table public.wheel_finishes enable row level security;
alter table public.wheel_variants enable row level security;
alter table public.wheel_media enable row level security;
alter table public.wheel_fitments enable row level security;

create policy "Public can read published wheel collections"
on public.wheel_collections for select to anon, authenticated
using (status = 'published');

create policy "Public can read published wheel products"
on public.wheel_products for select to anon, authenticated
using (status = 'published');

create policy "Public can read active variants of published products"
on public.wheel_variants for select to anon, authenticated
using (status = 'active' and exists (
  select 1 from public.wheel_products p where p.id = product_id and p.status = 'published'
));

create policy "Public can read active finishes of published products"
on public.wheel_finishes for select to anon, authenticated
using (status = 'active' and exists (
  select 1 from public.wheel_products p where p.id = product_id and p.status = 'published'
));

create policy "Public can read media of published products"
on public.wheel_media for select to anon, authenticated
using (exists (
  select 1 from public.wheel_products p where p.id = product_id and p.status = 'published'
));

create policy "Public can read verified fitments of published products"
on public.wheel_fitments for select to anon, authenticated
using (verification_status = 'verified' and exists (
  select 1 from public.wheel_products p where p.id = product_id and p.status = 'published'
));

grant usage on schema public to anon, authenticated, service_role;
grant select on public.wheel_collections, public.wheel_products, public.wheel_finishes,
  public.wheel_variants, public.wheel_media, public.wheel_fitments to anon, authenticated;
grant all privileges on public.wheel_collections, public.wheel_products, public.wheel_finishes,
  public.wheel_variants, public.wheel_media, public.wheel_fitments to service_role;
