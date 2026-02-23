import { PermissionKeys } from "./permissions";

export const dashboardRouting = [
  // student permissions

  // teacher permissions
  {
    route: "/itkan-dashboard/question_bank",
    permission: PermissionKeys.ACADEMIC_QUESTION_BANK_VIEW,
  },
  {
    route: "/itkan-dashboard/exam_dashboard",
    permission: PermissionKeys.ACADEMIC_EXAMS_VIEW,
  },

  // staff permissions
  {
    route: "/itkan-dashboard/branches",
    permission: PermissionKeys.SYSTEM_BRANCHES_VIEW,
  },
  {
    route: "/itkan-dashboard/students",
    permission: PermissionKeys.SYSTEM_STUDENTS_VIEW,
  },
  {
    route: "/itkan-dashboard/parents",
    permission: PermissionKeys.SYSTEM_PARENTS_VIEW,
  },
  {
    route: "/itkan-dashboard/roles",
    permission: PermissionKeys.SYSTEM_ROLES_VIEW,
  },
  {
    route: "/itkan-dashboard/classes",
    permission: PermissionKeys.ACADEMIC_CLASSES_VIEW,
  },
  {
    route: "/itkan-dashboard/teachers",
    permission: PermissionKeys.SYSTEM_TEACHERS_VIEW,
  },
  {
    route: "/itkan-dashboard/attendance",
    permission: PermissionKeys.STAFF_ATTENDANCE_CHECKIN,
  },
  {
    route: "/itkan-dashboard/attendance-management",
    permission: PermissionKeys.STAFF_ATTENDANCE_VIEW,
  },
  {
    route: "/itkan-dashboard/attendance/calendars",
    permission: PermissionKeys.STAFF_ATTENDANCE_CALENDAR_MANAGE,
  },
  {
    route: "/itkan-dashboard/attendance/work-schedules",
    permission: PermissionKeys.STAFF_ATTENDANCE_CALENDAR_MANAGE,
  },
];
