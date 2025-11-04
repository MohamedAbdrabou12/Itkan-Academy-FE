
export enum UserRole {
  STUDENT = "Student",
  TEACHER = "Teacher",
  GENERAL_MANAGER = "General Manager",
  EDUCATION_AFFAIRS_MANAGER = "Education Affairs Manager",
  GENERAL_EDUCATION_SUPERVISOR = "General Education Supervisor",
  BRANCH_SUPERVISOR = "Branch Supervisor",
  ACADEMIC_AFFAIRS_MANAGER = "Academic Affairs Manager",
  ADMINISTRATIVE_AFFAIRS_MANAGER = "Administrative Affairs Manager",
  STAFF_AFFAIRS_MANAGER = "Staff Affairs Manager",
  STUDENT_AFFAIRS_MANAGER = "Student Affairs Manager",
  FINANCIAL_AFFAIRS_MANAGER = "Financial Affairs Manager",
}

export interface RoleDetails {
  id: number;
  name: UserRole;
  description: string;
  name_in_arabic: string;
  created_at: string;
  [key: string]: unknown; // index signature
}

export interface RolesResponse {
  data: RoleDetails[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
