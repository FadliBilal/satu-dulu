"use client";

import React from "react";
import { Mail, KeyRound, ArrowLeft } from "lucide-react";
import { Input, Button } from "@/components/ui";

export interface ForgotPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  errorMsg: string;
  successMsg: string;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  email,
  setEmail,
  loading,
  errorMsg,
  successMsg,
  onSubmit,
  onBackToLogin,
}) => {
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <button
          type="button"
          onClick={onBackToLogin}
          className="inline-flex items-center gap-1.5 text-xs text-satublue-600 dark:text-satublue-400 hover:text-satublue-800 dark:hover:text-satublue-300 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Halaman Masuk
        </button>
      </div>

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

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Alamat Email Akun Anda"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          leftIcon={<Mail className="w-4 h-4" />}
          helperText="Kami akan mengirimkan instruksi dan tautan pemulihan kata sandi ke email Anda."
        />

        <Button
          type="submit"
          size="md"
          variant="blue"
          disabled={loading}
          className="w-full py-2.5 rounded-xl shadow-xs font-medium mt-2"
        >
          {loading ? (
            "Mengirim Permintaan..."
          ) : (
            <>
              Kirim Tautan Pemulihan
              <KeyRound className="w-4 h-4 ml-1.5" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
