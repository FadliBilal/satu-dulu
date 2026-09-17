import { describe, it, expect } from "vitest";
import {
  calculateCalibration,
  determineExecutionProfile,
  DayExecutionSummary,
} from "../../src/lib/domain/calibration";

describe("Personal Calibration & Planning Quality", () => {
  it("provides gentle onboarding calibration when history is empty", () => {
    const cal = calculateCalibration([]);
    expect(cal.recommendedRange).toEqual([2, 3]);
    expect(cal.planningQuality).toBe("realistic");
    expect(cal.perfectDaysCount).toBe(0);
  });

  it("calculates realistic planning rhythm when user completes most commitments", () => {
    const history: DayExecutionSummary[] = [
      { date: "2026-09-10", planned: 3, completed: 3, carriedForward: 0, focusSeconds: 3600, priority1Completed: true, priority2Completed: true },
      { date: "2026-09-11", planned: 4, completed: 4, carriedForward: 0, focusSeconds: 4800, priority1Completed: true, priority2Completed: true },
      { date: "2026-09-12", planned: 4, completed: 3, carriedForward: 1, focusSeconds: 3600, priority1Completed: true, priority2Completed: true },
      { date: "2026-09-13", planned: 3, completed: 3, carriedForward: 0, focusSeconds: 3600, priority1Completed: true, priority2Completed: true },
    ];

    const cal = calculateCalibration(history);
    expect(cal.planningQuality).toBe("realistic");
    expect(cal.averageCompleted).toBeGreaterThanOrEqual(3);
    expect(cal.perfectDaysCount).toBe(3);
    expect(cal.message).toContain("realistis");
  });

  it("detects overcommitted pattern when user plans 5+ but completes 2-3", () => {
    const history: DayExecutionSummary[] = [
      { date: "2026-09-10", planned: 6, completed: 2, carriedForward: 4, focusSeconds: 3600, priority1Completed: true, priority2Completed: false },
      { date: "2026-09-11", planned: 5, completed: 3, carriedForward: 2, focusSeconds: 4800, priority1Completed: true, priority2Completed: true },
      { date: "2026-09-12", planned: 6, completed: 2, carriedForward: 4, focusSeconds: 3600, priority1Completed: true, priority2Completed: false },
      { date: "2026-09-13", planned: 5, completed: 2, carriedForward: 3, focusSeconds: 3600, priority1Completed: true, priority2Completed: false },
    ];

    const cal = calculateCalibration(history);
    expect(cal.planningQuality).toBe("overcommitted");
    expect(cal.message).toContain("Bereksperimen dengan");
  });

  it("classifies archetypes without judgment", () => {
    const finisherHistory: DayExecutionSummary[] = [
      { date: "2026-09-10", planned: 3, completed: 3, carriedForward: 0, focusSeconds: 3600, priority1Completed: true, priority2Completed: true },
      { date: "2026-09-11", planned: 4, completed: 4, carriedForward: 0, focusSeconds: 4800, priority1Completed: true, priority2Completed: true },
      { date: "2026-09-12", planned: 3, completed: 3, carriedForward: 0, focusSeconds: 3600, priority1Completed: true, priority2Completed: true },
    ];
    expect(determineExecutionProfile(finisherHistory)).toBe("The Finisher");

    const prioritizerHistory: DayExecutionSummary[] = [
      { date: "2026-09-10", planned: 4, completed: 2, carriedForward: 2, focusSeconds: 3600, priority1Completed: true, priority2Completed: true },
      { date: "2026-09-11", planned: 4, completed: 3, carriedForward: 1, focusSeconds: 3600, priority1Completed: true, priority2Completed: true },
      { date: "2026-09-12", planned: 5, completed: 3, carriedForward: 2, focusSeconds: 3600, priority1Completed: true, priority2Completed: true },
    ];
    expect(determineExecutionProfile(prioritizerHistory)).toBe("The Prioritizer");
  });
});
