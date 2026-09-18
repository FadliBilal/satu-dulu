"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Inbox,
  Calendar,
  Archive,
  Settings,
  BookOpen,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import clsx from "clsx";
import { getRepository, clearRepositoryCache } from "@/lib/repository";
import { getCurrentDateInTimezone } from "@/lib/domain/rollover";
import { useAuth } from "@/lib/supabase/auth-context";
import { useTheme } from "@/lib/theme-context";
import { Logo } from "../ui/Logo";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isGuest, isSupabaseEnabled, signOut } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [momentum, setMomentum] = useState<number>(0);
  const [currentDateStr, setCurrentDateStr] = useState<string>("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadNavData() {
      try {
        const repo = getRepository();
        const [stats, profile] = await Promise.all([
          repo.getExecutionStats().catch(() => ({ current_momentum: 0 })),
          repo.getProfile().catch(() => ({ timezone: "Asia/Jakarta" })),
        ]);

        if (stats) setMomentum(stats.current_momentum || 0);

        const tz = profile?.timezone || "Asia/Jakarta";
        const today = getCurrentDateInTimezone(tz);
        const dateObj = new Date(today + "T00:00:00");
        setCurrentDateStr(
          new Intl.DateTimeFormat("id-ID", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }).format(dateObj)
        );
      } catch (err) {
        console.warn("Gagal memuat info navbar:", err);
      }
    }
    loadNavData();
  }, [pathname, user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await signOut();
    clearRepositoryCache();
    router.push("/login");
  };

  const navItems = [
    { label: "Hari Ini", href: "/app", icon: CheckCircle2 },
    { label: "Inbox", href: "/app/inbox", icon: Inbox },
    { label: "Rencana", href: "/app/plan", icon: Calendar },
    { label: "Vault", href: "/app/vault", icon: Archive },
  ];

  const userMetadataUsername = user?.user_metadata?.username;
  const displayName = userMetadataUsername
    ? `@${userMetadataUsername}`
    : user?.email || "Tamu (Mode Offline)";

  const userInitial = userMetadataUsername
    ? userMetadataUsername.slice(0, 2).toUpperCase()
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "TM";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md transition-all">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center justify-between gap-2">
        {/* Left: Brand & Tablet/Desktop Navigation Pills */}
        <div className="flex items-center gap-2.5 sm:gap-4 lg:gap-6 shrink-0">
          <Link href="/app" className="flex items-center shrink-0">
            <Logo showText={true} className="w-6 h-6" textSize="md" />
          </Link>

          {/* Tablet & Desktop Navigation Pills (Hidden on mobile < md) */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-900/90 border border-transparent dark:border-slate-800/60 rounded-xl">
            {navItems.map((item) => {
              const isActive =
                item.href === "/app"
                  ? pathname === "/app"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0",
                    isActive
                      ? "text-satublue-700 dark:text-satublue-300 bg-white dark:bg-slate-800 font-semibold shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Momentum, Theme Toggle, Guide, Settings, and User Avatar */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Momentum Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-satublue-50 dark:bg-blue-950/70 border border-satublue-200/80 dark:border-blue-800/80 shadow-xs"
            title="Skor Momentum Eksekusi"
          >
            <span className="w-2 h-2 rounded-full bg-satublue-600 dark:bg-sky-400 animate-pulse" />
            <span className="text-xs font-semibold text-satublue-900 dark:text-sky-200 font-mono">
              {momentum}
            </span>
            <span className="text-[10px] text-satublue-700 dark:text-sky-400 font-mono hidden sm:inline">
              MOMENTUM
            </span>
          </div>

          {/* Date pill (XL screens only) */}
          {currentDateStr && (
            <span className="hidden xl:inline-block text-xs font-mono text-slate-500 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-transparent dark:border-slate-700/60">
              {currentDateStr}
            </span>
          )}

          {/* Theme Quick Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            title={resolvedTheme === "dark" ? "Beralih ke Tema Terang" : "Beralih ke Tema Gelap"}
            aria-label="Toggle tema"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Panduan shortcut (Tablet & Desktop) */}
          <Link
            href="/guide"
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            title="Panduan Cara Pakai"
          >
            <BookOpen className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden lg:inline text-xs">Panduan</span>
          </Link>

          {/* Settings shortcut (Tablet & Desktop) */}
          <Link
            href="/app/settings"
            className="hidden md:flex items-center gap-1 p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            title="Pengaturan"
          >
            <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </Link>

          {/* User Avatar Dropdown (All Screen Sizes) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1 p-0.5 sm:p-1 pl-1 sm:pl-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all border border-slate-200/80 dark:border-slate-700 shrink-0"
              title={displayName}
            >
              <div className="w-6 h-6 rounded-full bg-satublue-600 text-white flex items-center justify-center text-[10px] font-semibold tracking-wider">
                {userInitial}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400 mr-0.5" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {displayName}
                  </p>
                  {user?.email && userMetadataUsername && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {user.email}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    {user ? "Supabase Cloud" : "Penyimpanan Lokal"}
                  </span>
                </div>

                <div className="p-1 space-y-0.5">
                  {/* Panduan accessible on mobile too */}
                  <Link
                    href="/guide"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    Panduan Penggunaan
                  </Link>

                  <Link
                    href="/app/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    Pengaturan Akun
                  </Link>

                  {user ? (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-medium text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      Keluar
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-satublue-700 dark:text-satublue-400 hover:bg-satublue-50 dark:hover:bg-satublue-950/40 transition-colors font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-satublue-600 dark:text-satublue-400" />
                      Masuk / Buat Akun
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

      {/* Floating Modern Mobile Bottom Navigation (Rendered outside header to guarantee bottom positioning) */}
      <div className="md:hidden fixed bottom-3 inset-x-0 z-50 px-3 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-[340px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-full py-1.5 px-2 shadow-xl shadow-slate-900/10 dark:shadow-black/50 flex items-center justify-around">
          {[
            ...navItems,
            { label: "Panduan", href: "/guide", icon: BookOpen },
          ].map((item) => {
            const isActive =
              item.href === "/app"
                ? pathname === "/app"
                : pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-full transition-all text-[10px] font-medium",
                  isActive
                    ? "text-satublue-700 dark:text-satublue-300 font-semibold bg-satublue-50/90 dark:bg-satublue-950/80 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                <Icon className={clsx("w-4 h-4", isActive ? "text-satublue-600 dark:text-satublue-400" : "text-slate-400")} />
                <span className="truncate max-w-[55px] text-center leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};
