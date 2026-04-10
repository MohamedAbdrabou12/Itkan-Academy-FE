import type { PERMISSION_VALUE } from "@/types/permissions";
import { UserRole } from "@/types/Roles";
import { PermissionKeys } from "./permissions";

export const dashboardRouting: {
  route: string;
  requiredPermissions?: PERMISSION_VALUE[];
  allowedRoles?: UserRole[];
  disallowedRoles?: UserRole[];
}[] = [
  {
    route: "/itkan-dashboard",
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  // student permissions

  // teacher permissions
  {
    route: "/itkan-dashboard/question_bank",
    requiredPermissions: [PermissionKeys.ACADEMIC_QUESTION_BANK_VIEW],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/exam_dashboard",
    requiredPermissions: [PermissionKeys.ACADEMIC_EXAMS_VIEW],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },

  // staff permissions
  {
    route: "/itkan-dashboard/branches",
    requiredPermissions: [PermissionKeys.SYSTEM_BRANCHES_VIEW],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/staff",
    requiredPermissions: [PermissionKeys.SYSTEM_STAFF_VIEW],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/students",
    requiredPermissions: [PermissionKeys.SYSTEM_STUDENTS_VIEW],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/parents",
    requiredPermissions: [PermissionKeys.SYSTEM_PARENTS_VIEW],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/roles",
    requiredPermissions: [PermissionKeys.SYSTEM_ROLES_VIEW],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/classes",
    requiredPermissions: [PermissionKeys.ACADEMIC_CLASSES_VIEW],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/teachers",
    requiredPermissions: [PermissionKeys.SYSTEM_TEACHERS_VIEW],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/attendance",
    requiredPermissions: [PermissionKeys.STAFF_ATTENDANCE_CHECKIN],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/attendance-management",
    requiredPermissions: [PermissionKeys.STAFF_ATTENDANCE_VIEW],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/attendance/calendars",
    requiredPermissions: [PermissionKeys.STAFF_ATTENDANCE_CALENDAR_MANAGE],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/attendance/work-schedules",
    requiredPermissions: [PermissionKeys.STAFF_ATTENDANCE_CALENDAR_MANAGE],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/curriculum",
    requiredPermissions: [PermissionKeys.ACADEMIC_CURRICULUM_VIEW],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/subjects",
    requiredPermissions: [PermissionKeys.ACADEMIC_EDUCATIONAL_CONTENT_VIEW],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/contracts",
    requiredPermissions: [PermissionKeys.STAFF_CONTRACTS_VIEW],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
  {
    route: "/itkan-dashboard/payroll-cycles",
    requiredPermissions: [PermissionKeys.PAYROLL_CYCLES_VIEW],
    disallowedRoles: [UserRole.PARENT, UserRole.STUDENT],
  },
];
