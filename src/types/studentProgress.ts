import type { AttendanceStatus } from "./classes";
import type { UnitItemType } from "./educationalContent";
import type { ExamAttemptStatus } from "./exams";

export interface StudentProgressUnitInfo {
  id: number;
  title: string;
}

export interface StudentProgressUnitItemInfo {
  id: number;
  title: string;
  type: UnitItemType;
  unit_info: StudentProgressUnitInfo;
}

export interface StudentProgressEvaluationInfo {
  id: number;
  attendance_status: AttendanceStatus;
  evaluation_grades: Record<string, number>[];
  date: string;
  notes?: string;
}

export interface StudentProgressExamInfo {
  id: number;
  title: string;
  duration_minutes: number;
  start_time: number;
  end_time: number;
  total_marks: number;
}

export interface StudentProgressExamAttemptInfo {
  id: number;
  exam_info: StudentProgressExamInfo;
  status: ExamAttemptStatus;
  start_time: number;
  end_time: number;
  score: number;
}

export enum StudentProgressStatus {
  PASSED = "passed",
  FAILED = "failed",
}

export interface StudentProgressEntry {
  id: number;
  student_id: number;
  status: StudentProgressStatus;
  unit_item_info: StudentProgressUnitItemInfo;
  evaluation_info?: StudentProgressEvaluationInfo;
  exam_attempt_info?: StudentProgressExamAttemptInfo;
  created_at: string;
}

export type StudentProgressClassGroup = {
  class_id: number;
  class_name: string;
  subject_name: string;
  curriculum_name: string;
  unit_items_info: StudentProgressUnitItemInfo[];
  items: StudentProgressEntry[];
};

export type StudentProgressStudentGroup = {
  student_id: number;
  student_name: string;
  groups: StudentProgressClassGroup[];
};
