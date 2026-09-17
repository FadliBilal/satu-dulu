// ==============================================================================
// SATUDULU — Plan & Commitment State Machine
// ==============================================================================

import { DailyPlan, DailyPlanStatus, Commitment, CommitmentStatus } from "../types";

export const MAX_DAILY_COMMITMENTS = 6;

export class PlanTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanTransitionError";
  }
}

/**
 * Validates whether a state transition for DailyPlan is permissible.
 */
export function canTransitionPlan(current: DailyPlanStatus, next: DailyPlanStatus): boolean {
  switch (current) {
    case "draft":
      return next === "committed" || next === "archived";
    case "committed":
      return next === "completed" || next === "replanned" || next === "archived";
    case "replanned":
      return next === "committed" || next === "completed" || next === "archived";
    case "completed":
    case "archived":
      return false; // Terminal states
    default:
      return false;
  }
}

/**
 * Validates whether a commitment status transition is permissible.
 */
export function canTransitionCommitment(current: CommitmentStatus, next: CommitmentStatus): boolean {
  switch (current) {
    case "planned":
      return next === "active" || next === "completed" || next === "carried_forward" || next === "cancelled";
    case "active":
      return next === "completed" || next === "carried_forward" || next === "cancelled" || next === "planned";
    case "completed":
    case "carried_forward":
    case "cancelled":
      return false; // Terminal for this day's plan
    default:
      return false;
  }
}

/**
 * Enforces business rules when committing a draft plan.
 */
export function commitDailyPlan(
  plan: DailyPlan,
  commitments: Commitment[]
): { plan: DailyPlan; commitments: Commitment[] } {
  if (plan.status !== "draft" && plan.status !== "replanned") {
    throw new PlanTransitionError(`Cannot commit a plan with status '${plan.status}'. Only draft or replanned plans can be committed.`);
  }

  if (commitments.length === 0) {
    throw new PlanTransitionError("Cannot commit a plan with zero commitments. Choose at least one commitment.");
  }

  if (commitments.length > MAX_DAILY_COMMITMENTS) {
    throw new PlanTransitionError(`Cannot commit more than ${MAX_DAILY_COMMITMENTS} commitments. 6 is the safety boundary.`);
  }

  // Sort commitments by priority (1 is highest)
  const sorted = [...commitments].sort((a, b) => a.priority - b.priority);

  // Normalize priorities 1..N and set first to active, others to planned
  const updatedCommitments: Commitment[] = sorted.map((c, index) => ({
    ...c,
    priority: index + 1,
    status: index === 0 ? "active" : "planned",
    updated_at: new Date().toISOString(),
  }));

  const updatedPlan: DailyPlan = {
    ...plan,
    status: "committed",
    locked_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return { plan: updatedPlan, commitments: updatedCommitments };
}

/**
 * Transitions the active commitment to completed and activates the next commitment.
 */
export function completeCommitment(
  commitments: Commitment[],
  commitmentId: string,
  focusSecondsSpent: number = 0
): {
  updatedCommitments: Commitment[];
  completedCommitment: Commitment;
  nextCommitment: Commitment | null;
  isAllCompleted: boolean;
} {
  const targetIndex = commitments.findIndex((c) => c.id === commitmentId);
  if (targetIndex === -1) {
    throw new PlanTransitionError(`Commitment ${commitmentId} not found.`);
  }

  const target = commitments[targetIndex];
  if (target.status === "completed") {
    throw new PlanTransitionError("Commitment is already completed.");
  }

  const now = new Date().toISOString();
  const completed: Commitment = {
    ...target,
    status: "completed",
    completed_at: now,
    focus_seconds: target.focus_seconds + focusSecondsSpent,
    updated_at: now,
  };

  const updated = [...commitments];
  updated[targetIndex] = completed;

  // Find next uncompleted commitment by priority
  const remaining = updated
    .filter((c) => c.status === "planned" || c.status === "active")
    .sort((a, b) => a.priority - b.priority);

  let next: Commitment | null = null;
  if (remaining.length > 0) {
    next = {
      ...remaining[0],
      status: "active",
      updated_at: now,
    };
    const nextIndex = updated.findIndex((c) => c.id === next!.id);
    updated[nextIndex] = next;
  }

  const isAllCompleted = updated.every((c) => c.status === "completed" || c.status === "cancelled");

  return {
    updatedCommitments: updated,
    completedCommitment: completed,
    nextCommitment: next,
    isAllCompleted,
  };
}

/**
 * Returns the single active commitment that should be executed right now.
 */
export function getActiveCommitment(commitments: Commitment[]): Commitment | null {
  const active = commitments.find((c) => c.status === "active");
  if (active) return active;

  // If none explicitly active, pick highest priority planned commitment
  const planned = commitments
    .filter((c) => c.status === "planned")
    .sort((a, b) => a.priority - b.priority);

  return planned[0] || null;
}
