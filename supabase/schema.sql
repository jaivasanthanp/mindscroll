-- MindScroll — Supabase schema (optional: for production persistence + realtime leaderboards)
-- Run this in the Supabase SQL editor, then set SUPABASE_URL / SUPABASE_ANON_KEY in .env.local

create table if not exists games (
  id text primary key,
  title text,
  boss_name text,
  theme text,
  topic text,
  video_ids text[],
  video_titles text[],
  questions jsonb,
  created_at timestamptz default now()
);

create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  game_id text references games(id) on delete cascade,
  player_name text,
  score int,
  max_score int,
  accuracy numeric,
  created_at timestamptz default now()
);

create index if not exists scores_game_score_idx on scores (game_id, score desc);

-- Public access for a hackathon demo (tighten before real launch):
alter table games enable row level security;
alter table scores enable row level security;

drop policy if exists "public read games" on games;
create policy "public read games" on games for select using (true);
drop policy if exists "public insert games" on games;
create policy "public insert games" on games for insert with check (true);

drop policy if exists "public read scores" on scores;
create policy "public read scores" on scores for select using (true);
drop policy if exists "public insert scores" on scores;
create policy "public insert scores" on scores for insert with check (true);

-- Optional: realtime for live leaderboards
-- alter publication supabase_realtime add table scores;
