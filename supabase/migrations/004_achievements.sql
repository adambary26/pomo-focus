-- Migration 004: Achievements and user stats tables
-- Tracks user achievements, streaks, and lifetime statistics

create table if not exists user_stats (
  user_id uuid references users(id) on delete cascade primary key,
  current_streak integer default 0,
  longest_streak integer default 0,
  total_pomodoros integer default 0,
  total_focus_seconds integer default 0,
  last_active_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  badge_id text not null,
  unlocked_at timestamptz default now(),
  unique(user_id, badge_id)
);

-- Enable RLS
alter table user_stats enable row level security;
alter table achievements enable row level security;

-- Policies for user_stats
create policy "Users can view own stats"
  on user_stats for select
  using (auth.uid() = user_id);

create policy "Users can update own stats"
  on user_stats for update
  using (auth.uid() = user_id);

create policy "Service role can manage all stats"
  on user_stats for all
  using (auth.jwt()->>'role' = 'service_role');

-- Policies for achievements
create policy "Users can view own achievements"
  on achievements for select
  using (auth.uid() = user_id);

create policy "Service role can manage all achievements"
  on achievements for all
  using (auth.jwt()->>'role' = 'service_role');

-- Indexes
create index if not exists idx_achievements_user_id on achievements(user_id);
create index if not exists idx_achievements_badge_id on achievements(badge_id);
