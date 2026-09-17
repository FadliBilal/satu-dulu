"use client";

import React from "react";
import { CheckCircle2, Focus, Clock } from "lucide-react";
import { Button } from "../ui/Button";
import { Commitment } from "@/lib/types";

interface NextActionTransitionProps {
  completedCommitment: Commitment;
  nextCommitment: Commitment;
  onStartNext: () => void;
  onViewSummary: () => void;
}

export const NextActionTransition: React.FC<NextActionTransitionProps> = ({
  completedCommitment,
  nextCommitment,
  onStartNext,
  onViewSummary,
}) => {
  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center animate-in fade-in duration-300">
      {/* Calm acknowledgement */}
      <div className="mb-12">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <span className="text-xs font-semibold text-satutext-muted uppercase tracking-wider block mb-1">
          SELESAI
        </span>
        <h2 className="text-xl font-semibold text-satutext-primary">
          Satu komitmen tuntas.
        </h2>
        <p className="text-xs text-satutext-secondary mt-1">
          "{completedCommitment.title}"
        </p>
      </div>

      {/* Next Commitment Reveal */}
      <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm text-center mb-8">
        <span className="text-xs font-semibold text-satutext-muted uppercase tracking-wider block mb-2 font-mono">
          BERIKUTNYA
        </span>

        <h3 className="text-2xl font-semibold text-satutext-primary tracking-tight mb-2">
          {nextCommitment.title}
        </h3>

        {nextCommitment.why_it_matters && (
          <p className="text-sm text-satutext-secondary max-w-sm mx-auto mb-6">
            {nextCommitment.why_it_matters}
          </p>
        )}

        <div className="inline-flex items-center gap-2 text-xs text-satutext-muted mb-8 bg-satubg-subtle px-3 py-1.5 rounded-md font-mono">
          <Clock className="w-3.5 h-3.5" />
          Estimasi {nextCommitment.estimated_duration} menit
        </div>

        <div>
          <Button size="lg" onClick={onStartNext} className="px-8 shadow-sm">
            <Focus className="w-4 h-4 mr-2" />
            MULAI FOKUS
          </Button>
        </div>
      </div>

      <button
        onClick={onViewSummary}
        className="text-xs text-satutext-muted hover:text-satutext-primary transition-colors underline"
      >
        Lihat ringkasan progres hari ini
      </button>
    </div>
  );
};
