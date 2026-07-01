-- supabase/migrations/001_initial.sql

create table if not exists badge_results (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  session_id text not null,             -- anonymous session identifier
  domain text not null,                 -- e.g. 'product-management'
  tier text not null,                   -- 'expert' | 'proficient' | 'practicing' | 'aspiring'
  overall_score integer not null,       -- 0-100
  accuracy_avg integer not null,
  nuance_avg integer not null,
  vocab_avg integer not null,
  domain_ratings jsonb not null,        -- array of { domain, rating }
  assessed_at timestamptz default now()
);

-- Row level security: anyone can insert, no one can read others
alter table badge_results enable row level security;

create policy "insert_own" on badge_results
  for insert with check (true);
