"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, HelpCircle } from "lucide-react";
import { Button, Card } from "@/components/ui";

export const GuideView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-28">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-satublue-50 dark:bg-satublue-950/70 border border-satublue-200 dark:border-satublue-800 text-xs text-satublue-800 dark:text-satublue-300 mb-2.5 font-medium">
          <BookOpen className="w-3.5 h-3.5 text-satublue-600 dark:text-satublue-400" />
          <span>Panduan Singkat</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Cara Kerja SatuDulu
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
          SatuDulu melindungi fokus Anda dengan prinsip single-thread: satu tugas, satu waktu, tanpa tumpukan distraksi.
        </p>
      </div>

      {/* 3 Langkah Eksekusi */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-satublue-700 dark:text-satublue-400 uppercase tracking-wider font-mono mb-4">
          3 Langkah Harian
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-8 h-8 rounded-xl bg-satublue-50 dark:bg-satublue-950/70 text-satublue-700 dark:text-satublue-300 flex items-center justify-center font-mono font-bold text-xs border border-satublue-100 dark:border-satublue-800 mb-3">
                01
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                Tampung di Inbox
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tulis ide atau tugas tanpa beban menyortir. Gunakan <strong>Klarifikasi AI</strong> gratis untuk memecahnya jadi aksi 25–60 menit.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-satublue-600 dark:text-satublue-400 font-medium">
              Inbox • Klarifikasi Cepat
            </div>
          </Card>

          <Card className="p-5 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-8 h-8 rounded-xl bg-satublue-50 dark:bg-satublue-950/70 text-satublue-700 dark:text-satublue-300 flex items-center justify-center font-mono font-bold text-xs border border-satublue-100 dark:border-satublue-800 mb-3">
                02
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                Kunci 1–4 Komitmen
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Pilih tugas via <strong>Pairwise</strong> untuk menentukan urutan esensial. Batas aman maksimal 6 tugas per hari.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-satublue-600 dark:text-satublue-400 font-medium">
              Rencana • Urutan Esensial
            </div>
          </Card>

          <Card className="p-5 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-8 h-8 rounded-xl bg-satublue-50 dark:bg-satublue-950/70 text-satublue-700 dark:text-satublue-300 flex items-center justify-center font-mono font-bold text-xs border border-satublue-100 dark:border-satublue-800 mb-3">
                03
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                Eksekusi Single-Thread
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Kerjakan <strong>Prioritas 01</strong>. Gunakan <strong>Timer Melayang (PiP)</strong> saat membuka aplikasi lain hingga tuntas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-satublue-600 dark:text-satublue-400 font-medium">
              Hari Ini • Bebas Gangguan
            </div>
          </Card>
        </div>
      </div>

      {/* Prinsip Desain Ringkas */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-satublue-700 dark:text-satublue-400 uppercase tracking-wider font-mono mb-4">
          Prinsip Kunci
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Hari Sempurna (100% Selaras)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              1/1, 2/2, atau 4/4 selesai adalah Hari Sempurna. Sistem menghargai komitmen yang realistis, bukan jumlah tugas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Pengalihan Tanpa Rasa Bersalah
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tugas yang belum selesai otomatis dialihkan ke kandidat rencana berikutnya tanpa penalti atau rasa bersalah.
            </p>
          </div>
        </div>
      </div>

      {/* Tanya Jawab Singkat */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-satublue-700 dark:text-satublue-400 uppercase tracking-wider font-mono mb-4">
          Pertanyaan Umum
        </h2>

        <div className="space-y-2.5">
          {[
            {
              q: "Bagaimana jika ada hal mendesak di tengah hari?",
              a: "Gunakan tombol Replan di halaman Hari Ini untuk menyesuaikan komitmen tanpa merusak catatan.",
            },
            {
              q: "Apakah AI di SatuDulu berbayar?",
              a: "Tidak. Mesin heuristik bawaan 100% offline dan gratis selamanya. Opsi Google Gemini Flash juga gratis tanpa kartu kredit.",
            },
            {
              q: "Apakah data saya tetap tersimpan offline?",
              a: "Ya. SatuDulu bekerja offline-first di peramban Anda, dan otomatis tersinkron ke cloud jika Anda menghubungkan akun.",
            },
          ].map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-satublue-600 dark:text-satublue-400 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-5 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="p-6 rounded-2xl bg-satublue-50 dark:bg-slate-900/90 border border-satublue-200 dark:border-slate-800 text-center">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
          Mulai Fokus Hari Ini
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
          Tentukan komitmen Anda dan selesaikan satu per satu.
        </p>
        <Link href="/app">
          <Button size="sm" variant="blue" className="px-6 rounded-xl shadow-xs">
            Buka Ruang Eksekusi
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
