"use client";

import React from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Card, Button } from "@/components/ui";

export interface DangerZoneCardProps {
  onOpenModal: () => void;
}

export const DangerZoneCard: React.FC<DangerZoneCardProps> = ({ onOpenModal }) => {
  return (
    <Card className="p-5 sm:p-6 bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Zona Bahaya: Hapus Akun & Data</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
          Menghapus akun Anda beserta seluruh riwayat komitmen, inbox, dan vault secara permanen. Tindakan ini tidak dapat dibatalkan.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onOpenModal}
        className="shrink-0 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-950/50"
      >
        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
        Hapus Akun
      </Button>
    </Card>
  );
};
