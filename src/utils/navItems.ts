import { PermissionKeys } from "@/constants/Permissions";
import {
  BookA,
  BookmarkCheck,
  LucideGraduationCap,
  UserRound,
  Users,
  Warehouse,
} from "lucide-react";

export const navLinks = [
  {
    id: "branches",
    title: "الفروع",
    icon: Warehouse,
    url: "/itkan-dashboard/branches",
    permission: PermissionKeys.SYSTEM_BRANCHES_VIEW,
  },
  {
    id: "roles",
    title: "الادوار الوظيفية",
    icon: BookA,
    url: "/itkan-dashboard/roles",
    permission: PermissionKeys.SYSTEM_ROLES_VIEW,
  },
  {
    id: "users",
    title: "المستخدمين",
    icon: Users,
    url: "/itkan-dashboard/users",
    permission: PermissionKeys.SYSTEM_USERS_VIEW,
  },
  {
    id: "students",
    title: "الطلاب",
    icon: LucideGraduationCap,
    url: "/itkan-dashboard/students",
    permission: PermissionKeys.SYSTEM_STUDENTS_VIEW,
  },
  {
    id: "teachers",
    title: "المعلمين",
    icon: UserRound,
    url: "/itkan-dashboard/teachers",
    permission: PermissionKeys.SYSTEM_TEACHER_PERMISSIONS_VIEW,
  },
  {
    id: "attendance_and_evaluations",
    title: "الحضور و التقييمات",
    icon: BookmarkCheck,
    url: "/itkan-dashboard/attendance-and-evaluations",
    permission: PermissionKeys.EVALUATION_STUDENT_VIEW,
  },
];
