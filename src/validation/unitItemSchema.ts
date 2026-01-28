import { z } from "zod";

export const unitItemSchema = z.object({
  title: z.string().min(1, "الاسم مطلوب"),
  type: z.enum(["lesson", "video", "exam"]),
  content: z.string().min(1, "محتوى الدرس مطلوب"),
  unit_id: z.string().min(1, "الوحدة مطلوبة"),
});

export type UnitItemFormInput = z.input<typeof unitItemSchema>;
export type UnitItemFormData = z.output<typeof unitItemSchema>;
