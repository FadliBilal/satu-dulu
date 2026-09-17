// ==============================================================================
// SATUDULU — Repository Interface
// Decouples data storage (Supabase PostgreSQL vs Offline/Demo Local Store)
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

export interface IRepository {
  // Profiles
  getProfile(): Promise<Profile>;
  updateProfile(updates: Partial<Profile>): Promise<Profile>;

  // Inbox
  getInboxItems(): Promise<InboxItem[]>;
  createInboxItem(title: string, description?: string | null): Promise<InboxItem>;
  updateInboxItem(id: string, updates: Partial<InboxItem>): Promise<InboxItem>;
  deleteInboxItem(id: string): Promise<void>;

  // Daily Plans
  getPlanForDate(date: string): Promise<{ plan: DailyPlan | null; commitments: Commitment[] }>;
  createDraftPlan(date: string): Promise<{ plan: DailyPlan; commitments: Commitment[] }>;
  commitPlan(planId: string, commitments: Commitment[]): Promise<{ plan: DailyPlan; commitments: Commitment[] }>;
  replanPlan(request: ReplanRequest): Promise<{ plan: DailyPlan; commitments: Commitment[] }>;
  completeCommitmentAction(commitmentId: string, focusSecondsSpent?: number): Promise<{
    completedCommitment: Commitment;
    nextCommitment: Commitment | null;
    isAllCompleted: boolean;
  }>;

  // Focus
  logFocusSession(commitmentId: string, startedAt: string, endedAt: string, durationSeconds: number): Promise<FocusSession>;

  // Reflections
  saveReflection(planId: string, reason: ReflectionReason, notes?: string): Promise<DailyReflection>;
  getReflection(planId: string): Promise<DailyReflection | null>;

  // Rollover
  checkAndRunRollover(todayDate: string): Promise<{ carriedCount: number; carriedItems: Commitment[] }>;

  // Analytics & Vault
  getVaultHistory(): Promise<VaultDay[]>;
  getPersonalRecords(): Promise<PersonalRecords>;
  getPlanningCalibration(): Promise<PlanningCalibration>;
  getExecutionStats(): Promise<ExecutionStats>;

  // Events
  logTaskEvent(commitmentId: string, eventType: string, metadata?: Record<string, any>): Promise<TaskEvent>;

  // Reset / Demo Helper
  resetDemoData(): Promise<void>;
}
