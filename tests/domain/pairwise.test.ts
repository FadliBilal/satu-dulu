import { describe, it, expect } from "vitest";
import {
  generatePairs,
  rankCandidatesByPairwise,
  PrioritizationCandidate,
} from "../../src/lib/domain/pairwise";

describe("Pairwise Prioritization Engine", () => {
  const candidates: PrioritizationCandidate[] = [
    { id: "task-a", title: "Finish thesis methodology" },
    { id: "task-b", title: "Fix API authentication" },
    { id: "task-c", title: "Study database" },
    { id: "task-d", title: "Prepare client proposal" },
  ];

  it("generates pairwise comparisons without exceeding maxPairs", () => {
    const pairs = generatePairs(candidates, 4);
    expect(pairs.length).toBeLessThanOrEqual(4);
    expect(pairs[0].itemA.id).toBe("task-a");
    expect(pairs[0].itemB.id).toBe("task-b");
  });

  it("ranks candidates based on user binary choices and applies calm labels", () => {
    const threeCandidates = candidates.slice(0, 3);
    const choices: Record<string, string> = {
      "task-a:task-b": "task-a",
      "task-a:task-c": "task-a",
      "task-b:task-c": "task-b",
    };

    const ranked = rankCandidatesByPairwise(threeCandidates, choices);

    expect(ranked[0].candidate.id).toBe("task-a");
    expect(ranked[0].priorityLabel).toBe("Prioritas tinggi");
    expect(ranked[1].candidate.id).toBe("task-b");
    expect(ranked[1].priorityLabel).toBe("Prioritas tinggi");
    expect(ranked[2].candidate.id).toBe("task-c");
  });

  it("gives rollover bonus to carried forward tasks during tie-break", () => {
    const candidateA: PrioritizationCandidate = { id: "a", title: "Task A", rollover_count: 0 };
    const candidateB: PrioritizationCandidate = { id: "b", title: "Task B (Carried)", rollover_count: 2 };

    const ranked = rankCandidatesByPairwise([candidateA, candidateB], {});
    // candidateB has rollover bonus, so it surfaces to be re-evaluated
    expect(ranked[0].candidate.id).toBe("b");
  });
});
