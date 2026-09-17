"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Sliders,
  ExternalLink,
  HelpCircle,
  Calendar,
  Layers,
  Inbox,
  Focus,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export const GuideView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-32">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-satublue-50 border border-satublue-200 text-xs text-satublue-800 mb-3 font-medium">
          <BookOpen className="w-3.5 h-3.5 text-satublue-600" />
          <span>Panduan Penggunaan Sistem SatuDulu</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
          Cara Menggunakan SatuDulu
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-xl">
          SatuDulu bukan aplikasi to-do list untuk menumpuk daftar keinginan. Ini adalah sistem operasi eksekusi harian yang dirancang untuk melindungi memori kerja Anda.
        </p>
      </div>

      {/* Bagian 1: Ritual Harian (4 Siklus Waktu) */}
      <div className="mb-14">
        <span className="text-xs font-semibold text-satublue-700 uppercase tracking-wider font-mono block mb-2">
          BAGIAN 1
        </span>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">
          Ritual Harian: Dari Malam ke Malam
        </h2>

        <div className="space-y-4">
          {/* Malam Hari */}
          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-satublue-50 text-satublue-700 flex items-center justify-center font-mono font-bold text-sm shrink-0 border border-satublue-100">
                01
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    Malam Hari: Perencanaan & Komitmen Besok
                  </h3>
                  <Badge variant="blue">Pukul 20:00 - 22:00</Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Buka menu <strong>Rencana</strong>. Tinjau tugas-tugas di Inbox atau komitmen kemarin yang dialihkan. Gunakan fitur <strong>Urutkan dengan Pairwise</strong> untuk membandingkan mana yang lebih mendesak. Pilih 2 hingga 4 komitmen yang realistis, lalu tekan <strong>[ KOMITMEN UNTUK BESOK ]</strong>.
                </p>
                <div className="mt-3 p-3 rounded-lg bg-slate-50 text-xs text-slate-600 border border-slate-200/60">
                  <strong>Mengapa malam hari?</strong> Mengetahui apa yang akan dieksekusi besok meredakan kecemasan alam bawah sadar sebelum tidur (Zeigarnik Effect), sehingga Anda bangun dengan kejelasan arah.
                </div>
              </div>
            </div>
          </Card>

          {/* Pagi Hari */}
          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-satublue-50 text-satublue-700 flex items-center justify-center font-mono font-bold text-sm shrink-0 border border-satublue-100">
                02
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    Pagi Hari: Mulai Tanpa Decision Fatigue
                  </h3>
                  <Badge variant="neutral">Mulai Bekerja</Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Buka SatuDulu di halaman <strong>Hari Ini</strong>. Anda <em>tidak</em> akan melihat daftar 20 tugas yang membuat pusing. Anda hanya akan melihat <strong>Prioritas 01</strong>. Judul tugas mendatang sengaja disembunyikan. Klik <strong>[ MULAI FOKUS ]</strong> dan mulailah bekerja.
                </p>
              </div>
            </div>
          </Card>

          {/* Siang Hari / Saat Bekerja */}
          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-satublue-50 text-satublue-700 flex items-center justify-center font-mono font-bold text-sm shrink-0 border border-satublue-100">
                03
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    Saat Bekerja: Mode Fokus & Timer Melayang (PiP)
                  </h3>
                  <Badge variant="blue">Deep Work</Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Di Mode Fokus, layar menjadi bersih dari gangguan. Jika Anda bekerja membuka software lain (seperti Word, VS Code, atau Figma), aktifkan tombol <strong>Timer Mengambang (PiP)</strong>. Timer akan melayang di pojok layar komputer Anda sebagai jangkar perhatian.
                </p>
              </div>
            </div>
          </Card>

          {/* Sore / Akhir Hari */}
          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-satublue-50 text-satublue-700 flex items-center justify-center font-mono font-bold text-sm shrink-0 border border-satublue-100">
                04
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    Akhir Hari: Refleksi & Pengalihan Tanpa Rasa Bersalah
                  </h3>
                  <Badge variant="success">Selesai</Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Saat semua komitmen selesai, SatuDulu akan menyampaikan: <em>"Hanya itu yang Anda komitmenkan. Tidak ada hal lain yang diwajibkan."</em> Jika ada tugas yang belum selesai, statusnya menjadi <strong>Dialihkan</strong> dan siap Anda putuskan kembali malam ini secara segar.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bagian 2: Tiga Prinsip Krusial */}
      <div className="mb-14">
        <span className="text-xs font-semibold text-satublue-700 uppercase tracking-wider font-mono block mb-2">
          BAGIAN 2
        </span>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">
          Prinsip Desain yang Perlu Dipahami
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 bg-white border-slate-200">
            <span className="text-xs font-semibold text-satublue-700 block mb-1">
              1. Angka 6 Adalah Batas Aman, Bukan Target
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anda tidak diwajibkan membuat 6 tugas setiap hari. Menentukan 1 komitmen besar ("Selesaikan draf bab 3") lalu menuntaskannya bernilai jauh lebih tinggi daripada membuat 6 tugas kecil yang tidak selesai.
            </p>
          </Card>

          <Card className="p-5 bg-white border-slate-200">
            <span className="text-xs font-semibold text-satublue-700 block mb-1">
              2. Definisi Hari Sempurna (Perfect Day)
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hari Sempurna terjadi ketika 100% komitmen yang Anda tetapkan tuntas: 1/1 adalah Hari Sempurna, 3/3 adalah Hari Sempurna, 5/5 adalah Hari Sempurna. Sistem ini menghargai keselarasan rencana dengan realita.
            </p>
          </Card>

          <Card className="p-5 bg-white border-slate-200">
            <span className="text-xs font-semibold text-satublue-700 block mb-1">
              3. Penyesuaian Terkontrol (Replan)
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dunia nyata dinamis: rapat dadakan muncul, server bermasalah, atau Anda mendadak sakit. Tombol <strong>Replan</strong> ada untuk menyesuaikan komitmen secara sah tanpa dianggap sebagai kegagalan eksekusi.
            </p>
          </Card>

          <Card className="p-5 bg-white border-slate-200">
            <span className="text-xs font-semibold text-satublue-700 block mb-1">
              4. Klarifikasi Berbantuan AI (Gratis)
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jika tugas di Inbox masih samar ("Belajar basis data"), buka <strong>Klarifikasi</strong> dan tekan <strong>Klarifikasi AI (Gratis)</strong>. Sistem akan memecah tugas tersebut menjadi 3 pilihan aksi konkret dalam hitungan detik.
            </p>
          </Card>
        </div>
      </div>

      {/* Bagian 3: Tanya Jawab (FAQ) */}
      <div className="mb-14">
        <span className="text-xs font-semibold text-satublue-700 uppercase tracking-wider font-mono block mb-2">
          BAGIAN 3
        </span>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h2>

        <div className="space-y-3">
          {[
            {
              q: "Apakah tugas yang belum selesai otomatis jadi Prioritas 1 besok?",
              a: "Tidak. Tugas yang dialihkan akan masuk kembali sebagai kandidat di sesi perencanaan malam. Anda yang memegang kendali penuh untuk memutuskan: apakah tugas ini masih penting untuk besok, atau ada hal lain yang lebih mendesak?",
            },
            {
              q: "Bolehkah saya langsung menambah tugas baru di tengah hari?",
              a: "Setelah Anda berkomitmen di malam hari, rencana dikunci demi melindungi kapasitas kognitif Anda dari distraksi dadakan. Namun jika ada situasi mendesak, gunakan tombol Replan untuk mengganti atau memprioritaskan ulang komitmen.",
            },
            {
              q: "Mengapa aplikasi ini tidak memiliki koin, XP, atau level karakter?",
              a: "SatuDulu dirancang untuk menumbuhkan motivasi intrinsik dan fokus nyata, bukan kecanduan game semu. Bukti kemajuan Anda tercatat rapi di The Vault dan Rekor Pribadi tanpa perbandingan dengan orang lain.",
            },
            {
              q: "Apakah data saya tetap aman saat tidak ada internet?",
              a: "Ya. SatuDulu bekerja secara offline-first. Seluruh tugas, komitmen, dan sesi fokus Anda tersimpan aman di penyimpanan lokal browser Anda, dan otomatis tersinkron saat internet tersedia.",
            },
          ].map((faq, idx) => (
            <Card key={idx} className="p-5 bg-white border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-1.5 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-satublue-600 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="p-8 rounded-2xl bg-satublue-50 border border-satublue-200 text-center">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Siap Mulai Eksekusi?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
          Buka aplikasi SatuDulu sekarang, tuangkan isi kepala Anda ke Inbox, dan tetapkan komitmen pertama Anda.
        </p>
        <Link href="/app">
          <Button size="lg" variant="blue" className="px-8 shadow-sm">
            Buka SatuDulu Sekarang
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
