export type EvaluationStatus = "draft" | "submitted" | "approved";

// Evaluation Cycle Types
export interface EvaluationCycle {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EvaluationCycleCreate {
  name: string;
  start_date: string;
  end_date: string;
  is_active?: boolean;
}

export interface EvaluationCycleUpdate {
  name?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

// KPI Types
export interface KPI {
  id: number;
  template_id: number;
  name: string;
  description?: string;
  weight: number;
  max_score: number;
  created_at: string;
  updated_at: string;
}

export interface KPICreate {
  name: string;
  description?: string;
  weight: number;
  max_score?: number;
}

export interface KPIUpdate {
  name?: string;
  description?: string;
  weight?: number;
  max_score?: number;
}

// KPI Template Types
export interface KPITemplate {
  id: number;
  name: string;
  created_by_user_id?: number;
  created_at: string;
  updated_at: string;
  kpis?: KPI[];
  created_by?: {
    id: number;
    full_name: string;
  };
}

export interface KPITemplateCreate {
  name: string;
  kpis?: KPICreate[];
}

export interface KPITemplateUpdate {
  name?: string;
}

// Evaluation Types
export interface EvaluationKPIScore {
  id: number;
  evaluation_id: number;
  kpi_id: number;
  score: number;
  created_at: string;
  updated_at: string;
  kpi?: KPI;
}

export interface EvaluationComment {
  id: number;
  evaluation_id: number;
  comment: string;
  created_at: string;
}

export interface EmployeeEvaluation {
  id: number;
  employee_user_id: number;
  evaluator_user_id: number;
  cycle_id: number;
  template_id: number;
  status: EvaluationStatus;
  final_score?: number;
  created_at: string;
  updated_at: string;
}

export interface EmployeeEvaluationWithDetails extends EmployeeEvaluation {
  employee?: { id: number; full_name: string };
  evaluator?: { id: number; full_name: string };
  cycle?: EvaluationCycle;
  template?: KPITemplate;
  kpi_scores?: EvaluationKPIScore[];
  comments?: EvaluationComment[];
}

export interface StartEvaluationRequest {
  employee_user_id: number;
  cycle_id: number;
  template_id: number;
}

export interface ScoreEvaluationRequest {
  scores: { kpi_id: number; score: number }[];
}

export interface EvaluationCommentCreate {
  comment: string;
}
