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
  GraduationCap,
  Sparkles,
  ChevronRight,
  Compass,
} from "lucide-react";
import { Button } from "../ui/Button";

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden text-slate-900 selection:bg-satublue-100 bg-grid-subtle">
      {/* Ambient Background Gradient Meshes */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Main top aura */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[340px] sm:w-[700px] md:w-[950px] h-[550px] bg-gradient-to-b from-blue-200/50 via-indigo-100/30 to-transparent blur-3xl rounded-full" />
        {/* Subtle side glow */}
        <div className="absolute top-[600px] -left-32 w-[380px] h-[380px] bg-sky-100/40 blur-3xl rounded-full" />
        <div className="absolute top-[1200px] -right-32 w-[420px] h-[420px] bg-blue-100/40 blur-3xl rounded-full" />
      </div>

      {/* Floating Bubble/Pill Header Navbar */}
      <header className="fixed top-3 sm:top-5 inset-x-0 z-50 px-3 sm:px-6 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-3xl bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 shadow-md shadow-slate-900/5 flex items-center justify-between transition-all">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-2.5 h-2.5 rounded-full bg-satublue-600 ring-4 ring-satublue-100 group-hover:scale-110 transition-all" />
            <span className="font-bold tracking-tight text-slate-900 text-sm sm:text-base">
              SATUDULU
            </span>
            <span className="hidden md:inline-block text-[11px] text-slate-400 border-l border-slate-200 pl-2 font-normal">
              Satu hal dalam satu waktu
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              href="#loop"
              className="text-xs font-medium text-slate-600 hover:text-satublue-700 hover:bg-slate-100/60 px-3 py-1.5 rounded-full transition-colors"
            >
              Cara Kerja
            </Link>
            <Link
              href="#riset"
              className="text-xs font-medium text-slate-600 hover:text-satublue-700 hover:bg-slate-100/60 px-3 py-1.5 rounded-full transition-colors"
            >
              Dasar Riset
            </Link>
            <Link
              href="/guide"
              className="text-xs font-medium text-slate-600 hover:text-satublue-700 hover:bg-slate-100/60 px-3 py-1.5 rounded-full transition-colors"
            >
              Panduan
            </Link>
          </div>

          {/* Action CTA */}
          <div className="flex items-center gap-2">
            <Link href="/guide" className="sm:hidden text-xs text-slate-600 px-2 py-1">
              Panduan
            </Link>
            <Link href="/app">
              <Button size="sm" variant="blue" className="rounded-full px-4 py-1.5 text-xs shadow-xs">
                Buka Aplikasi
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-36 md:pt-40 pb-16 px-4 sm:px-6 max-w-4xl mx-auto text-center relative">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-satublue-200 text-xs text-satublue-900 mb-8 font-medium shadow-xs">
          <span className="w-2 h-2 rounded-full bg-satublue-600 animate-pulse" />
          <span>Sistem Eksekusi Personal Berbasis Riset Kognitif</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.12] mb-6">
          Berhenti mengelola segalanya.
          <br />
          <span className="bg-gradient-to-r from-satublue-700 via-satublue-600 to-sky-600 bg-clip-text text-transparent">
            Mulai dengan satu hal.
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
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
              <BookOpen className="w-4 h-4 mr-2 text-satublue-600" />
              Panduan Penggunaan
            </Button>
          </Link>
        </div>

        <p className="text-xs text-slate-400 mt-6 font-mono">
          Kapasitas adaptif • Fokus single-thread • Pengalihan tanpa rasa bersalah
        </p>
      </section>

      {/* Hero Preview Card: Single-Thread Screen */}
      <section className="px-4 sm:px-6 max-w-2xl mx-auto w-full mb-28">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 relative overflow-hidden transition-all hover:border-satublue-300">
          {/* Blue accent top bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-satublue-700 via-satublue-600 to-sky-500" />

          <div className="flex items-center justify-between pb-6 border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider font-mono">
            <span>HARI INI</span>
            <span className="font-semibold text-satublue-700 bg-satublue-50 px-2.5 py-1 rounded-md border border-satublue-100">
              01 / 03
            </span>
          </div>

          <div className="py-8 sm:py-10 text-center">
            <span className="text-xs font-semibold text-satublue-700 uppercase tracking-wider mb-2 block font-mono">
              KOMITMEN AKTIF
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-3">
              Selesaikan metodologi skripsi
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              Kirim draf revisi ke dosen pembimbing sebelum diskusi besok siang.
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 mb-8 bg-satublue-50/70 border border-satublue-100 px-3.5 py-1.5 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-satublue-600" />
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

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>1 dari 3 komitmen</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-satublue-600 ring-4 ring-satublue-100" />
              <span className="w-2.5 h-2.5 rounded-full border border-slate-300 bg-white" />
              <span className="w-2.5 h-2.5 rounded-full border border-slate-300 bg-white" />
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-3 italic">
          Judul tugas berikutnya sengaja disembunyikan sampai komitmen saat ini selesai.
        </p>
      </section>

      {/* Section 1: The Problem */}
      <section className="py-20 px-4 sm:px-6 border-t border-slate-200/80 bg-white/70 backdrop-blur-xs">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <span className="text-xs font-semibold text-satublue-700 uppercase tracking-wider font-mono">
              MASALAH UTAMA
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-2">
              Daftar todo biasa memicu kelelahan mental, bukan tindakan nyata.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:border-satublue-300 hover:shadow-md transition-all">
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Decision Fatigue
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Melihat daftar 20 tugas menguras energi kognitif di pagi hari bahkan sebelum pekerjaan nyata sempat dimulai.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:border-satublue-300 hover:shadow-md transition-all">
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Overplanning & Rasa Bersalah
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Membuat target tak realistis berujung pada rasa bersalah saat realita bergeser, menciptakan siklus demotivasi.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:border-satublue-300 hover:shadow-md transition-all">
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Context Switching
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Melompat-lompat antar tugas menghancurkan fokus mendalam (*deep work*). Anda mengakhiri hari dengan lelah tanpa ada yang tuntas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Dasar Riset Ilmiah (Scientific Foundations) */}
      <section id="riset" className="py-20 px-4 sm:px-6 border-t border-slate-200/80 bg-satublue-50/30">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-satublue-700 uppercase tracking-wider font-mono mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>DASAR RISET ILMIAH & PSIKOLOGI KOGNITIF</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Mengapa SatuDulu Bekerja: Fondasi Teoretis di Balik Desain
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              SatuDulu dibangun bukan dari tren produktivitas semu, melainkan dengan menerjemahkan temuan eksperimental psikologi kognitif ke dalam antarmuka perangkat lunak.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Miller's Law */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-satublue-300 hover:shadow-md transition-all">
              <span className="text-[10px] font-mono text-satublue-700 bg-satublue-50 px-2 py-0.5 rounded font-semibold inline-block mb-2">
                KOGNISI MEMORI
              </span>
              <h4 className="text-sm font-semibold text-slate-900 mb-1.5">
                Miller’s Law & Batas Memori Kerja
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Riset George A. Miller (1956) dan Alan Baddeley membuktikan kapasitas memori kerja manusia sangat terbatas (3–5 item simultan). SatuDulu membatasi layar eksekusi ke <strong>1 tugas aktif</strong> untuk mencegah kelebihan muatan kognitif.
              </p>
            </div>

            {/* Baumeister */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-satublue-300 hover:shadow-md transition-all">
              <span className="text-[10px] font-mono text-satublue-700 bg-satublue-50 px-2 py-0.5 rounded font-semibold inline-block mb-2">
                KONTROL DIRI
              </span>
              <h4 className="text-sm font-semibold text-slate-900 mb-1.5">
                Ego Depletion & Decision Fatigue
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Studi Roy Baumeister et al. (1998) menunjukkan energi mental untuk mengambil keputusan cepat terkuras. Fitur <strong>Pairwise Prioritization</strong> menyederhanakan pemilahan menjadi perbandingan biner A vs B yang sangat ringan.
              </p>
            </div>

            {/* Gollwitzer */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-satublue-300 hover:shadow-md transition-all">
              <span className="text-[10px] font-mono text-satublue-700 bg-satublue-50 px-2 py-0.5 rounded font-semibold inline-block mb-2">
                PSIKOLOGI AKSI
              </span>
              <h4 className="text-sm font-semibold text-slate-900 mb-1.5">
                Implementation Intentions
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Peter Gollwitzer (1999) membuktikan bahwa merumuskan konteks spesifik ("Kapan, di mana, dan mengapa") melipatgandakan tingkat ketercapaian. Di SatuDulu, setiap tugas diklarifikasi dengan kolom <strong>"Mengapa Ini Penting"</strong>.
              </p>
            </div>

            {/* Locke & Latham */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-satublue-300 hover:shadow-md transition-all">
              <span className="text-[10px] font-mono text-satublue-700 bg-satublue-50 px-2 py-0.5 rounded font-semibold inline-block mb-2">
                TARGET REALISTIS
              </span>
              <h4 className="text-sm font-semibold text-slate-900 mb-1.5">
                Goal-Setting Theory
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Edwin Locke & Gary Latham (1990) menemukan target proksimal (dekat) dan terukur menghasilkan kinerja optimal. Prinsip <strong>"6 adalah batas aman, bukan target"</strong> mencegah target semu yang menjebak pengguna.
              </p>
            </div>

            {/* Kahneman */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-satublue-300 hover:shadow-md transition-all">
              <span className="text-[10px] font-mono text-satublue-700 bg-satublue-50 px-2 py-0.5 rounded font-semibold inline-block mb-2">
                BIAS KOGNITIF
              </span>
              <h4 className="text-sm font-semibold text-slate-900 mb-1.5">
                The Planning Fallacy
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Daniel Kahneman & Amos Tversky (1979) mengidentifikasi kecenderungan manusia meremehkan waktu. Algoritma <strong>Kalibrasi Personal</strong> SatuDulu mengingatkan ritme riil Anda selama 7–14 hari terakhir.
              </p>
            </div>

            {/* Csikszentmihalyi */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-satublue-300 hover:shadow-md transition-all">
              <span className="text-[10px] font-mono text-satublue-700 bg-satublue-50 px-2 py-0.5 rounded font-semibold inline-block mb-2">
                FOKUS MENDALAM
              </span>
              <h4 className="text-sm font-semibold text-slate-900 mb-1.5">
                Flow State & Imersi
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mihaly Csikszentmihalyi (1990) mendefinisikan *flow* sebagai kondisi konsentrasi penuh tanpa gangguan. <strong>Mode Fokus</strong> SatuDulu mematikan seluruh navigasi dan menyajikan stopwatch bersih di layar penuh atau Picture-in-Picture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Core Loop */}
      <section id="loop" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <div className="mb-14 text-center">
          <span className="text-xs font-semibold text-satublue-700 uppercase tracking-wider font-mono">
            ALUR EKSEKUSI
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight mt-2">
            Dari beban pikiran menuju eksekusi terfokus.
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {[
            {
              step: "01",
              name: "TANGKAP (CAPTURE)",
              title: "Keluarkan semua isi pikiran Anda.",
              desc: "Tuangkan semua ide, tugas, dan revisi ke Inbox tanpa gesekan. Tidak perlu langsung mengurutkan prioritas.",
            },
            {
              step: "02",
              name: "KLARIFIKASI (CLARIFY & AI)",
              title: "Jadikan komitmen dapat dieksekusi.",
              desc: "Ubah tugas samar ('Kerjakan skripsi') menjadi tindakan nyata ('Tulis draf bab metodologi'). Dilengkapi asisten AI gratis.",
            },
            {
              step: "03",
              name: "PRIORITASKAN (PAIRWISE)",
              title: "Keputusan biner yang ringan.",
              desc: "Bandingkan dua hal sekaligus: 'Mana yang lebih penting untuk besok?' Dapatkan kejelasan tanpa harus mengurutkan 20 tugas.",
            },
            {
              step: "04",
              name: "KALIBRASI & KOMITMEN",
              title: "Kapasitas adaptif, bukan target palsu.",
              desc: "SatuDulu mempelajari ritme asli Anda. Mau berkomitmen pada 1, 3, atau hingga 6 hal, angka 6 adalah batas aman, bukan kuota wajib.",
            },
            {
              step: "05",
              name: "EKSEKUSI (SINGLE-THREAD & PiP)",
              title: "Mode fokus satu tugas.",
              desc: "Hanya lihat komitmen aktif Anda dengan stopwatch Picture-in-Picture. Judul tugas mendatang tetap disembunyikan.",
            },
            {
              step: "06",
              name: "REFLEKSI & PENGALIHAN",
              title: "Bawa ke esok hari tanpa rasa bersalah.",
              desc: "Tugas yang belum selesai dialihkan dengan bersih. Anda memutuskannya kembali besok dengan pikiran yang segar.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200/90 hover:border-satublue-300 hover:shadow-md transition-all gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <span className="text-sm font-mono font-semibold text-satublue-700 bg-satublue-50 px-2.5 py-1 rounded-lg border border-satublue-100 shrink-0">
                  {item.step}
                </span>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 tracking-wider">
                    {item.name}
                  </span>
                  <h4 className="text-base font-semibold text-slate-900 mt-0.5">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto py-16 px-4 sm:px-6 border-t border-slate-200 text-center bg-white/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold text-slate-900 mb-3">
            Tentukan apa yang penting. Kerjakan satu per satu.
          </h3>
          <p className="text-sm text-slate-600 mb-8">
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
          <div className="mt-12 text-xs text-slate-400 flex items-center justify-center gap-4 flex-wrap">
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
