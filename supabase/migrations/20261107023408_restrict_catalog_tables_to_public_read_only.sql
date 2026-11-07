revoke all privileges on public.wheel_collections, public.wheel_products, public.wheel_finishes,
  public.wheel_variants, public.wheel_media, public.wheel_fitments
from public, anon, authenticated;
grant select on public.wheel_collections, public.wheel_products, public.wheel_finishes,
  public.wheel_variants, public.wheel_media, public.wheel_fitments to anon, authenticated;
grant all privileges on public.wheel_collections, public.wheel_products, public.wheel_finishes,
  public.wheel_variants, public.wheel_media, public.wheel_fitments to service_role;
