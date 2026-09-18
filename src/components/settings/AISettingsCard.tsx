"use client";

import React from "react";
import { Sparkles, ExternalLink } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { isGeminiConfigured } from "@/lib/ai-clarify";

export interface AISettingsCardProps {
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  onSaveKey: () => void;
}

export const AISettingsCard: React.FC<AISettingsCardProps> = ({
  geminiKey,
  setGeminiKey,
  onSaveKey,
}) => {
  const isConfigured = isGeminiConfigured(geminiKey);

  return (
    <Card className="mb-6 p-5 sm:p-6 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-satublue-50 dark:bg-satublue-950/70 text-satublue-600 dark:text-satublue-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Klarifikasi AI (100% Gratis & Aman)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Membantu memecah tugas abstrak menjadi langkah konkret 25-60 menit.
            </p>
          </div>
        </div>
        <Badge variant={isConfigured ? "blue" : "neutral"}>
          {isConfigured ? "Gemini 1.5 Flash" : "Heuristik Offline"}
        </Badge>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
        <p>
          <strong>Default:</strong> Mesin offline bawaan (100% gratis Rp0 selamanya tanpa API key).
        </p>
        <p>
          <strong>Opsional:</strong> Dapatkan API key gratis tanpa kartu kredit di{" "}
          <a
            href="https://aistudio.google.com/"
            target="_blank"
            rel="noreferrer"
            className="text-satublue-600 dark:text-satublue-400 underline font-medium inline-flex items-center gap-0.5 hover:text-satublue-800"
          >
            Google AI Studio <ExternalLink className="w-3 h-3" />
          </a>.
        </p>
      </div>

      <div className="pt-1">
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Google Gemini API Key (Opsional)
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="password"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="AIzaSy... (Kosongkan jika ingin memakai mesin heuristik offline bawaan)"
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-satublue-500/20 focus:border-satublue-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
          />
          <Button size="sm" variant="outline" onClick={onSaveKey} className="shrink-0">
            Simpan Kunci
          </Button>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
          Kunci disimpan hanya di browser lokal Anda (atau lewat env <code>NEXT_PUBLIC_GEMINI_API_KEY</code>).
        </p>
      </div>
    </Card>
  );
};
