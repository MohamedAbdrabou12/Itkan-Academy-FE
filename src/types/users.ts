export interface StaffDetails {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role_id: number;
  role_name: string;
  role_name_ar: string;
  branch_ids: number[] | null;
  branch_name: string | null;
  branches: { id: number; name: string }[] | null;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  status: "active" | "deactive";
  [key: string]: unknown; // index signature
}

export interface UsersResponse {
  items: StaffDetails[];
  page: number;
  size: number;
  total: number;
  pages: number;
}
