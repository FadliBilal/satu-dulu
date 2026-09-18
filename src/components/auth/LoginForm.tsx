"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input, Button } from "@/components/ui";

export interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  errorMsg: string;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPasswordClick: () => void;
  password?: string;
  setPassword?: (password: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  loading,
  errorMsg,
  onSubmit,
  onForgotPasswordClick,
  password = "",
  setPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 font-medium animate-in fade-in">
          {errorMsg}
        </div>
      )}

      <Input
        label="Alamat Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="nama@email.com"
        leftIcon={<Mail className="w-4 h-4" />}
      />

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Kata Sandi
          </label>
          <button
            type="button"
            onClick={onForgotPasswordClick}
            className="text-[11px] text-satublue-600 dark:text-satublue-400 hover:text-satublue-800 dark:hover:text-satublue-300 font-medium transition-colors"
          >
            Lupa kata sandi?
          </button>
        </div>

        <Input
          type={showPassword ? "text" : "password"}
          required
          value={password}
          onChange={(e) => setPassword?.(e.target.value)}
          placeholder="Masukkan kata sandi"
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
            Masuk Sekarang
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </>
        )}
      </Button>
    </form>
  );
};
