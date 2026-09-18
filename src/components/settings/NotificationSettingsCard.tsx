"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";

export interface NotificationSettingsCardProps {
  permission: NotificationPermission;
  onEnable: () => void;
  onTest: () => void;
}

export const NotificationSettingsCard: React.FC<NotificationSettingsCardProps> = ({
  permission,
  onEnable,
  onTest,
}) => {
  const isGranted = permission === "granted";

  return (
    <Card className="mb-6 p-5 sm:p-6 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-satublue-50 dark:bg-satublue-950/70 text-satublue-600 dark:text-satublue-300 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Notifikasi Ritual Malam ("Besok Butuh Keputusan")
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pengingat malam hari untuk menentukan komitmen sebelum tidur.
            </p>
          </div>
        </div>
        <Badge variant={isGranted ? "success" : "warning"}>
          {isGranted ? "Aktif" : "Belum Aktif"}
        </Badge>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {!isGranted ? (
          <Button size="sm" variant="blue" onClick={onEnable}>
            Aktifkan Notifikasi Browser
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={onTest}>
            Kirim Notifikasi Uji Coba
          </Button>
        )}
      </div>
    </Card>
  );
};
