"use client";

import React, { useState, useEffect } from "react";
import { Archive, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { VaultDay } from "@/lib/types";
import { getRepository } from "@/lib/repository";

export const VaultView: React.FC = () => {
  const [vaultDays, setVaultDays] = useState<VaultDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  useEffect(() => {
    async function loadVault() {
      try {
        const repo = getRepository();
        const history = await repo.getVaultHistory();
        setVaultDays(history);
      } finally {
        setLoading(false);
      }
    }
    loadVault();
  }, []);

  const toggleExpand = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400 dark:text-slate-500 font-mono">
        Memuat The Vault...
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-2 sm:py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Archive className="w-5 h-5 text-slate-900 dark:text-slate-100" />
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            The Vault
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Bukti akumulatif dari konsistensi eksekusi pribadi Anda.
        </p>
      </div>

      {vaultDays.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 text-xs text-slate-400 dark:text-slate-500">
          Belum ada hari yang tersimpan di Vault.
        </div>
      ) : (
        <div className="space-y-3">
          {vaultDays.map((day) => {
            const isExpanded = expandedDate === day.date;
            const dateObj = new Date(day.date + "T00:00:00");
            const dateHeader = new Intl.DateTimeFormat("id-ID", {
              month: "short",
              day: "numeric",
              weekday: "short",
            }).format(dateObj);

            return (
              <Card
                key={day.date}
                className="overflow-hidden border border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-gray-300 dark:hover:border-slate-700 transition-all p-0"
              >
                <div
                  onClick={() => toggleExpand(day.date)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 block capitalize">
                        {dateHeader}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                          {day.completedCount} / {day.committedCount}
                        </span>
                        {day.isPerfectDay && (
                          <Badge variant="success" size="sm">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            HARI SEMPURNA
                          </Badge>
                        )}
                        {day.carriedCount > 0 && (
                          <Badge variant="warning" size="sm">
                            {day.carriedCount} Dialihkan
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                    {day.totalFocusSeconds > 0 && (
                      <span className="font-mono hidden sm:inline-block">
                        {Math.round(day.totalFocusSeconds / 60)}m fokus
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Commitment Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-slate-800 bg-satubg-light/60 dark:bg-slate-950/60 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2 font-mono">
                      KOMITMEN PADA HARI TERSEBUT
                    </span>
                    {day.commitments.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100/60 dark:border-slate-800/60 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              c.status === "completed"
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          />
                          <span
                            className={
                              c.status === "completed"
                                ? "text-slate-900 dark:text-slate-100 font-medium"
                                : "text-slate-600 dark:text-slate-400"
                            }
                          >
                            {c.title}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                          {c.focus_seconds > 0 ? `${Math.round(c.focus_seconds / 60)}m` : ""}
                        </span>
                      </div>
                    ))}

                    {day.reflection && (
                      <div className="mt-3 p-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-xs">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                          Refleksi: {day.reflection.reflection_reason.replace("_", " ")}
                        </span>
                        {day.reflection.notes && (
                          <p className="text-slate-600 dark:text-slate-400 mt-1 italic">
                            "{day.reflection.notes}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
