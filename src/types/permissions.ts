// export const PermissionKeys = {
//   STAFFADD: "settings.staff.add",
// } as const;

export interface Permission {
  id: number;
  code: string;
  name: string;
  name_ar: string;
  description?: string;
  description_ar?: string;
  created_at: string;
  updated_at: string;
}
export interface RolePermission {
  role_id: number;
  permission_id: number;
  permission?: Permission; // Joined permission data
}
