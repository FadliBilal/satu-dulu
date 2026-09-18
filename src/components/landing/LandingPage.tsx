"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BookOpen,
  Focus,
  Compass,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { useTheme } from "@/lib/theme-context";

export const LandingPage: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen relative overflow-x-hidden text-slate-900 dark:text-slate-100 selection:bg-satublue-100 dark:selection:bg-satublue-900 bg-grid-subtle">
      {/* Ambient Background Gradient Meshes */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Main top aura */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[340px] sm:w-[700px] md:w-[950px] h-[550px] bg-gradient-to-b from-blue-200/50 dark:from-satublue-950/40 via-indigo-100/30 dark:via-indigo-950/20 to-transparent blur-3xl rounded-full" />
        {/* Subtle side glow */}
        <div className="absolute top-[600px] -left-32 w-[380px] h-[380px] bg-sky-100/40 dark:bg-sky-950/20 blur-3xl rounded-full" />
        <div className="absolute top-[1200px] -right-32 w-[420px] h-[420px] bg-blue-100/40 dark:bg-blue-950/20 blur-3xl rounded-full" />
      </div>

      {/* Floating Bubble/Pill Header Navbar */}
      <header className="fixed top-3 sm:top-5 inset-x-0 z-50 px-3 sm:px-6 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 shadow-md shadow-slate-900/5 dark:shadow-black/40 flex items-center justify-between transition-all">
          {/* Brand */}
          <Link href="/" className="flex items-center shrink-0">
            <Logo showText={true} className="w-6 h-6" textSize="md" />
            <span className="hidden md:inline-block text-[11px] text-slate-400 dark:text-slate-500 border-l border-slate-200 dark:border-slate-800 pl-2 ml-2 font-normal">
              Satu hal dalam satu waktu
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              href="#loop"
              className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-satublue-700 dark:hover:text-satublue-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
            >
              Cara Kerja
            </Link>
            <Link
              href="#riset"
              className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-satublue-700 dark:hover:text-satublue-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
            >
              Dasar Riset
            </Link>
            <Link
              href="/guide"
              className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-satublue-700 dark:hover:text-satublue-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
            >
              Panduan
            </Link>
          </div>

          {/* Action CTA & Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Toggle tema"
              title={resolvedTheme === "dark" ? "Beralih ke Tema Terang" : "Beralih ke Tema Gelap"}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            <Link
              href="/login"
              className="hidden sm:inline-block text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-satublue-700 dark:hover:text-satublue-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
            >
              Masuk
            </Link>
            <Link href="/app" className="shrink-0">
              <Button size="sm" variant="blue" className="rounded-full px-3.5 sm:px-4 py-1.5 text-xs shadow-xs font-medium whitespace-nowrap flex items-center gap-1">
                <span className="sm:hidden">Buka App</span>
                <span className="hidden sm:inline">Buka Aplikasi</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-36 md:pt-40 pb-16 px-4 sm:px-6 max-w-4xl mx-auto text-center relative">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-satublue-50/90 dark:bg-blue-950/70 backdrop-blur-md border border-satublue-200 dark:border-blue-800/80 text-[11px] sm:text-xs text-satublue-900 dark:text-sky-200 mb-6 sm:mb-8 font-medium shadow-xs max-w-full">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-satublue-600 dark:bg-sky-400 animate-pulse shrink-0" />
          <span className="truncate">Sistem Eksekusi Personal Berbasis Riset Kognitif</span>
        </div>

        <h1 className="text-2xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15] mb-4 sm:mb-6">
          Berhenti mengelola segalanya.
          <br />
          <span className="bg-gradient-to-r from-satublue-700 via-satublue-600 to-sky-600 dark:from-satublue-400 dark:via-satublue-300 dark:to-sky-400 bg-clip-text text-transparent">
            Mulai dengan satu hal.
          </span>
        </h1>

        <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8 sm:mb-10">
          SatuDulu membantu mahasiswa dan pekerja pengetahuan memutuskan apa yang paling penting,
          berkomitmen secara realistis, dan mengeksekusi satu komitmen dalam satu waktu tanpa distraksi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/app" className="w-full sm:w-auto">
            <Button size="lg" variant="blue" className="w-full sm:w-auto px-8 rounded-xl shadow-md shadow-satublue-500/10">
              Mulai Perencanaan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/guide" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl">
              <BookOpen className="w-4 h-4 mr-2 text-satublue-600 dark:text-satublue-400" />
              Panduan Penggunaan
            </Button>
          </Link>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 mt-6 font-mono">
          Kapasitas adaptif • Fokus single-thread • Pengalihan tanpa rasa bersalah
        </p>
      </section>

      {/* Hero Preview Card: Single-Thread Screen */}
      <section className="px-4 sm:px-6 max-w-2xl mx-auto w-full mb-28">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/50 relative overflow-hidden transition-all hover:border-satublue-300 dark:hover:border-satublue-700">
          {/* Blue accent top bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-satublue-700 via-satublue-600 to-sky-500" />

          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
            <span>HARI INI</span>
            <span className="font-semibold text-satublue-700 dark:text-satublue-300 bg-satublue-50 dark:bg-satublue-950/70 px-2.5 py-1 rounded-md border border-satublue-100 dark:border-satublue-800">
              01 / 03
            </span>
          </div>

          <div className="py-8 sm:py-10 text-center">
            <span className="text-xs font-semibold text-satublue-700 dark:text-satublue-400 uppercase tracking-wider mb-2 block font-mono">
              KOMITMEN AKTIF
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight mb-3">
              Selesaikan metodologi skripsi
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
              Kirim draf revisi ke dosen pembimbing sebelum diskusi besok siang.
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 mb-8 bg-satublue-50/70 dark:bg-satublue-950/60 border border-satublue-100 dark:border-satublue-800 px-3.5 py-1.5 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-satublue-600 dark:text-satublue-400" />
              Estimasi 60 menit
            </div>

            <div>
              <Link href="/app">
                <Button size="md" variant="blue" className="px-8 shadow-sm rounded-xl">
                  <Focus className="w-4 h-4 mr-2" />
                  MULAI FOKUS
                </Button>
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>1 dari 3 komitmen</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-satublue-600 ring-4 ring-satublue-100 dark:ring-satublue-950" />
              <span className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
              <span className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3 italic">
          Judul tugas berikutnya sengaja disembunyikan sampai komitmen saat ini selesai.
        </p>
      </section>

      {/* Section 1: 3 Pilar Utama */}
      <section id="riset" className="py-16 sm:py-20 px-4 sm:px-6 border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xs">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-satublue-700 dark:text-satublue-400 uppercase tracking-wider font-mono">
              FILOSOFI EKSEKUSI
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight mt-2">
              Bukan to-do list penimbun tugas. Ini sistem fokus nyata.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs hover:border-satublue-300 dark:hover:border-satublue-700 transition-all">
              <div className="w-9 h-9 rounded-xl bg-satublue-50 dark:bg-satublue-950/70 text-satublue-600 dark:text-satublue-400 flex items-center justify-center mb-4 border border-satublue-100 dark:border-satublue-800">
                <Focus className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                Thread Tunggal
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Di layar kerja, Anda hanya melihat Prioritas 01. Judul tugas mendatang disembunyikan agar otak tidak terdistraksi.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs hover:border-satublue-300 dark:hover:border-satublue-700 transition-all">
              <div className="w-9 h-9 rounded-xl bg-satublue-50 dark:bg-satublue-950/70 text-satublue-600 dark:text-satublue-400 flex items-center justify-center mb-4 border border-satublue-100 dark:border-satublue-800">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                Prioritas Biner (A vs B)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Bandingkan dua tugas sekaligus untuk memilih mana yang lebih mendesak, tanpa perlu pusing mengurutkan puluhan item.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs hover:border-satublue-300 dark:hover:border-satublue-700 transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-800">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                Bebas Rasa Bersalah
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Tugas yang belum selesai dialihkan otomatis ke hari esok dengan tenang. Tidak ada cap merah atau rasa gagal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Alur Kerja 3 Langkah Ringkas */}
      <section id="loop" className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold text-satublue-700 dark:text-satublue-400 uppercase tracking-wider font-mono">
            CARA KERJA
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight mt-2">
            3 langkah sederhana setiap hari.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-mono font-semibold text-satublue-700 dark:text-satublue-300 bg-satublue-50 dark:bg-satublue-950/70 px-2.5 py-1 rounded-lg border border-satublue-100 dark:border-satublue-800 inline-block mb-3">
              01 • TAMPUNG
            </span>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Catat di Inbox
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Keluarkan semua isi kepala ke Inbox tanpa beban. AI gratis siap membantu merinci langkah konkret.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-mono font-semibold text-satublue-700 dark:text-satublue-300 bg-satublue-50 dark:bg-satublue-950/70 px-2.5 py-1 rounded-lg border border-satublue-100 dark:border-satublue-800 inline-block mb-3">
              02 • KUNCI
            </span>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Komitmen Malam Hari
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tentukan 1–4 tugas penting untuk besok sebelum tidur. Bangun pagi langsung siap eksekusi tanpa ragu.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800 inline-block mb-3">
              03 • EKSEKUSI
            </span>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Fokus Satu per Satu
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mulai timer fokus (bisa melayang via Picture-in-Picture). Selesaikan satu hal, lalu lanjut ke berikutnya.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto py-16 px-4 sm:px-6 border-t border-slate-200 dark:border-slate-800 text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Tentukan apa yang penting. Kerjakan satu per satu.
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
            Didesain untuk mahasiswa, programmer, desainer, dan pekerja pengetahuan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/app" className="w-full sm:w-auto">
              <Button size="lg" variant="blue" className="w-full sm:w-auto px-8 rounded-xl shadow-md shadow-satublue-500/10">
                Mulai SatuDulu
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/guide" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl">
                Pelajari Panduan Lengkap
              </Button>
            </Link>
          </div>
          <div className="mt-12 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-4 flex-wrap">
            <span>Sistem Eksekusi SatuDulu</span>
            <span>•</span>
            <span>Antarmuka Bersih Bebas Emoji</span>
            <span>•</span>
            <span>Timer Melayang Picture-in-Picture</span>
            <span>•</span>
            <span>PWA Siap Mobile</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
