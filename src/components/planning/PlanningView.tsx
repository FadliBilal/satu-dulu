"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sliders,
  ArrowUpDown,
  Check,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { PairwiseModal } from "./PairwiseModal";
import {
  Commitment,
  DailyPlan,
  PlanningCalibration,
} from "@/lib/types";
import { getRepository } from "@/lib/repository";
import { getCurrentDateInTimezone } from "@/lib/domain/rollover";
import { PrioritizationCandidate } from "@/lib/domain/pairwise";

export const PlanningView: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [committing, setCommitting] = useState(false);
  const [tomorrowDate, setTomorrowDate] = useState("");
  const [existingPlan, setExistingPlan] = useState<DailyPlan | null>(null);
  const [calibration, setCalibration] = useState<PlanningCalibration | null>(null);

  // Available candidate items (from inbox + carried forward)
  const [candidates, setCandidates] = useState<PrioritizationCandidate[]>([]);
  // Selected candidate IDs in priority order (max 6)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showPairwise, setShowPairwise] = useState(false);

  useEffect(() => {
    async function loadPlanningData() {
      try {
        const repo = getRepository();
        const profile = await repo.getProfile();
        const cal = await repo.getPlanningCalibration();
        setCalibration(cal);

        // Tomorrow in user timezone
        const now = new Date();
        now.setDate(now.getDate() + 1);
        const tDate = getCurrentDateInTimezone(profile.timezone || "Asia/Jakarta", now);
        setTomorrowDate(tDate);

        // Check if plan already exists for tomorrow
        const { plan, commitments } = await repo.getPlanForDate(tDate);
        setExistingPlan(plan);

        // Gather inbox items & carried items
        const inboxItems = await repo.getInboxItems();
        const allCandidates: PrioritizationCandidate[] = [];

        // Any carried forward commitments
        const vault = await repo.getVaultHistory();
        for (const day of vault) {
          for (const c of day.commitments) {
            if (c.status === "carried_forward") {
              allCandidates.push({
                id: c.id,
                title: c.title,
                why_it_matters: c.why_it_matters,
                estimated_duration: c.estimated_duration,
                rollover_count: c.rollover_count,
              });
            }
          }
        }

        // Add inbox items
        for (const item of inboxItems) {
          allCandidates.push({
            id: item.id,
            title: item.title,
            why_it_matters: item.description,
            estimated_duration: 45,
            inbox_item_id: item.id,
          });
        }

        setCandidates(allCandidates);

        if (commitments.length > 0) {
          setSelectedIds(commitments.map((c) => c.id));
        } else if (allCandidates.length > 0) {
          // Default pick top 2-3 candidates to align with adaptive calibration
          const defaultCount = Math.min(allCandidates.length, cal.recommendedRange[0] || 3);
          setSelectedIds(allCandidates.slice(0, defaultCount).map((c) => c.id));
        }
      } finally {
        setLoading(false);
      }
    }
    loadPlanningData();
  }, []);

  const toggleCandidate = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 6) {
        alert("Maksimal 6 komitmen per hari. Angka 6 adalah batas aman, bukan target yang harus dicapai.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const movePriority = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= selectedIds.length) return;
    const copy = [...selectedIds];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setSelectedIds(copy);
  };

  const handlePairwiseRank = (ranked: PrioritizationCandidate[]) => {
    const rankedIds = ranked.map((r) => r.id);
    const reordered = selectedIds.sort((a, b) => rankedIds.indexOf(a) - rankedIds.indexOf(b));
    setSelectedIds([...reordered]);
  };

  const handleCommitTomorrow = async () => {
    if (selectedIds.length === 0) {
      alert("Silakan pilih setidaknya 1 komitmen untuk besok.");
      return;
    }

    setCommitting(true);
    try {
      const repo = getRepository();
      const profile = await repo.getProfile();
      let plan = existingPlan;

      if (!plan) {
        const created = await repo.createDraftPlan(tomorrowDate);
        plan = created.plan;
      }

      const selectedCandidates = selectedIds
        .map((id) => candidates.find((c) => c.id === id)!)
        .filter(Boolean);

      const commitmentsToCommit: Commitment[] = selectedCandidates.map((cand, idx) => ({
        id: cand.id.startsWith("c-") ? cand.id : "c-new-" + Date.now() + "-" + idx,
        user_id: profile.user_id,
        daily_plan_id: plan!.id,
        inbox_item_id: cand.inbox_item_id || null,
        title: cand.title,
        description: null,
        why_it_matters: cand.why_it_matters || null,
        priority: idx + 1,
        estimated_duration: cand.estimated_duration || 30,
        status: idx === 0 ? "active" : "planned",
        focus_seconds: 0,
        rollover_count: cand.rollover_count || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      await repo.commitPlan(plan.id, commitmentsToCommit);
      router.push("/app");
    } catch (err: any) {
      alert(err.message || "Gagal mengonfirmasi rencana.");
    } finally {
      setCommitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400 font-mono">
        Memuat ruang perencanaan besok...
      </div>
    );
  }

  const selectedCandidateObjects = selectedIds
    .map((id) => candidates.find((c) => c.id === id)!)
    .filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-36">
      {/* Header */}
      <div className="mb-6">
        <span className="text-[11px] font-semibold text-satublue-700 tracking-wider uppercase font-mono">
          PERENCANAAN BESOK • {tomorrowDate}
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mt-1">
          Apa yang penting besok?
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Pilih apa yang bersedia Anda eksekusi secara realistis. Angka 6 adalah batas aman, bukan kuota wajib.
        </p>
      </div>

      {/* Adaptive Calibration Ribbon */}
      {calibration && (
        <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-satublue-50 border border-satublue-100 flex items-center justify-center text-satublue-700 shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900">
                  Ritme Anda
                </span>
                <Badge
                  variant={
                    calibration.planningQuality === "realistic"
                      ? "success"
                      : calibration.planningQuality === "stretched"
                      ? "warning"
                      : "neutral"
                  }
                >
                  {calibration.planningQuality === "realistic"
                    ? "Ritme Realistis"
                    : calibration.planningQuality === "stretched"
                    ? "Sedikit Terentang"
                    : "Terlalu Banyak"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {calibration.rhythmDescription}
              </p>
              <p className="text-xs font-medium text-slate-800 mt-1">
                {calibration.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selected Commitments (Order & Priority) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <span>Komitmen Besok</span>
            <span className="text-xs font-normal text-satublue-700 bg-satublue-50 px-2 py-0.5 rounded font-mono">
              {selectedIds.length} dari maks 6
            </span>
          </h3>

          {selectedIds.length >= 2 && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowPairwise(true)}
              className="text-xs py-1"
            >
              <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-satublue-600" />
              Urutkan dengan Pairwise
            </Button>
          )}
        </div>

        {selectedIds.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-400">
            Belum ada komitmen yang dipilih. Pilih dari kandidat di bawah.
          </div>
        ) : (
          <div className="space-y-2">
            {selectedCandidateObjects.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-satublue-600 text-white text-xs font-mono font-semibold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-slate-900 truncate">
                      {item.title}
                    </h4>
                    {item.why_it_matters && (
                      <p className="text-xs text-slate-500 truncate">
                        {item.why_it_matters}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    disabled={index === 0}
                    onClick={() => movePriority(index, "up")}
                    className="p-1 text-slate-400 hover:text-satublue-700 disabled:opacity-20"
                    title="Naikkan urutan"
                  >
                    ↑
                  </button>
                  <button
                    disabled={index === selectedIds.length - 1}
                    onClick={() => movePriority(index, "down")}
                    className="p-1 text-slate-400 hover:text-satublue-700 disabled:opacity-20"
                    title="Turunkan urutan"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => toggleCandidate(item.id)}
                    className="ml-2 text-xs text-slate-400 hover:text-satudanger px-1.5 py-0.5 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Candidates Pool (Inbox & Carried Forward) */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Kandidat yang Tersedia
        </h3>

        {candidates.length === 0 ? (
          <div className="p-6 text-center border border-slate-200 rounded-xl bg-white text-xs text-slate-400">
            Inbox Anda tidak memiliki tugas yang tertunda.
          </div>
        ) : (
          <div className="space-y-2">
            {candidates.map((cand) => {
              const isSelected = selectedIds.includes(cand.id);
              return (
                <div
                  key={cand.id}
                  onClick={() => toggleCandidate(cand.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-satublue-50/60 border-satublue-300 shadow-xs"
                      : "bg-white border-slate-200/90 hover:border-satublue-200"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-satublue-600 border-satublue-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-slate-900 truncate">
                          {cand.title}
                        </h4>
                        {cand.rollover_count && cand.rollover_count > 0 ? (
                          <Badge variant="warning">Dialihkan</Badge>
                        ) : null}
                      </div>
                      {cand.why_it_matters && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {cand.why_it_matters}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-400 ml-2 shrink-0">
                    {cand.estimated_duration || 30}m
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation & Commit Button (Fixed Bottom Bar with safe mobile spacing) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 mb-14 md:mb-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-slate-900 block">
              {selectedIds.length} komitmen dipilih
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline-block">
              Rencana menjadi panduan eksekusi setelah Anda berkomitmen.
            </span>
          </div>

          <Button
            size="md"
            variant="blue"
            onClick={handleCommitTomorrow}
            disabled={selectedIds.length === 0 || committing}
            className="px-6 shadow-sm shrink-0"
          >
            {committing ? "Memproses..." : "KOMITMEN UNTUK BESOK"}
          </Button>
        </div>
      </div>

      {/* Pairwise Prioritization Modal */}
      <PairwiseModal
        isOpen={showPairwise}
        onClose={() => setShowPairwise(false)}
        candidates={selectedCandidateObjects}
        onRankCompleted={handlePairwiseRank}
      />
    </div>
  );
};
