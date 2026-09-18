"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Briefcase,
  RotateCcw,
  Database,
  Bell,
  Sparkles,
  Shield,
  User,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Sun,
  Moon,
  Monitor,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Occupation, Profile } from "@/lib/types";
import { getRepository, clearRepositoryCache } from "@/lib/repository";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/auth-context";
import { useTheme, Theme } from "@/lib/theme-context";
import { NotificationService } from "@/lib/notifications";
import { isGeminiConfigured } from "@/lib/ai-clarify";

const OCCUPATION_OPTIONS: Array<{ value: Occupation; label: string }> = [
  { value: "student", label: "Mahasiswa / Pelajar" },
  { value: "developer", label: "Software Developer / Engineer" },
  { value: "designer", label: "Desainer Grafis / UI/UX" },
  { value: "marketer", label: "Pemasar / Content Creator" },
  { value: "freelancer", label: "Pekerja Lepas (Freelancer)" },
  { value: "entrepreneur", label: "Wirausahawan / Founder" },
  { value: "employee", label: "Pekerja Pengetahuan / Karyawan" },
  { value: "other", label: "Lainnya" },
];

const TIMEZONE_OPTIONS = [
  "Asia/Jakarta",
  "Asia/Makassar",
  "Asia/Jayapura",
  "Asia/Singapore",
  "Asia/Tokyo",
  "UTC",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
];

export const SettingsView: React.FC = () => {
  const router = useRouter();
  const { user, isGuest, signOut, deleteAccount } = useAuth();
  const { theme, setTheme } = useTheme();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [geminiKey, setGeminiKey] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const repo = getRepository();
        const p = await repo.getProfile();
        setProfile(p);
        const resolvedUsername = p.username || (user?.user_metadata?.username as string) || "";
        setUsernameInput(resolvedUsername);
        setNotificationPermission(NotificationService.getPermission());
        const savedKey = localStorage.getItem("satudulu_gemini_key") || "";
        setGeminiKey(savedKey);
      } catch (err) {
        console.warn("Gagal memuat profil:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [user]);

  const handleUpdate = async (updates: Partial<Profile>) => {
    if (!profile) return;
    setSaving(true);
    try {
      const repo = getRepository();
      const updated = await repo.updateProfile(updates);
      setProfile(updated);
      setMessage("Pengaturan berhasil disimpan.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUsername = async () => {
    const clean = usernameInput.trim().toLowerCase().replace(/^@/, "");
    if (!clean) {
      setUsernameError("Username tidak boleh kosong.");
      return;
    }
    if (!/^[a-z0-9_]{3,20}$/.test(clean)) {
      setUsernameError("Username hanya boleh 3-20 karakter huruf kecil, angka, dan garis bawah (_).");
      return;
    }
    setUsernameError("");
    await handleUpdate({ username: clean });
    setUsernameInput(clean);
  };

  const handleEnableNotifications = async () => {
    const granted = await NotificationService.requestPermission();
    setNotificationPermission(NotificationService.getPermission());
    if (granted) {
      NotificationService.sendLocalNotification(
        "SatuDulu Aktif",
        "Notifikasi ritual komitmen Anda telah aktif."
      );
      setMessage("Izin notifikasi berhasil diaktifkan.");
      setTimeout(() => setMessage(""), 3000);
    } else {
      alert("Izin notifikasi ditolak oleh browser. Anda dapat mengaktifkannya di pengaturan situs browser.");
    }
  };

  const handleTestNotification = () => {
    const ok = NotificationService.sendLocalNotification(
      "Besok Butuh Keputusan",
      "Waktunya meninjau komitmen apa yang benar-benar penting untuk besok."
    );
    if (!ok) {
      alert("Aktifkan izin notifikasi terlebih dahulu.");
    }
  };

  const handleSaveGeminiKey = () => {
    localStorage.setItem("satudulu_gemini_key", geminiKey.trim());
    setMessage("Kunci API Gemini tersimpan secara aman di peramban Anda.");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun?")) {
      await signOut();
      clearRepositoryCache();
      router.push("/login");
    }
  };

  const handleReset = async () => {
    if (confirm("Reset penyimpanan lokal dan kembalikan komitmen contoh demo?")) {
      const repo = getRepository();
      await repo.resetDemoData();
      window.location.reload();
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.trim().toUpperCase() !== "HAPUS") {
      return;
    }
    setDeletingAccount(true);
    try {
      const { error } = await deleteAccount();
      if (error) {
        alert(error.message || "Gagal menghapus akun.");
      } else {
        setShowDeleteModal(false);
        clearRepositoryCache();
        router.push("/login");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menghapus akun.");
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="py-24 text-center text-xs text-slate-400 font-mono">
        Memuat pengaturan...
      </div>
    );
  }

  const isSupabaseActive = isSupabaseConfigured && Boolean(user);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Pengaturan
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Sesuaikan akun, preferensi tema, AI gratis, dan lingkungan eksekusi Anda.
        </p>
      </div>

      {message && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-300 font-medium animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* 1. Account & Auth Status Section */}
      <Card className="mb-6 p-5 sm:p-6 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-satublue-50 dark:bg-satublue-950/70 border border-satublue-100 dark:border-satublue-800 flex items-center justify-center text-satublue-700 dark:text-satublue-300 font-semibold text-sm">
              {profile.username
                ? profile.username.slice(0, 2).toUpperCase()
                : user?.email
                ? user.email.slice(0, 2).toUpperCase()
                : <User className="w-5 h-5 text-slate-500" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {profile.username ? `@${profile.username}` : user ? user.email : "Mode Tamu (Offline)"}
                </h3>
                <Badge variant={isSupabaseActive ? "success" : "neutral"}>
                  {isSupabaseActive ? "Supabase Cloud" : "Lokal Offline"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {user?.email && profile.username ? `${user.email} • ` : ""}
                {isSupabaseActive
                  ? "Tersinkronisasi aman ke PostgreSQL cloud dengan Row Level Security."
                  : "Data disimpan di penyimpanan lokal browser Anda."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Keluar
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="blue" size="sm" className="text-xs">
                  Masuk / Daftar Akun
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Username Configuration Row */}
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Username Pengguna (@)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 select-none">
                @
              </span>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
                  setUsernameError("");
                }}
                placeholder="nama_pengguna"
                maxLength={20}
                className="w-full text-xs pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-satublue-500/20 focus:border-satublue-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={saving}
              onClick={handleSaveUsername}
              className="shrink-0 text-xs"
            >
              Simpan Username
            </Button>
          </div>
          {usernameError ? (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1.5">{usernameError}</p>
          ) : (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
              Username unik Anda (3-20 karakter, huruf kecil, angka, dan garis bawah).
            </p>
          )}
        </div>
      </Card>

      {/* 2. Theme Preferences (Light / Dark / System) */}
      <Card className="mb-6 p-5 sm:p-6 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-satublue-50 dark:bg-satublue-950/70 text-satublue-600 dark:text-satublue-300 flex items-center justify-center">
            {theme === "dark" ? (
              <Moon className="w-4 h-4" />
            ) : theme === "light" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Monitor className="w-4 h-4" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Tema Tampilan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pilih mode terang, gelap untuk fokus malam, atau ikuti preferensi sistem perangkat Anda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-medium transition-all ${
              theme === "light"
                ? "bg-satublue-50 dark:bg-satublue-950/50 border-satublue-500 text-satublue-700 dark:text-satublue-300 shadow-xs"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Terang</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-medium transition-all ${
              theme === "dark"
                ? "bg-satublue-50 dark:bg-satublue-950/50 border-satublue-500 text-satublue-700 dark:text-satublue-300 shadow-xs"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Gelap</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-medium transition-all ${
              theme === "system"
                ? "bg-satublue-50 dark:bg-satublue-950/50 border-satublue-500 text-satublue-700 dark:text-satublue-300 shadow-xs"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Monitor className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Sistem</span>
          </button>
        </div>
      </Card>

      {/* 3. Free AI Settings (100% Free & Safe) */}
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
          <Badge variant={isGeminiConfigured(geminiKey) ? "blue" : "neutral"}>
            {isGeminiConfigured(geminiKey) ? "Gemini 1.5 Flash" : "Heuristik Offline"}
          </Badge>
        </div>

        {/* Compact AI Guidance */}
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
            <Button size="sm" variant="outline" onClick={handleSaveGeminiKey} className="shrink-0">
              Simpan Kunci
            </Button>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
            Kunci disimpan hanya di browser lokal Anda (atau lewat env <code>NEXT_PUBLIC_GEMINI_API_KEY</code>).
          </p>
        </div>
      </Card>

      {/* 4. Notification Section (Pilar COMMIT) */}
      <Card className="mb-6 p-5 sm:p-6 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-satublue-50 dark:bg-satublue-950/70 text-satublue-600 dark:text-satublue-300 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Notifikasi Ritual Malam ("Besok Butuh Keputusan")
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pengingat malam hari untuk menentukan komitmen sebelum tidur.
              </p>
            </div>
          </div>
          <Badge variant={notificationPermission === "granted" ? "success" : "warning"}>
            {notificationPermission === "granted" ? "Aktif" : "Belum Aktif"}
          </Badge>
        </div>

        <div className="flex items-center gap-2 pt-1">
          {notificationPermission !== "granted" ? (
            <Button size="sm" variant="blue" onClick={handleEnableNotifications}>
              Aktifkan Notifikasi Browser
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={handleTestNotification}>
              Kirim Notifikasi Uji Coba
            </Button>
          )}
        </div>
      </Card>

      {/* 5. Timezone Configuration */}
      <Card className="mb-6 p-5 sm:p-6 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-satublue-50 dark:bg-satublue-950/70 text-satublue-600 dark:text-satublue-300 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Zona Waktu Eksekusi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Menentukan batas pergantian hari (00:00) dan pengalihan tugas tanpa rasa bersalah.
            </p>
          </div>
        </div>

        <select
          value={profile.timezone}
          onChange={(e) => handleUpdate({ timezone: e.target.value })}
          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-satublue-500/20 focus:border-satublue-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
        >
          {TIMEZONE_OPTIONS.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </Card>

      {/* 6. Occupation Context */}
      <Card className="mb-6 p-5 sm:p-6 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-satublue-50 dark:bg-satublue-950/70 text-satublue-600 dark:text-satublue-300 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Konteks / Pekerjaan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Menyesuaikan rekomendasi ritme kapasitas kerja harian Anda.
            </p>
          </div>
        </div>

        <select
          value={profile.occupation}
          onChange={(e) => handleUpdate({ occupation: e.target.value as Occupation })}
          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-satublue-500/20 focus:border-satublue-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
        >
          {OCCUPATION_OPTIONS.map((occ) => (
            <option key={occ.value} value={occ.value}>
              {occ.label}
            </option>
          ))}
        </select>
      </Card>

      {/* 7. Reset Local Data (for offline guest / demo testing) */}
      <Card className="mb-6 p-5 sm:p-6 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Reset Data Demo Lokal
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mengembalikan data contoh awal untuk mahasiswa dan pekerja pengetahuan.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="shrink-0">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset Demo
        </Button>
      </Card>

      {/* 8. Danger Zone: Delete Account */}
      <Card className="p-5 sm:p-6 bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Zona Bahaya: Hapus Akun & Data</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
            Menghapus akun Anda beserta seluruh riwayat komitmen, inbox, dan vault secara permanen. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setDeleteConfirmation("");
            setShowDeleteModal(true);
          }}
          className="shrink-0 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-950/50"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Hapus Akun
        </Button>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Konfirmasi Hapus Akun
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tindakan ini akan <strong>menghapus akun dan seluruh data Anda secara permanen</strong> dari sistem. Data yang dihapus tidak dapat dipulihkan kembali.
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              Ketik kata <strong className="text-rose-600 dark:text-rose-400 font-mono">HAPUS</strong> untuk mengonfirmasi:
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="HAPUS"
                className="mt-2 w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingAccount}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={deleteConfirmation.trim().toUpperCase() !== "HAPUS" || deletingAccount}
                onClick={handleDeleteAccount}
              >
                {deletingAccount ? "Menghapus..." : "Hapus Permanen"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
