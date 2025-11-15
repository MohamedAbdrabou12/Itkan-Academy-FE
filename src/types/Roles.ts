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
  ADMIN = "Admin",
}

export interface RoleDetails {
  id: number;
  name: UserRole;
  name_ar: string;
  description: string;
  description_ar: string;
  permissions_count: number;
  created_at: string;
  [key: string]: unknown; // index signature
}

export interface RolesResponse {
  items: RoleDetails[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
export interface UpdateUserRoleData {
  user_id: number;
  role_id: number;
}
