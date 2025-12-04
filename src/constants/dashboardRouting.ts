import { PermissionKeys } from "./permissions";

export const dashboardRouting = [
  // student permissions

  // teacher permissions

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
    route: "/itkan-dashboard/roles",
    permission: PermissionKeys.SYSTEM_ROLES_VIEW,
  },
  {
    route: "/itkan-dashboard/classes",
    permission: PermissionKeys.ACADEMIC_CLASSES_VIEW,
  },
  {
    route: "/itkan-dashboard/teachers",
    permission: PermissionKeys.SYSTEM_TEACHER_PERMISSIONS_VIEW,
  },
];
