-- Gyaantosh Exams: database schema
-- Supabase Dashboard > SQL Editor mein poora ye file paste karke "Run" dabayein.

-- 1. Profiles: har user ki extra jaankari
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  mobile text,
  exam text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Naya user banne par profile apne aap ban jaye
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, mobile, exam)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'mobile',
    new.raw_user_meta_data ->> 'exam'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Materials: papers, notes, MCQ sheets
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  topic text not null default 'General',
  tag text not null default '',
  exams text[] not null default '{}',
  pages integer not null default 1,
  price integer not null default 0 check (price >= 0),   -- rupees mein, 0 = free
  language text not null default 'Hindi',
  file_path text not null,                               -- bucket "materials" ke andar ka path
  cover_path text,                                       -- bucket "covers" ke andar ka path (optional)
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. Purchases: kis user ne kaunsa paper khareeda (payment wale step mein bharega)
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  material_id uuid not null references public.materials (id) on delete cascade,
  amount integer not null,
  payment_id text,
  created_at timestamptz not null default now(),
  unique (user_id, material_id)
);

-- 4. Subscriptions: monthly plan (payment wale step mein bharega)
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  active_until timestamptz not null,
  payment_id text,
  updated_at timestamptz not null default now()
);

-- 5. Security rules (Row Level Security)
alter table public.profiles enable row level security;
alter table public.materials enable row level security;
alter table public.purchases enable row level security;
alter table public.subscriptions enable row level security;

-- Profile: user sirf apni profile dekh sakta hai
drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles
  for select using (auth.uid() = id);

-- Materials: sab published materials ki list dekh sakte hain (file nahi, sirf list)
drop policy if exists "materials read published" on public.materials;
create policy "materials read published" on public.materials
  for select using (published = true);

-- Purchases aur subscriptions: user sirf apne dekh sakta hai. Likhna sirf server se hoga.
drop policy if exists "purchases read own" on public.purchases;
create policy "purchases read own" on public.purchases
  for select using (auth.uid() = user_id);

drop policy if exists "subscriptions read own" on public.subscriptions;
create policy "subscriptions read own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- 6. Storage buckets
-- materials: PRIVATE (asli PDF/image files, sirf signed link se khulti hain)
-- covers: PUBLIC (cards par dikhne wali chhoti photos)
insert into storage.buckets (id, name, public)
values ('materials', 'materials', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

-- 7. Apne aap ko admin banane ke liye (register karne ke baad ek baar chalayein):
--   update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'AAPKA-EMAIL@example.com');
