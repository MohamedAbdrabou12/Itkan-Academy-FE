export enum BranchStatus {
  ACTIVE = "active",
  DEACTIVE = "deactive",
}

export interface BranchDetails {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: BranchStatus;
  created_at: string;
  [key: string]: unknown; // index signature
}

export interface BranchesResponse {
  branches: BranchDetails[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
