import { UserRole } from "@/types/Roles";

export const getHomePath = (role: UserRole): string => {
  if (role === UserRole.STUDENT) return "/";
  else return "/itkan-dashboard";
};
