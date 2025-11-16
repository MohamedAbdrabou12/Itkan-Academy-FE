export const PermissionKeys = {
  ACADEMIC_CURRICULUM_ALL: "academic.curriculum.*",
  ACADEMIC_CURRICULUM_VIEW: "academic.curriculum.view",
  ACADEMIC_CURRICULUM_MANAGE: "academic.curriculum.manage",

  ACADEMIC_PERFORMANCE_ALL: "academic.performance.*",
  ACADEMIC_PERFORMANCE_VIEW: "academic.performance.view",

  ACADEMIC_EXAMS_ALL: "academic.exams.*",
  ACADEMIC_EXAMS_VIEW: "academic.exams.view",
  ACADEMIC_EXAMS_PERFORM: "academic.exams.perform",
  ACADEMIC_EXAMS_SUPERVISE: "academic.exams.supervise",
  ACADEMIC_EXAMS_COORDINATE: "academic.exams.coordinate",

  ACADEMIC_CLASSES_ALL: "academic.classes.*",
  ACADEMIC_CLASSES_VIEW: "academic.classes.view",

  FINANCIAL_INVOICES_ALL: "financial.invoices.*",
  FINANCIAL_INVOICES_PAY: "financial.invoices.pay",

  FINANCIAL_PAYMENTS_ALL: "financial.payments.*",
  FINANCIAL_PAYMENTS_VIEW: "financial.payments.view",

  FINANCIAL_SUBSCRIPTIONS_ALL: "financial.subscriptions.*",
  FINANCIAL_SUBSCRIPTIONS_MANAGE: "financial.subscriptions.manage",

  FINANCIAL_ACCOUNTS_ALL: "financial.accounts.*",
  FINANCIAL_ACCOUNTS_MANAGE: "financial.accounts.manage",

  FINANCIAL_EXPENSES_ALL: "financial.expenses.*",
  FINANCIAL_EXPENSES_MANAGE: "financial.expenses.manage",

  COMMUNICATION_MANAGEMENT_ALL: "communication.management.*",
  COMMUNICATION_MANAGEMENT_CONTACT: "communication.management.contact",

  COMMUNICATION_SUPERVISOR_ALL: "communication.supervisor.*",
  COMMUNICATION_SUPERVISOR_CONTACT: "communication.supervisor.contact",

  COMMUNICATION_ANNOUNCEMENTS_ALL: "communication.announcements.*",
  COMMUNICATION_ANNOUNCEMENTS_SEND: "communication.announcements.send",

  COMMUNICATION_MESSAGES_ALL: "communication.messages.*",
  COMMUNICATION_MESSAGES_SEND: "communication.messages.send",

  ATTENDANCE_DAILY_ALL: "attendance.daily.*",
  ATTENDANCE_DAILY_MANAGE: "attendance.daily.manage",

  ATTENDANCE_TEACHER_ALL: "attendance.teacher.*",
  ATTENDANCE_TEACHER_MANAGE: "attendance.teacher.manage",

  ATTENDANCE_STUDENT_ALL: "attendance.student.*",
  ATTENDANCE_STUDENT_MANAGE: "attendance.student.manage",

  REPORTS_ALL: "reports.*",
  REPORTS_ACADEMIC_VIEW: "reports.academic.view",
  REPORTS_STAFF_VIEW: "reports.staff.view",
  REPORTS_FINANCIAL_VIEW: "reports.financial.view",
  REPORTS_FINANCIAL_GENERATE: "reports.financial.generate",

  REPORTS_BRANCH_ALL: "reports.branch.*",
  REPORTS_BRANCH_VIEW: "reports.branch.view",

  REPORTS_TEACHER_ALL: "reports.teacher.*",
  REPORTS_TEACHER_VIEW: "reports.teacher.view",

  REPORTS_STUDENT_ALL: "reports.student.*",
  REPORTS_STUDENT_VIEW: "reports.student.view",

  REPORTS_ADMINISTRATIVE_ALL: "reports.administrative.*",
  REPORTS_ADMINISTRATIVE_VIEW: "reports.administrative.view",
  REPORTS_ADMINISTRATIVE_APPROVE: "reports.administrative.approve",

  REPORTS_FINANCIAL_EXPENSES_ALL: "reports.financial_expenses.*",
  REPORTS_FINANCIAL_EXPENSES_APPROVE: "reports.financial_expenses.approve",

  SYSTEM_ROLES_ALL: "system.roles.*",
  SYSTEM_ROLES_MANAGE: "system.roles.manage",

  SYSTEM_ROLE_PERMISSIONS_ALL: "system.role_permissions.*",
  SYSTEM_ROLE_PERMISSIONS_MANAGE: "system.role_permissions.manage",

  SYSTEM_BRANCHES_ALL: "system.branches.*",
  SYSTEM_BRANCHES_MANAGE: "system.branches.manage",

  SYSTEM_ASSIGNMENTS_ALL: "system.assignments.*",
  SYSTEM_ASSIGNMENTS_MANAGE: "system.assignments.manage",

  SYSTEM_TEACHER_PERMISSIONS_ALL: "system.teacher_permissions.*",
  SYSTEM_TEACHER_PERMISSIONS_MANAGE: "system.teacher_permissions.manage",

  TEACHER_MANAGEMENT_ALL: "teacher.management.*",
  TEACHER_MANAGEMENT_MANAGE: "teacher.management.manage",

  EVALUATION_TEACHER_ALL: "evaluation.teacher.*",
  EVALUATION_TEACHER_MANAGE: "evaluation.teacher.manage",

  TRAINING_TEACHER_ALL: "training.teacher.*",
  TRAINING_TEACHER_MANAGE: "training.teacher.manage",

  STAFF_MANAGEMENT_ALL: "staff.management.*",
  STAFF_MANAGEMENT_MANAGE: "staff.management.manage",

  STUDENT_MANAGEMENT_ALL: "student.management.*",
  STUDENT_MANAGEMENT_MANAGE: "student.management.manage",

  PENALTY_STAFF_ALL: "penalty.staff.*",
  PENALTY_STAFF_MANAGE: "penalty.staff.manage",

  PENALTY_TEACHER_ALL: "penalty.teacher.*",
  PENALTY_TEACHER_MANAGE: "penalty.teacher.manage",

  SALARY_STAFF_ALL: "salary.staff.*",
  SALARY_STAFF_MANAGE: "salary.staff.manage",
  SALARY_STAFF_APPROVE: "salary.staff.approve",

  SALARY_TEACHER_ALL: "salary.teacher.*",
  SALARY_TEACHER_MANAGE: "salary.teacher.manage",
  SALARY_TEACHER_APPROVE: "salary.teacher.approve",

  ACTIVITIES_STUDENT_ALL: "activities.student.*",
  ACTIVITIES_STUDENT_APPROVE: "activities.student.approve",

  ACTIVITIES_SEMINARS_ALL: "activities.seminars.*",
  ACTIVITIES_SEMINARS_ORGANIZE: "activities.seminars.organize",

  ACTIVITIES_COMPETITIONS_ALL: "activities.competitions.*",
  ACTIVITIES_COMPETITIONS_MANAGE: "activities.competitions.manage",

  ACTIVITIES_PARTIES_ALL: "activities.parties.*",
  ACTIVITIES_PARTIES_MANAGE: "activities.parties.manage",
} as const;

export interface Permission {
  id: number;
  code: string;
  name: string;
  name_ar: string;
  description?: string;
  description_ar?: string;
  created_at: string;
  updated_at: string;
}
export interface RolePermission {
  role_id: number;
  permission_id: number;
  permission?: Permission;
}
