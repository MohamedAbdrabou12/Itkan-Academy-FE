export enum QuestionKeys {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
}

export type QuestionBankResponse = QuestionBank[];

export interface QuestionBank {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  type: "mcq" | "short_answer" | "essay" | "true_false";
  options?: Option[];
  correct_answer?: QuestionKeys;
  id: number;
  created_at: string;
}

export interface Option {
  key: QuestionKeys;
  option: string;
}
