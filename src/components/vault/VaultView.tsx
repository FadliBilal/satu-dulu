"use client";

import React, { useState, useEffect } from "react";
import { Archive, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
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
      <div className="py-24 text-center text-xs text-satutext-muted">
        Memuat The Vault...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-28">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Archive className="w-5 h-5 text-satutext-primary" />
          <h1 className="text-2xl font-semibold tracking-tight text-satutext-primary">
            The Vault
          </h1>
        </div>
        <p className="text-xs text-satutext-secondary">
          Bukti akumulatif dari konsistensi eksekusi pribadi Anda.
        </p>
      </div>

      {vaultDays.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-gray-200 rounded-2xl bg-white text-xs text-satutext-muted">
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
                className="overflow-hidden border border-gray-200/80 bg-white hover:border-gray-300 transition-all p-0"
              >
                <div
                  onClick={() => toggleExpand(day.date)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <span className="text-xs font-mono font-medium text-satutext-muted block capitalize">
                        {dateHeader}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-base font-semibold text-satutext-primary">
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

                  <div className="flex items-center gap-4 text-xs text-satutext-muted">
                    {day.totalFocusSeconds > 0 && (
                      <span className="font-mono hidden sm:inline-block">
                        {Math.round(day.totalFocusSeconds / 60)}m fokus
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-satutext-secondary" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-satutext-secondary" />
                    )}
                  </div>
                </div>

                {/* Expanded Commitment Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-satubg-light/60 space-y-2">
                    <span className="text-[11px] font-semibold text-satutext-muted uppercase tracking-wider block mb-2 font-mono">
                      KOMITMEN PADA HARI TERSEBUT
                    </span>
                    {day.commitments.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100/60 last:border-0"
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
                                ? "text-satutext-primary font-medium"
                                : "text-satutext-secondary"
                            }
                          >
                            {c.title}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-satutext-muted">
                          {c.focus_seconds > 0 ? `${Math.round(c.focus_seconds / 60)}m` : ""}
                        </span>
                      </div>
                    ))}

                    {day.reflection && (
                      <div className="mt-3 p-3 rounded-lg bg-white border border-gray-200 text-xs">
                        <span className="font-semibold text-satutext-primary block">
                          Refleksi: {day.reflection.reflection_reason.replace("_", " ")}
                        </span>
                        {day.reflection.notes && (
                          <p className="text-satutext-secondary mt-1 italic">
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
