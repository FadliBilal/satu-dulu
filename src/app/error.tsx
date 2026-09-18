"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled client error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-satubg-light flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200 shadow-xs">
        <AlertCircle className="w-7 h-7" />
      </div>
      <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider font-mono">
        KENDALA TEKNIS
      </span>
      <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-1 mb-2">
        Ruang kerja terhenti sementara
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        Terjadi kendala yang tidak terduga saat memuat data. Tenang, data lokal dan komitmen Anda tetap tersimpan aman.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button size="md" variant="blue" onClick={() => reset()} className="px-5 rounded-xl shadow-xs">
          <RotateCcw className="w-3.5 h-3.5 mr-2" />
          Muat Ulang
        </Button>
        <Link href="/app">
          <Button size="md" variant="outline" className="px-5 rounded-xl">
            <Home className="w-3.5 h-3.5 mr-2" />
            Kembali ke Hari Ini
          </Button>
        </Link>
      </div>
    </div>
  );
}
