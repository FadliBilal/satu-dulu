"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import {
  ExecutionStats,
  PersonalRecords,
  PlanningCalibration,
} from "@/lib/types";
import { getRepository } from "@/lib/repository";
import { getProfileDescription } from "@/lib/domain/calibration";

export const AnalyticsView: React.FC = () => {
  const [stats, setStats] = useState<ExecutionStats | null>(null);
  const [records, setRecords] = useState<PersonalRecords | null>(null);
  const [calibration, setCalibration] = useState<PlanningCalibration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const repo = getRepository();
        const [s, r, c] = await Promise.all([
          repo.getExecutionStats(),
          repo.getPersonalRecords(),
          repo.getPlanningCalibration(),
        ]);
        setStats(s);
        setRecords(r);
        setCalibration(c);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading || !stats || !records) {
    return (
      <div className="py-24 text-center text-xs text-satutext-muted font-mono">
        Memuat data analitik eksekusi...
      </div>
    );
  }

  const formatHours = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours === 0) return `${mins}m`;
    return `${hours}j ${mins}m`;
  };

  const getQualityText = (q: string) => {
    switch (q) {
      case "realistic":
        return "REALISTIS";
      case "stretched":
        return "SEDIKIT TERENTANG";
      default:
        return "TERLALU BANYAK";
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-28">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-satutext-primary">
          Ritme Eksekusi
        </h1>
        <p className="text-xs text-satutext-secondary mt-1">
          Kemajuan personal yang terkalibrasi berdasarkan komitmen Anda sendiri.
        </p>
      </div>

      {/* Execution Profile Card */}
      <Card className="mb-6 border-satutext-primary/20 bg-white shadow-xs">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-satutext-muted block mb-1">
              PROFIL EKSEKUSI
            </span>
            <h3 className="text-lg font-semibold text-satutext-primary">
              {stats.execution_profile}
            </h3>
          </div>
          <Badge variant="accent" size="md">
            Arketipe Personal
          </Badge>
        </div>
        <p className="text-xs text-satutext-secondary leading-relaxed">
          {getProfileDescription(stats.execution_profile)}
        </p>
      </Card>

      {/* Weekly Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Card className="p-4 bg-white text-center">
          <span className="text-[11px] font-medium text-satutext-muted block mb-1">
            Tingkat Komitmen
          </span>
          <span className="text-2xl font-semibold text-satutext-primary font-mono">
            {stats.historical_completion_rate}%
          </span>
        </Card>

        <Card className="p-4 bg-white text-center">
          <span className="text-[11px] font-medium text-satutext-muted block mb-1">
            Hari Sempurna
          </span>
          <span className="text-2xl font-semibold text-satutext-primary font-mono">
            {records.totalPerfectDays}
          </span>
        </Card>

        <Card className="p-4 bg-white text-center">
          <span className="text-[11px] font-medium text-satutext-muted block mb-1">
            Momentum
          </span>
          <span className="text-2xl font-semibold text-satutext-primary font-mono">
            {stats.current_momentum}
          </span>
        </Card>

        <Card className="p-4 bg-white text-center">
          <span className="text-[11px] font-medium text-satutext-muted block mb-1">
            Waktu Fokus
          </span>
          <span className="text-2xl font-semibold text-satutext-primary font-mono">
            {formatHours(stats.total_focus_seconds)}
          </span>
        </Card>
      </div>

      {/* Personal Records */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-satutext-primary mb-3">
          Rekor Pribadi
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="p-4 bg-white flex items-center justify-between">
            <div>
              <span className="text-xs text-satutext-secondary block">
                Streak Terbaik
              </span>
              <span className="text-lg font-semibold text-satutext-primary font-mono mt-0.5">
                {records.bestStreakDays} hari
              </span>
            </div>
            <ShieldCheck className="w-5 h-5 text-satutext-muted" />
          </Card>

          <Card className="p-4 bg-white flex items-center justify-between">
            <div>
              <span className="text-xs text-satutext-secondary block">
                Sesi Fokus Terlama
              </span>
              <span className="text-lg font-semibold text-satutext-primary font-mono mt-0.5">
                {formatHours(records.longestFocusSeconds)}
              </span>
            </div>
            <Clock className="w-5 h-5 text-satutext-muted" />
          </Card>
        </div>
      </div>

      {/* Planning Quality & Calibration Note */}
      {calibration && (
        <Card className="p-5 bg-satubg-subtle/70 border-gray-200">
          <span className="text-xs font-semibold text-satutext-primary block mb-1">
            Kualitas Perencanaan: {getQualityText(calibration.planningQuality)}
          </span>
          <p className="text-xs text-satutext-secondary leading-relaxed">
            {calibration.message}
          </p>
          <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-satutext-muted">
            <span>Rata-rata rencana harian: {calibration.averageCommitted}</span>
            <span>Rata-rata selesai harian: {calibration.averageCompleted}</span>
          </div>
        </Card>
      )}

      <p className="text-center text-[11px] text-satutext-muted mt-6 italic">
        SatuDulu tidak pernah membandingkan angka Anda dengan orang lain. Eksekusi ini 100% personal.
      </p>
    </div>
  );
};
