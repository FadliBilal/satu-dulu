"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { ReflectionReason } from "@/lib/types";

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  completedCount: number;
  totalCount: number;
  carriedCount: number;
  onSaveReflection: (reason: ReflectionReason, notes?: string) => Promise<void>;
}

const REASONS: Array<{ value: ReflectionReason; label: string }> = [
  { value: "unexpected_work", label: "Pekerjaan mendesak tak terduga" },
  { value: "underestimated_effort", label: "Meremehkan waktu/tenaga tugas" },
  { value: "too_many_commitments", label: "Terlalu banyak komitmen" },
  { value: "distraction", label: "Distraksi / Terhambat kendala" },
  { value: "low_energy", label: "Energi menurun atau kelelahan" },
  { value: "other", label: "Prioritas lain yang mendesak" },
];

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  isOpen,
  onClose,
  planId,
  completedCount,
  totalCount,
  carriedCount,
  onSaveReflection,
}) => {
  const [selectedReason, setSelectedReason] = useState<ReflectionReason>("unexpected_work");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveReflection(selectedReason, notes.trim() || undefined);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Refleksi Harian"
      description="Refleksikan tanpa menghakimi diri. Data ini membantu kalibrasi kapasitas pribadi Anda."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Outcome summary */}
        <div className="p-3.5 bg-satubg-subtle dark:bg-slate-800/80 rounded-xl text-center">
          <span className="text-xs font-semibold text-satutext-primary dark:text-slate-100 block">
            {completedCount} dari {totalCount} komitmen tuntas.
          </span>
          {carriedCount > 0 && (
            <span className="text-[11px] text-satutext-secondary dark:text-slate-400 mt-0.5 block">
              {carriedCount} dialihkan untuk keputusan yang segar besok.
            </span>
          )}
        </div>

        {carriedCount > 0 ? (
          <div>
            <label className="text-xs font-semibold text-satutext-primary dark:text-slate-100 block mb-2">
              Apa yang menghambat Anda hari ini?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REASONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setSelectedReason(r.value)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    selectedReason === r.value
                      ? "border-satutext-primary dark:border-sky-500 bg-white dark:bg-slate-800 font-medium text-satutext-primary dark:text-slate-100 shadow-xs"
                      : "border-gray-200 dark:border-slate-800 text-satutext-secondary dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800/50"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-satutext-secondary dark:text-slate-400 text-center">
            Luar biasa, Anda menuntaskan semua komitmen yang Anda tetapkan hari ini.
          </p>
        )}

        <div>
          <label className="text-xs font-semibold text-satutext-primary dark:text-slate-100 block mb-1">
            Catatan Tambahan (Opsional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Satu kalimat tentang eksekusi Anda hari ini..."
            className="w-full px-3 py-2 text-xs rounded-lg bg-transparent dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 text-satutext-primary dark:text-slate-100 placeholder:text-satutext-muted dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-satutext-primary dark:focus:ring-sky-500"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100 dark:border-slate-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Lewati
          </Button>
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Refleksi"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
