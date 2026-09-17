"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit3, ArrowRight, Inbox, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { ClarifyModal } from "./ClarifyModal";
import { InboxItem } from "@/lib/types";
import { getRepository } from "@/lib/repository";

export const InboxView: React.FC = () => {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [titleInput, setTitleInput] = useState("");
  const [clarifyingItem, setClarifyingItem] = useState<InboxItem | null>(null);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      const repo = getRepository();
      const list = await repo.getInboxItems();
      setItems(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    const repo = getRepository();
    const created = await repo.createInboxItem(titleInput.trim());
    setItems([created, ...items]);
    setTitleInput("");
  };

  const handleDeleteItem = async (id: string) => {
    const repo = getRepository();
    await repo.deleteInboxItem(id);
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSaveClarified = async (clarified: {
    title: string;
    why_it_matters: string;
    estimated_duration: number;
  }) => {
    if (!clarifyingItem) return;
    const repo = getRepository();
    const updated = await repo.updateInboxItem(clarifyingItem.id, {
      title: clarified.title,
      description: clarified.why_it_matters,
    });
    setItems(items.map((i) => (i.id === updated.id ? updated : i)));
    setClarifyingItem(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Inbox
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Keluarkan semua isi pikiran Anda. Penentuan prioritas dilakukan nanti.
            </p>
          </div>
          {items.length > 0 && (
            <Link href="/app/plan">
              <Button size="sm" variant="blue">
                Rencanakan Besok
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Quick Input Bar */}
      <form onSubmit={handleAddItem} className="mb-8">
        <div className="relative flex items-center">
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Tuliskan tugas, ide, atau revisi... (Tekan Enter)"
            className="w-full pl-4 pr-24 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-satublue-600 shadow-xs"
          />
          <div className="absolute right-2">
            <Button
              type="submit"
              variant="blue"
              size="sm"
              disabled={!titleInput.trim()}
              className="py-1.5 px-3"
            >
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </div>
        </div>
      </form>

      {/* Item List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">
          Memuat inbox...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 px-4 border border-dashed border-slate-200 rounded-2xl bg-white/60">
          <div className="w-12 h-12 rounded-full bg-satublue-50 text-satublue-600 flex items-center justify-center mx-auto mb-3 border border-satublue-100">
            <Inbox className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            Belum ada apa-apa di sini.
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-5">
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
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 pb-1">
            <span>{items.length} tugas tersimpan</span>
            <span>Gunakan Klarifikasi untuk merinci aksi</span>
          </div>

          {items.map((item) => (
            <Card
              key={item.id}
              className="flex items-start justify-between gap-4 p-4 bg-white border border-slate-200/90 hover:border-satublue-300 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-slate-900 leading-snug">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setClarifyingItem(item)}
                  className="text-xs px-2.5 py-1 text-satublue-800"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1 text-satublue-600" />
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
