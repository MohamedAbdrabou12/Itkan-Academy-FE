export interface Class {
  id: number;
  branch_id: number;
  name: string;
  schedule: Record<string, string[]>;
  evaluation_config: string[];
  created_at: string;
  updated_at: string;
}

export interface ClassStudent {
  student_id: number;
  full_name: string;
}

export interface EvaluationGrade {
  name: string;
  grade: number;
}

export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
  LATE = "late",
  EXCUSED = "excused",
}

export interface StudentAttendanceStatus {
  status: AttendanceStatus;
  notes: string;
  evaluations: EvaluationGrade[];
}
