import type { JWTBranch } from "./Branches";
import type { UserRole } from "./Roles";

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  role_name: UserRole;
  status: string;
}

export interface JWTTokenDecodedContent {
  permissions: Permission[];
  branches: JWTBranch[];
}

export interface PermissionModuleResponse {
  moduleGroups: ModuleGroup[];
  total: number;
}

export interface ModuleGroup {
  groupName: string;
  modules: Module[];
}

export interface Module {
  moduleName: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  code: string;
  description: string;
}
