import { z } from "zod";

export const unitSchema = z.object({
  title: z.string().min(1, "اسم الوحدة مطلوب"),
  description: z.string(),
  curriculum_id: z.string().min(1, "المستوى مطلوب"),
  subject_id: z.string().min(1, "المادة الدراسية مطلوبة")
});

export type UnitFormInput = z.input<typeof unitSchema>;
export type UnitFormData = z.output<typeof unitSchema>;
