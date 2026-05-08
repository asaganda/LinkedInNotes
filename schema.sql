-- LinkedIn Notes — Supabase Schema
-- Run this in the Supabase SQL editor to create the tables.

create table connections (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id),
  name          text not null,
  job_title     text,
  company       text,
  linkedin_url  text not null unique,
  phone         text,
  email         text,
  avatar_url    text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table connections enable row level security;

create policy "Users can only access their own connections"
  on connections for all
  using (user_id = auth.uid());

create table notes (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id),
  connection_id  uuid references connections(id) on delete cascade,
  body           text not null,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

alter table notes enable row level security;

create policy "Users can only access their own notes"
  on notes for all
  using (user_id = auth.uid());