-- Migration 003: Sync data table
-- Stores user data for cloud synchronization across devices

create table if not exists sync_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  data_type text not null,
  data jsonb not null default '{}'::jsonb,
  version integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, data_type)
);

-- Enable RLS
alter table sync_data enable row level security;

-- Policies
create policy "Users can CRUD own sync data"
  on sync_data for all
  using (auth.uid() = user_id);

-- Indexes
create index if not exists idx_sync_data_user_id on sync_data(user_id);
create index if not exists idx_sync_data_type on sync_data(data_type);
