-- Create high_scores table
create table if not exists public.high_scores (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null check (char_length(name) <= 3), -- 3 letter initials
  score integer not null,
  level integer not null default 1
);

-- Enable RLS
alter table public.high_scores enable row level security;

-- Create policies
-- Allow anyone to read high scores
create policy "Public High Scores Read"
  on public.high_scores for select
  using (true);

-- Allow anyone to insert high scores (Retro arcade style, no auth needed)
create policy "Public High Scores Insert"
  on public.high_scores for insert
  with check (true);
