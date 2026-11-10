-- Run this entire script in Supabase Dashboard > SQL Editor.
-- Creates seller product listings, public product-image storage, and row-level security.
create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  category text not null,
  price numeric(12,2) not null check (price > 0),
  description text not null check (char_length(description) <= 1000),
  image_url text not null,
  store_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Anyone can view active products" on public.products;
create policy "Anyone can view active products"
on public.products for select
using (is_active = true or auth.uid() = seller_id);

drop policy if exists "Sellers can add their own products" on public.products;
create policy "Sellers can add their own products"
on public.products for insert
to authenticated
with check (auth.uid() = seller_id);

drop policy if exists "Sellers can update their own products" on public.products;
create policy "Sellers can update their own products"
on public.products for update
to authenticated
using (auth.uid() = seller_id)
with check (auth.uid() = seller_id);

drop policy if exists "Sellers can delete their own products" on public.products;
create policy "Sellers can delete their own products"
on public.products for delete
to authenticated
using (auth.uid() = seller_id);

-- Public bucket allows shoppers to see listing photos. Uploads are limited to
-- authenticated users, inside a folder named with their auth user ID.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Anyone can view product images" on storage.objects;
create policy "Anyone can view product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Authenticated sellers upload to own folder" on storage.objects;
create policy "Authenticated sellers upload to own folder"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Sellers update own product images" on storage.objects;
create policy "Sellers update own product images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'product-images' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Sellers delete own product images" on storage.objects;
create policy "Sellers delete own product images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and (storage.foldername(name))[1] = auth.uid()::text);


-- KIVORA member profiles and optional shopper/seller location. Run this after the existing setup.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null default '',
  phone text not null default '',
  account_type text not null default 'buyer' check (account_type in ('buyer','seller')),
  country text not null default '',
  state text not null default '',
  city text not null default '',
  street_address text not null default '',
  postcode text not null default '',
  latitude double precision,
  longitude double precision,
  accuracy_m integer,
  location_shared_at timestamptz,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "Members can read own profile" on public.profiles;
create policy "Members can read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "Members can create own profile" on public.profiles;
create policy "Members can create own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists "Members can update own profile" on public.profiles;
create policy "Members can update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create or replace function public.is_kivora_admin() returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and is_admin = true); $$;
drop policy if exists "KIVORA admins can view all profiles" on public.profiles;
create policy "KIVORA admins can view all profiles" on public.profiles for select to authenticated using (public.is_kivora_admin());
create or replace function public.protect_profile_admin_flag() returns trigger
language plpgsql security definer set search_path = public
as $$ begin
  if old.is_admin is distinct from new.is_admin and not public.is_kivora_admin() then
    raise exception 'Only an existing KIVORA administrator can change administrator access';
  end if;
  return new;
end; $$;
drop trigger if exists protect_profile_admin_flag on public.profiles;
create trigger protect_profile_admin_flag before update on public.profiles for each row execute function public.protect_profile_admin_flag();
-- To grant the first administrator, run this as the project owner in SQL Editor:
-- update public.profiles set is_admin = true where email = 'YOUR_ADMIN_EMAIL';
