"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { ArrowRight } from "lucide-react";
import {
  generatePairs,
  rankCandidatesByPairwise,
  PairwiseComparison,
  PrioritizationCandidate,
} from "@/lib/domain/pairwise";

interface PairwiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: PrioritizationCandidate[];
  onRankCompleted: (ranked: PrioritizationCandidate[]) => void;
}

export const PairwiseModal: React.FC<PairwiseModalProps> = ({
  isOpen,
  onClose,
  candidates,
  onRankCompleted,
}) => {
  const [pairs, setPairs] = useState<PairwiseComparison[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && candidates.length >= 2) {
      const generated = generatePairs(candidates, 5);
      setPairs(generated);
      setCurrentIndex(0);
      setChoices({});
    }
  }, [isOpen, candidates]);

  if (!isOpen || pairs.length === 0) return null;

  const currentPair = pairs[currentIndex];

  const handleSelectWinner = (winnerId: string) => {
    const pairKey = `${currentPair.itemA.id}:${currentPair.itemB.id}`;
    const updated = { ...choices, [pairKey]: winnerId };
    setChoices(updated);

    if (currentIndex + 1 < pairs.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finalizeRanking(updated);
    }
  };

  const finalizeRanking = (finalChoices: Record<string, string>) => {
    const rankedResults = rankCandidatesByPairwise(candidates, finalChoices);
    const sortedCandidates = rankedResults.map((r) => r.candidate);
    onRankCompleted(sortedCandidates);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Prioritisasi Pairwise"
      description="Mana yang lebih penting untuk besok?"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-xs text-satutext-muted">
          <span>
            Perbandingan {currentIndex + 1} dari {pairs.length}
          </span>
          <button
            type="button"
            onClick={() => finalizeRanking(choices)}
            className="hover:text-satutext-primary underline transition-colors"
          >
            Lewati & Terapkan Urutan Saat Ini
          </button>
        </div>

        {/* Binary Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card A */}
          <button
            type="button"
            onClick={() => handleSelectWinner(currentPair.itemA.id)}
            className="text-left p-5 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-satublue-600 dark:hover:border-satublue-500 bg-satubg-light dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 transition-all group flex flex-col justify-between min-h-[160px] focus:outline-none focus:ring-2 focus:ring-satublue-500 shadow-xs"
          >
            <div>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1 font-mono">
                PILIHAN A
              </span>
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-satublue-600 dark:group-hover:text-satublue-400 leading-snug">
                {currentPair.itemA.title}
              </h4>
              {currentPair.itemA.why_it_matters && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">
                  {currentPair.itemA.why_it_matters}
                </p>
              )}
            </div>
            <div className="pt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 border-t border-gray-100 dark:border-slate-800 mt-3">
              <span>{currentPair.itemA.estimated_duration || 30} menit</span>
              <span className="font-semibold text-satublue-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Pilih <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>

          {/* Card B */}
          <button
            type="button"
            onClick={() => handleSelectWinner(currentPair.itemB.id)}
            className="text-left p-5 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-satublue-600 dark:hover:border-satublue-500 bg-satubg-light dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 transition-all group flex flex-col justify-between min-h-[160px] focus:outline-none focus:ring-2 focus:ring-satublue-500 shadow-xs"
          >
            <div>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1 font-mono">
                PILIHAN B
              </span>
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-satublue-600 dark:group-hover:text-satublue-400 leading-snug">
                {currentPair.itemB.title}
              </h4>
              {currentPair.itemB.why_it_matters && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">
                  {currentPair.itemB.why_it_matters}
                </p>
              )}
            </div>
            <div className="pt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 border-t border-gray-100 dark:border-slate-800 mt-3">
              <span>{currentPair.itemB.estimated_duration || 30} menit</span>
              <span className="font-semibold text-satublue-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Pilih <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
          Pilih komitmen yang memiliki dampak atau urgensi lebih tinggi untuk besok.
        </p>
      </div>
    </Modal>
  );
};
