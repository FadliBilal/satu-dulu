"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, CheckCircle2, X, ExternalLink } from "lucide-react";
import { Button } from "../ui/Button";
import { Commitment } from "@/lib/types";
import { PipTimerController } from "@/lib/pip-timer";

interface FocusModeViewProps {
  commitment: Commitment;
  onComplete: (durationSeconds: number) => void;
  onExit: (durationSeconds: number) => void;
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  commitment,
  onComplete,
  onExit,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isPipOn, setIsPipOn] = useState(false);
  const pipRef = useRef<PipTimerController | null>(null);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    pipRef.current = new PipTimerController();
    return () => {
      if (pipRef.current) {
        pipRef.current.exitPip();
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => {
          const next = s + 1;
          if (pipRef.current && isPipOn) {
            pipRef.current.updateTime(formatTime(next), commitment.title);
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPipOn, commitment.title]);

  const togglePip = async () => {
    if (!pipRef.current) return;
    if (isPipOn) {
      await pipRef.current.exitPip();
      setIsPipOn(false);
    } else {
      const success = await pipRef.current.startPip(
        formatTime(seconds),
        commitment.title,
        () => setIsPipOn(false)
      );
      setIsPipOn(success);
    }
  };

  const handleComplete = () => {
    if (pipRef.current) pipRef.current.exitPip();
    onComplete(seconds);
  };

  const handleExit = () => {
    if (pipRef.current) pipRef.current.exitPip();
    onExit(seconds);
  };

  return (
    <div className="fixed inset-0 z-50 bg-satubg-light dark:bg-[#090D16] flex flex-col justify-between p-6 sm:p-12 selection:bg-satublue-100 dark:selection:bg-satublue-900 text-slate-900 dark:text-slate-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-satublue-600 dark:bg-sky-400 animate-pulse" />
          <span className="text-xs font-mono text-satublue-900 dark:text-sky-300 uppercase tracking-wider font-semibold">
            MODE FOKUS • SINGLE THREAD
          </span>
        </div>

        <div className="flex items-center gap-2">
          {pipRef.current?.isSupported() && (
            <button
              onClick={togglePip}
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                isPipOn
                  ? "bg-satublue-600 text-white border-satublue-600"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:text-satublue-700 dark:hover:text-satublue-300 hover:border-satublue-300 dark:hover:border-satublue-700"
              }`}
              title="Aktifkan timer melayang (Picture-in-Picture) di atas aplikasi lain"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isPipOn ? "PiP Aktif" : "Timer Mengambang (PiP)"}</span>
            </button>
          )}

          <button
            onClick={handleExit}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs"
            aria-label="Keluar dari mode fokus"
          >
            <X className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Center Focus Element */}
      <div className="max-w-xl mx-auto w-full text-center my-auto py-12">
        <span className="text-xs font-semibold text-satublue-700 dark:text-sky-400 uppercase tracking-wider block mb-3 font-mono">
          KOMITMEN SAAT INI
        </span>

        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight leading-snug mb-4">
          {commitment.title}
        </h1>

        {commitment.why_it_matters && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-10 font-normal">
            {commitment.why_it_matters}
          </p>
        )}

        {/* Stopwatch Display */}
        <div className="mb-10">
          <div className="text-5xl sm:text-7xl font-mono font-medium tracking-tight text-slate-900 dark:text-slate-100 mb-2">
            {formatTime(seconds)}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {isActive ? "Penghitung fokus aktif" : "Penghitung waktu dijeda"}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            size="lg"
            variant="blue"
            onClick={handleComplete}
            className="px-8 shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            SELESAI
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsActive(!isActive)}
            className="px-6"
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                JEDA
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                LANJUTKAN
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Bottom context: Supporting context only */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500 max-w-md mx-auto">
        <span>Estimasi: {commitment.estimated_duration} menit. Eksekusi mendalam sedang berjalan.</span>
      </div>
    </div>
  );
};
