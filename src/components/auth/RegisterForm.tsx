"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AtSign, ArrowRight, ShieldCheck } from "lucide-react";
import { Input, Button } from "@/components/ui";

export interface RegisterFormProps {
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  errorMsg: string;
  successMsg: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  errorMsg,
  successMsg,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 font-medium animate-in fade-in">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-300 font-medium animate-in fade-in leading-relaxed">
          {successMsg}
        </div>
      )}

      <div>
        <Input
          label="Username (@nama_pengguna)"
          type="text"
          required
          value={username}
          onChange={(e) =>
            setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
          }
          placeholder="e.g. fadlibilal"
          maxLength={20}
          leftIcon={<AtSign className="w-4 h-4" />}
          helperText="3–20 karakter (huruf kecil, angka, atau garis bawah)."
          className="font-mono"
        />
      </div>

      <div>
        <Input
          label="Alamat Email Asli (Aktif)"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          leftIcon={<Mail className="w-4 h-4" />}
          helperText="Pastikan email aktif untuk menerima tautan konfirmasi pendaftaran."
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Buat Kata Sandi Baru
        </label>

        <div className="p-2.5 rounded-xl bg-satublue-50 dark:bg-satublue-950/60 border border-satublue-200/80 dark:border-satublue-800 mb-2 flex items-start gap-2 text-xs text-satublue-900 dark:text-satublue-200 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-satublue-600 dark:text-satublue-400 shrink-0 mt-0.5" />
          <span className="text-[11px]">
            Buat kata sandi baru untuk SatuDulu. <strong>Bukan</strong> kata sandi akun email asli Anda demi keamanan privasi Anda.
          </span>
        </div>

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

      <Button
        type="submit"
        size="md"
        variant="blue"
        disabled={loading}
        className="w-full py-2.5 rounded-xl shadow-xs font-medium mt-2"
      >
        {loading ? (
          "Memproses..."
        ) : (
          <>
            Daftar Akun Baru
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </>
        )}
      </Button>
    </form>
  );
};
