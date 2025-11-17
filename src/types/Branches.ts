export enum BranchStatus {
  ACTIVE = "active",
  DEACTIVE = "deactive",
}

export interface BranchDetails {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: BranchStatus;
  created_at: string;
  [key: string]: unknown; // index signature
}

export interface BranchesResponse {
  items: BranchDetails[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface JWTBranch {
  id: string;
  name: string;
}
