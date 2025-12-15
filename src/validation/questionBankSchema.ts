import z from "zod";

const optionSchema = z.object({
  option: z.string("الاختيار مطلوب").min(1, "الاختيار مطلوب"),
  key: z.string("الرمز مطلوب").optional(),
});
export const questionBankSchema = z.object({
  title: z.string("العنوان مطلوب").min(1, "العنوان مطلوب"),
  difficulty: z.enum(["easy", "medium", "hard"]).default("easy"),
  type: z.enum(["mcq", "short_answer", "essay", "true_false"]),
  options: z.array(optionSchema).optional(),
  correct_answer: z
    .string("الإجابة الصحيحة مطلوبة")
    .min(1, "الإجابة الصحيحة مطلوبة")
    .optional(),
});

export type QuestionBankFormData = z.infer<typeof questionBankSchema>;
export type OptionFormData = z.infer<typeof optionSchema>;
