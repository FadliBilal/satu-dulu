"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  UserCheck,
  Sparkles,
  Database,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/supabase/auth-context";
import { Button } from "../ui/Button";
import { clearRepositoryCache } from "@/lib/repository";
import { Logo } from "../ui/Logo";

interface AuthViewProps {
  onSuccess?: () => void;
  isModal?: boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, isModal = false }) => {
  const router = useRouter();
  const { signInWithPassword, signUpWithPassword, continueAsGuest, isSupabaseEnabled } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Harap masukkan email dan kata sandi.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await signInWithPassword(email.trim(), password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setErrorMsg("Email atau kata sandi tidak cocok. Silakan periksa kembali.");
          } else {
            setErrorMsg(error.message || "Gagal masuk ke akun.");
          }
        } else {
          clearRepositoryCache();
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/app");
          }
        }
      } else {
        const { error, user } = await signUpWithPassword(email.trim(), password);
        if (error) {
          if (error.message.includes("already registered")) {
            setErrorMsg("Email ini sudah terdaftar. Silakan pilih tab Masuk.");
          } else {
            setErrorMsg(error.message || "Gagal mendaftar akun baru.");
          }
        } else {
          clearRepositoryCache();
          if (user && !user.identities?.length) {
            setErrorMsg("Akun dengan email ini sudah ada. Silakan masuk.");
          } else {
            setSuccessMsg(
              "Akun berhasil dibuat! Silakan periksa inbox email Anda untuk konfirmasi jika diwajibkan oleh Supabase, atau langsung masuk."
            );
            // If user session was immediately established, proceed
            setTimeout(() => {
              if (onSuccess) {
                onSuccess();
              } else {
                router.push("/app");
              }
            }, 1200);
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses otentikasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    clearRepositoryCache();
    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/app");
    }
  };

  return (
    <div className={isModal ? "w-full" : "min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 relative"}>
      {/* Background aura for standalone page */}
      {!isModal && (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[340px] sm:w-[600px] h-[400px] bg-gradient-to-b from-blue-100/60 via-indigo-50/40 to-transparent blur-3xl rounded-full" />
        </div>
      )}

      {/* Back to Home Link (if standalone) */}
      {!isModal && (
        <div className="w-full max-w-md mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-satublue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Beranda
          </Link>
        </div>
      )}

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 transition-all">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size={44} className="w-11 h-11" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            {mode === "login" ? "Masuk ke SatuDulu" : "Mulai Akun Baru"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {mode === "login"
              ? "Lanjutkan eksekusi komitmen harian Anda dengan tenang."
              : "Sistem eksekusi personal thread tunggal bebas rasa bersalah."}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-xl mb-6 text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === "login"
                ? "bg-white text-satublue-700 font-semibold shadow-xs"
                : "hover:text-slate-900"
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === "register"
                ? "bg-white text-satublue-700 font-semibold shadow-xs"
                : "hover:text-slate-900"
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium animate-in fade-in">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium animate-in fade-in">
            {successMsg}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-satublue-500/20 focus:border-satublue-600 transition-all bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-satublue-500/20 focus:border-satublue-600 transition-all bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            size="md"
            variant="blue"
            disabled={loading}
            className="w-full py-2.5 rounded-xl shadow-xs font-medium mt-2"
          >
            {loading ? (
              "Memproses..."
            ) : mode === "login" ? (
              <>
                Masuk Sekarang
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            ) : (
              <>
                Daftar Akun Baru
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-2 text-slate-400 font-mono">
              atau coba langsung
            </span>
          </div>
        </div>

        {/* Guest Mode Action */}
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleGuest}
          className="w-full py-2.5 rounded-xl text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <UserCheck className="w-4 h-4 mr-2 text-slate-500" />
          Masuk sebagai Tamu (Mode Offline Demo)
        </Button>

        {/* Database Security Pill */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {isSupabaseEnabled
              ? "Dilindungi Supabase PostgreSQL RLS"
              : "Penyimpanan Browser Offline"}
          </span>
        </div>
      </div>
    </div>
  );
};
