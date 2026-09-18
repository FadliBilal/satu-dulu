// ==============================================================================
// SATUDULU — Core Domain TypeScript Definitions
// Tagline: "Decide what matters. Do it one at a time."
// ==============================================================================

export type Occupation =
  | "student"
  | "developer"
  | "designer"
  | "marketer"
  | "freelancer"
  | "entrepreneur"
  | "employee"
  | "other";

export interface Profile {
  id: string;
  user_id: string;
  username?: string | null;
  occupation: Occupation;
  timezone: string; // e.g. "Asia/Jakarta"
  created_at: string;
  updated_at: string;
}

export type InboxItemStatus = "active" | "archived" | "converted";

export interface InboxItem {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  status: InboxItemStatus;
  created_at: string;
  updated_at: string;
}

export type DailyPlanStatus =
  | "draft"
  | "committed"
  | "completed"
  | "replanned"
  | "archived";

export interface DailyPlan {
  id: string;
  user_id: string;
  plan_date: string; // YYYY-MM-DD in user's timezone
  status: DailyPlanStatus;
  locked_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type CommitmentStatus =
  | "planned"
  | "active"
  | "completed"
  | "carried_forward"
  | "cancelled";

export interface Commitment {
  id: string;
  user_id: string;
  daily_plan_id: string;
  inbox_item_id?: string | null;
  title: string;
  description?: string | null;
  why_it_matters?: string | null;
  priority: number; // 1 to 6 (1 is highest, active first)
  estimated_duration: number; // minutes, e.g. 25, 45, 60
  status: CommitmentStatus;
  completed_at?: string | null;
  focus_seconds: number;
  rollover_count: number;
  created_at: string;
  updated_at: string;
}

export type TaskEventType =
  | "created"
  | "prioritized"
  | "committed"
  | "started"
  | "completed"
  | "carried_forward"
  | "replanned"
  | "cancelled";

export interface TaskEvent {
  id: string;
  user_id: string;
  commitment_id: string;
  event_type: TaskEventType;
  metadata: Record<string, any>;
  created_at: string;
}

export interface FocusSession {
  id: string;
  user_id: string;
  commitment_id: string;
  started_at: string;
  ended_at?: string | null;
  duration_seconds: number;
  created_at: string;
}

export type ReflectionReason =
  | "unexpected_work"
  | "underestimated_effort"
  | "too_many_commitments"
  | "distraction"
  | "low_energy"
  | "other";

export interface DailyReflection {
  id: string;
  user_id: string;
  daily_plan_id: string;
  reflection_reason: ReflectionReason;
  notes?: string | null;
  created_at: string;
}

export type ExecutionProfileArchetype =
  | "The Finisher"
  | "The Consistent"
  | "The Sprinter"
  | "The Prioritizer"
  | "The Overcommitter";

export interface ExecutionStats {
  user_id: string;
  current_momentum: number; // consecutive completed commitments in active flow
  best_streak_days: number; // days where at least 1 commitment was completed
  total_perfect_days: number; // days where 100% of planned commitments were completed
  longest_focus_seconds: number;
  historical_completion_rate: number; // 0 to 100
  total_commitments_completed: number;
  total_focus_seconds: number;
  execution_profile: ExecutionProfileArchetype;
  updated_at: string;
}

export interface PersonalRecords {
  bestStreakDays: number;
  totalPerfectDays: number;
  longestFocusSeconds: number;
  highestWeeklyCompletionRate: number;
}

export interface PlanningCalibration {
  recommendedRange: [number, number]; // e.g. [3, 4]
  message: string;
  rhythmDescription: string;
  planningQuality: "realistic" | "stretched" | "overcommitted";
  averageCommitted: number;
  averageCompleted: number;
  perfectDaysCount: number;
}

export interface VaultDay {
  date: string;
  planStatus: DailyPlanStatus;
  committedCount: number;
  completedCount: number;
  carriedCount: number;
  isPerfectDay: boolean;
  totalFocusSeconds: number;
  commitments: Commitment[];
  reflection?: DailyReflection | null;
}

export interface ReplanRequest {
  planId: string;
  reason: ReflectionReason;
  notes?: string;
  removedCommitmentIds?: string[];
  reorderedCommitmentIds?: string[];
  newCommitments?: Array<Omit<Commitment, "id" | "user_id" | "daily_plan_id" | "created_at" | "updated_at" | "rollover_count" | "focus_seconds">>;
}
