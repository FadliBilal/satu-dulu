// ==============================================================================
// SATUDULU — Personal Calibration & Planning Quality Engine (Bahasa Indonesia)
// ==============================================================================

import {
  Commitment,
  DailyPlan,
  ExecutionProfileArchetype,
  FocusSession,
  PlanningCalibration,
} from "../types";

export interface DayExecutionSummary {
  date: string;
  planned: number;
  completed: number;
  carriedForward: number;
  focusSeconds: number;
  priority1Completed: boolean;
  priority2Completed: boolean;
}

/**
 * Computes execution summaries for historical days.
 */
export function summarizeHistoricalDays(
  plans: DailyPlan[],
  commitments: Commitment[],
  focusSessions: FocusSession[] = []
): DayExecutionSummary[] {
  const summaries: DayExecutionSummary[] = [];

  for (const plan of plans) {
    if (plan.status === "draft") continue; // Exclude uncommitted drafts

    const planCommitments = commitments.filter((c) => c.daily_plan_id === plan.id);
    if (planCommitments.length === 0) continue;

    const planned = planCommitments.length;
    const completed = planCommitments.filter((c) => c.status === "completed").length;
    const carriedForward = planCommitments.filter((c) => c.status === "carried_forward").length;

    const planFocus = focusSessions
      .filter((s) => planCommitments.some((c) => c.id === s.commitment_id))
      .reduce((acc, s) => acc + (s.duration_seconds || 0), 0);

    const p1 = planCommitments.find((c) => c.priority === 1);
    const p2 = planCommitments.find((c) => c.priority === 2);

    summaries.push({
      date: plan.plan_date,
      planned,
      completed,
      carriedForward,
      focusSeconds: planFocus,
      priority1Completed: p1?.status === "completed",
      priority2Completed: p2 ? p2.status === "completed" : true,
    });
  }

  // Sort chronologically ascending
  return summaries.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Evaluates the user's past 7-14 days to provide adaptive calibration.
 */
export function calculateCalibration(history: DayExecutionSummary[]): PlanningCalibration {
  if (history.length === 0) {
    return {
      recommendedRange: [2, 3],
      message: "Mulai dari yang terukur. 2–3 komitmen memungkinkan Anda membangun momentum yang stabil.",
      rhythmDescription: "Perjalanan eksekusi baru. Kalibrasi dimulai saat Anda berkomitmen.",
      planningQuality: "realistic",
      averageCommitted: 3,
      averageCompleted: 0,
      perfectDaysCount: 0,
    };
  }

  // Take the most recent 14 days
  const recent = history.slice(-14);
  const totalPlanned = recent.reduce((sum, d) => sum + d.planned, 0);
  const totalCompleted = recent.reduce((sum, d) => sum + d.completed, 0);

  const avgPlanned = Math.round((totalPlanned / recent.length) * 10) / 10;
  const avgCompleted = Math.round((totalCompleted / recent.length) * 10) / 10;
  const completionRatio = totalPlanned > 0 ? totalCompleted / totalPlanned : 0;

  const perfectDaysCount = recent.filter((d) => d.planned > 0 && d.completed === d.planned).length;

  let minRec = Math.max(1, Math.floor(avgCompleted));
  let maxRec = Math.min(6, Math.ceil(avgCompleted + 0.5));
  if (minRec === maxRec) {
    minRec = Math.max(1, minRec - 1);
  }

  let planningQuality: "realistic" | "stretched" | "overcommitted" = "realistic";
  let message = "";
  let rhythmDescription = `Anda biasanya berkomitmen pada ${Math.round(avgPlanned)} hal dan biasanya menyelesaikan ${Math.round(avgCompleted)}.`;

  if (completionRatio >= 0.8) {
    planningQuality = "realistic";
    message = `Ritme perencanaan Anda saat ini tampak realistis. Rekomendasi: ${minRec}–${maxRec} komitmen.`;
  } else if (completionRatio >= 0.6) {
    planningQuality = "stretched";
    message = `Anda sedikit meregangkan kapasitas Anda. Fokus pada ${minRec} komitmen dapat membantu menyelesaikan dengan tuntas.`;
  } else {
    planningQuality = "overcommitted";
    minRec = Math.max(1, Math.min(minRec, 3));
    maxRec = Math.max(minRec + 1, 3);
    message = `Anda sering merencanakan ${Math.round(avgPlanned)}+ tetapi biasanya menyelesaikan ${Math.round(avgCompleted)}. Bereksperimen dengan ${minRec}–${maxRec} komitmen akan mengurangi rasa kewalahan.`;
  }

  return {
    recommendedRange: [minRec, maxRec],
    message,
    rhythmDescription,
    planningQuality,
    averageCommitted: avgPlanned,
    averageCompleted: avgCompleted,
    perfectDaysCount,
  };
}

/**
 * Classifies the user's execution pattern into a descriptive archetype.
 */
export function determineExecutionProfile(
  history: DayExecutionSummary[],
  avgSessionSeconds: number = 1800
): ExecutionProfileArchetype {
  if (history.length < 3) {
    return "The Consistent";
  }

  const recent = history.slice(-14);
  const totalPlanned = recent.reduce((sum, d) => sum + d.planned, 0);
  const totalCompleted = recent.reduce((sum, d) => sum + d.completed, 0);
  const ratio = totalPlanned > 0 ? totalCompleted / totalPlanned : 0;
  const avgPlanned = totalPlanned / recent.length;

  const p1CompletionRate =
    recent.filter((d) => d.priority1Completed).length / recent.length;

  // Archetype rules:
  if (avgPlanned >= 4.5 && ratio < 0.65) {
    return "The Overcommitter";
  }

  if (ratio >= 0.85) {
    return "The Finisher";
  }

  if (p1CompletionRate >= 0.85 && ratio < 0.8) {
    return "The Prioritizer";
  }

  if (avgSessionSeconds >= 2400 && avgPlanned <= 3.5) {
    return "The Sprinter";
  }

  return "The Consistent";
}

/**
 * Descriptive text for execution profiles in Indonesian (always encouraging and respectful).
 */
export function getProfileDescription(profile: ExecutionProfileArchetype): string {
  switch (profile) {
    case "The Finisher":
      return "Anda konsisten menyelesaikan sebagian besar komitmen yang dibuat, menjaga rencana tetap selaras dengan kenyataan.";
    case "The Consistent":
      return "Anda mempertahankan ritme eksekusi yang stabil dan disiplin dari hari ke hari.";
    case "The Sprinter":
      return "Anda cenderung bekerja paling baik dalam sesi fokus mendalam dengan komitmen yang lebih sedikit namun intensif.";
    case "The Prioritizer":
      return "Anda dapat diandalkan untuk menuntaskan komitmen prioritas tertinggi Anda bahkan saat situasi di lapangan berubah.";
    case "The Overcommitter":
      return "Anda sering memiliki ambisi tinggi. Bereksperimen dengan komitmen harian yang lebih terukur akan meningkatkan ketuntasan dan ketenangan.";
    default:
      return "Sedang membangun ritme eksekusi personal Anda.";
  }
}
