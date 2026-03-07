export interface Activity {
  id: string;
  name: string;
  icon: string;
  time_label: string;
  sort_order: number;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_id: string;
  custom_name: string | null;
}

export type EntryStatus = "ontime" | "delayed" | "unable";

export interface RoutineEntry {
  id: string;
  user_id: string;
  activity_id: string;
  date: string; // YYYY-MM-DD
  status: EntryStatus;
  notes: string | null;
  created_at: string;
}
