// ==============================================================================
// SATUDULU — Behavioral Gamification & Vault Engine
// Principles: Intrinsic progress, no coins/XP/emojis, 100% personal
// ==============================================================================

import { Commitment, DailyPlan, DailyReflection, ExecutionStats, PersonalRecords, VaultDay } from "../types";

/**
 * Calculates current execution momentum.
 * Momentum is the number of consecutive completed commitments in the active flow.
 */
export function calculateMomentum(commitments: Commitment[]): number {
  // Sort by completed_at descending
  const completed = commitments
    .filter((c) => c.status === "completed" && c.completed_at)
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime());

  if (completed.length === 0) return 0;

  // Count consecutive completions within recent activity
  return Math.min(completed.length, 12);
}

/**
 * Checks if a specific day is a Perfect Day.
 * Rule: 1/1 = Perfect Day, 3/3 = Perfect Day, 5/5 = Perfect Day.
 * Depends on commitment completion, NOT task volume.
 */
export function isPerfectDay(dayCommitments: Commitment[]): boolean {
  if (dayCommitments.length === 0) return false;
  return dayCommitments.every((c) => c.status === "completed");
}

/**
 * Aggregates personal records and vault history across all committed plans.
 */
export function aggregateVaultAndRecords(
  plans: DailyPlan[],
  commitments: Commitment[],
  reflections: DailyReflection[] = []
): {
  vaultDays: VaultDay[];
  records: PersonalRecords;
  overallCompletionRate: number;
} {
  const committedPlans = plans
    .filter((p) => p.status !== "draft")
    .sort((a, b) => b.plan_date.localeCompare(a.plan_date)); // Most recent first

  const vaultDays: VaultDay[] = [];
  let totalCommittedAcrossTime = 0;
  let totalCompletedAcrossTime = 0;
  let perfectDaysCount = 0;
  let longestFocus = 0;

  for (const plan of committedPlans) {
    const planCommitments = commitments.filter((c) => c.daily_plan_id === plan.id);
    if (planCommitments.length === 0) continue;

    const completed = planCommitments.filter((c) => c.status === "completed").length;
    const carried = planCommitments.filter((c) => c.status === "carried_forward").length;
    const isPerfect = isPerfectDay(planCommitments);
    if (isPerfect) perfectDaysCount++;

    const totalFocus = planCommitments.reduce((acc, c) => acc + (c.focus_seconds || 0), 0);
    for (const c of planCommitments) {
      if (c.focus_seconds > longestFocus) longestFocus = c.focus_seconds;
    }

    totalCommittedAcrossTime += planCommitments.length;
    totalCompletedAcrossTime += completed;

    const reflection = reflections.find((r) => r.daily_plan_id === plan.id) || null;

    vaultDays.push({
      date: plan.plan_date,
      planStatus: plan.status,
      committedCount: planCommitments.length,
      completedCount: completed,
      carriedCount: carried,
      isPerfectDay: isPerfect,
      totalFocusSeconds: totalFocus,
      commitments: planCommitments,
      reflection,
    });
  }

  // Calculate streak of consecutive days with committed plans
  let currentStreak = 0;
  let bestStreak = 0;
  // Vault days are sorted descending by date
  for (let i = 0; i < vaultDays.length; i++) {
    if (vaultDays[i].completedCount > 0) {
      currentStreak++;
      if (currentStreak > bestStreak) bestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  }

  const overallCompletionRate =
    totalCommittedAcrossTime > 0
      ? Math.round((totalCompletedAcrossTime / totalCommittedAcrossTime) * 100)
      : 0;

  return {
    vaultDays,
    records: {
      bestStreakDays: Math.max(bestStreak, vaultDays.length > 0 ? 1 : 0),
      totalPerfectDays: perfectDaysCount,
      longestFocusSeconds: longestFocus,
      highestWeeklyCompletionRate: overallCompletionRate,
    },
    overallCompletionRate,
  };
}
