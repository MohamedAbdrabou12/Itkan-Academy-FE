export interface ClassRead {
  id: number;
  branch_id: number;
  name: string;
  schedule?: Record<string, unknown>;
  status: "active" | "deactive";
  created_at: string;
  updated_at: string;
}
