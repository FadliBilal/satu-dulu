"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/auth-context";
import { useTheme } from "@/lib/theme-context";
import { clearRepositoryCache } from "@/lib/repository";
import { useProfile } from "@/hooks";
import { AccountSettingsCard } from "./AccountSettingsCard";
import { UsernameSettingsCard } from "./UsernameSettingsCard";
import { ThemeSettingsCard } from "./ThemeSettingsCard";
import { AISettingsCard } from "./AISettingsCard";
import { NotificationSettingsCard } from "./NotificationSettingsCard";
import { EnvironmentSettingsCard } from "./EnvironmentSettingsCard";
import { DangerZoneCard } from "./DangerZoneCard";
import { DeleteAccountModal } from "./DeleteAccountModal";

export const SettingsView: React.FC = () => {
  const router = useRouter();
  const { user, signOut, deleteAccount } = useAuth();
  const { theme, setTheme } = useTheme();

  const {
    profile,
    loading,
    saving,
    message,
    usernameInput,
    usernameError,
    notificationPermission,
    geminiKey,
    setUsernameInput,
    setUsernameError,
    setGeminiKey,
    updateProfile,
    saveUsername,
    saveGeminiKey,
    enableNotifications,
    testNotification,
    resetDemoData,
  } = useProfile();

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");
  const [deletingAccount, setDeletingAccount] = useState<boolean>(false);

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun?")) {
      await signOut();
      clearRepositoryCache();
      router.push("/login");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.trim().toUpperCase() !== "HAPUS") {
      return;
    }
    setDeletingAccount(true);
    try {
      const { error } = await deleteAccount();
      if (error) {
        alert(error.message || "Gagal menghapus akun.");
      } else {
        setShowDeleteModal(false);
        clearRepositoryCache();
        router.push("/login");
      }
    } catch (err: any) {
      alert(err?.message || "Terjadi kesalahan saat menghapus akun.");
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="py-24 text-center text-xs text-slate-400 font-mono">
        Memuat pengaturan...
      </div>
    );
  }

  const isSupabaseActive = isSupabaseConfigured && Boolean(user);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Pengaturan
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Sesuaikan akun, preferensi tema, AI gratis, dan lingkungan eksekusi Anda.
        </p>
      </div>

      {message && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-300 font-medium animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Modular Settings Cards */}
      <AccountSettingsCard
        profile={profile}
        user={user}
        isSupabaseActive={isSupabaseActive}
        onLogout={handleLogout}
      />

      <UsernameSettingsCard
        usernameInput={usernameInput}
        setUsernameInput={setUsernameInput}
        usernameError={usernameError}
        setUsernameError={setUsernameError}
        onSave={saveUsername}
        saving={saving}
      />

      <ThemeSettingsCard theme={theme} setTheme={setTheme} />

      <AISettingsCard
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        onSaveKey={saveGeminiKey}
      />

      <NotificationSettingsCard
        permission={notificationPermission}
        onEnable={enableNotifications}
        onTest={testNotification}
      />

      <EnvironmentSettingsCard
        timezone={profile.timezone}
        occupation={profile.occupation}
        onUpdateTimezone={(tz) => updateProfile({ timezone: tz })}
        onUpdateOccupation={(occ) => updateProfile({ occupation: occ })}
        onResetDemo={resetDemoData}
      />

      <DangerZoneCard
        onOpenModal={() => {
          setDeleteConfirmation("");
          setShowDeleteModal(true);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        deleteConfirmation={deleteConfirmation}
        setDeleteConfirmation={setDeleteConfirmation}
        onConfirmDelete={handleDeleteAccount}
        deletingAccount={deletingAccount}
      />
    </div>
  );
};
