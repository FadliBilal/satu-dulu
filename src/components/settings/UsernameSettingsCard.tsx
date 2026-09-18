"use client";

import React from "react";
import { AtSign } from "lucide-react";
import { Card, Button, Input } from "@/components/ui";

export interface UsernameSettingsCardProps {
  usernameInput: string;
  setUsernameInput: (value: string) => void;
  usernameError: string;
  setUsernameError: (value: string) => void;
  onSave: () => void;
  saving: boolean;
}

export const UsernameSettingsCard: React.FC<UsernameSettingsCardProps> = ({
  usernameInput,
  setUsernameInput,
  usernameError,
  setUsernameError,
  onSave,
  saving,
}) => {
  return (
    <Card className="mb-6 p-5 sm:p-6 bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Username Pengguna (@)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
          Username unik akun Anda untuk personalisasi tampilan eksekusi.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              value={usernameInput}
              onChange={(e) => {
                setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
                setUsernameError("");
              }}
              placeholder="nama_pengguna"
              maxLength={20}
              leftIcon={<AtSign className="w-4 h-4" />}
              error={usernameError}
              helperText={
                !usernameError
                  ? "3-20 karakter huruf kecil, angka, dan garis bawah (_)."
                  : undefined
              }
            />
          </div>
          <div className="self-start sm:self-auto pt-0 sm:pt-0">
            <Button
              size="md"
              variant="outline"
              disabled={saving}
              onClick={onSave}
              className="shrink-0 text-xs py-2.5 h-[42px]"
            >
              Simpan Username
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
