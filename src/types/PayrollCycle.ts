export enum PayrollCycleStatus {
  DRAFT = "draft",
  APPROVED = "approved",
  LOCKED = "locked",
  PAID = "paid",
}

export interface PayrollCycleDetails {
  id: number;
  branch_name: string;
  month: number;
  year: number;
  status: PayrollCycleStatus;
  created_by_name: string;
  approved_by_name?: string;
  locked_by_name?: string;

  [key: string]: unknown;
}

export interface PayrollCyclesResponse {
  items: PayrollCycleDetails[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
