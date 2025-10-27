import { UserRole } from "@/types/User";

export const getHomePath = (role: UserRole): string => {
  if (role === UserRole.STUDENT) return "/";
  else return "/";
};
