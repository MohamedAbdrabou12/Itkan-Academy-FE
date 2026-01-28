enum UnitItemTypes {
  LESSON = "lesson",
  VIDEO = "video",
  EXAM = "exam",
}

export interface UnitItems {
  id: number;
  title: string;
  type: UnitItemTypes;
  content: string;
  unit_id: number;
}
