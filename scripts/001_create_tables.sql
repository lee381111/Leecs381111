-- Create profiles table for user data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  language text default 'ko',
  theme text default 'light',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Create notes table
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text,
  category text,
  media_urls text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.notes enable row level security;

create policy "notes_select_own"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "notes_insert_own"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "notes_update_own"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "notes_delete_own"
  on public.notes for delete
  using (auth.uid() = user_id);

-- Create diary entries table
create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text,
  mood text,
  weather text,
  media_urls text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.diary_entries enable row level security;

create policy "diary_entries_select_own"
  on public.diary_entries for select
  using (auth.uid() = user_id);

create policy "diary_entries_insert_own"
  on public.diary_entries for insert
  with check (auth.uid() = user_id);

create policy "diary_entries_update_own"
  on public.diary_entries for update
  using (auth.uid() = user_id);

create policy "diary_entries_delete_own"
  on public.diary_entries for delete
  using (auth.uid() = user_id);

-- Create schedules table
create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz,
  alarm_enabled boolean default false,
  alarm_time timestamptz,
  completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.schedules enable row level security;

create policy "schedules_select_own"
  on public.schedules for select
  using (auth.uid() = user_id);

create policy "schedules_insert_own"
  on public.schedules for insert
  with check (auth.uid() = user_id);

create policy "schedules_update_own"
  on public.schedules for update
  using (auth.uid() = user_id);

create policy "schedules_delete_own"
  on public.schedules for delete
  using (auth.uid() = user_id);

-- Create travel records table
create table if not exists public.travel_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination text not null,
  start_date date not null,
  end_date date,
  notes text,
  media_urls text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.travel_records enable row level security;

create policy "travel_records_select_own"
  on public.travel_records for select
  using (auth.uid() = user_id);

create policy "travel_records_insert_own"
  on public.travel_records for insert
  with check (auth.uid() = user_id);

create policy "travel_records_update_own"
  on public.travel_records for update
  using (auth.uid() = user_id);

create policy "travel_records_delete_own"
  on public.travel_records for delete
  using (auth.uid() = user_id);

-- Create vehicles table
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null,
  model text,
  year integer,
  license_plate text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.vehicles enable row level security;

create policy "vehicles_select_own"
  on public.vehicles for select
  using (auth.uid() = user_id);

create policy "vehicles_insert_own"
  on public.vehicles for insert
  with check (auth.uid() = user_id);

create policy "vehicles_update_own"
  on public.vehicles for update
  using (auth.uid() = user_id);

create policy "vehicles_delete_own"
  on public.vehicles for delete
  using (auth.uid() = user_id);

-- Create vehicle maintenance records table
create table if not exists public.vehicle_maintenance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  type text not null,
  description text,
  cost numeric,
  date date not null,
  mileage integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.vehicle_maintenance enable row level security;

create policy "vehicle_maintenance_select_own"
  on public.vehicle_maintenance for select
  using (auth.uid() = user_id);

create policy "vehicle_maintenance_insert_own"
  on public.vehicle_maintenance for insert
  with check (auth.uid() = user_id);

create policy "vehicle_maintenance_update_own"
  on public.vehicle_maintenance for update
  using (auth.uid() = user_id);

create policy "vehicle_maintenance_delete_own"
  on public.vehicle_maintenance for delete
  using (auth.uid() = user_id);

-- Create health records table
create table if not exists public.health_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  value numeric,
  unit text,
  notes text,
  recorded_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.health_records enable row level security;

create policy "health_records_select_own"
  on public.health_records for select
  using (auth.uid() = user_id);

create policy "health_records_insert_own"
  on public.health_records for insert
  with check (auth.uid() = user_id);

create policy "health_records_update_own"
  on public.health_records for update
  using (auth.uid() = user_id);

create policy "health_records_delete_own"
  on public.health_records for delete
  using (auth.uid() = user_id);

-- Create medications table
create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  dosage text,
  frequency text,
  start_date date,
  end_date date,
  notes text,
  alarm_enabled boolean default false,
  alarm_times text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.medications enable row level security;

create policy "medications_select_own"
  on public.medications for select
  using (auth.uid() = user_id);

create policy "medications_insert_own"
  on public.medications for insert
  with check (auth.uid() = user_id);

create policy "medications_update_own"
  on public.medications for update
  using (auth.uid() = user_id);

create policy "medications_delete_own"
  on public.medications for delete
  using (auth.uid() = user_id);
