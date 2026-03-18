"use client";

import type { EntryStatus } from "@/lib/types";

const STORAGE_KEY = "routine_entries";

interface LocalEntry {
  status: EntryStatus;
  date: string;
  activity_id: string;
}

/**
 * Get all locally stored routine entries.
 * Returns a map keyed by "date_activityId".
 */
export function getLocalEntries(): Record<string, LocalEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save or update a single local entry.
 */
export function setLocalEntry(
  cellKey: string,
  activityId: string,
  date: string,
  status: EntryStatus
) {
  const entries = getLocalEntries();
  entries[cellKey] = { status, date, activity_id: activityId };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/**
 * Remove a single local entry.
 */
export function removeLocalEntry(cellKey: string) {
  const entries = getLocalEntries();
  delete entries[cellKey];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
