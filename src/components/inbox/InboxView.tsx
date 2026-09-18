"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit3, ArrowRight, Inbox } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import { ClarifyModal } from "./ClarifyModal";
import { InboxItem } from "@/lib/types";
import { useInbox } from "@/hooks";

export const InboxView: React.FC = () => {
  const { items, loading, error, addItem, deleteItem, clarifyItem } = useInbox();
  const [titleInput, setTitleInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [clarifyingItem, setClarifyingItem] = useState<InboxItem | null>(null);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addItem(titleInput.trim());
      setTitleInput("");
    } catch (err: any) {
      alert("Gagal menambahkan tugas ke Inbox: " + (err?.message || "Silakan coba lagi."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
    } catch (err: any) {
      alert("Gagal menghapus tugas: " + (err?.message || "Silakan coba lagi."));
    }
  };

  const handleSaveClarified = async (clarified: {
    title: string;
    why_it_matters: string;
    estimated_duration: number;
  }) => {
    if (!clarifyingItem) return;
    try {
      await clarifyItem(clarifyingItem.id, clarified);
      setClarifyingItem(null);
    } catch (err: any) {
      alert("Gagal menyimpan hasil klarifikasi: " + (err?.message || "Silakan coba lagi."));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-2 sm:py-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Inbox
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Keluarkan semua isi pikiran Anda. Penentuan prioritas dilakukan nanti.
            </p>
          </div>
          {items.length > 0 && (
            <Link href="/app/plan" className="self-start sm:self-auto">
              <Button size="sm" variant="blue" className="rounded-xl shadow-xs">
                Rencanakan Besok
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 font-medium">
          {error}
        </div>
      )}

      {/* Quick Input Bar */}
      <form onSubmit={handleAddItem} className="mb-6 sm:mb-8">
        <div className="relative flex items-center shadow-xs">
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Tuliskan tugas, ide, atau revisi... (Tekan Enter)"
            className="w-full pl-4 pr-24 py-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-satublue-500/20 focus:border-satublue-600 transition-all shadow-xs"
          />
          <div className="absolute right-2">
            <Button
              type="submit"
              variant="blue"
              size="sm"
              disabled={!titleInput.trim() || submitting}
              className="py-1.5 px-3 rounded-xl text-xs font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              {submitting ? "..." : "Tambah"}
            </Button>
          </div>
        </div>
      </form>

      {/* Item List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
          Memuat inbox...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/60 dark:bg-slate-900/40">
          <div className="w-12 h-12 rounded-full bg-satublue-50 dark:bg-satublue-950/70 text-satublue-600 dark:text-satublue-300 flex items-center justify-center mx-auto mb-3 border border-satublue-100 dark:border-satublue-800">
            <Inbox className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Belum ada apa-apa di sini.
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1 mb-5">
            Gunakan inbox untuk mencatat tugas, tugas kuliah, dan revisi sebelum merencanakan.
          </p>
          <Button
            size="sm"
            variant="blue"
            onClick={() => {
              const input = document.querySelector("input");
              input?.focus();
            }}
          >
            Tambah sesuatu
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 px-1 pb-1">
            <span>{items.length} tugas tersimpan</span>
            <span>Gunakan Klarifikasi untuk merinci aksi</span>
          </div>

          {items.map((item) => (
            <Card
              key={item.id}
              className="flex items-start justify-between gap-4 p-4 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 hover:border-satublue-300 dark:hover:border-satublue-700 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setClarifyingItem(item)}
                  className="text-xs px-2.5 py-1 text-satublue-800 dark:text-satublue-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1 text-satublue-600 dark:text-satublue-400" />
                  Klarifikasi
                </Button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-satudanger rounded-md transition-colors"
                  aria-label="Hapus tugas"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Clarify Modal with free AI */}
      <ClarifyModal
        isOpen={Boolean(clarifyingItem)}
        onClose={() => setClarifyingItem(null)}
        item={clarifyingItem}
        onSave={handleSaveClarified}
      />
    </div>
  );
};
