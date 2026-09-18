"use client";

import { useState, useEffect, useCallback } from "react";
import { Profile } from "@/lib/types";
import { getRepository } from "@/lib/repository";
import { useAuth } from "@/lib/supabase/auth-context";
import { NotificationService } from "@/lib/notifications";
import { APP_CONFIG } from "@/lib/constants/config";

export interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  saving: boolean;
  message: string;
  usernameInput: string;
  usernameError: string;
  notificationPermission: NotificationPermission;
  geminiKey: string;
  setUsernameInput: (value: string) => void;
  setUsernameError: (error: string) => void;
  setGeminiKey: (key: string) => void;
  setMessage: (message: string) => void;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
  saveUsername: () => Promise<boolean>;
  saveGeminiKey: () => void;
  enableNotifications: () => Promise<boolean>;
  testNotification: () => boolean;
  resetDemoData: () => Promise<void>;
  reload: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [geminiKey, setGeminiKey] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");

  const showNotificationMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const reload = useCallback(async () => {
    try {
      const repo = getRepository();
      const p = await repo.getProfile();
      setProfile(p);
      const resolvedUsername = p.username || (user?.user_metadata?.username as string) || "";
      setUsernameInput(resolvedUsername);
      setNotificationPermission(NotificationService.getPermission());
      const savedKey =
        typeof window !== "undefined"
          ? localStorage.getItem(APP_CONFIG.storageKeys.geminiKey) || ""
          : "";
      setGeminiKey(savedKey);
    } catch (err) {
      console.warn("Gagal memuat profil pengguna:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!profile) return false;
    setSaving(true);
    try {
      const repo = getRepository();
      const updated = await repo.updateProfile(updates);
      setProfile(updated);
      showNotificationMessage("Pengaturan berhasil disimpan.");
      return true;
    } catch (err) {
      console.error("Gagal memperbarui profil:", err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveUsername = async (): Promise<boolean> => {
    const clean = usernameInput.trim().toLowerCase().replace(/^@/, "");
    if (!clean) {
      setUsernameError("Username tidak boleh kosong.");
      return false;
    }
    if (!/^[a-z0-9_]{3,20}$/.test(clean)) {
      setUsernameError("Username hanya boleh 3-20 karakter huruf kecil, angka, dan garis bawah (_).");
      return false;
    }
    setUsernameError("");
    const success = await updateProfile({ username: clean });
    if (success) {
      setUsernameInput(clean);
    }
    return success;
  };

  const saveGeminiKey = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(APP_CONFIG.storageKeys.geminiKey, geminiKey.trim());
      showNotificationMessage("Kunci API Gemini tersimpan secara aman di peramban Anda.");
    }
  };

  const enableNotifications = async (): Promise<boolean> => {
    const granted = await NotificationService.requestPermission();
    setNotificationPermission(NotificationService.getPermission());
    if (granted) {
      NotificationService.sendLocalNotification(
        "SatuDulu Aktif",
        "Notifikasi ritual komitmen Anda telah aktif."
      );
      showNotificationMessage("Izin notifikasi berhasil diaktifkan.");
      return true;
    } else {
      alert("Izin notifikasi ditolak oleh browser. Anda dapat mengaktifkannya di pengaturan situs browser.");
      return false;
    }
  };

  const testNotification = (): boolean => {
    const ok = NotificationService.sendLocalNotification(
      "Besok Butuh Keputusan",
      "Waktunya meninjau komitmen apa yang benar-benar penting untuk besok."
    );
    if (!ok) {
      alert("Aktifkan izin notifikasi terlebih dahulu.");
      return false;
    }
    return true;
  };

  const resetDemoData = async () => {
    if (confirm("Reset penyimpanan lokal dan kembalikan komitmen contoh demo?")) {
      const repo = getRepository();
      await repo.resetDemoData();
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
  };

  return {
    profile,
    loading,
    saving,
    message,
    usernameInput,
    usernameError,
    notificationPermission,
    geminiKey,
    setUsernameInput,
    setUsernameError,
    setGeminiKey,
    setMessage,
    updateProfile,
    saveUsername,
    saveGeminiKey,
    enableNotifications,
    testNotification,
    resetDemoData,
    reload,
  };
}
