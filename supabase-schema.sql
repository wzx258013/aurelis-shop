-- Run this once in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  cn text not null default '',
  price text not null default '',
  tag text not null default '',
  category text not null default 'Collection',
  material text not null default '',
  description text not null default '',
  image text not null default '',
  detail_image text not null default '',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

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

alter table public.products enable row level security;
alter table public.site_settings enable row level security;

create policy "Anyone can read published products" on public.products for select using (published = true or auth.role() = 'authenticated');
create policy "Authenticated users manage products" on public.products for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Anyone can read settings" on public.site_settings for select using (true);
create policy "Authenticated users manage settings" on public.site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;
create policy "Anyone can view product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Authenticated users upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "Authenticated users update product images" on storage.objects for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "Authenticated users delete product images" on storage.objects for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');
