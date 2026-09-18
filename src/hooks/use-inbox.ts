"use client";

import { useState, useEffect, useCallback } from "react";
import { InboxItem } from "@/lib/types";
import { getRepository } from "@/lib/repository";

export interface UseInboxReturn {
  items: InboxItem[];
  loading: boolean;
  error: string | null;
  addItem: (title: string) => Promise<InboxItem | null>;
  deleteItem: (id: string) => Promise<boolean>;
  clarifyItem: (
    id: string,
    clarified: { title: string; why_it_matters: string; estimated_duration?: number }
  ) => Promise<InboxItem | null>;
  reload: () => Promise<void>;
}

export function useInbox(): UseInboxReturn {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const repo = getRepository();
      const list = await repo.getInboxItems();
      setItems(list);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat daftar inbox.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addItem = async (title: string): Promise<InboxItem | null> => {
    const trimmed = title.trim();
    if (!trimmed) return null;
    setError(null);
    try {
      const repo = getRepository();
      const created = await repo.createInboxItem(trimmed);
      setItems((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      const msg = err?.message || "Gagal menambahkan tugas ke Inbox.";
      setError(msg);
      throw err;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    setError(null);
    try {
      const repo = getRepository();
      await repo.deleteInboxItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err: any) {
      const msg = err?.message || "Gagal menghapus tugas dari Inbox.";
      setError(msg);
      throw err;
    }
  };

  const clarifyItem = async (
    id: string,
    clarified: { title: string; why_it_matters: string; estimated_duration?: number }
  ): Promise<InboxItem | null> => {
    setError(null);
    try {
      const repo = getRepository();
      const updated = await repo.updateInboxItem(id, {
        title: clarified.title,
        description: clarified.why_it_matters,
      });
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      return updated;
    } catch (err: any) {
      const msg = err?.message || "Gagal memperbarui klarifikasi tugas.";
      setError(msg);
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    addItem,
    deleteItem,
    clarifyItem,
    reload,
  };
}
