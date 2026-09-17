import { describe, it, expect } from "vitest";
import {
  isPerfectDay,
  calculateMomentum,
  aggregateVaultAndRecords,
} from "../../src/lib/domain/gamification";
import { Commitment, DailyPlan } from "../../src/lib/types";

describe("Behavioral Gamification & Vault", () => {
  const createCommitment = (id: string, status: any, focusSeconds: number = 1800): Commitment => ({
    id,
    user_id: "u1",
    daily_plan_id: "p1",
    title: `Commitment ${id}`,
    priority: 1,
    estimated_duration: 30,
    status,
    focus_seconds: focusSeconds,
    rollover_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: status === "completed" ? new Date().toISOString() : undefined,
  });

  it("awards Perfect Day based on completion, NOT volume (1/1, 3/3, 5/5 are all equal)", () => {
    // 1 of 1 completed
    const dayOne = [createCommitment("c1", "completed")];
    expect(isPerfectDay(dayOne)).toBe(true);

    // 3 of 3 completed
    const dayThree = [
      createCommitment("c1", "completed"),
      createCommitment("c2", "completed"),
      createCommitment("c3", "completed"),
    ];
    expect(isPerfectDay(dayThree)).toBe(true);

    // 5 of 6 completed is NOT a perfect day
    const dayStretched = [
      createCommitment("c1", "completed"),
      createCommitment("c2", "completed"),
      createCommitment("c3", "completed"),
      createCommitment("c4", "completed"),
      createCommitment("c5", "completed"),
      createCommitment("c6", "carried_forward"),
    ];
    expect(isPerfectDay(dayStretched)).toBe(false);
  });

  it("calculates momentum from consecutive completed commitments", () => {
    const commitments = [
      createCommitment("c1", "completed"),
      createCommitment("c2", "completed"),
      createCommitment("c3", "completed"),
      createCommitment("c4", "active"),
    ];
    const momentum = calculateMomentum(commitments);
    expect(momentum).toBe(3);
  });

  it("aggregates Vault history and personal records without competitive rankings", () => {
    const plans: DailyPlan[] = [
      { id: "p1", user_id: "u1", plan_date: "2026-09-15", status: "completed", created_at: "", updated_at: "" },
      { id: "p2", user_id: "u1", plan_date: "2026-09-16", status: "completed", created_at: "", updated_at: "" },
    ];

    const commitments: Commitment[] = [
      { ...createCommitment("c1", "completed", 3600), daily_plan_id: "p1" },
      { ...createCommitment("c2", "completed", 2400), daily_plan_id: "p1" },
      { ...createCommitment("c3", "completed", 1800), daily_plan_id: "p2" },
      { ...createCommitment("c4", "carried_forward", 0), daily_plan_id: "p2" },
    ];

    const { vaultDays, records, overallCompletionRate } = aggregateVaultAndRecords(plans, commitments);

    expect(vaultDays).toHaveLength(2);
    expect(records.totalPerfectDays).toBe(1); // p1 is 2/2 (perfect)
    expect(records.longestFocusSeconds).toBe(3600);
    // 3 completed out of 4 planned = 75%
    expect(overallCompletionRate).toBe(75);
  });
});
