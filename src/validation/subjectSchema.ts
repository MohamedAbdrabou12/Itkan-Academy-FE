import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string().min(1, "اسم المادة مطلوب"),
});

export type SubjectFormInput = z.input<typeof subjectSchema>;
export type SubjectFormData = z.output<typeof subjectSchema>;
