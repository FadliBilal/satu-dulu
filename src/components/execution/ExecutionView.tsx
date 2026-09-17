"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Focus,
  CheckCircle2,
  Clock,
  ArrowRight,
  Calendar,
  Shield,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { FocusModeView } from "./FocusModeView";
import { NextActionTransition } from "./NextActionTransition";
import { ReplanModal } from "./ReplanModal";
import { ReflectionModal } from "../reflection/ReflectionModal";
import { Commitment, DailyPlan, ReflectionReason, ReplanRequest } from "@/lib/types";
import { getRepository } from "@/lib/repository";
import { getCurrentDateInTimezone } from "@/lib/domain/rollover";
import { getActiveCommitment } from "@/lib/domain/state-machine";

export const ExecutionView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [todayDate, setTodayDate] = useState("");
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [commitments, setCommitments] = useState<Commitment[]>([]);

  // Execution flow state
  const [inFocusMode, setInFocusMode] = useState(false);
  const [transitionState, setTransitionState] = useState<{
    completed: Commitment;
    next: Commitment;
  } | null>(null);

  // Modals
  const [showReplan, setShowReplan] = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  const loadTodayExecution = async () => {
    try {
      const repo = getRepository();
      const profile = await repo.getProfile();
      const today = getCurrentDateInTimezone(profile.timezone || "Asia/Jakarta");
      setTodayDate(today);

      // Check and run rollover for today
      await repo.checkAndRunRollover(today);

      const { plan: currentPlan, commitments: list } = await repo.getPlanForDate(today);
      setPlan(currentPlan);
      setCommitments(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodayExecution();
  }, []);

  const activeCommitment = getActiveCommitment(commitments);
  const completedCount = commitments.filter((c) => c.status === "completed").length;
  const carriedCount = commitments.filter((c) => c.status === "carried_forward").length;
  const totalCount = commitments.filter((c) => c.status !== "cancelled").length;
  const isAllFinished = totalCount > 0 && completedCount + carriedCount === totalCount;

  // Complete commitment handler
  const handleCompleteActive = async (focusSecondsSpent: number = 0) => {
    if (!activeCommitment) return;

    const repo = getRepository();
    const result = await repo.completeCommitmentAction(activeCommitment.id, focusSecondsSpent);

    // If there is focus time, log session
    if (focusSecondsSpent > 0) {
      const now = new Date();
      const started = new Date(now.getTime() - focusSecondsSpent * 1000).toISOString();
      await repo.logFocusSession(activeCommitment.id, started, now.toISOString(), focusSecondsSpent);
    }

    setInFocusMode(false);

    // Refresh plan commitments
    const { plan: updatedPlan, commitments: updatedList } = await repo.getPlanForDate(todayDate);
    setPlan(updatedPlan);
    setCommitments(updatedList);

    if (result.nextCommitment) {
      setTransitionState({
        completed: result.completedCommitment,
        next: result.nextCommitment,
      });
    } else {
      setTransitionState(null);
    }
  };

  const handleReplanConfirmed = async (request: ReplanRequest) => {
    const repo = getRepository();
    await repo.replanPlan(request);
    await loadTodayExecution();
  };

  const handleSaveReflection = async (reason: ReflectionReason, notes?: string) => {
    if (!plan) return;
    const repo = getRepository();
    await repo.saveReflection(plan.id, reason, notes);
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400 font-mono">
        Memuat ruang eksekusi hari ini...
      </div>
    );
  }

  // 1. FOCUS MODE ACTIVE
  if (inFocusMode && activeCommitment) {
    return (
      <FocusModeView
        commitment={activeCommitment}
        onComplete={(secs) => handleCompleteActive(secs)}
        onExit={(secs) => {
          if (secs > 10) {
            const repo = getRepository();
            const now = new Date();
            const started = new Date(now.getTime() - secs * 1000).toISOString();
            repo.logFocusSession(activeCommitment.id, started, now.toISOString(), secs);
          }
          setInFocusMode(false);
        }}
      />
    );
  }

  // 2. NEXT ACTION CALM TRANSITION SCREEN
  if (transitionState) {
    return (
      <NextActionTransition
        completedCommitment={transitionState.completed}
        nextCommitment={transitionState.next}
        onStartNext={() => {
          setTransitionState(null);
          setInFocusMode(true);
        }}
        onViewSummary={() => setTransitionState(null)}
      />
    );
  }

  // 3. NO COMMITTED PLAN FOR TODAY
  if (!plan || plan.status === "draft" || commitments.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-satublue-50 text-satublue-600 flex items-center justify-center mx-auto mb-4 border border-satublue-100">
          <Calendar className="w-5 h-5" />
        </div>
        <span className="text-xs font-semibold text-satublue-800 uppercase tracking-wider font-mono">
          HARI INI • {todayDate}
        </span>
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mt-1 mb-2">
          Hari ini butuh keputusan.
        </h2>
        <p className="text-sm text-slate-600 max-w-sm mx-auto mb-8">
          Belum ada rencana yang dikomitkan untuk hari ini. Tentukan apa yang penting sebelum mulai bekerja.
        </p>

        <Link href="/app/plan">
          <Button size="lg" variant="blue" className="px-8 shadow-sm">
            Rencanakan Komitmen Hari Ini
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  // 4. ALL COMMITMENTS FINISHED (PERFECT COMPLETION OR DAY FINISHED)
  if (isAllFinished) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center animate-in fade-in duration-300">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider font-mono">
          HARI INI TUNTAS
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-1 mb-3">
          Hanya itu yang Anda komitmenkan.
        </h2>
        <p className="text-sm text-slate-600 max-w-sm mx-auto mb-8">
          Tidak ada hal lain yang diwajibkan. Silakan tutup aplikasi dan istirahat dengan tenang.
        </p>

        {/* Progress indicators */}
        <div className="inline-flex items-center gap-2 mb-8 bg-slate-100 px-4 py-2 rounded-full text-xs text-slate-700 font-mono">
          <span>{completedCount} dari {totalCount} tuntas</span>
          <span>•</span>
          <span>{Math.round(commitments.reduce((acc, c) => acc + c.focus_seconds, 0) / 60)}m fokus</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowReflection(true)}
          >
            Refleksi Harian
          </Button>
          <Link href="/app/plan">
            <Button size="md" variant="blue" className="px-6">
              Rencanakan Besok
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Reflection Modal */}
        <ReflectionModal
          isOpen={showReflection}
          onClose={() => setShowReflection(false)}
          planId={plan.id}
          completedCount={completedCount}
          totalCount={totalCount}
          carriedCount={carriedCount}
          onSaveReflection={handleSaveReflection}
        />
      </div>
    );
  }

  // 5. ACTIVE EXECUTION SCREEN: ONLY ONE ACTIVE COMMITMENT IS DISPLAYED!
  const activePriorityStr = activeCommitment
    ? activeCommitment.priority.toString().padStart(2, "0")
    : "01";
  const totalCountStr = totalCount.toString().padStart(2, "0");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200/80 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase font-mono">
              HARI INI • {todayDate}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-satublue-700 bg-satublue-50 px-2 py-0.5 rounded-full border border-satublue-200/60">
              <Shield className="w-3 h-3 text-satublue-600" />
              Terkunci
            </span>
          </div>
          <h2 className="text-xs text-slate-600 mt-1">
            Satu hal yang perlu dikerjakan terlebih dahulu.
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-satublue-800 bg-satublue-50 px-2.5 py-1 rounded-md border border-satublue-200/80">
            {activePriorityStr} / {totalCountStr}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplan(true)}
            className="text-xs text-slate-500 hover:text-satublue-700"
            title="Ada situasi mendesak? Sesuaikan rencana"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
            Replan
          </Button>
        </div>
      </div>

      {/* Center: The Single Active Commitment Card */}
      {activeCommitment && (
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center mb-8 relative overflow-hidden">
          {/* Subtle blue accent bar at top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-satublue-600" />

          <span className="text-xs font-semibold text-satublue-700 uppercase tracking-wider font-mono block mb-2">
            PRIORITAS {activePriorityStr}
          </span>

          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-snug mb-3 max-w-lg mx-auto">
            {activeCommitment.title}
          </h1>

          {activeCommitment.why_it_matters && (
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
              {activeCommitment.why_it_matters}
            </p>
          )}

          <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 mb-8 bg-satublue-50/70 border border-satublue-100 px-3.5 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-satublue-600" />
            Estimasi {activeCommitment.estimated_duration} menit
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              size="lg"
              variant="blue"
              onClick={() => setInFocusMode(true)}
              className="px-8 shadow-sm"
            >
              <Focus className="w-4 h-4 mr-2" />
              MULAI FOKUS
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => handleCompleteActive(0)}
              className="px-6"
            >
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
              Tandai Selesai
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Progress Indicator: Subtle Dots (No Titles of Future Tasks!) */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
        <span>
          {completedCount + 1} dari {totalCount} komitmen
        </span>

        {/* Subtle Dots */}
        <div className="flex items-center gap-2" title="Progres single-thread">
          {commitments
            .filter((c) => c.status !== "cancelled")
            .map((c) => {
              const isDone = c.status === "completed";
              const isActive = c.status === "active";
              return (
                <span
                  key={c.id}
                  className={`rounded-full transition-all ${
                    isDone
                      ? "w-2.5 h-2.5 bg-emerald-600"
                      : isActive
                      ? "w-3 h-3 bg-satublue-600 ring-4 ring-satublue-100"
                      : "w-2.5 h-2.5 border border-slate-300 bg-white"
                  }`}
                />
              );
            })}
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-3">
        Judul komitmen berikutnya sengaja disembunyikan untuk menjaga fokus kognitif Anda.
      </p>

      {/* Replan Modal */}
      <ReplanModal
        isOpen={showReplan}
        onClose={() => setShowReplan(false)}
        planId={plan.id}
        commitments={commitments}
        onReplanConfirmed={handleReplanConfirmed}
      />

      {/* Reflection Modal */}
      <ReflectionModal
        isOpen={showReflection}
        onClose={() => setShowReflection(false)}
        planId={plan.id}
        completedCount={completedCount}
        totalCount={totalCount}
        carriedCount={carriedCount}
        onSaveReflection={handleSaveReflection}
      />
    </div>
  );
};
