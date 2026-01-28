export interface Subject {
  id: number;
  name: string;
  [key: string]: unknown;
}

export enum UnitItemType {
  LESSON = "lesson",
  EXAM = "exam",
  VIDEO = "video",
}

export interface UnitItem {
  id: number;
  title: string;
  type: UnitItemType;
  content: string;
  unit_id: number;
  [key: string]: unknown;
}

export interface Unit {
  id: number;
  title: string;
  description: string;
  subject_id: number;
  curriculum_id: number;
  [key: string]: unknown;
}

export type DetailedUnit = Unit & {
  items: UnitItem[];
  subject_name: string;
  curriculum_name: string;
};

export type DetailedSubject = Subject & {
  units: DetailedUnit[];
};
