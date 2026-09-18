"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "./Navbar";
import { useAuth } from "@/lib/supabase/auth-context";
import { AuthView } from "@/components/auth/AuthView";
import { Logo } from "../ui/Logo";

export const AppLayoutClient: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading, isGuest, isSupabaseEnabled } = useAuth();

  // 1. Loading state with calm, ambient pulse
  if (isLoading) {
    return (
      <div className="min-h-screen bg-satubg-light dark:bg-[#090D16] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-satublue-50 dark:bg-satublue-950/60 border border-satublue-100 dark:border-satublue-800 flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-satublue-600 animate-ping" />
          </div>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            Menyiapkan ruang eksekusi...
          </span>
        </div>
      </div>
    );
  }

  // 2. If Supabase is configured and user is neither logged in nor continuing as guest, show AuthView
  if (isSupabaseEnabled && !user && !isGuest) {
    return (
      <div className="min-h-screen bg-satubg-light dark:bg-[#090D16] flex flex-col selection:bg-satublue-100 dark:selection:bg-satublue-900">
        <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0B0F17]/80 backdrop-blur-md py-3.5 px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Logo showText={true} className="w-5 h-5" textSize="sm" />
            </Link>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              Satu hal dalam satu waktu
            </span>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <AuthView />
        </main>
      </div>
    );
  }

  // 3. Authenticated or Guest Mode: render Navbar + responsive main container
  return (
    <div className="min-h-screen bg-satubg-light dark:bg-[#090D16] flex flex-col selection:bg-satublue-100 dark:selection:bg-satublue-900 relative">
      {/* Gentle ambient aura in the backdrop */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-b from-blue-50/50 dark:from-blue-950/20 via-indigo-50/20 dark:via-indigo-950/10 to-transparent blur-3xl" />
      </div>

      <Navbar />

      {/* Main content wrapper with generous responsive padding (pb-28 for mobile bottom bar safe area) */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 pb-28 md:pb-16 pt-4 sm:pt-6">
        {children}
      </main>
    </div>
  );
};
