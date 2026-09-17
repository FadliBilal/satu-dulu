// ==============================================================================
// SATUDULU — Supabase PostgreSQL Repository Implementation
// Enforces Row Level Security (RLS) and real-time cloud persistence
// ==============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
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
import { commitDailyPlan, completeCommitment, PlanTransitionError } from "../domain/state-machine";
import { calculateCalibration, determineExecutionProfile, summarizeHistoricalDays } from "../domain/calibration";
import { aggregateVaultAndRecords, calculateMomentum } from "../domain/gamification";
import { getCurrentDateInTimezone, processRollover } from "../domain/rollover";

export class SupabaseRepository implements IRepository {
  private client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  private async getUserId(): Promise<string> {
    const { data: { user }, error } = await this.client.auth.getUser();
    if (error || !user) {
      throw new Error("User not authenticated in Supabase.");
    }
    return user.id;
  }

  async resetDemoData(): Promise<void> {
    // No-op for remote DB
  }

  async getProfile(): Promise<Profile> {
    const userId = await this.getUserId();
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      // Upsert default
      const defaultProfile: Profile = {
        id: userId,
        user_id: userId,
        occupation: "other",
        timezone: "Asia/Jakarta",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await this.client.from("profiles").upsert(defaultProfile);
      return defaultProfile;
    }
    return data;
  }

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const userId = await this.getUserId();
    const { data, error } = await this.client
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getInboxItems(): Promise<InboxItem[]> {
    const userId = await this.getUserId();
    const { data, error } = await this.client
      .from("inbox_items")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createInboxItem(title: string, description?: string | null): Promise<InboxItem> {
    const userId = await this.getUserId();
    const { data, error } = await this.client
      .from("inbox_items")
      .insert({
        user_id: userId,
        title: title.trim(),
        description: description?.trim() || null,
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateInboxItem(id: string, updates: Partial<InboxItem>): Promise<InboxItem> {
    const userId = await this.getUserId();
    const { data, error } = await this.client
      .from("inbox_items")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteInboxItem(id: string): Promise<void> {
    const userId = await this.getUserId();
    const { error } = await this.client
      .from("inbox_items")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
  }

  async getPlanForDate(date: string): Promise<{ plan: DailyPlan | null; commitments: Commitment[] }> {
    const userId = await this.getUserId();
    const { data: plan, error: planError } = await this.client
      .from("daily_plans")
      .select("*")
      .eq("user_id", userId)
      .eq("plan_date", date)
      .maybeSingle();

    if (planError) throw planError;
    if (!plan) return { plan: null, commitments: [] };

    const { data: commitments, error: commError } = await this.client
      .from("commitments")
      .select("*")
      .eq("daily_plan_id", plan.id)
      .order("priority", { ascending: true });

    if (commError) throw commError;
    return { plan, commitments: commitments || [] };
  }

  async createDraftPlan(date: string): Promise<{ plan: DailyPlan; commitments: Commitment[] }> {
    const userId = await this.getUserId();
    const existing = await this.getPlanForDate(date);
    if (existing.plan) return existing as { plan: DailyPlan; commitments: Commitment[] };

    const { data, error } = await this.client
      .from("daily_plans")
      .insert({
        user_id: userId,
        plan_date: date,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;
    return { plan: data, commitments: [] };
  }

  async commitPlan(planId: string, commitments: Commitment[]): Promise<{ plan: DailyPlan; commitments: Commitment[] }> {
    const userId = await this.getUserId();
    const { data: currentPlan, error: planError } = await this.client
      .from("daily_plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError || !currentPlan) throw new PlanTransitionError(`Plan ${planId} not found.`);

    const { plan: committedPlan, commitments: updatedCommitments } = commitDailyPlan(currentPlan, commitments);

    await this.client
      .from("daily_plans")
      .update({
        status: "committed",
        locked_at: committedPlan.locked_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", planId);

    // Upsert commitments
    for (const c of updatedCommitments) {
      await this.client.from("commitments").upsert({
        ...c,
        daily_plan_id: planId,
        user_id: userId,
        updated_at: new Date().toISOString(),
      });

      await this.logTaskEvent(c.id, "committed", { priority: c.priority, date: committedPlan.plan_date });
    }

    return { plan: committedPlan, commitments: updatedCommitments };
  }

  async replanPlan(request: ReplanRequest): Promise<{ plan: DailyPlan; commitments: Commitment[] }> {
    const userId = await this.getUserId();
    const now = new Date().toISOString();

    if (request.removedCommitmentIds && request.removedCommitmentIds.length > 0) {
      await this.client
        .from("commitments")
        .update({ status: "cancelled", updated_at: now })
        .in("id", request.removedCommitmentIds)
        .eq("user_id", userId);
    }

    if (request.newCommitments) {
      for (const item of request.newCommitments) {
        await this.client.from("commitments").insert({
          ...item,
          daily_plan_id: request.planId,
          user_id: userId,
          created_at: now,
          updated_at: now,
        });
      }
    }

    await this.client
      .from("daily_plans")
      .update({ status: "replanned", updated_at: now })
      .eq("id", request.planId);

    await this.logTaskEvent("none", "replanned", { reason: request.reason, notes: request.notes });

    const { plan, commitments } = await this.getPlanForDate(getCurrentDateInTimezone());
    return { plan: plan!, commitments };
  }

  async completeCommitmentAction(
    commitmentId: string,
    focusSecondsSpent: number = 0
  ): Promise<{
    completedCommitment: Commitment;
    nextCommitment: Commitment | null;
    isAllCompleted: boolean;
  }> {
    const { data: target, error } = await this.client
      .from("commitments")
      .select("*")
      .eq("id", commitmentId)
      .single();

    if (error || !target) throw new PlanTransitionError(`Commitment ${commitmentId} not found.`);

    const { data: planCommitments } = await this.client
      .from("commitments")
      .select("*")
      .eq("daily_plan_id", target.daily_plan_id)
      .order("priority", { ascending: true });

    const { updatedCommitments, completedCommitment, nextCommitment, isAllCompleted } =
      completeCommitment(planCommitments || [], commitmentId, focusSecondsSpent);

    for (const c of updatedCommitments) {
      await this.client.from("commitments").update(c).eq("id", c.id);
    }

    if (isAllCompleted) {
      await this.client
        .from("daily_plans")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", target.daily_plan_id);
    }

    await this.logTaskEvent(commitmentId, "completed", { focusSecondsSpent });

    return { completedCommitment, nextCommitment, isAllCompleted };
  }

  async logFocusSession(
    commitmentId: string,
    startedAt: string,
    endedAt: string,
    durationSeconds: number
  ): Promise<FocusSession> {
    const userId = await this.getUserId();
    const { data, error } = await this.client
      .from("focus_sessions")
      .insert({
        user_id: userId,
        commitment_id: commitmentId,
        started_at: startedAt,
        ended_at: endedAt,
        duration_seconds: durationSeconds,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async saveReflection(planId: string, reason: ReflectionReason, notes?: string): Promise<DailyReflection> {
    const userId = await this.getUserId();
    const { data, error } = await this.client
      .from("daily_reflections")
      .upsert({
        user_id: userId,
        daily_plan_id: planId,
        reflection_reason: reason,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getReflection(planId: string): Promise<DailyReflection | null> {
    const { data, error } = await this.client
      .from("daily_reflections")
      .select("*")
      .eq("daily_plan_id", planId)
      .maybeSingle();

    if (error) return null;
    return data;
  }

  async checkAndRunRollover(todayDate: string): Promise<{ carriedCount: number; carriedItems: Commitment[] }> {
    const userId = await this.getUserId();
    const { data: plans } = await this.client.from("daily_plans").select("*").eq("user_id", userId);
    const { data: commitments } = await this.client.from("commitments").select("*").eq("user_id", userId);

    const { updatedPlans, updatedCommitments, carriedForwardCommitments, carriedCount } = processRollover(
      plans || [],
      commitments || [],
      todayDate
    );

    if (carriedCount > 0) {
      for (const c of carriedForwardCommitments) {
        await this.client.from("commitments").update(c).eq("id", c.id);
        await this.logTaskEvent(c.id, "carried_forward");
      }
      for (const p of updatedPlans) {
        await this.client.from("daily_plans").update(p).eq("id", p.id);
      }
    }

    return { carriedCount, carriedItems: carriedForwardCommitments };
  }

  async getVaultHistory(): Promise<VaultDay[]> {
    const userId = await this.getUserId();
    const { data: plans } = await this.client.from("daily_plans").select("*").eq("user_id", userId);
    const { data: commitments } = await this.client.from("commitments").select("*").eq("user_id", userId);
    const { data: reflections } = await this.client.from("daily_reflections").select("*").eq("user_id", userId);

    const { vaultDays } = aggregateVaultAndRecords(plans || [], commitments || [], reflections || []);
    return vaultDays;
  }

  async getPersonalRecords(): Promise<PersonalRecords> {
    const userId = await this.getUserId();
    const { data: plans } = await this.client.from("daily_plans").select("*").eq("user_id", userId);
    const { data: commitments } = await this.client.from("commitments").select("*").eq("user_id", userId);
    const { records } = aggregateVaultAndRecords(plans || [], commitments || []);
    return records;
  }

  async getPlanningCalibration(): Promise<PlanningCalibration> {
    const userId = await this.getUserId();
    const { data: plans } = await this.client.from("daily_plans").select("*").eq("user_id", userId);
    const { data: commitments } = await this.client.from("commitments").select("*").eq("user_id", userId);
    const { data: sessions } = await this.client.from("focus_sessions").select("*").eq("user_id", userId);

    const summaries = summarizeHistoricalDays(plans || [], commitments || [], sessions || []);
    return calculateCalibration(summaries);
  }

  async getExecutionStats(): Promise<ExecutionStats> {
    const userId = await this.getUserId();
    const { data: plans } = await this.client.from("daily_plans").select("*").eq("user_id", userId);
    const { data: commitments } = await this.client.from("commitments").select("*").eq("user_id", userId);
    const { data: sessions } = await this.client.from("focus_sessions").select("*").eq("user_id", userId);

    const summaries = summarizeHistoricalDays(plans || [], commitments || [], sessions || []);
    const { records, overallCompletionRate } = aggregateVaultAndRecords(plans || [], commitments || []);
    const momentum = calculateMomentum(commitments || []);
    const archetype = determineExecutionProfile(summaries);
    const totalFocus = (sessions || []).reduce((acc, s) => acc + s.duration_seconds, 0);
    const totalCompleted = (commitments || []).filter((c) => c.status === "completed").length;

    return {
      user_id: userId,
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
    const userId = await this.getUserId();
    const { data, error } = await this.client
      .from("task_events")
      .insert({
        user_id: userId,
        commitment_id: commitmentId === "none" ? null : commitmentId,
        event_type: eventType,
        metadata,
      })
      .select()
      .single();

    if (error) {
      console.warn("Event logging skipped", error);
    }
    return data;
  }
}
