import { describe, it, expect } from "vitest";
import {
  canTransitionPlan,
  canTransitionCommitment,
  commitDailyPlan,
  completeCommitment,
  getActiveCommitment,
  MAX_DAILY_COMMITMENTS,
  PlanTransitionError,
} from "../../src/lib/domain/state-machine";
import { DailyPlan, Commitment } from "../../src/lib/types";

describe("Plan State Machine", () => {
  const dummyPlan: DailyPlan = {
    id: "plan-1",
    user_id: "user-1",
    plan_date: "2026-09-18",
    status: "draft",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const createDummyCommitment = (id: string, priority: number, status: any = "planned"): Commitment => ({
    id,
    user_id: "user-1",
    daily_plan_id: "plan-1",
    title: `Task ${id}`,
    priority,
    estimated_duration: 30,
    status,
    focus_seconds: 0,
    rollover_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  it("validates permissible plan transitions", () => {
    expect(canTransitionPlan("draft", "committed")).toBe(true);
    expect(canTransitionPlan("committed", "completed")).toBe(true);
    expect(canTransitionPlan("committed", "replanned")).toBe(true);
    expect(canTransitionPlan("completed", "draft")).toBe(false);
  });

  it("validates permissible commitment transitions", () => {
    expect(canTransitionCommitment("planned", "active")).toBe(true);
    expect(canTransitionCommitment("active", "completed")).toBe(true);
    expect(canTransitionCommitment("active", "carried_forward")).toBe(true);
    expect(canTransitionCommitment("completed", "active")).toBe(false);
  });

  it("commits a valid draft plan and sets first task active", () => {
    const commitments = [
      createDummyCommitment("c-1", 2),
      createDummyCommitment("c-2", 1),
      createDummyCommitment("c-3", 3),
    ];

    const { plan, commitments: committedList } = commitDailyPlan(dummyPlan, commitments);

    expect(plan.status).toBe("committed");
    expect(plan.locked_at).toBeDefined();
    expect(committedList).toHaveLength(3);

    // Sorted by priority: c-2 was priority 1 originally
    expect(committedList[0].id).toBe("c-2");
    expect(committedList[0].priority).toBe(1);
    expect(committedList[0].status).toBe("active");

    // Second task is planned
    expect(committedList[1].priority).toBe(2);
    expect(committedList[1].status).toBe("planned");
  });

  it("rejects committing 0 commitments", () => {
    expect(() => commitDailyPlan(dummyPlan, [])).toThrow(PlanTransitionError);
  });

  it("rejects committing more than 6 commitments (safety boundary)", () => {
    const excessive = Array.from({ length: 7 }, (_, i) =>
      createDummyCommitment(`c-${i}`, i + 1)
    );
    expect(() => commitDailyPlan(dummyPlan, excessive)).toThrow(PlanTransitionError);
  });

  it("transitions active task to completed and unlocks next commitment", () => {
    const commitments = [
      createDummyCommitment("c-1", 1, "active"),
      createDummyCommitment("c-2", 2, "planned"),
      createDummyCommitment("c-3", 3, "planned"),
    ];

    const res1 = completeCommitment(commitments, "c-1", 1800);
    expect(res1.completedCommitment.status).toBe("completed");
    expect(res1.completedCommitment.focus_seconds).toBe(1800);
    expect(res1.nextCommitment?.id).toBe("c-2");
    expect(res1.nextCommitment?.status).toBe("active");
    expect(res1.isAllCompleted).toBe(false);

    // Complete c-2
    const res2 = completeCommitment(res1.updatedCommitments, "c-2", 1200);
    expect(res2.nextCommitment?.id).toBe("c-3");
    expect(res2.isAllCompleted).toBe(false);

    // Complete c-3 (last)
    const res3 = completeCommitment(res2.updatedCommitments, "c-3", 900);
    expect(res3.nextCommitment).toBeNull();
    expect(res3.isAllCompleted).toBe(true);
  });

  it("retrieves the single active commitment correctly", () => {
    const commitments = [
      createDummyCommitment("c-1", 1, "completed"),
      createDummyCommitment("c-2", 2, "active"),
      createDummyCommitment("c-3", 3, "planned"),
    ];

    const active = getActiveCommitment(commitments);
    expect(active?.id).toBe("c-2");
  });
});
