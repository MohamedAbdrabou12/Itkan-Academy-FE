import { BookA, LucideGraduationCap, UserCheck, Warehouse } from "lucide-react";

export const navLinks = [
  {
    id: "branches",
    title: "الفروع",
    icon: Warehouse,
    url: "/itkan-dashboard/branches",
  },
  {
    id: "roles",
    title: "الادوار الوظيفية",
    icon: BookA,
    url: "/itkan-dashboard/roles",
  },
  {
    id: "attendance_and_evaluations",
    title: "الحضور و التقييمات",
    icon: UserCheck,
    url: "/itkan-dashboard/attendance-and-evaluations",
  },
  {
    id: "students",
    title: "الطلاب",
    icon: LucideGraduationCap,
    url: "/itkan-dashboard/students",
  },
];
