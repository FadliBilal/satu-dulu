"use client";

import React, { useState } from "react";
import { VaultView } from "@/components/vault/VaultView";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";
import { Archive, BarChart2 } from "lucide-react";

export default function VaultPage() {
  const [activeTab, setActiveTab] = useState<"vault" | "analytics">("vault");

  return (
    <div>
      {/* Subnav Tabs */}
      <div className="max-w-2xl mx-auto px-4 pt-6 flex items-center justify-center">
        <div className="inline-flex p-1 bg-satubg-subtle dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("vault")}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "vault"
                ? "bg-white dark:bg-slate-800 text-satutext-primary dark:text-slate-100 shadow-xs font-semibold"
                : "text-satutext-secondary dark:text-slate-400 hover:text-satutext-primary dark:hover:text-slate-100"
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            The Vault
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "analytics"
                ? "bg-white dark:bg-slate-800 text-satutext-primary dark:text-slate-100 shadow-xs font-semibold"
                : "text-satutext-secondary dark:text-slate-400 hover:text-satutext-primary dark:hover:text-slate-100"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Ritme Eksekusi
          </button>
        </div>
      </div>

      {activeTab === "vault" ? <VaultView /> : <AnalyticsView />}
    </div>
  );
}
