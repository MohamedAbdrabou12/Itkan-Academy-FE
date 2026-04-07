export enum PaymentStatus {
  UNPAID = "unpaid",
  PAID = "paid",
}

export interface PayrollRecordDetails {
  id: number;
  cycle_year: number;
  cycle_month: number;
  employee_name: string;
  role_name_ar: string;
  base_salary: string;
  allowance: string;
  bonuses: string;
  deductions: string;
  status: PaymentStatus;

  [key: string]: unknown;
}

export interface PayrollRecordsResponse {
  items_total: string;
  page_info: {
    items: PayrollRecordDetails[];
    total: number;
    page: number;
    size: number;
    pages: number;
  };
}
