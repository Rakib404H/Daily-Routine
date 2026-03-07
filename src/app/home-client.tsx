"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoutineGrid } from "@/components/routine-grid";
import { WeekNavigator } from "@/components/week-navigator";
import { TherapyBanner } from "@/components/therapy-banner";
import { AuthHeader } from "@/components/auth-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sun, Github } from "lucide-react";

interface HomeClientProps {
  userId: string | null;
  email: string;
  fullName: string;
}

export function HomeClient({ userId, email, fullName }: HomeClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const router = useRouter();

  const handlePrevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const handleToday = () => setCurrentDate(new Date());
  const handleLoginRequired = () => router.push("/login");

  return (
    <div className="min-h-screen bg-gray-50/80 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 sm:h-8 sm:w-8">
              <Sun className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-gray-900 dark:text-white">Daily Routine</h1>
              <p className="text-[10px] text-gray-400">Weekly habit tracker</p>
            </div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white sm:hidden">Daily Routine</h1>
          </div>

          {/* Week nav — hidden on very small screens, show below header */}
          <div className="hidden sm:block">
            <WeekNavigator
              currentDate={currentDate}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onToday={handleToday}
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <AuthHeader userId={userId} email={email} fullName={fullName} />
          </div>
        </div>

        {/* Mobile week nav */}
        <div className="flex justify-center border-t border-gray-100 py-1.5 dark:border-gray-800 sm:hidden">
          <WeekNavigator
            currentDate={currentDate}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            onToday={handleToday}
          />
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-5">
        <div className="space-y-4">
          {!userId && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-center text-xs text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-400 sm:text-sm">
              Viewing as guest —{" "}
              <button onClick={() => router.push("/login")} className="font-medium underline hover:no-underline">
                 Sign in
              </button>{" "}
              to track your routine
            </div>
          )}

          <RoutineGrid
            currentDate={currentDate}
            userId={userId}
            onLoginRequired={handleLoginRequired}
          />
          
          <TherapyBanner />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/80 py-4 dark:border-gray-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            Built by{" "}
            <a
              href="https://github.com/Rakib404H"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Github className="h-3 w-3" />
              Rakib
            </a>
          </div>
          <p className="text-[10px] text-gray-300 dark:text-gray-700">
            Therapist&apos;s Weekly Homework © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
