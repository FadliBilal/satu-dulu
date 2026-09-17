// ==============================================================================
// SATUDULU — Zero-Guilt Rollover Engine
// Tagline: "Carried forward. You decide again."
// ==============================================================================

import { Commitment, DailyPlan } from "../types";

export interface RolloverResult {
  updatedPlans: DailyPlan[];
  updatedCommitments: Commitment[];
  carriedForwardCommitments: Commitment[];
  carriedCount: number;
}

/**
 * Returns current date string (YYYY-MM-DD) for a given timezone.
 * Defaults to 'Asia/Jakarta'.
 */
export function getCurrentDateInTimezone(timezone: string = "Asia/Jakarta", date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date);
  } catch {
    // Fallback if timezone string is invalid
    return date.toISOString().split("T")[0];
  }
}

/**
 * Processes rollover idempotently for any days strictly prior to `todayDate`.
 * Only transitions commitments that are currently 'planned' or 'active' (not already carried_forward).
 */
export function processRollover(
  plans: DailyPlan[],
  commitments: Commitment[],
  todayDate: string
): RolloverResult {
  const updatedPlans = [...plans];
  const updatedCommitments = [...commitments];
  const carriedForwardCommitments: Commitment[] = [];

  const pastPlans = updatedPlans.filter(
    (p) => p.plan_date < todayDate && (p.status === "committed" || p.status === "replanned")
  );

  const now = new Date().toISOString();

  for (const plan of pastPlans) {
    const planCommitments = updatedCommitments.filter((c) => c.daily_plan_id === plan.id);
    let allFinished = true;

    for (const c of planCommitments) {
      if (c.status === "planned" || c.status === "active") {
        // Idempotently transition to carried_forward
        const idx = updatedCommitments.findIndex((item) => item.id === c.id);
        const carried: Commitment = {
          ...c,
          status: "carried_forward",
          rollover_count: (c.rollover_count || 0) + 1,
          updated_at: now,
        };
        updatedCommitments[idx] = carried;
        carriedForwardCommitments.push(carried);
        allFinished = false;
      } else if (c.status !== "completed" && c.status !== "cancelled") {
        allFinished = false;
      }
    }

    // Update plan status if finished or archived
    const planIdx = updatedPlans.findIndex((p) => p.id === plan.id);
    updatedPlans[planIdx] = {
      ...plan,
      status: allFinished ? "completed" : "completed",
      updated_at: now,
    };
  }

  return {
    updatedPlans,
    updatedCommitments,
    carriedForwardCommitments,
    carriedCount: carriedForwardCommitments.length,
  };
}
