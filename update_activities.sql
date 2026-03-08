-- Run this in your Supabase SQL Editor to update your default activities
-- This deletes the old ones and inserts the newly formatted ones

-- 1. Optional: if you want to wipe existing routine entries, you can run: 
-- DELETE FROM routine_entries;

-- 2. Delete existing default activities
DELETE FROM activities;

-- 3. Insert the new ones with exact line breaks 
INSERT INTO activities (name, icon, time_label, sort_order) VALUES
  ('Wake Up
6 AM', 'sun', '6:00 AM', 1),
  ('Breakfast
6-7 AM', 'coffee', '6:00-7:00 AM', 2),
  ('DevOps Pr
7-10 AM', 'terminal', '7:00-10:00 AM', 3),
  ('Sleep
10-12 PM', 'moon', '10:00 AM-12:00 PM', 4),
  ('Lunch
12-1 PM', 'utensils', '12:00-1:00 PM', 5),
  ('Coffee Br
1-2 PM', 'coffee', '1:00-2:00 PM', 6),
  ('DevOps Pr
2-6 PM', 'terminal', '2:00-6:00 PM', 7),
  ('Break
6-7:30 PM', 'coffee', '6:00-7:30 PM', 8),
  ('Other Pr
7:30-8:30 PM', 'folder', '7:30-8:30 PM', 9),
  ('Dinner
8:30-9 PM', 'soup', '8:30-9:00 PM', 10),
  ('Book
9-11 PM', 'book-open', '9:00-11:00 PM', 11),
  ('Sleep
11-6 AM', 'moon', '11:00 PM-6:00 AM', 12);

