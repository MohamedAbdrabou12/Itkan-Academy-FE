import { PermissionKeys } from "@/constants/Permissions";
import {
  BookA,
  BookmarkCheck,
  BriefcaseBusiness,
  LucideGraduationCap,
  UserRound,
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
    id: "staff",
    title: "المديرين",
    icon: BriefcaseBusiness,
    url: "/itkan-dashboard/staff",
    permission: PermissionKeys.SYSTEM_STAFF_VIEW,
  },
  {
    id: "students",
    title: "الطلاب",
    icon: LucideGraduationCap,
    url: "/itkan-dashboard/students",
    permission: PermissionKeys.SYSTEM_STUDENTS_VIEW,
  },
  {
    id: "classes",
    title: "الفصول",
    icon: BookmarkCheck,
    url: "/itkan-dashboard/classes",
    permission: PermissionKeys.SYSTEM_TEACHER_PERMISSIONS_VIEW,
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
