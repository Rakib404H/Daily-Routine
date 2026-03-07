"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthHeaderProps {
  userId: string | null;
  email: string;
  fullName: string;
}

export function AuthHeader({ userId, email, fullName }: AuthHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  if (!userId) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/login")}
        className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <LogIn className="mr-1.5 h-3.5 w-3.5" />
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
        {(fullName || email)[0].toUpperCase()}
      </div>
      <span className="hidden text-sm text-gray-700 dark:text-gray-300 sm:inline">
        {fullName || email.split("@")[0]}
      </span>
      <button
        onClick={handleLogout}
        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        title="Log out"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
