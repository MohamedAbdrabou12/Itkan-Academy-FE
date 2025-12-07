import type { StudentDetails } from "@/types/Students";

export enum RelationshipType {
  FATHER = "father",
  MOTHER = "mother",
  GUARDIAN = "guardian",
}

export enum ParentStatus {
  PENDING = "pending",
  ACTIVE = "active",
  REJECTED = "rejected",
  DEACTIVE = "deactive",
}

export interface ParentUser {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  role_id?: number;
  role_name?: string;
  role_name_ar?: string | null;
  branch_name?: string | null;
  last_login?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  status?: string;
  branch_ids?: number[];
  branches?: { id: number; name: string }[];
}

export interface ParentDetails {
  id: number;
  occupation?: string | null;
  address?: string | null;
  relationship_type: RelationshipType;
  user: ParentUser;
  children?: StudentDetails[];
  status: ParentStatus;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
}

export interface ParentChildInfo {
  student_id: number;
  full_name: string;
  email?: string | null;
}

export interface ParentsResponse {
  items: ParentDetails[];
  total: number;
  page: number;
  size: number;
  pages: number;
}