"use client";

import React from "react";
import { Globe, Briefcase, RotateCcw } from "lucide-react";
import { Card, Button, Select } from "@/components/ui";
import { Occupation } from "@/lib/types";
import { OCCUPATION_OPTIONS, TIMEZONE_OPTIONS } from "@/lib/constants/config";

export interface EnvironmentSettingsCardProps {
  timezone: string;
  occupation: Occupation;
  onUpdateTimezone: (tz: string) => void;
  onUpdateOccupation: (occ: Occupation) => void;
  onResetDemo: () => void;
}

export const EnvironmentSettingsCard: React.FC<EnvironmentSettingsCardProps> = ({
  timezone,
  occupation,
  onUpdateTimezone,
  onUpdateOccupation,
  onResetDemo,
}) => {
  return (
    <>
      {/* Timezone Configuration */}
      <Card className="mb-6 p-5 sm:p-6 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-satublue-50 dark:bg-satublue-950/70 text-satublue-600 dark:text-satublue-300 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Zona Waktu Eksekusi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Menentukan batas pergantian hari (00:00) dan pengalihan tugas tanpa rasa bersalah.
            </p>
          </div>
        </div>

        <Select
          value={timezone}
          onChange={(e) => onUpdateTimezone(e.target.value)}
          options={TIMEZONE_OPTIONS.map((tz) => ({ value: tz, label: tz }))}
        />
      </Card>

      {/* Occupation Context */}
      <Card className="mb-6 p-5 sm:p-6 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-satublue-50 dark:bg-satublue-950/70 text-satublue-600 dark:text-satublue-300 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Konteks / Pekerjaan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Menyesuaikan rekomendasi ritme kapasitas kerja harian Anda.
            </p>
          </div>
        </div>

        <Select
          value={occupation}
          onChange={(e) => onUpdateOccupation(e.target.value as Occupation)}
          options={OCCUPATION_OPTIONS}
        />
      </Card>

      {/* Reset Local Data (for offline guest / demo testing) */}
      <Card className="mb-6 p-5 sm:p-6 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Reset Data Demo Lokal
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mengembalikan data contoh awal untuk mahasiswa dan pekerja pengetahuan.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onResetDemo} className="shrink-0">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset Demo
        </Button>
      </Card>
    </>
  );
};
