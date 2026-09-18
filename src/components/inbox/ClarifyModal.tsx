"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Sparkles, Check } from "lucide-react";
import { InboxItem } from "@/lib/types";
import { clarifyTaskWithAI, ClarificationSuggestion, isGeminiConfigured } from "@/lib/ai-clarify";

interface ClarifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InboxItem | null;
  onSave: (clarified: {
    title: string;
    why_it_matters: string;
    estimated_duration: number;
  }) => void;
}

const ACTION_VERBS = [
  "Tulis",
  "Implementasi",
  "Refactor",
  "Review",
  "Siapkan",
  "Riset",
  "Perbaiki",
  "Pelajari",
  "Kirim",
];

export const ClarifyModal: React.FC<ClarifyModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [whyItMatters, setWhyItMatters] = useState("");
  const [duration, setDuration] = useState<number>(45);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<ClarificationSuggestion[]>([]);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setWhyItMatters(item.description || "");
      setDuration(45);
      setAiSuggestions([]);
    }
  }, [item]);

  if (!item) return null;

  const handleVerbClick = (verb: string) => {
    const words = title.split(" ");
    if (ACTION_VERBS.includes(words[0])) {
      words[0] = verb;
      setTitle(words.join(" "));
    } else {
      setTitle(`${verb} ${title}`);
    }
  };

  const handleAiClarify = async () => {
    if (!title.trim()) return;
    setAiLoading(true);
    try {
      const suggestions = await clarifyTaskWithAI(title);
      setAiSuggestions(suggestions);
    } finally {
      setAiLoading(false);
    }
  };

  const applySuggestion = (s: ClarificationSuggestion) => {
    setTitle(s.title);
    setWhyItMatters(s.why_it_matters);
    setDuration(s.estimated_duration);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      why_it_matters: whyItMatters.trim(),
      estimated_duration: duration,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Klarifikasi Komitmen"
      description="Jadikan spesifik, terukur, dan siap dieksekusi."
      maxWidth="lg"
    >
      <form onSubmit={handleFormSubmit} className="space-y-5">
        {/* Action Verbs & Free AI trigger */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-slate-400">Kata kerja:</span>
            {ACTION_VERBS.slice(0, 6).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleVerbClick(v)}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:text-satublue-700 hover:bg-satublue-50 transition-colors"
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {isGeminiConfigured() ? "Gemini 1.5 Flash (Gratis)" : "Heuristik Kognitif (Offline)"}
            </span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAiClarify}
              disabled={aiLoading || !title.trim()}
              className="text-xs py-1 px-2.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-satublue-600" />
              {aiLoading ? "Menganalisis..." : "Klarifikasi AI (Gratis)"}
            </Button>
          </div>
        </div>

        {/* AI Suggestions Box (if generated) */}
        {aiSuggestions.length > 0 && (
          <div className="p-3.5 rounded-xl bg-satublue-50/80 border border-satublue-200/70 space-y-2 animate-in fade-in">
            <span className="text-[11px] font-semibold text-satublue-900 uppercase tracking-wider block font-mono">
              REKOMENDASI AKSI DARI AI (Klik untuk pilih)
            </span>
            <div className="space-y-1.5">
              {aiSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applySuggestion(s)}
                  className="w-full text-left p-2.5 rounded-lg bg-white border border-satublue-200 hover:border-satublue-500 transition-all text-xs group"
                >
                  <div className="font-semibold text-slate-900 group-hover:text-satublue-700 flex items-center justify-between">
                    <span>{s.title}</span>
                    <span className="font-mono text-[11px] text-satublue-600">
                      {s.estimated_duration}m
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {s.why_it_matters}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Task Title */}
        <div>
          <label className="text-xs font-semibold text-slate-900 block mb-1">
            Judul Tindakan Nyata
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="cth. Tulis draf metodologi penelitian"
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-satublue-600"
            required
            autoFocus
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Ubah pikiran samar menjadi tindakan fisik atau digital yang jelas batasannya.
          </p>
        </div>

        {/* Why it matters */}
        <div>
          <label className="text-xs font-semibold text-slate-900 block mb-1">
            Mengapa Ini Penting (Definisi Selesai)
          </label>
          <textarea
            value={whyItMatters}
            onChange={(e) => setWhyItMatters(e.target.value)}
            placeholder="cth. Kirim revisi ke dosen pembimbing sebelum evaluasi besok siang."
            rows={2}
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-satublue-600 resize-none"
          />
        </div>

        {/* Duration Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-900 block mb-1.5">
            Estimasi Waktu Fokus
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[25, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDuration(mins)}
                className={`py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
                  duration === mins
                    ? "bg-satublue-600 text-white border-satublue-600"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {mins} menit
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="blue" size="sm">
            Simpan Komitmen
          </Button>
        </div>
      </form>
    </Modal>
  );
};
