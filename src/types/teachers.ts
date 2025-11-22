export type GetTeachersResponse = {
  items: Teacher[];
  total: number;
  page: number;
  size: number;
  pages: number;
};

export interface Teacher {
  full_name: string;
  email: string;
  phone: string;
  branch_ids: string[];
  id: number;
  role_id: number;
  role_name: string;
  role_name_ar: string;
  branch_name: string;
  last_login: string;
  created_at: string;
  updated_at: string;
  status: string;
  branches: Branch[];
  qualification: string;
  specialization: string;
  hire_date: string;
  employment_type: string;
  class_ids: string[];
  [key: string]: unknown; // index signature
}

export interface Branch {
  id: number;
  name: string;
}
