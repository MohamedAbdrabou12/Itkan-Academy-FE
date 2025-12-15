export enum ExamStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  CLOSED = "closed",
}

export interface ExamResponse {
  items: Exam[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface Exam {
  title: string;
  duration_minutes: number;
  start_time: string;
  end_time: string;
  class_id: number;
  id: number;
  total_marks: number;
  status: ExamStatus;
  branch_id: number;
  created_by: number;
  questions: any[];
  [key: string]: unknown; // index signature
}

export interface ExamQuestion {
  id: number;
  exam_id: number;
  question_id: number;
  points: number;
}

export interface ExamWithQuestions extends Exam {
  questions: ExamQuestion[];
}

export type ExamCreate = Omit<
  Exam,
  "id" | "created_at" | "updated_at" | "status"
>;
export type ExamUpdate = Partial<ExamCreate>;
