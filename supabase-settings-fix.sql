create table if not exists public.site_settings (
  id text primary key default 'default',
  email text not null default 'atelier@aequo.studio',
  whatsapp text not null default '',
  instagram text not null default '',
  facebook text not null default '',
  appointment_text text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values ('default') on conflict (id) do nothing;
alter table public.site_settings enable row level security;

drop policy if exists "Anyone can read settings" on public.site_settings;
drop policy if exists "Authenticated users manage settings" on public.site_settings;
create policy "Anyone can read settings" on public.site_settings for select using (true);
create policy "Authenticated users manage settings" on public.site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;
drop policy if exists "Anyone can view product images" on storage.objects;
drop policy if exists "Authenticated users upload product images" on storage.objects;
drop policy if exists "Authenticated users update product images" on storage.objects;
drop policy if exists "Authenticated users delete product images" on storage.objects;
create policy "Anyone can view product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Authenticated users upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "Authenticated users update product images" on storage.objects for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "Authenticated users delete product images" on storage.objects for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');
