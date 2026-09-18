"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, KeyRound, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/supabase/auth-context";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Button, Logo, Input } from "@/components/ui";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { user, updatePassword, isSupabaseEnabled } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [isRecoverySessionReady, setIsRecoverySessionReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function checkRecoverySession() {
      const client = getSupabaseClient();
      if (!client) {
        setInitializing(false);
        return;
      }

      // Check for error fragments in URL (e.g. otp_expired)
      if (typeof window !== "undefined") {
        const hash = window.location.hash || "";
        const search = window.location.search || "";
        if (
          hash.includes("error_code=otp_expired") ||
          search.includes("error_code=otp_expired") ||
          hash.includes("access_denied") ||
          search.includes("access_denied")
        ) {
          setErrorMsg(
            "Tautan pemulihan kata sandi telah kedaluwarsa atau sudah pernah digunakan. Silakan minta tautan pemulihan baru melalui halaman Masuk."
          );
          setInitializing(false);
          return;
        }

        // 1. Check if PKCE code parameter exists in URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          try {
            const { data, error } = await client.auth.exchangeCodeForSession(code);
            if (!error && data.session) {
              setIsRecoverySessionReady(true);
              setInitializing(false);
              return;
            }
          } catch (err) {
            console.warn("Gagal menukar kode PKCE:", err);
          }
        }

        // 2. Check hash fragments (implicit flow)
        if (window.location.hash && window.location.hash.includes("access_token")) {
          try {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get("access_token");
            const refreshToken = hashParams.get("refresh_token");
            if (accessToken && refreshToken) {
              const { data, error } = await client.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              if (!error && data.session) {
                setIsRecoverySessionReady(true);
                setInitializing(false);
                return;
              }
            }
          } catch (err) {
            console.warn("Gagal set session dari hash:", err);
          }
          setIsRecoverySessionReady(true);
          setInitializing(false);
          return;
        }
      }

      // 3. Check current session
      const { data } = await client.auth.getSession();
      if (data.session) {
        setIsRecoverySessionReady(true);
      }
      setInitializing(false);
    }

    checkRecoverySession();

    // Listen to PASSWORD_RECOVERY event
    const client = getSupabaseClient();
    if (client) {
      const { data: { subscription } } = client.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
          setIsRecoverySessionReady(true);
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!password || password.length < 6) {
      setErrorMsg("Kata sandi baru minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok. Harap periksa kembali.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        if (error.message.includes("Auth session missing")) {
          setErrorMsg(
            "Sesi pemulihan tidak ditemukan atau tautan telah kedaluwarsa. Silakan minta tautan baru melalui menu Lupa Password di halaman Masuk."
          );
        } else {
          setErrorMsg(error.message || "Gagal memperbarui kata sandi.");
        }
      } else {
        setSuccessMsg("Kata sandi berhasil diperbarui! Mengalihkan ke ruang eksekusi...");
        setTimeout(() => {
          router.push("/app");
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Terjadi kesalahan saat memperbarui kata sandi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-satubg-light dark:bg-[#090D16] flex flex-col items-center justify-center px-4 py-8 relative selection:bg-satublue-100 dark:selection:bg-satublue-900">
      {/* Gentle ambient aura in the backdrop */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[340px] sm:w-[600px] h-[400px] bg-gradient-to-b from-blue-100/60 dark:from-blue-950/20 via-indigo-50/40 dark:via-indigo-950/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md mb-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-satublue-600 dark:hover:text-satublue-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Masuk
        </Link>
      </div>

      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/50 transition-all">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size={44} className="w-11 h-11" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Atur Ulang Kata Sandi
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Buat kata sandi baru yang aman untuk akun SatuDulu Anda.
          </p>
        </div>

        {/* Warning if opened without email recovery link */}
        {!initializing && !isRecoverySessionReady && !user && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 font-medium flex items-start gap-2 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              Pastikan Anda membuka halaman ini dengan mengklik tautan pemulihan yang dikirimkan ke email Anda.
            </span>
          </div>
        )}

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 font-medium animate-in fade-in">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-300 font-medium animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Kata Sandi Baru
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              leftIcon={<Lock className="w-4 h-4" />}
              rightAction={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Konfirmasi Kata Sandi Baru
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              leftIcon={<Lock className="w-4 h-4" />}
            />
          </div>

          <Button
            type="submit"
            size="md"
            variant="blue"
            disabled={loading}
            className="w-full py-2.5 rounded-xl shadow-xs font-medium mt-2"
          >
            {loading ? (
              "Menyimpan..."
            ) : (
              <>
                Simpan Kata Sandi Baru
                <KeyRound className="w-4 h-4 ml-1.5" />
              </>
            )}
          </Button>
        </form>

        {/* Database Security Pill */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>
            {isSupabaseEnabled
              ? "Tersimpan aman via Supabase Authentication"
              : "Mode Demo"}
          </span>
        </div>
      </div>
    </div>
  );
}
