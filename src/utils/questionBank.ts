import { QuestionKeys } from "@/types/questionBank";

export const questionTypes = [
  {
    label: "اختيار من متعدد",
    value: "mcq",
  },
  {
    label: "إجابة قصيرة",
    value: "short_answer",
  },
  {
    label: "مقالي",
    value: "essay",
  },
  {
    label: "صح/خطأ",
    value: "true_false",
  },
];

export const questionDifficulties = [
  {
    label: "سهل",
    value: "easy",
  },
  {
    label: "متوسط",
    value: "medium",
  },
  {
    label: "صعب",
    value: "hard",
  },
];

export const questionKeys: QuestionKeys[] = [
  QuestionKeys.A,
  QuestionKeys.B,
  QuestionKeys.C,
  QuestionKeys.D,
  QuestionKeys.E,
  QuestionKeys.F,
];
