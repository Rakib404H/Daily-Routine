"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getWeekDates, formatDateKey, getDayName, isToday, isPastDate } from "@/lib/dates";
import type { Activity, RoutineEntry, EntryStatus } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sun,
  Moon,
  Coffee,
  Dumbbell,
  BookOpen,
  ShowerHead,
  Utensils,
  MapPin,
  Soup,
  Pencil,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sun: Sun, moon: Moon, coffee: Coffee, dumbbell: Dumbbell,
  "book-open": BookOpen, "shower-head": ShowerHead,
  utensils: Utensils, "map-pin": MapPin, soup: Soup,
};

const STATUS_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  ontime: { label: "On time", emoji: "✅", color: "text-emerald-700 dark:text-emerald-400" },
  delayed: { label: "Delayed", emoji: "⏳", color: "text-amber-700 dark:text-amber-400" },
  unable: { label: "Unable", emoji: "❌", color: "text-red-700 dark:text-red-400" },
};

interface RoutineGridProps {
  currentDate: Date;
  userId: string | null;
  onLoginRequired: () => void;
}

export function RoutineGrid({ currentDate, userId, onLoginRequired }: RoutineGridProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [entries, setEntries] = useState<Record<string, RoutineEntry>>({});
  const [loading, setLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const supabase = createClient();
  const weekDates = getWeekDates(currentDate);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const sb = createClient();
    const { data: acts } = await sb.from("activities").select("*").order("sort_order");
    if (acts) setActivities(acts);

    if (userId) {
      const { data: customs } = await sb.from("user_activities").select("*").eq("user_id", userId);
      if (customs) {
        const map: Record<string, string> = {};
        customs.forEach((c: { activity_id: string; custom_name: string | null }) => {
          if (c.custom_name) map[c.activity_id] = c.custom_name;
        });
        setCustomNames(map);
      }
      const startDate = formatDateKey(weekDates[0]);
      const endDate = formatDateKey(weekDates[6]);
      const { data: ents } = await sb.from("routine_entries").select("*").eq("user_id", userId).gte("date", startDate).lte("date", endDate);
      if (ents) {
        const map: Record<string, RoutineEntry> = {};
        ents.forEach((e: RoutineEntry) => { map[`${e.date}_${e.activity_id}`] = e; });
        setEntries(map);
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, userId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const setStatus = async (activityId: string, date: Date, newStatus: string) => {
    if (!userId) { onLoginRequired(); return; }
    const dateKey = formatDateKey(date);
    const cellKey = `${dateKey}_${activityId}`;
    const existing = entries[cellKey];

    if (newStatus === "none") {
      // Clear entry
      if (existing) {
        setEntries((prev) => { const next = { ...prev }; delete next[cellKey]; return next; });
        await supabase.from("routine_entries").delete().eq("id", existing.id);
      }
      return;
    }

    if (existing) {
      setEntries((prev) => ({ ...prev, [cellKey]: { ...existing, status: newStatus as EntryStatus } }));
      await supabase.from("routine_entries").update({ status: newStatus }).eq("id", existing.id);
    } else {
      const temp: RoutineEntry = {
        id: "temp-" + cellKey, user_id: userId, activity_id: activityId,
        date: dateKey, status: newStatus as EntryStatus, notes: null, created_at: new Date().toISOString(),
      };
      setEntries((prev) => ({ ...prev, [cellKey]: temp }));
      const { data } = await supabase
        .from("routine_entries")
        .insert({ user_id: userId, activity_id: activityId, date: dateKey, status: newStatus })
        .select().single();
      if (data) setEntries((prev) => ({ ...prev, [cellKey]: data }));
    }
  };

  const startRename = (activityId: string, currentName: string) => {
    if (!userId) { onLoginRequired(); return; }
    setEditingActivity(activityId);
    setEditName(currentName);
  };

  const saveRename = async (activityId: string) => {
    if (!userId || !editName.trim()) { setEditingActivity(null); return; }
    const trimmed = editName.trim();
    setCustomNames((prev) => ({ ...prev, [activityId]: trimmed }));
    setEditingActivity(null);
    const { data: existing } = await supabase.from("user_activities").select("id").eq("user_id", userId).eq("activity_id", activityId).single();
    if (existing) {
      await supabase.from("user_activities").update({ custom_name: trimmed }).eq("id", existing.id);
    } else {
      await supabase.from("user_activities").insert({ user_id: userId, activity_id: activityId, custom_name: trimmed });
    }
  };

  const getActivityName = (a: Activity) => customNames[a.id] || a.name;

  // --- Performance calculations ---
  const getDayStats = (date: Date) => {
    const dateKey = formatDateKey(date);
    const isPast = isPastDate(date);
    let ontime = 0, delayed = 0, unable = 0, total = activities.length;
    
    activities.forEach((a) => {
      let s = entries[`${dateKey}_${a.id}`]?.status;
      // Auto-fill past unfilled days as "unable"
      if (!s && isPast) s = "unable";
      
      if (s === "ontime") ontime++;
      else if (s === "delayed") delayed++;
      else if (s === "unable") unable++;
    });
    
    const filled = ontime + delayed + unable;
    const score = total > 0 ? Math.round((ontime / total) * 100) : 0;
    return { ontime, delayed, unable, filled, total, score };
  };

  const getWeekStats = () => {
    let ontime = 0, delayed = 0, unable = 0;
    const total = activities.length * 7;
    weekDates.forEach((date) => {
      const s = getDayStats(date);
      ontime += s.ontime;
      delayed += s.delayed;
      unable += s.unable;
    });
    const filled = ontime + delayed + unable;
    const score = total > 0 ? Math.round((ontime / total) * 100) : 0;
    return { ontime, delayed, unable, filled, total, score };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500">No activities found.</p>
        <p className="mt-1 text-sm text-gray-400">Run the SQL setup in your Supabase dashboard.</p>
      </div>
    );
  }

  const weekStats = getWeekStats();

  return (
    <div className="space-y-5">
      {/* Grid */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="sticky left-0 z-10 bg-gray-50 px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:bg-gray-900 dark:text-gray-500 sm:px-4">
                Day
              </th>
              {activities.map((activity) => {
                const Icon = iconMap[activity.icon] || Sun;
                const name = getActivityName(activity);
                return (
                  <th key={activity.id} className="group bg-gray-50 px-1.5 py-2.5 text-center dark:bg-gray-900 sm:px-2">
                    <div className="flex flex-col items-center gap-0.5">
                      <Icon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                      {editingActivity === activity.id ? (
                        <input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => saveRename(activity.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveRename(activity.id);
                            if (e.key === "Escape") setEditingActivity(null);
                          }}
                          className="w-16 rounded border border-blue-300 bg-white px-1 py-0.5 text-center text-[11px] outline-none dark:border-blue-600 dark:bg-gray-800 dark:text-white sm:w-20"
                        />
                      ) : (
                        <div className="flex items-center gap-0.5">
                          <span className="whitespace-pre-line text-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 sm:text-xs">
                            {name}
                          </span>
                          {userId && (
                            <button
                              onClick={() => startRename(activity.id, name)}
                              className="rounded p-0.5 text-gray-300 opacity-0 transition-opacity hover:text-gray-500 group-hover:opacity-100 dark:text-gray-600"
                            >
                              <Pencil className="h-2.5 w-2.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
              <th className="bg-gray-50 px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:bg-gray-900 dark:text-gray-500">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {weekDates.map((date) => {
              const today = isToday(date);
              const dayStats = getDayStats(date);
              const isPast = isPastDate(date);
              
              return (
                <tr
                  key={formatDateKey(date)}
                  className={`border-t border-gray-50 dark:border-gray-800/50 ${
                    today ? "bg-blue-50/60 dark:bg-blue-950/15" : ""
                  }`}
                >
                  <td className={`sticky left-0 z-10 px-3 py-2 sm:px-4 ${today ? "bg-blue-50/80 dark:bg-blue-950/20" : "bg-white dark:bg-gray-900"}`}>
                    <div className="flex items-center gap-1.5">
                      <div>
                        <div className={`text-xs font-bold sm:text-sm ${today ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"}`}>
                          {getDayName(date)}
                        </div>
                        <div className={`text-[10px] ${today ? "text-blue-400" : "text-gray-400 dark:text-gray-500"}`}>
                          {date.getDate()}/{date.getMonth() + 1}
                        </div>
                      </div>
                      {today && (
                        <span className="rounded bg-blue-100 px-1 py-px text-[8px] font-bold uppercase text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                          Today
                        </span>
                      )}
                    </div>
                  </td>

                  {activities.map((activity) => {
                    const dateKey = formatDateKey(date);
                    const cellKey = `${dateKey}_${activity.id}`;
                    const entry = entries[cellKey];
                    let status = entry?.status || "";
                    
                    // Auto-fill past dates
                    if (!status && isPast) status = "unable";

                    return (
                      <td key={activity.id} className="px-1 py-1.5 text-center sm:px-2">
                        <Select
                          value={status || "none"}
                          onValueChange={(val) => setStatus(activity.id, date, val as string)}
                        >
                          <SelectTrigger
                            size="sm"
                            className={`mx-auto w-[68px] justify-center text-[11px] sm:w-[80px] sm:text-xs ${
                              status === "ontime"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                                : status === "delayed"
                                  ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                                  : status === "unable"
                                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                                    : "border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
                            }`}
                          >
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">— Clear</SelectItem>
                            <SelectItem value="ontime">✅ On time</SelectItem>
                            <SelectItem value="delayed">⏳ Delayed</SelectItem>
                            <SelectItem value="unable">❌ Unable</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    );
                  })}

                  {/* Day score */}
                  <td className="px-2 py-1.5 text-center">
                    <div className={`text-sm font-bold ${
                      dayStats.score >= 80 ? "text-emerald-600 dark:text-emerald-400"
                        : dayStats.score >= 50 ? "text-amber-600 dark:text-amber-400"
                          : dayStats.filled > 0 ? "text-red-600 dark:text-red-400"
                            : "text-gray-300 dark:text-gray-600"
                    }`}>
                      {dayStats.filled > 0 ? `${dayStats.score}%` : "—"}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Weekly Performance Report */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-gray-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Week Score</span>
          </div>
          <div className={`mt-2 text-2xl font-bold ${
            weekStats.score >= 80 ? "text-emerald-600 dark:text-emerald-400"
              : weekStats.score >= 50 ? "text-amber-600 dark:text-amber-400"
                : weekStats.filled > 0 ? "text-red-600 dark:text-red-400"
                  : "text-gray-300 dark:text-gray-600"
          }`}>
            {weekStats.filled > 0 ? `${weekStats.score}%` : "—"}
          </div>
          <p className="mt-1 text-[11px] text-gray-400">On-time rate</p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/10">
          <div className="flex items-center gap-2 text-emerald-500">
            <BarChart3 className="h-4 w-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">On Time</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {weekStats.ontime}
          </div>
          <p className="mt-1 text-[11px] text-emerald-500/70">of {weekStats.total} total</p>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-950/10">
          <div className="flex items-center gap-2 text-amber-500">
            <BarChart3 className="h-4 w-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Delayed</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-400">
            {weekStats.delayed}
          </div>
          <p className="mt-1 text-[11px] text-amber-500/70">of {weekStats.total} total</p>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 dark:border-red-900/30 dark:bg-red-950/10">
          <div className="flex items-center gap-2 text-red-500">
            <BarChart3 className="h-4 w-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Unable</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-red-700 dark:text-red-400">
            {weekStats.unable}
          </div>
          <p className="mt-1 text-[11px] text-red-500/70">of {weekStats.total} total</p>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <BarChart3 className="h-4 w-4 text-gray-400" />
          Daily Breakdown
        </h3>
        <div className="space-y-2">
          {weekDates.map((date) => {
            const today = isToday(date);
            const stats = getDayStats(date);
            const barWidth = stats.total > 0 ? (stats.filled / stats.total) * 100 : 0;
            const ontimeWidth = stats.total > 0 ? (stats.ontime / stats.total) * 100 : 0;
            const delayedWidth = stats.total > 0 ? (stats.delayed / stats.total) * 100 : 0;

            return (
              <div key={formatDateKey(date)} className="flex items-center gap-3">
                <span className={`w-10 text-xs font-medium ${today ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                  {getDayName(date)}
                </span>
                <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  {barWidth > 0 && (
                    <>
                      <div
                        className="absolute left-0 top-0 h-full bg-emerald-400 transition-all duration-500 dark:bg-emerald-500"
                        style={{ width: `${ontimeWidth}%` }}
                      />
                      <div
                        className="absolute top-0 h-full bg-amber-400 transition-all duration-500 dark:bg-amber-500"
                        style={{ left: `${ontimeWidth}%`, width: `${delayedWidth}%` }}
                      />
                      <div
                        className="absolute top-0 h-full bg-red-400 transition-all duration-500 dark:bg-red-500"
                        style={{ left: `${ontimeWidth + delayedWidth}%`, width: `${barWidth - ontimeWidth - delayedWidth}%` }}
                      />
                    </>
                  )}
                </div>
                <span className="w-14 text-right text-xs text-gray-400">
                  {stats.filled}/{stats.total}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> On time</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Delayed</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400" /> Unable</span>
        </div>
      </div>
    </div>
  );
}
