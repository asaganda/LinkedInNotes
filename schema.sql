-- LinkedIn Notes — Supabase Schema
-- Run this in the Supabase SQL editor to create the tables.

create table connections (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  job_title     text not null,
  company       text,
  linkedin_url  text not null unique,
  phone         text,
  email         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create table notes (
  id             uuid primary key default gen_random_uuid(),
  connection_id  uuid references connections(id) on delete cascade,
  body           text not null,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);