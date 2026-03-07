"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const displayName = fullName || email.split("@")[0];
  const initial = (fullName || email)[0].toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none ring-offset-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:ring-offset-gray-950">
        <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-blue-600 text-[11px] sm:text-xs font-bold text-white transition-colors hover:bg-blue-700">
          {initial}
        </span>
        <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 sm:inline">
          {displayName}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
              {email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950/50 dark:focus:text-red-300 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
