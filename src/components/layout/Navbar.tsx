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
} from "lucide-react";
import clsx from "clsx";
import { getRepository, clearRepositoryCache } from "@/lib/repository";
import { getCurrentDateInTimezone } from "@/lib/domain/rollover";
import { useAuth } from "@/lib/supabase/auth-context";
import { Logo } from "../ui/Logo";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isGuest, isSupabaseEnabled, signOut } = useAuth();

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

  const userInitial = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "TM";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center justify-between gap-2">
        {/* Left: Brand & Tablet/Desktop Navigation Pills */}
        <div className="flex items-center gap-2.5 sm:gap-4 lg:gap-6 shrink-0">
          <Link href="/app" className="flex items-center shrink-0">
            <Logo showText={true} className="w-6 h-6" textSize="md" />
          </Link>

          {/* Tablet & Desktop Navigation Pills (Hidden on mobile < md) */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl">
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
                      ? "text-satublue-700 bg-white font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side: Clean, uncluttered items across breakpoints */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Subtle Date Display — only on wide screens >= 1280px (xl) */}
          {currentDateStr && (
            <span className="hidden xl:inline-block text-[11px] font-mono text-slate-400 border-r border-slate-200 pr-3 mr-1">
              {currentDateStr}
            </span>
          )}

          {/* Momentum counter */}
          {momentum > 0 && (
            <div
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-satublue-50 border border-satublue-200/80 text-satublue-800 text-xs font-medium shrink-0"
              title={`${momentum} komitmen tuntas berturut-turut`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-satublue-600 animate-pulse" />
              <span className="font-mono font-semibold">{momentum}</span>
              <span className="hidden lg:inline text-[11px] text-satublue-700">Momentum</span>
            </div>
          )}

          {/* Panduan Link — visible on md and up, hidden on mobile */}
          <Link
            href="/guide"
            className={clsx(
              "hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0",
              pathname === "/guide"
                ? "text-satublue-700 bg-satublue-50 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            )}
            title="Panduan Filosofi & Eksekusi"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-xs">Panduan</span>
          </Link>

          {/* Pengaturan Link — visible on md and up, hidden on mobile (accessed via avatar) */}
          <Link
            href="/app/settings"
            className={clsx(
              "hidden md:flex p-2 rounded-xl text-xs font-medium transition-colors items-center justify-center shrink-0",
              pathname === "/app/settings"
                ? "text-satublue-700 bg-satublue-50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            )}
            title="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* User Profile Dropdown — ALWAYS clean and accessible */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1 p-0.5 sm:p-1 pl-1 sm:pl-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-all border border-slate-200/80 shrink-0"
              title={user ? user.email : "Akun Pengguna"}
            >
              <div className="w-6 h-6 rounded-full bg-satublue-600 text-white flex items-center justify-center text-[10px] font-semibold tracking-wider">
                {userInitial}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-500 mr-0.5" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {user ? user.email : "Tamu (Mode Offline)"}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {user ? "Supabase Cloud" : "Penyimpanan Lokal"}
                  </span>
                </div>

                <div className="p-1 space-y-0.5">
                  {/* Panduan accessible on mobile too */}
                  <Link
                    href="/guide"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    Panduan Penggunaan
                  </Link>

                  <Link
                    href="/app/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    Pengaturan Akun
                  </Link>

                  {user ? (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-medium text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      Keluar
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-satublue-700 hover:bg-satublue-50 transition-colors font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-satublue-600" />
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
        <nav className="pointer-events-auto w-full max-w-[340px] bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-full py-1.5 px-2 shadow-xl shadow-slate-900/10 flex items-center justify-around">
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
                    ? "text-satublue-700 font-semibold bg-satublue-50/90 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                <Icon className={clsx("w-4 h-4", isActive ? "text-satublue-600" : "text-slate-400")} />
                <span className="truncate max-w-[55px] text-center leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};
