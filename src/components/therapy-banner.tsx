"use client";

import { Heart, X, Code2 } from "lucide-react";
import { useState } from "react";

export function TherapyBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative flex items-start gap-3 rounded-lg border border-pink-200 bg-pink-50 px-4 py-3 dark:border-pink-900/50 dark:bg-pink-950/20">
      <Heart className="mt-0.5 h-4 w-4 shrink-0 text-pink-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-pink-800 dark:text-pink-300">
          Therapist&apos;s Weekly Homework 
        </p>
        <p className="mt-1 text-xs text-pink-600/80 dark:text-pink-400/80">
          This is a custom-built, desktop-first app for tracking my daily activities as a homework assignment given by my therapist. Consistency builds healthy habits! 🖥️✨
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded p-1 text-pink-400 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/30 dark:hover:text-pink-300"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
