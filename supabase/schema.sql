-- NAYAK website database (Supabase / Postgres).
-- This is the full schema as applied to the `nayak-india` Supabase project, in one file,
-- so the database can be recreated from scratch. Run it in the SQL editor of a new project.

create schema if not exists private;
grant usage on schema private to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Admins: a signed-in user whose email is listed here can use /admin
-- ---------------------------------------------------------------------------
create table public.admin_emails (
  email text primary key check (email = lower(email) and position('@' in email) > 1),
  added_at timestamptz not null default now()
);

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.admin_emails
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

-- Indian mobile numbers are stored as 10 digits (+91 / leading 0 removed)
create or replace function private.clean_phone(p text) returns text
language sql immutable set search_path = '' as $$
  select case
    when d ~ '^91[6-9][0-9]{9}$' then substr(d, 3)
    when d ~ '^0[6-9][0-9]{9}$' then substr(d, 2)
    else d
  end
  from (select regexp_replace(coalesce(p, ''), '[^0-9]', '', 'g') as d) s;
$$;
grant execute on function private.clean_phone(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table public.members (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (phone ~ '^\+?[0-9 -]{10,15}$'),
  email text check (email is null or char_length(email) <= 200),
  address text check (address is null or char_length(address) <= 500),
  reasons text[] not null default '{}',
  reason_other text check (reason_other is null or char_length(reason_other) <= 500),
  changes text[] not null default '{}',
  change_other text check (change_other is null or char_length(change_other) <= 500),
  status text not null default 'new' check (status in ('new','contacted','active','inactive')),
  admin_notes text,
  source text not null default 'website'
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  ref_code text not null unique default ('NYK-' || upper(substr(md5(gen_random_uuid()::text), 1, 6))),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text check (name is null or char_length(name) <= 120),
  phone text not null check (phone ~ '^\+?[0-9 -]{10,15}$'),
  area text not null check (char_length(area) between 2 and 200),
  landmark text check (landmark is null or char_length(landmark) <= 300),
  category text not null check (category in ('roads','drainage','garbage','water','electricity','streetlight','traffic','encroachment','corruption','other')),
  description text not null check (char_length(description) between 10 and 3000),
  photo_paths text[] not null default '{}',
  status text not null default 'new' check (status in ('new','verifying','in_progress','resolved','rejected')),
  admin_notes text
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
create trigger reports_touch before update on public.reports
for each row execute function public.touch_updated_at();

create table public.instagram_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  url text not null unique check (url ~ '^https://(www\.)?instagram\.com/(p|reel|tv)/[A-Za-z0-9_-]+/?$'),
  caption text check (caption is null or char_length(caption) <= 200),
  sort_order integer not null default 0,
  is_visible boolean not null default true
);

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.admin_emails enable row level security;
alter table public.members enable row level security;
alter table public.reports enable row level security;
alter table public.instagram_posts enable row level security;

create policy "admins manage admin list" on public.admin_emails
  for all to authenticated using (private.is_admin()) with check (private.is_admin());

create policy "admins read members" on public.members for select to authenticated using (private.is_admin());
create policy "admins update members" on public.members for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admins delete members" on public.members for delete to authenticated using (private.is_admin());

create policy "admins read reports" on public.reports for select to authenticated using (private.is_admin());
create policy "admins update reports" on public.reports for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admins delete reports" on public.reports for delete to authenticated using (private.is_admin());

create policy "anyone sees visible posts" on public.instagram_posts for select to anon, authenticated using (is_visible or private.is_admin());
create policy "admins insert posts" on public.instagram_posts for insert to authenticated with check (private.is_admin());
create policy "admins update posts" on public.instagram_posts for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admins delete posts" on public.instagram_posts for delete to authenticated using (private.is_admin());

-- ---------------------------------------------------------------------------
-- Public submissions (the only way the public can write)
-- ---------------------------------------------------------------------------
create or replace function public.submit_member(
  p_name text, p_phone text, p_email text, p_address text,
  p_reasons text[], p_reason_other text, p_changes text[], p_change_other text
) returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_phone text := private.clean_phone(p_phone);
begin
  if (select count(*) from public.members
      where phone = v_phone and created_at > now() - interval '10 minutes') > 0 then
    raise exception 'duplicate_recent' using errcode = 'P0001';
  end if;
  insert into public.members (name, phone, email, address, reasons, reason_other, changes, change_other)
  values (trim(p_name), v_phone, nullif(trim(p_email), ''), nullif(trim(p_address), ''),
          coalesce(p_reasons, '{}'), nullif(trim(p_reason_other), ''),
          coalesce(p_changes, '{}'), nullif(trim(p_change_other), ''))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public.submit_report(
  p_name text, p_phone text, p_area text, p_landmark text,
  p_category text, p_description text, p_photo_paths text[]
) returns text language plpgsql security definer set search_path = '' as $$
declare v_ref text; v_path text; v_phone text := private.clean_phone(p_phone);
begin
  if (select count(*) from public.reports
      where phone = v_phone and created_at > now() - interval '1 day') >= 5 then
    raise exception 'too_many_reports' using errcode = 'P0001';
  end if;
  if coalesce(array_length(p_photo_paths, 1), 0) > 3 then
    raise exception 'too_many_photos' using errcode = 'P0001';
  end if;
  foreach v_path in array coalesce(p_photo_paths, '{}') loop
    if v_path !~ '^incoming/[A-Za-z0-9_-]+\.(jpg|jpeg|png|webp)$' then
      raise exception 'bad_photo_path' using errcode = 'P0001';
    end if;
  end loop;
  insert into public.reports (name, phone, area, landmark, category, description, photo_paths)
  values (nullif(trim(p_name), ''), v_phone, trim(p_area), nullif(trim(p_landmark), ''),
          p_category, trim(p_description), coalesce(p_photo_paths, '{}'))
  returning ref_code into v_ref;
  return v_ref;
end; $$;

revoke all on function public.submit_member(text,text,text,text,text[],text,text[],text) from public;
revoke all on function public.submit_report(text,text,text,text,text,text,text[]) from public;
grant execute on function public.submit_member(text,text,text,text,text[],text,text[],text) to anon, authenticated;
grant execute on function public.submit_report(text,text,text,text,text,text,text[]) to anon, authenticated;
comment on function public.submit_member(text,text,text,text,text[],text,text[],text) is 'Public join form. Intentionally callable by anon; validates and rate-limits.';
comment on function public.submit_report(text,text,text,text,text,text,text[]) is 'Public problem report form. Intentionally callable by anon; validates, rate-limits, returns ref code.';

-- ---------------------------------------------------------------------------
-- Report photos: private bucket; the public can upload into incoming/, only admins can view
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('report-photos', 'report-photos', false, 5242880, array['image/jpeg','image/png','image/webp']);

create policy "public uploads report photos" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'report-photos' and (storage.foldername(name))[1] = 'incoming');
create policy "admins view report photos" on storage.objects for select to authenticated
  using (bucket_id = 'report-photos' and private.is_admin());
create policy "admins delete report photos" on storage.objects for delete to authenticated
  using (bucket_id = 'report-photos' and private.is_admin());

-- First admin: replace with the email of the person who will log in to /admin
insert into public.admin_emails (email) values ('your.email@example.com');
