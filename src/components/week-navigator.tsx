"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatWeekRange, getWeekDates, isSameDay } from "@/lib/dates";

interface WeekNavigatorProps {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export function WeekNavigator({ currentDate, onPrevWeek, onNextWeek, onToday }: WeekNavigatorProps) {
  const weekDates = getWeekDates(currentDate);
  const today = new Date();
  const isCurrentWeek = weekDates.some((d) => isSameDay(d, today));

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevWeek}
        className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="min-w-[150px] text-center text-sm font-medium text-gray-700 dark:text-gray-200">
        {formatWeekRange(weekDates)}
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNextWeek}
        className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {!isCurrentWeek && (
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="ml-1 h-7 border-gray-300 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          Today
        </Button>
      )}
    </div>
  );
}
