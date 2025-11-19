export interface EvaluationCriteria {
  name: string;
  max_grade: number;
}

export interface Class {
  id: number;
  branch_id: number;
  name: string;
  schedule: Record<string, string[]>;
  evaluation_config: EvaluationCriteria[];
  created_at: string;
  updated_at: string;
}

export interface ClassStudent {
  student_id: number;
  full_name: string;
}

export interface EvaluationGrade {
  criteria: string;
  grade: number;
  max_grade: number;
}

export interface StudentAttendanceStatus {
  present: boolean;
  notes: string;
  evaluations: EvaluationGrade[];
}

export interface AttendanceStatus {
  [key: number]: StudentAttendanceStatus;
}
