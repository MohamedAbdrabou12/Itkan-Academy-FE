import { z } from "zod";

export const classSchema = z.object({
  name: z.string("اسم الفصل مطلوب").min(1, "الاسم مطلوب"),
  branch_id: z.string().min(1, "الفرع مطلوب").default(""),

  schedule: z
    .array(
      z.object({
        day: z.string("اليوم مطلوب").min(1, "اليوم مطلوب"),
        time: z.string("وقت البدء مطلوب").min(1, "وقت البدء مطلوب"),
      }),
    )
    .min(1, "يجب إضافة جدول زمني واحد على الأقل"),
  evaluation_config: z.array(z.string()).optional().default([]),
});

export type ClassFormData = z.infer<typeof classSchema>;
