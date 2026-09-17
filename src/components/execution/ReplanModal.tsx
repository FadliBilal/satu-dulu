"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { Commitment, ReflectionReason, ReplanRequest } from "@/lib/types";

interface ReplanModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  commitments: Commitment[];
  onReplanConfirmed: (request: ReplanRequest) => Promise<void>;
}

const REASON_OPTIONS: Array<{ value: ReflectionReason; label: string }> = [
  { value: "unexpected_work", label: "Muncul pekerjaan mendesak tak terduga" },
  { value: "underestimated_effort", label: "Meremehkan estimasi waktu tugas" },
  { value: "too_many_commitments", label: "Terlalu banyak komitmen untuk hari ini" },
  { value: "low_energy", label: "Energi menurun atau kurang sehat" },
  { value: "distraction", label: "Terhambat kendala atau dependensi luar" },
  { value: "other", label: "Prioritas memang bergeser secara wajar" },
];

export const ReplanModal: React.FC<ReplanModalProps> = ({
  isOpen,
  onClose,
  planId,
  commitments,
  onReplanConfirmed,
}) => {
  const [reason, setReason] = useState<ReflectionReason>("unexpected_work");
  const [notes, setNotes] = useState("");
  const [activeItems, setActiveItems] = useState<Commitment[]>(
    commitments.filter((c) => c.status !== "completed" && c.status !== "cancelled")
  );
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRemove = (id: string) => {
    setActiveItems(activeItems.filter((i) => i.id !== id));
    setRemovedIds([...removedIds, id]);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= activeItems.length) return;
    const copy = [...activeItems];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setActiveItems(copy);
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (activeItems.length >= 6) {
      alert("Maksimal 6 komitmen.");
      return;
    }

    const item: Commitment = {
      id: "temp-" + Date.now(),
      user_id: "",
      daily_plan_id: planId,
      title: newTitle.trim(),
      priority: activeItems.length + 1,
      estimated_duration: 30,
      status: "planned",
      focus_seconds: 0,
      rollover_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setActiveItems([...activeItems, item]);
    setNewTitle("");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const newItemsToAdd = activeItems
        .filter((item) => item.id.startsWith("temp-"))
        .map((item) => ({
          title: item.title,
          description: null,
          why_it_matters: null,
          priority: item.priority,
          estimated_duration: 30,
          status: "planned" as const,
        }));

      const request: ReplanRequest = {
        planId,
        reason,
        notes: notes.trim() || undefined,
        removedCommitmentIds: removedIds,
        reorderedCommitmentIds: activeItems.map((item) => item.id),
        newCommitments: newItemsToAdd,
      };

      await onReplanConfirmed(request);
      onClose();
    } catch (err: any) {
      alert(err.message || "Gagal melakukan replan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Penyesuaian Terkontrol (Replan)"
      description="Situasi berubah. Menyesuaikan rencana adalah praktik eksekusi yang sehat dan adaptif."
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* What Changed Selector */}
        <div>
          <label className="text-xs font-semibold text-satutext-primary block mb-2">
            Apa yang berubah?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REASON_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setReason(opt.value)}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                  reason === opt.value
                    ? "border-satutext-primary bg-satubg-subtle font-medium text-satutext-primary"
                    : "border-gray-200 text-satutext-secondary hover:bg-satubg-subtle/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Adjust Active Commitments */}
        <div>
          <label className="text-xs font-semibold text-satutext-primary block mb-2">
            Sesuaikan Komitmen Tersisa ({activeItems.length} aktif)
          </label>

          <div className="space-y-2 mb-3">
            {activeItems.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-satutext-primary text-white text-[11px] font-mono flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-satutext-primary truncate">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, "up")}
                    className="p-1 text-satutext-muted hover:text-satutext-primary disabled:opacity-20"
                    title="Naikkan urutan"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === activeItems.length - 1}
                    onClick={() => handleMove(idx, "down")}
                    className="p-1 text-satutext-muted hover:text-satutext-primary disabled:opacity-20"
                    title="Turunkan urutan"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="p-1 text-satutext-muted hover:text-satudanger ml-1"
                    title="Hapus komitmen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add replacement */}
          <form onSubmit={handleAddNew} className="flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Tambah komitmen pengganti..."
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-satutext-primary"
            />
            <Button type="submit" size="sm" variant="outline" disabled={!newTitle.trim()}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Tambah
            </Button>
          </form>
        </div>

        {/* Optional Context Notes */}
        <div>
          <label className="text-xs font-semibold text-satutext-primary block mb-1">
            Catatan Tambahan (Konteks kalibrasi opsional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="cth. Ada kendala teknis tak terduga yang membutuhkan perhatian segera."
            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-satutext-primary"
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={activeItems.length === 0 || submitting}
          >
            {submitting ? "Menyimpan..." : "Konfirmasi Replan"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
