-- AMM Learning resource library schema
-- Applied to Supabase project yvfumgrywsqhsvjfnmzu on 2026-11-12.

create table if not exists public.learning_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  icon text not null default 'book-open',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint learning_categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.learning_resources (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.learning_categories(id) on delete restrict,
  title text not null,
  slug text not null unique,
  summary text not null default '',
  content_type text not null default 'guide'
    check (content_type in ('guide','prompt','pdf','link','image','code','video','collection')),
  body text not null default '',
  resource_url text,
  file_path text,
  thumbnail_path text,
  tags text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  related_video_url text,
  status text not null default 'draft'
    check (status in ('draft','published','archived')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint learning_resources_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint learning_resources_resource_url_format check (resource_url is null or resource_url ~ '^https?://')
);

create index if not exists learning_categories_active_order_idx
  on public.learning_categories (is_active, sort_order, name);
create index if not exists learning_resources_category_status_order_idx
  on public.learning_resources (category_id, status, sort_order, published_at desc);
create index if not exists learning_resources_published_at_idx
  on public.learning_resources (published_at desc) where status = 'published';

create or replace function public.learning_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists learning_categories_set_updated_at on public.learning_categories;
create trigger learning_categories_set_updated_at
before update on public.learning_categories
for each row execute function public.learning_set_updated_at();

drop trigger if exists learning_resources_set_updated_at on public.learning_resources;
create trigger learning_resources_set_updated_at
before update on public.learning_resources
for each row execute function public.learning_set_updated_at();

alter table public.learning_categories enable row level security;
alter table public.learning_resources enable row level security;

drop policy if exists "learning categories public read" on public.learning_categories;
create policy "learning categories public read"
on public.learning_categories for select to anon, authenticated
using (is_active = true or lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "learning categories admin insert" on public.learning_categories;
create policy "learning categories admin insert"
on public.learning_categories for insert to authenticated
with check (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "learning categories admin update" on public.learning_categories;
create policy "learning categories admin update"
on public.learning_categories for update to authenticated
using (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com')
with check (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "learning categories admin delete" on public.learning_categories;
create policy "learning categories admin delete"
on public.learning_categories for delete to authenticated
using (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "learning resources public read" on public.learning_resources;
create policy "learning resources public read"
on public.learning_resources for select to anon, authenticated
using (
  (status = 'published' and exists (
    select 1 from public.learning_categories c
    where c.id = learning_resources.category_id and c.is_active = true
  ))
  or lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com'
);

drop policy if exists "learning resources admin insert" on public.learning_resources;
create policy "learning resources admin insert"
on public.learning_resources for insert to authenticated
with check (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "learning resources admin update" on public.learning_resources;
create policy "learning resources admin update"
on public.learning_resources for update to authenticated
using (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com')
with check (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "learning resources admin delete" on public.learning_resources;
create policy "learning resources admin delete"
on public.learning_resources for delete to authenticated
using (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

grant usage on schema public to anon, authenticated;
grant select on public.learning_categories, public.learning_resources to anon, authenticated;
grant insert, update, delete on public.learning_categories, public.learning_resources to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('amm-learning','amm-learning',true,20971520,array['application/pdf','image/jpeg','image/png','image/webp','text/plain','text/markdown','application/zip'])
on conflict (id) do nothing;

drop policy if exists "AMM learning public file read" on storage.objects;
create policy "AMM learning public file read" on storage.objects for select to anon, authenticated
using (bucket_id = 'amm-learning');

drop policy if exists "AMM learning admin file upload" on storage.objects;
create policy "AMM learning admin file upload" on storage.objects for insert to authenticated
with check (bucket_id = 'amm-learning' and lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "AMM learning admin file update" on storage.objects;
create policy "AMM learning admin file update" on storage.objects for update to authenticated
using (bucket_id = 'amm-learning' and lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com')
with check (bucket_id = 'amm-learning' and lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "AMM learning admin file delete" on storage.objects;
create policy "AMM learning admin file delete" on storage.objects for delete to authenticated
using (bucket_id = 'amm-learning' and lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');
