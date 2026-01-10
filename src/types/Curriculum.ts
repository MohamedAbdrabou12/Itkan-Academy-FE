export interface Curriculum {
  id: number;
  name: string;
  description: string;
  academic_year: string;
  is_active: boolean;
  [key: string]: unknown; // index signature
}
