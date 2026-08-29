-- Safe migration for the original AURELIS products table.
-- It only adds missing fields and copies existing values.
alter table public.products add column if not exists slug text not null default '';
alter table public.products add column if not exists cn text not null default '';
alter table public.products add column if not exists tag text not null default '';
alter table public.products add column if not exists material text not null default '';
alter table public.products add column if not exists detail_image text not null default '';
alter table public.products add column if not exists published boolean not null default true;
alter table public.products add column if not exists sort_order integer not null default 0;

update public.products
set slug = lower(trim(both '-' from regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')))
where slug = '';

update public.products
set cn = name
where cn = '';

update public.products
set tag = coalesce(nullif(badge, ''), '')
where tag = '';

update public.products
set material = coalesce(nullif(sub, ''), '')
where material = '';

update public.products
set detail_image = image
where detail_image = '';

update public.products
set published = (status = 'published');

-- Refresh PostgREST's column cache immediately after the migration.
notify pgrst, 'reload schema';
