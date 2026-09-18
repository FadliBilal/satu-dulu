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
  AtSign,
  ChevronDown,
  KeyRound,
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
  const {
    signInWithPassword,
    signUpWithPassword,
    resetPasswordForEmail,
    continueAsGuest,
    isSupabaseEnabled,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [username, setUsername] = useState("");
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

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMsg("Harap masukkan alamat email asli yang valid (contoh: nama@gmail.com).");
      return;
    }

    if (mode === "forgot") {
      setLoading(true);
      try {
        const { error } = await resetPasswordForEmail(cleanEmail);
        if (error) {
          setErrorMsg(error.message || "Gagal mengirim tautan pemulihan kata sandi.");
        } else {
          setSuccessMsg(
            "Tautan pemulihan kata sandi telah dikirim! Silakan periksa kotak masuk atau folder spam email Anda."
          );
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Terjadi kesalahan saat memproses permintaan.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setErrorMsg("Harap masukkan kata sandi.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Kata sandi minimal 6 karakter.");
      return;
    }

    if (mode === "register") {
      const cleanUsername = username.trim().toLowerCase();
      if (!cleanUsername) {
        setErrorMsg("Harap tentukan username Anda.");
        return;
      }
      if (cleanUsername.length < 3 || cleanUsername.length > 20) {
        setErrorMsg("Username harus memiliki panjang antara 3 hingga 20 karakter.");
        return;
      }
      if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
        setErrorMsg("Username hanya boleh terdiri dari huruf kecil, angka, dan garis bawah (_).");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await signInWithPassword(cleanEmail, password);
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
        const cleanUsername = username.trim().toLowerCase();
        const { error, user, session } = await signUpWithPassword(cleanEmail, password, cleanUsername);
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
          } else if (!session) {
            setSuccessMsg(
              "Akun berhasil didaftarkan! Silakan periksa inbox/spam email Anda untuk verifikasi, lalu masuk."
            );
            setTimeout(() => {
              setMode("login");
            }, 3500);
          } else {
            setSuccessMsg("Akun berhasil dibuat! Menyiapkan ruang eksekusi...");
            setTimeout(() => {
              if (onSuccess) {
                onSuccess();
              } else {
                router.push("/app");
              }
            }, 1000);
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
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/50 transition-all">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size={44} className="w-11 h-11" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {mode === "login"
              ? "Masuk ke SatuDulu"
              : mode === "register"
              ? "Mulai Akun Baru"
              : "Pemulihan Kata Sandi"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === "login"
              ? "Lanjutkan eksekusi komitmen harian Anda dengan tenang."
              : mode === "register"
              ? "Sistem eksekusi personal thread tunggal bebas rasa bersalah."
              : "Masukkan email Anda untuk menerima tautan pemulihan sandi."}
          </p>
        </div>

        {/* Mode Switcher Tabs (Hidden during forgot mode) */}
        {mode !== "forgot" ? (
          <div className="grid grid-cols-2 p-1 bg-slate-100/90 dark:bg-slate-950 rounded-xl mb-6 text-xs font-medium text-slate-600 dark:text-slate-400 border border-transparent dark:border-slate-800/60">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === "login"
                  ? "bg-white dark:bg-slate-800 text-satublue-700 dark:text-satublue-300 font-semibold shadow-xs"
                  : "hover:text-slate-900 dark:hover:text-slate-100"
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
                  ? "bg-white dark:bg-slate-800 text-satublue-700 dark:text-satublue-300 font-semibold shadow-xs"
                  : "hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              Daftar Baru
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="inline-flex items-center gap-1.5 text-xs text-satublue-600 dark:text-satublue-400 hover:text-satublue-800 dark:hover:text-satublue-300 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Halaman Masuk
            </button>
          </div>
        )}

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 font-medium animate-in fade-in">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-300 font-medium animate-in fade-in leading-relaxed">
            {successMsg}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Username (@nama_pengguna)
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                  }
                  placeholder="e.g. fadlibilal"
                  maxLength={20}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-satublue-500/20 focus:border-satublue-600 transition-all bg-white dark:bg-slate-950 font-mono"
                />
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                3–20 karakter (huruf kecil, angka, atau garis bawah).
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {mode === "register" ? "Alamat Email Asli (Aktif)" : "Alamat Email"}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-satublue-500/20 focus:border-satublue-600 transition-all bg-white dark:bg-slate-950"
              />
            </div>
            {mode === "register" && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                Pastikan email aktif untuk menerima tautan konfirmasi pendaftaran.
              </span>
            )}
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {mode === "register" ? "Buat Kata Sandi Baru" : "Kata Sandi"}
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-[11px] text-satublue-600 dark:text-satublue-400 hover:text-satublue-800 dark:hover:text-satublue-300 font-medium transition-colors"
                  >
                    Lupa kata sandi?
                  </button>
                )}
              </div>

              {mode === "register" && (
                <div className="p-2.5 rounded-xl bg-satublue-50 dark:bg-satublue-950/60 border border-satublue-200/80 dark:border-satublue-800 mb-2 flex items-start gap-2 text-xs text-satublue-900 dark:text-satublue-200 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-satublue-600 dark:text-satublue-400 shrink-0 mt-0.5" />
                  <span className="text-[11px]">
                    Buat kata sandi baru untuk SatuDulu. <strong>Bukan</strong> kata sandi akun email asli Anda demi keamanan privasi Anda.
                  </span>
                </div>
              )}

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "Minimal 6 karakter" : "Masukkan kata sandi"}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-satublue-500/20 focus:border-satublue-600 transition-all bg-white dark:bg-slate-950"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

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
            ) : mode === "register" ? (
              <>
                Daftar Akun Baru
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            ) : (
              <>
                Kirim Tautan Pemulihan
                <KeyRound className="w-4 h-4 ml-1.5" />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        {mode !== "forgot" && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 dark:text-slate-500 font-mono">
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
              className="w-full py-2.5 rounded-xl text-xs font-medium border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <UserCheck className="w-4 h-4 mr-2 text-slate-500" />
              Masuk sebagai Tamu (Mode Offline Demo)
            </Button>
          </>
        )}

        {/* Database Security Pill */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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
