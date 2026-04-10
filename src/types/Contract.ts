export interface ContractDetails {
  id: number;
  employee_id: number;
  employee_full_name: string;
  role_name_ar: string;
  base_salary: string;
  allowance: string;
  effective_from: string;
  effective_to: string;
  created_at: string;
  updated_at: string;

  [key: string]: unknown;
}

export interface ContractsResponse {
  items: ContractDetails[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
