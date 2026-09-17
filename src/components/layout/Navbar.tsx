"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckCircle2,
  Inbox,
  Calendar,
  Archive,
  Settings,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import clsx from "clsx";
import { getRepository } from "@/lib/repository";
import { getCurrentDateInTimezone } from "@/lib/domain/rollover";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [momentum, setMomentum] = useState<number>(0);
  const [currentDateStr, setCurrentDateStr] = useState<string>("");

  useEffect(() => {
    async function loadNavData() {
      const repo = getRepository();
      const stats = await repo.getExecutionStats();
      const profile = await repo.getProfile();
      setMomentum(stats.current_momentum);

      const today = getCurrentDateInTimezone(profile.timezone || "Asia/Jakarta");
      const dateObj = new Date(today + "T00:00:00");
      setCurrentDateStr(
        new Intl.DateTimeFormat("id-ID", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }).format(dateObj)
      );
    }
    loadNavData();
  }, [pathname]);

  const navItems = [
    { label: "Hari Ini", href: "/app", icon: CheckCircle2 },
    { label: "Inbox", href: "/app/inbox", icon: Inbox },
    { label: "Rencana", href: "/app/plan", icon: Calendar },
    { label: "Vault", href: "/app/vault", icon: Archive },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/app" className="flex items-center gap-2 group">
            <span className="w-2.5 h-2.5 rounded-full bg-satublue-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold tracking-tight text-slate-900 text-base">
              SATUDULU
            </span>
          </Link>

          {/* Desktop Nav - Clean, airy pills */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
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
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                    isActive
                      ? "text-satublue-700 bg-satublue-50 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side: Momentum, Panduan, Pengaturan */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Subtle Momentum pill */}
          {momentum > 0 && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-satublue-50 border border-satublue-200/80 text-satublue-800 text-xs font-medium"
              title={`${momentum} komitmen tuntas berturut-turut`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-satublue-600 animate-pulse" />
              <span className="font-mono font-semibold">{momentum}</span>
              <span className="hidden sm:inline text-[11px] text-satublue-700">Momentum</span>
            </div>
          )}

          {/* Panduan Link */}
          <Link
            href="/guide"
            className={clsx(
              "p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1",
              pathname === "/guide"
                ? "text-satublue-700 bg-satublue-50"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            )}
            title="Panduan Penggunaan"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Panduan</span>
          </Link>

          {/* Pengaturan Link */}
          <Link
            href="/app/settings"
            className={clsx(
              "p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1",
              pathname === "/app/settings"
                ? "text-satublue-700 bg-satublue-50"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            )}
            title="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg">
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
                "flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors",
                isActive
                  ? "text-satublue-700 font-semibold"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon className={clsx("w-4 h-4", isActive && "text-satublue-600")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
