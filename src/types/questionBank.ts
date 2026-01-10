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
  type: QuestionTypes;
  options?: Option[];
  correct_answer?: QuestionKeys;
  id: number;
  created_at: string;
}
export enum QuestionTypes {
  MCQ = "mcq",
  SHORT_ANSWER = "short_answer",
  ESSAY = "essay",
  TRUE_FALSE = "true_false",
}
export interface Option {
  key: QuestionKeys;
  option: string;
}
