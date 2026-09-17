import { describe, it, expect } from "vitest";
import { processRollover, getCurrentDateInTimezone } from "../../src/lib/domain/rollover";
import { Commitment, DailyPlan } from "../../src/lib/types";

describe("Zero-Guilt Rollover Engine", () => {
  it("formats date for user timezone accurately", () => {
    const d = new Date("2026-09-18T01:00:00.000Z");
    const jkt = getCurrentDateInTimezone("Asia/Jakarta", d);
    expect(jkt).toBe("2026-09-18");
  });

  it("carries forward uncompleted commitments from previous dates idempotently", () => {
    const plans: DailyPlan[] = [
      { id: "p-past", user_id: "u1", plan_date: "2026-09-17", status: "committed", created_at: "", updated_at: "" },
      { id: "p-today", user_id: "u1", plan_date: "2026-09-18", status: "committed", created_at: "", updated_at: "" },
    ];

    const commitments: Commitment[] = [
      { id: "c1", user_id: "u1", daily_plan_id: "p-past", title: "Finished Task", priority: 1, estimated_duration: 30, status: "completed", focus_seconds: 1800, rollover_count: 0, created_at: "", updated_at: "" },
      { id: "c2", user_id: "u1", daily_plan_id: "p-past", title: "Unfinished Task", priority: 2, estimated_duration: 45, status: "planned", focus_seconds: 0, rollover_count: 0, created_at: "", updated_at: "" },
      { id: "c3", user_id: "u1", daily_plan_id: "p-today", title: "Today Task", priority: 1, estimated_duration: 30, status: "active", focus_seconds: 0, rollover_count: 0, created_at: "", updated_at: "" },
    ];

    const res = processRollover(plans, commitments, "2026-09-18");

    expect(res.carriedCount).toBe(1);
    expect(res.carriedForwardCommitments[0].id).toBe("c2");
    expect(res.carriedForwardCommitments[0].status).toBe("carried_forward");
    expect(res.carriedForwardCommitments[0].rollover_count).toBe(1);

    // Ensure c1 (completed) and c3 (today) remain unchanged
    const c1 = res.updatedCommitments.find((c) => c.id === "c1");
    expect(c1?.status).toBe("completed");

    const c3 = res.updatedCommitments.find((c) => c.id === "c3");
    expect(c3?.status).toBe("active");

    // Running rollover a second time on the same state produces 0 new carries (Idempotency)
    const secondRun = processRollover(res.updatedPlans, res.updatedCommitments, "2026-09-18");
    expect(secondRun.carriedCount).toBe(0);
  });
});
