import { UserRole } from "@/types/Roles";

export const getHomePath = (role: UserRole): string => {
  if (role === UserRole.STUDENT) return "/";
  if (role === UserRole.GENERAL_MANAGER) return "/admin/branches";
  else return "/";
};
