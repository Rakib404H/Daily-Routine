# Supabase Database Setup

Run these SQL commands in your Supabase SQL Editor (Dashboard → SQL Editor → New Query).  
Run them **in order**, one block at a time.

## Step 1: Create Tables

```sql
-- Activities table (default activities shared by all users)
create table activities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  icon text,
  time_label text,
  sort_order int not null
);

-- User-customized activity names
create table user_activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  activity_id uuid references activities(id) on delete cascade,
  custom_name text,
  unique(user_id, activity_id)
);

-- Routine entries (status: 'ontime', 'delayed', or 'unable')
create table routine_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  activity_id uuid references activities(id) on delete cascade,
  date date not null,
  status text check (status in ('ontime', 'delayed', 'unable')) not null default 'ontime',
  notes text,
  created_at timestamptz default now(),
  unique(user_id, activity_id, date)
);
```

## Step 2: Enable Row Level Security

```sql
alter table routine_entries enable row level security;

create policy "Users can view own entries"
  on routine_entries for select using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on routine_entries for insert with check (auth.uid() = user_id);

create policy "Users can update own entries"
  on routine_entries for update using (auth.uid() = user_id);

create policy "Users can delete own entries"
  on routine_entries for delete using (auth.uid() = user_id);

alter table activities enable row level security;

create policy "Anyone can read activities"
  on activities for select using (true);

alter table user_activities enable row level security;

create policy "Users can view own custom names"
  on user_activities for select using (auth.uid() = user_id);

create policy "Users can insert own custom names"
  on user_activities for insert with check (auth.uid() = user_id);

create policy "Users can update own custom names"
  on user_activities for update using (auth.uid() = user_id);
```

## Step 3: Seed Default Activities

```sql
insert into activities (name, icon, time_label, sort_order) values
  ('Wake Up
6 AM', 'sun', '6:00 AM', 1),
  ('Breakfast
7 AM', 'coffee', '7:00 AM', 2),
  ('DevOps Pr
10 AM', 'terminal', '10:00 AM', 3),
  ('Sleep
12 PM', 'moon', '12:00 PM', 4),
  ('Lunch
1 PM', 'utensils', '1:00 PM', 5),
  ('Coffee Br
2 PM', 'coffee', '2:00 PM', 6),
  ('DevOps Pr
6 PM', 'terminal', '6:00 PM', 7),
  ('Break
7:30 PM', 'coffee', '7:30 PM', 8),
  ('Other Pr
8:30 PM', 'folder', '8:30 PM', 9),
  ('Dinner
9 PM', 'soup', '9:00 PM', 10),
  ('Book
11 PM', 'book-open', '11:00 PM', 11),
  ('Sleep
6 AM', 'moon', '6:00 AM', 12);
```
