import type { UserRole } from "./Roles";

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role_name: UserRole;
  status: string;
}

export interface JWTTokenDecodedContent {
  permissions: tokenPermission[];
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
  permissions: tokenPermission[];
}

export interface tokenPermission {
  id: string;
  code: string;
  description: string;
}
