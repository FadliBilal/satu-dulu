"use client";

import React, { useState, useEffect } from "react";
import { Globe, Briefcase, RotateCcw, Database, Bell, Key, Sparkles, Shield } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Occupation, Profile } from "@/lib/types";
import { getRepository } from "@/lib/repository";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { NotificationService } from "@/lib/notifications";

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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [geminiKey, setGeminiKey] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const repo = getRepository();
        const p = await repo.getProfile();
        setProfile(p);
        setNotificationPermission(NotificationService.getPermission());
        const savedKey = localStorage.getItem("satudulu_gemini_key") || "";
        setGeminiKey(savedKey);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

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
    setMessage("Kunci API Gemini tersimpan secara lokal di browser.");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleReset = async () => {
    if (confirm("Reset penyimpanan lokal dan kembalikan komitmen contoh demo?")) {
      const repo = getRepository();
      await repo.resetDemoData();
      window.location.reload();
    }
  };

  if (loading || !profile) {
    return (
      <div className="py-24 text-center text-xs text-slate-400">
        Memuat pengaturan...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Pengaturan
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Sesuaikan konteks, notifikasi komitmen, dan lingkungan eksekusi Anda.
        </p>
      </div>

      {message && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium animate-in fade-in">
          {message}
        </div>
      )}

      {/* Storage & Environment Status */}
      <Card className="mb-6 p-5 bg-white border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-satublue-600" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Mesin Penyimpanan Data
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isSupabaseConfigured
                  ? "Terhubung ke Supabase PostgreSQL cloud dengan Row Level Security."
                  : "Berjalan pada Penyimpanan Lokal Offline (Data tersimpan di browser Anda)."}
              </p>
            </div>
          </div>
          <Badge variant={isSupabaseConfigured ? "success" : "blue"}>
            {isSupabaseConfigured ? "Supabase Cloud" : "Lokal Offline"}
          </Badge>
        </div>
      </Card>

      {/* Notification Section (Pilar COMMIT) */}
      <Card className="mb-6 p-5 bg-white border-slate-200 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-satublue-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Notifikasi Ritual Malam ("Besok Butuh Keputusan")
            </h3>
          </div>
          <Badge variant={notificationPermission === "granted" ? "success" : "warning"}>
            {notificationPermission === "granted" ? "Aktif" : "Belum Aktif"}
          </Badge>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Mengingatkan Anda setiap malam untuk memutuskan apa yang penting besok hari sebelum tidur, sehingga pagi hari langsung siap eksekusi.
        </p>

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

      {/* Morning Commitment Lock Info */}
      <Card className="mb-6 p-5 bg-satublue-50/70 border-satublue-200 space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-satublue-700" />
          <h3 className="text-sm font-semibold text-satublue-900">
            Kunci Komitmen Pagi (Morning Commitment Lock)
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Setelah berkomitmen, rencana hari ini dikunci agar Anda tidak tergoda menambah tugas mendadak di pagi hari. Jika terjadi keadaan darurat, Anda dapat menggunakan tombol <strong>Replan</strong> untuk menyesuaikan komitmen dengan wajar.
        </p>
      </Card>

      {/* Free AI Settings (Optional Gemini Key) */}
      <Card className="mb-6 p-5 bg-white border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-satublue-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            Klarifikasi AI (Gratis)
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Secara default, SatuDulu dilengkapi dengan mesin heuristik klarifikasi tugas yang 100% gratis dan offline. Jika Anda memiliki API Key Google Gemini Flash gratis, Anda dapat memasukkannya di bawah ini untuk kemampuan kustomisasi tingkat lanjut:
        </p>
        <div className="flex gap-2">
          <input
            type="password"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="AIzaSy... (Opsional, tinggalkan kosong untuk mesin gratis bawaan)"
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-satublue-600"
          />
          <Button size="sm" variant="outline" onClick={handleSaveGeminiKey}>
            Simpan Kunci
          </Button>
        </div>
      </Card>

      {/* Timezone Configuration */}
      <Card className="mb-6 p-5 bg-white border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-satublue-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            Zona Waktu Eksekusi
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Menentukan batas pergantian hari, pengalihan tugas otomatis, dan reset perencanaan.
        </p>
        <select
          value={profile.timezone}
          onChange={(e) => handleUpdate({ timezone: e.target.value })}
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-satublue-600 bg-white"
        >
          {TIMEZONE_OPTIONS.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </Card>

      {/* Occupation / Context */}
      <Card className="mb-6 p-5 bg-white border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-satublue-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            Konteks / Pekerjaan
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Konteks kerja personal Anda. SatuDulu menerapkan filosofi eksekusi yang sama untuk semua bidang.
        </p>
        <select
          value={profile.occupation}
          onChange={(e) => handleUpdate({ occupation: e.target.value as Occupation })}
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-satublue-600 bg-white"
        >
          {OCCUPATION_OPTIONS.map((occ) => (
            <option key={occ.value} value={occ.value}>
              {occ.label}
            </option>
          ))}
        </select>
      </Card>

      {/* Reset Local Data */}
      <Card className="p-5 bg-white border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Reset Data Demo
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Mengembalikan data contoh awal untuk mahasiswa dan pekerja pengetahuan.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      </Card>
    </div>
  );
};
