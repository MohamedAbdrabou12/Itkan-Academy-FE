import { z } from "zod";

export const curriculumSchema = z.object({
  name: z.string().min(1, "اسم المستوى التعليمى مطلوب"),
  description: z.string().default(""),
  academic_year: z.string().min(1, "السنة الأكاديمية مطلوبة"),
  is_active: z
    .preprocess((val) => {
      if (typeof val === "boolean") return val;
      if (val === "false") return false;
      if (val === "true") return true;
      return Boolean(val);
    }, z.boolean())
    .default(true),
});

export type CurriculumFormInput = z.input<typeof curriculumSchema>;
export type CurriculumFormData = z.output<typeof curriculumSchema>;
