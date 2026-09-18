"use client";

import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Card } from "@/components/ui";
import { Theme } from "@/lib/theme-context";

export interface ThemeSettingsCardProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeSettingsCard: React.FC<ThemeSettingsCardProps> = ({ theme, setTheme }) => {
  return (
    <Card className="mb-6 p-5 sm:p-6 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-satublue-50 dark:bg-satublue-950/70 text-satublue-600 dark:text-satublue-300 flex items-center justify-center">
          {theme === "dark" ? (
            <Moon className="w-4 h-4" />
          ) : theme === "light" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Monitor className="w-4 h-4" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Tema Tampilan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pilih mode terang, gelap untuk fokus malam, atau ikuti preferensi sistem perangkat Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-medium transition-all ${
            theme === "light"
              ? "bg-satublue-50 dark:bg-satublue-950/50 border-satublue-500 text-satublue-700 dark:text-satublue-300 shadow-xs"
              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Terang</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-medium transition-all ${
            theme === "dark"
              ? "bg-satublue-50 dark:bg-satublue-950/50 border-satublue-500 text-satublue-700 dark:text-satublue-300 shadow-xs"
              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <Moon className="w-4 h-4 text-indigo-400" />
          <span>Gelap</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("system")}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-medium transition-all ${
            theme === "system"
              ? "bg-satublue-50 dark:bg-satublue-950/50 border-satublue-500 text-satublue-700 dark:text-satublue-300 shadow-xs"
              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <Monitor className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Sistem</span>
        </button>
      </div>
    </Card>
  );
};
