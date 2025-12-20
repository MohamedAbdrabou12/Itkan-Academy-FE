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
  permissions: Permission[];
  branches: Branch[];
}

export interface Permission {
  id: number;
  code: string;
  description: string;
}

export interface Branch {
  id: number;
  name: string;
}

export interface JWTTokenDecodedContent {
  permissions: JWTPermission[];
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
  permissions: JWTPermission[];
}

export interface JWTPermission {
  id: string;
  code: string;
  description: string;
}
