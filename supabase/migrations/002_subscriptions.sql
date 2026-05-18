-- Migration 002: Subscriptions table
-- Tracks Stripe subscription state for each user

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  stripe_price_id text,
  status text not null default 'free',
  plan text not null default 'free',
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table subscriptions enable row level security;

-- Policies
create policy "Users can view own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role can manage all subscriptions"
  on subscriptions for all
  using (auth.jwt()->>'role' = 'service_role');

-- Index for fast lookups
create index if not exists idx_subscriptions_user_id on subscriptions(user_id);
create index if not exists idx_subscriptions_stripe_id on subscriptions(stripe_subscription_id);
