export enum StudentStatus {
  PENDING = "pending",
  ACTIVE = "active",
  REJECTED = "rejected",
  DEACTIVE = "deactive",
}

export interface StudentDetails {
  id: number;    //user id
  student_id: number; //student profile id
  full_name: string;
  email: string;
  phone?: string;
  branch_ids?: number[];
  class_ids?: number[];
  admission_date?: string | null;
  curriculum_progress?: Record<string, unknown>;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface StudentsResponse {
  items: StudentDetails[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
