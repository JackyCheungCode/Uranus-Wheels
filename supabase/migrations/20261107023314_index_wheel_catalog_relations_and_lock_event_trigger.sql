create index wheel_variants_finish_idx on public.wheel_variants(finish_id);
create index wheel_fitments_variant_idx on public.wheel_fitments(variant_id);
create index wheel_fitments_front_variant_idx on public.wheel_fitments(front_variant_id);
create index wheel_fitments_rear_variant_idx on public.wheel_fitments(rear_variant_id);

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
