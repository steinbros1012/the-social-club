-- Run this in your Supabase SQL editor to create the volunteers table

create table if not exists volunteers (
  id uuid default gen_random_uuid() primary key,
  event_name text not null default 'The Social Club',
  event_date date,
  volunteer_name text not null,
  volunteer_age integer not null,
  is_minor boolean not null default false,
  guardian_name text,
  guardian_phone text,
  guardian_email text,
  waiver_agreed boolean not null default false,
  signature_volunteer text not null,
  signature_volunteer_date date not null,
  signature_guardian text,
  signature_guardian_date date,
  created_at timestamptz not null default now()
);

alter table volunteers enable row level security;
-- Service role only, same as registrations
