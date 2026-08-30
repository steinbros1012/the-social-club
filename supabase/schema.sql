-- Run this in your Supabase SQL editor to create the registrations table

create table if not exists registrations (
  id uuid default gen_random_uuid() primary key,
  -- Participant
  participant_first_name text not null,
  participant_last_name text not null,
  participant_dob date,
  participant_email text not null,
  participant_phone text not null,
  -- Caregiver
  caregiver_first_name text not null,
  caregiver_last_name text not null,
  caregiver_relationship text not null,
  caregiver_email text not null,
  caregiver_phone text not null,
  -- Emergency contact
  emergency_contact_name text,
  emergency_contact_phone text,
  -- Preferences
  accommodation_notes text,
  dietary_notes text,
  -- Payment
  scholarship_requested boolean not null default false,
  payment_status text not null default 'pending', -- pending | paid | scholarship | canceled | refunded
  stripe_session_id text,
  stripe_payment_intent_id text,
  -- Status
  registration_status text not null default 'incomplete', -- incomplete | complete | waitlist | canceled
  -- Meta
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row-level security: only service role can read/write
alter table registrations enable row level security;

-- Allow server-side service role full access (no policies needed for service role)
-- For admin access, add appropriate policies

-- Trigger to update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_registrations_updated_at
  before update on registrations
  for each row execute function update_updated_at();
