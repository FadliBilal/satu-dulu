"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-satubg-light flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-satublue-50 text-satublue-600 flex items-center justify-center mx-auto mb-4 border border-satublue-100 shadow-xs">
        <Compass className="w-7 h-7" />
      </div>
      <span className="text-xs font-semibold text-satublue-700 uppercase tracking-wider font-mono">
        404 • HALAMAN TIDAK DITEMUKAN
      </span>
      <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-1 mb-2">
        Arah yang Anda cari tidak ada
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        Halaman ini mungkin telah dipindahkan atau tautan yang Anda tuju kurang tepat.
      </p>

      <Link href="/app">
        <Button size="md" variant="blue" className="px-6 rounded-xl shadow-xs">
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          Kembali ke Ruang Eksekusi
        </Button>
      </Link>
    </div>
  );
}
