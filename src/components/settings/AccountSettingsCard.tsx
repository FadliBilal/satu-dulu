"use client";

import React from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { Profile } from "@/lib/types";

export interface AccountSettingsCardProps {
  profile: Profile;
  user: any;
  isSupabaseActive: boolean;
  onLogout: () => void;
}

export const AccountSettingsCard: React.FC<AccountSettingsCardProps> = ({
  profile,
  user,
  isSupabaseActive,
  onLogout,
}) => {
  return (
    <Card className="mb-6 p-5 sm:p-6 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-satublue-50 dark:bg-satublue-950/70 border border-satublue-100 dark:border-satublue-800 flex items-center justify-center text-satublue-700 dark:text-satublue-300 font-semibold text-sm">
            {profile.username ? (
              profile.username.slice(0, 2).toUpperCase()
            ) : user?.email ? (
              user.email.slice(0, 2).toUpperCase()
            ) : (
              <User className="w-5 h-5 text-slate-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {profile.username ? `@${profile.username}` : user ? user.email : "Mode Tamu (Offline)"}
              </h3>
              <Badge variant={isSupabaseActive ? "success" : "neutral"}>
                {isSupabaseActive ? "Supabase Cloud" : "Lokal Offline"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user?.email && profile.username ? `${user.email} • ` : ""}
              {isSupabaseActive
                ? "Tersinkronisasi aman ke PostgreSQL cloud dengan Row Level Security."
                : "Data disimpan di penyimpanan lokal browser Anda."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Keluar
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="blue" size="sm" className="text-xs">
                Masuk / Daftar Akun
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};
