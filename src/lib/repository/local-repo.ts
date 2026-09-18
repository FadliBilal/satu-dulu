// ==============================================================================
// SATUDULU — Offline-First & Demo Repository Implementation
// Enables seamless testing, demonstration, and offline execution
// ==============================================================================

import {
  Commitment,
  DailyPlan,
  DailyReflection,
  ExecutionStats,
  FocusSession,
  InboxItem,
  PersonalRecords,
  PlanningCalibration,
  Profile,
  ReflectionReason,
  ReplanRequest,
  TaskEvent,
  VaultDay,
} from "../types";
import { IRepository } from "./interface";
import {
  commitDailyPlan,
  completeCommitment,
  MAX_DAILY_COMMITMENTS,
  PlanTransitionError,
} from "../domain/state-machine";
import { calculateCalibration, determineExecutionProfile, summarizeHistoricalDays } from "../domain/calibration";
import { aggregateVaultAndRecords, calculateMomentum } from "../domain/gamification";
import { getCurrentDateInTimezone, processRollover } from "../domain/rollover";

const STORAGE_PREFIX = "satudulu_data_v2";

interface StorageState {
  profile: Profile;
  inboxItems: InboxItem[];
  dailyPlans: DailyPlan[];
  commitments: Commitment[];
  taskEvents: TaskEvent[];
  focusSessions: FocusSession[];
  dailyReflections: DailyReflection[];
  lastRolloverDate?: string;
}

function getInitialSeedData(): StorageState {
  const userId = "demo-user-001";
  const now = new Date();
  const today = getCurrentDateInTimezone("Asia/Jakarta", now);

  // Helper to format date offset
  const getDateOffset = (offsetDays: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offsetDays);
    return getCurrentDateInTimezone("Asia/Jakarta", d);
  };

  const d1 = getDateOffset(-3);
  const d2 = getDateOffset(-2);
  const d3 = getDateOffset(-1);

  // Seed past days so analytics, records & vault have historical context,
  // while TODAY starts completely clean and ready for real planning!
  const plans: DailyPlan[] = [
    {
      id: "plan-d1",
      user_id: userId,
      plan_date: d1,
      status: "completed",
      locked_at: `${d1}T08:00:00.000Z`,
      created_at: `${d1}T07:30:00.000Z`,
      updated_at: `${d1}T18:00:00.000Z`,
    },
    {
      id: "plan-d2",
      user_id: userId,
      plan_date: d2,
      status: "completed",
      locked_at: `${d2}T08:00:00.000Z`,
      created_at: `${d2}T07:30:00.000Z`,
      updated_at: `${d2}T18:00:00.000Z`,
    },
    {
      id: "plan-d3",
      user_id: userId,
      plan_date: d3,
      status: "completed",
      locked_at: `${d3}T08:00:00.000Z`,
      created_at: `${d3}T07:30:00.000Z`,
      updated_at: `${d3}T18:00:00.000Z`,
    },
  ];

  const commitments: Commitment[] = [
    // Past Day -3 (Hari Sempurna 3/3)
    {
      id: "c-d1-1",
      user_id: userId,
      daily_plan_id: "plan-d1",
      title: "Tulis sintesis tinjauan pustaka",
      why_it_matters: "Dibutuhkan untuk evaluasi berkala dengan dosen pembimbing.",
      priority: 1,
      estimated_duration: 60,
      status: "completed",
      completed_at: `${d1}T10:15:00.000Z`,
      focus_seconds: 3600,
      rollover_count: 0,
      created_at: `${d1}T07:30:00.000Z`,
      updated_at: `${d1}T10:15:00.000Z`,
    },
    {
      id: "c-d1-2",
      user_id: userId,
      daily_plan_id: "plan-d1",
      title: "Optimasi query PostgreSQL",
      why_it_matters: "Mencegah timeout query pada sistem produksi.",
      priority: 2,
      estimated_duration: 45,
      status: "completed",
      completed_at: `${d1}T14:30:00.000Z`,
      focus_seconds: 2700,
      rollover_count: 0,
      created_at: `${d1}T07:30:00.000Z`,
      updated_at: `${d1}T14:30:00.000Z`,
    },
    {
      id: "c-d1-3",
      user_id: userId,
      daily_plan_id: "plan-d1",
      title: "Review catatan normalisasi database",
      why_it_matters: "Persiapan ujian minggu depan.",
      priority: 3,
      estimated_duration: 30,
      status: "completed",
      completed_at: `${d1}T17:00:00.000Z`,
      focus_seconds: 1800,
      rollover_count: 0,
      created_at: `${d1}T07:30:00.000Z`,
      updated_at: `${d1}T17:00:00.000Z`,
    },

    // Past Day -2 (3/4 selesai, 1 dialihkan)
    {
      id: "c-d2-1",
      user_id: userId,
      daily_plan_id: "plan-d2",
      title: "Tulis draf metodologi bab 3",
      why_it_matters: "Bagian utama dari laporan tugas akhir.",
      priority: 1,
      estimated_duration: 90,
      status: "completed",
      completed_at: `${d2}T11:00:00.000Z`,
      focus_seconds: 5100,
      rollover_count: 0,
      created_at: `${d2}T07:30:00.000Z`,
      updated_at: `${d2}T11:00:00.000Z`,
    },
    {
      id: "c-d2-2",
      user_id: userId,
      daily_plan_id: "plan-d2",
      title: "Implementasi kebijakan Supabase RLS",
      why_it_matters: "Menjamin keamanan isolasi data pengguna.",
      priority: 2,
      estimated_duration: 45,
      status: "completed",
      completed_at: `${d2}T15:20:00.000Z`,
      focus_seconds: 2800,
      rollover_count: 0,
      created_at: `${d2}T07:30:00.000Z`,
      updated_at: `${d2}T15:20:00.000Z`,
    },
    {
      id: "c-d2-3",
      user_id: userId,
      daily_plan_id: "plan-d2",
      title: "Kirim laporan kemajuan mingguan",
      why_it_matters: "Memastikan sinkronisasi dengan pemangku kepentingan.",
      priority: 3,
      estimated_duration: 25,
      status: "completed",
      completed_at: `${d2}T16:45:00.000Z`,
      focus_seconds: 1500,
      rollover_count: 0,
      created_at: `${d2}T07:30:00.000Z`,
      updated_at: `${d2}T16:45:00.000Z`,
    },
    {
      id: "c-d2-4",
      user_id: userId,
      daily_plan_id: "plan-d2",
      title: "Refactor penanganan error API",
      why_it_matters: "Pemeliharaan kode non-kritis.",
      priority: 4,
      estimated_duration: 40,
      status: "carried_forward",
      focus_seconds: 0,
      rollover_count: 1,
      created_at: `${d2}T07:30:00.000Z`,
      updated_at: `${d2}T22:00:00.000Z`,
    },

    // Past Day -1 (Hari Sempurna 2/2)
    {
      id: "c-d3-1",
      user_id: userId,
      daily_plan_id: "plan-d3",
      title: "Finalisasi revisi metodologi",
      why_it_matters: "Dosen pembimbing telah menyetujui draf sebelumnya dengan catatan kecil.",
      priority: 1,
      estimated_duration: 60,
      status: "completed",
      completed_at: `${d3}T10:40:00.000Z`,
      focus_seconds: 3700,
      rollover_count: 0,
      created_at: `${d3}T07:30:00.000Z`,
      updated_at: `${d3}T10:40:00.000Z`,
    },
    {
      id: "c-d3-2",
      user_id: userId,
      daily_plan_id: "plan-d3",
      title: "Implementasi alur refresh token",
      why_it_matters: "Memperbaiki bug sesi logout mendadak yang dilaporkan pengguna.",
      priority: 2,
      estimated_duration: 50,
      status: "completed",
      completed_at: `${d3}T15:10:00.000Z`,
      focus_seconds: 3100,
      rollover_count: 0,
      created_at: `${d3}T07:30:00.000Z`,
      updated_at: `${d3}T15:10:00.000Z`,
    },

    // Note: Today starts uncommitted so new users have a clean canvas to plan and execute immediately.
  ];

  const inboxItems: InboxItem[] = [
    {
      id: "inbox-1",
      user_id: userId,
      title: "Rencanakan dan selesaikan komitmen pertama Anda",
      description: "Pilih tugas ini di menu Rencana, kunci komitmen, lalu fokus eksekusi.",
      status: "active",
      created_at: `${today}T08:00:00.000Z`,
      updated_at: `${today}T08:00:00.000Z`,
    },
    {
      id: "inbox-2",
      user_id: userId,
      title: "Coba fitur Timer Melayang (PiP)",
      description: "Buka Mode Fokus dan aktifkan PiP untuk mempertahankan fokus di atas aplikasi lain.",
      status: "active",
      created_at: `${today}T08:05:00.000Z`,
      updated_at: `${today}T08:05:00.000Z`,
    },
  ];

  return {
    profile: {
      id: userId,
      user_id: userId,
      occupation: "developer",
      timezone: "Asia/Jakarta",
      created_at: `${d1}T00:00:00.000Z`,
      updated_at: now.toISOString(),
    },
    inboxItems,
    dailyPlans: plans,
    commitments,
    taskEvents: [],
    focusSessions: [
      {
        id: "sess-1",
        user_id: userId,
        commitment_id: "c-d1-1",
        started_at: `${d1}T09:00:00.000Z`,
        ended_at: `${d1}T10:00:00.000Z`,
        duration_seconds: 3600,
        created_at: `${d1}T10:00:00.000Z`,
      },
      {
        id: "sess-2",
        user_id: userId,
        commitment_id: "c-d2-1",
        started_at: `${d2}T09:30:00.000Z`,
        ended_at: `${d2}T10:55:00.000Z`,
        duration_seconds: 5100,
        created_at: `${d2}T10:55:00.000Z`,
      },
    ],
    dailyReflections: [
      {
        id: "ref-d2",
        user_id: userId,
        daily_plan_id: "plan-d2",
        reflection_reason: "unexpected_work",
        notes: "Production deployment sync took an extra hour.",
        created_at: `${d2}T22:30:00.000Z`,
      },
    ],
    lastRolloverDate: d3,
  };
}

export class LocalDemoRepository implements IRepository {
  private state: StorageState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): StorageState {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(STORAGE_PREFIX);
        if (raw) {
          return JSON.parse(raw);
        }
      } catch (err) {
        console.error("Failed reading from localStorage, falling back to seed data", err);
      }
    }
    const seed = getInitialSeedData();
    this.saveState(seed);
    return seed;
  }

  private saveState(state: StorageState) {
    this.state = state;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_PREFIX, JSON.stringify(state));
      } catch (err) {
        console.error("Failed persisting to localStorage", err);
      }
    }
  }

  async resetDemoData(): Promise<void> {
    const seed = getInitialSeedData();
    this.saveState(seed);
  }

  async getProfile(): Promise<Profile> {
    return this.state.profile;
  }

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const updated: Profile = {
      ...this.state.profile,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveState({ ...this.state, profile: updated });
    return updated;
  }

  async getInboxItems(): Promise<InboxItem[]> {
    return this.state.inboxItems.filter((item) => item.status === "active");
  }

  async createInboxItem(title: string, description?: string | null): Promise<InboxItem> {
    const newItem: InboxItem = {
      id: "inbox-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      user_id: this.state.profile.user_id,
      title: title.trim(),
      description: description?.trim() || null,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const inboxItems = [newItem, ...this.state.inboxItems];
    this.saveState({ ...this.state, inboxItems });
    return newItem;
  }

  async updateInboxItem(id: string, updates: Partial<InboxItem>): Promise<InboxItem> {
    const idx = this.state.inboxItems.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error(`Inbox item ${id} not found.`);

    const updated: InboxItem = {
      ...this.state.inboxItems[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    const inboxItems = [...this.state.inboxItems];
    inboxItems[idx] = updated;
    this.saveState({ ...this.state, inboxItems });
    return updated;
  }

  async deleteInboxItem(id: string): Promise<void> {
    const inboxItems = this.state.inboxItems.filter((i) => i.id !== id);
    this.saveState({ ...this.state, inboxItems });
  }

  async getPlanForDate(date: string): Promise<{ plan: DailyPlan | null; commitments: Commitment[] }> {
    const plan = this.state.dailyPlans.find((p) => p.plan_date === date) || null;
    if (!plan) return { plan: null, commitments: [] };

    const commitments = this.state.commitments
      .filter((c) => c.daily_plan_id === plan.id)
      .sort((a, b) => a.priority - b.priority);

    return { plan, commitments };
  }

  async createDraftPlan(date: string): Promise<{ plan: DailyPlan; commitments: Commitment[] }> {
    let plan = this.state.dailyPlans.find((p) => p.plan_date === date);
    if (!plan) {
      plan = {
        id: "plan-" + Date.now(),
        user_id: this.state.profile.user_id,
        plan_date: date,
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.saveState({
        ...this.state,
        dailyPlans: [...this.state.dailyPlans, plan],
      });
    }

    const commitments = this.state.commitments
      .filter((c) => c.daily_plan_id === plan.id)
      .sort((a, b) => a.priority - b.priority);

    return { plan, commitments };
  }

  async commitPlan(planId: string, commitments: Commitment[]): Promise<{ plan: DailyPlan; commitments: Commitment[] }> {
    const planIndex = this.state.dailyPlans.findIndex((p) => p.id === planId);
    if (planIndex === -1) throw new PlanTransitionError(`Plan ${planId} not found.`);

    const currentPlan = this.state.dailyPlans[planIndex];
    const { plan: committedPlan, commitments: updatedCommitments } = commitDailyPlan(currentPlan, commitments);

    // Replace or assign commitments for this plan
    const otherCommitments = this.state.commitments.filter((c) => c.daily_plan_id !== planId);
    const allCommitments = [...otherCommitments, ...updatedCommitments];

    const allPlans = [...this.state.dailyPlans];
    allPlans[planIndex] = committedPlan;

    // Log events
    const newEvents: TaskEvent[] = updatedCommitments.map((c) => ({
      id: "ev-" + Date.now() + "-" + c.id,
      user_id: this.state.profile.user_id,
      commitment_id: c.id,
      event_type: "committed",
      metadata: { priority: c.priority, planDate: committedPlan.plan_date },
      created_at: new Date().toISOString(),
    }));

    this.saveState({
      ...this.state,
      dailyPlans: allPlans,
      commitments: allCommitments,
      taskEvents: [...this.state.taskEvents, ...newEvents],
    });

    return { plan: committedPlan, commitments: updatedCommitments };
  }

  async replanPlan(request: ReplanRequest): Promise<{ plan: DailyPlan; commitments: Commitment[] }> {
    const planIndex = this.state.dailyPlans.findIndex((p) => p.id === request.planId);
    if (planIndex === -1) throw new PlanTransitionError(`Plan ${request.planId} not found.`);

    const currentPlan = this.state.dailyPlans[planIndex];
    let planCommitments = this.state.commitments.filter((c) => c.daily_plan_id === request.planId);

    const now = new Date().toISOString();

    // 1. Remove commitments if requested
    if (request.removedCommitmentIds && request.removedCommitmentIds.length > 0) {
      planCommitments = planCommitments.map((c) => {
        if (request.removedCommitmentIds!.includes(c.id)) {
          return { ...c, status: "cancelled", updated_at: now };
        }
        return c;
      });
    }

    // 2. Add new commitments if provided
    if (request.newCommitments && request.newCommitments.length > 0) {
      const created: Commitment[] = request.newCommitments.map((item, idx) => ({
        ...item,
        id: "c-replanned-" + Date.now() + "-" + idx,
        user_id: this.state.profile.user_id,
        daily_plan_id: request.planId,
        focus_seconds: 0,
        rollover_count: 0,
        created_at: now,
        updated_at: now,
      }));
      planCommitments.push(...created);
    }

    // Active/planned items
    const activePool = planCommitments.filter((c) => c.status !== "cancelled" && c.status !== "carried_forward");

    // 3. Reorder if specified
    if (request.reorderedCommitmentIds && request.reorderedCommitmentIds.length > 0) {
      const orderMap = new Map<string, number>();
      request.reorderedCommitmentIds.forEach((id, idx) => orderMap.set(id, idx + 1));

      activePool.forEach((c) => {
        if (orderMap.has(c.id)) {
          c.priority = orderMap.get(c.id)!;
        }
      });
    }

    // Sort active pool
    activePool.sort((a, b) => a.priority - b.priority);

    // Normalize priorities and ensure one is active if uncompleted
    let foundActive = false;
    activePool.forEach((c, idx) => {
      c.priority = idx + 1;
      if (c.status === "completed") {
        // preserve completed
      } else if (!foundActive) {
        c.status = "active";
        foundActive = true;
      } else {
        c.status = "planned";
      }
      c.updated_at = now;
    });

    // Update plan status
    const replannedPlan: DailyPlan = {
      ...currentPlan,
      status: "replanned",
      updated_at: now,
    };

    const otherCommitments = this.state.commitments.filter((c) => c.daily_plan_id !== request.planId);
    const allCommitments = [...otherCommitments, ...planCommitments];

    const allPlans = [...this.state.dailyPlans];
    allPlans[planIndex] = replannedPlan;

    // Log replan event
    const replanEvent: TaskEvent = {
      id: "ev-replan-" + Date.now(),
      user_id: this.state.profile.user_id,
      commitment_id: planCommitments[0]?.id || "none",
      event_type: "replanned",
      metadata: { reason: request.reason, notes: request.notes },
      created_at: now,
    };

    this.saveState({
      ...this.state,
      dailyPlans: allPlans,
      commitments: allCommitments,
      taskEvents: [...this.state.taskEvents, replanEvent],
    });

    return { plan: replannedPlan, commitments: activePool };
  }

  async completeCommitmentAction(
    commitmentId: string,
    focusSecondsSpent: number = 0
  ): Promise<{
    completedCommitment: Commitment;
    nextCommitment: Commitment | null;
    isAllCompleted: boolean;
  }> {
    const target = this.state.commitments.find((c) => c.id === commitmentId);
    if (!target) throw new PlanTransitionError(`Commitment ${commitmentId} not found.`);

    const planCommitments = this.state.commitments.filter((c) => c.daily_plan_id === target.daily_plan_id);

    const { updatedCommitments, completedCommitment, nextCommitment, isAllCompleted } =
      completeCommitment(planCommitments, commitmentId, focusSecondsSpent);

    const otherCommitments = this.state.commitments.filter((c) => c.daily_plan_id !== target.daily_plan_id);
    const allCommitments = [...otherCommitments, ...updatedCommitments];

    // If all completed, update plan status
    const allPlans = [...this.state.dailyPlans];
    if (isAllCompleted) {
      const planIdx = allPlans.findIndex((p) => p.id === target.daily_plan_id);
      if (planIdx !== -1) {
        allPlans[planIdx] = {
          ...allPlans[planIdx],
          status: "completed",
          updated_at: new Date().toISOString(),
        };
      }
    }

    const completeEvent: TaskEvent = {
      id: "ev-complete-" + Date.now(),
      user_id: this.state.profile.user_id,
      commitment_id: commitmentId,
      event_type: "completed",
      metadata: { focusSecondsSpent },
      created_at: new Date().toISOString(),
    };

    this.saveState({
      ...this.state,
      dailyPlans: allPlans,
      commitments: allCommitments,
      taskEvents: [...this.state.taskEvents, completeEvent],
    });

    return { completedCommitment, nextCommitment, isAllCompleted };
  }

  async logFocusSession(
    commitmentId: string,
    startedAt: string,
    endedAt: string,
    durationSeconds: number
  ): Promise<FocusSession> {
    const newSession: FocusSession = {
      id: "session-" + Date.now(),
      user_id: this.state.profile.user_id,
      commitment_id: commitmentId,
      started_at: startedAt,
      ended_at: endedAt,
      duration_seconds: durationSeconds,
      created_at: new Date().toISOString(),
    };

    // Update commitment focus seconds
    const idx = this.state.commitments.findIndex((c) => c.id === commitmentId);
    let commitments = [...this.state.commitments];
    if (idx !== -1) {
      commitments[idx] = {
        ...commitments[idx],
        focus_seconds: commitments[idx].focus_seconds + durationSeconds,
        updated_at: new Date().toISOString(),
      };
    }

    this.saveState({
      ...this.state,
      focusSessions: [...this.state.focusSessions, newSession],
      commitments,
    });

    return newSession;
  }

  async saveReflection(planId: string, reason: ReflectionReason, notes?: string): Promise<DailyReflection> {
    const existingIdx = this.state.dailyReflections.findIndex((r) => r.daily_plan_id === planId);
    const reflection: DailyReflection = {
      id: "ref-" + Date.now(),
      user_id: this.state.profile.user_id,
      daily_plan_id: planId,
      reflection_reason: reason,
      notes: notes || null,
      created_at: new Date().toISOString(),
    };

    let reflections = [...this.state.dailyReflections];
    if (existingIdx !== -1) {
      reflections[existingIdx] = reflection;
    } else {
      reflections.push(reflection);
    }

    this.saveState({ ...this.state, dailyReflections: reflections });
    return reflection;
  }

  async getReflection(planId: string): Promise<DailyReflection | null> {
    return this.state.dailyReflections.find((r) => r.daily_plan_id === planId) || null;
  }

  async checkAndRunRollover(todayDate: string): Promise<{ carriedCount: number; carriedItems: Commitment[] }> {
    if (this.state.lastRolloverDate === todayDate) {
      return { carriedCount: 0, carriedItems: [] };
    }

    const { updatedPlans, updatedCommitments, carriedForwardCommitments, carriedCount } = processRollover(
      this.state.dailyPlans,
      this.state.commitments,
      todayDate
    );

    this.saveState({
      ...this.state,
      dailyPlans: updatedPlans,
      commitments: updatedCommitments,
      lastRolloverDate: todayDate,
    });

    return {
      carriedCount,
      carriedItems: carriedForwardCommitments,
    };
  }

  async getVaultHistory(): Promise<VaultDay[]> {
    const { vaultDays } = aggregateVaultAndRecords(
      this.state.dailyPlans,
      this.state.commitments,
      this.state.dailyReflections
    );
    return vaultDays;
  }

  async getPersonalRecords(): Promise<PersonalRecords> {
    const { records } = aggregateVaultAndRecords(
      this.state.dailyPlans,
      this.state.commitments,
      this.state.dailyReflections
    );
    return records;
  }

  async getPlanningCalibration(): Promise<PlanningCalibration> {
    const summaries = summarizeHistoricalDays(
      this.state.dailyPlans,
      this.state.commitments,
      this.state.focusSessions
    );
    return calculateCalibration(summaries);
  }

  async getExecutionStats(): Promise<ExecutionStats> {
    const summaries = summarizeHistoricalDays(
      this.state.dailyPlans,
      this.state.commitments,
      this.state.focusSessions
    );
    const { records, overallCompletionRate } = aggregateVaultAndRecords(
      this.state.dailyPlans,
      this.state.commitments,
      this.state.dailyReflections
    );
    const momentum = calculateMomentum(this.state.commitments);
    const archetype = determineExecutionProfile(summaries);
    const totalFocus = this.state.focusSessions.reduce((acc, s) => acc + s.duration_seconds, 0);
    const totalCompleted = this.state.commitments.filter((c) => c.status === "completed").length;

    return {
      user_id: this.state.profile.user_id,
      current_momentum: momentum,
      best_streak_days: records.bestStreakDays,
      total_perfect_days: records.totalPerfectDays,
      longest_focus_seconds: records.longestFocusSeconds,
      historical_completion_rate: overallCompletionRate,
      total_commitments_completed: totalCompleted,
      total_focus_seconds: totalFocus,
      execution_profile: archetype,
      updated_at: new Date().toISOString(),
    };
  }

  async logTaskEvent(commitmentId: string, eventType: string, metadata: Record<string, any> = {}): Promise<TaskEvent> {
    const event: TaskEvent = {
      id: "ev-" + Date.now(),
      user_id: this.state.profile.user_id,
      commitment_id: commitmentId,
      event_type: eventType as any,
      metadata,
      created_at: new Date().toISOString(),
    };

    this.saveState({
      ...this.state,
      taskEvents: [...this.state.taskEvents, event],
    });

    return event;
  }
}
