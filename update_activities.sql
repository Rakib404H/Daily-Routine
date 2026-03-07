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
