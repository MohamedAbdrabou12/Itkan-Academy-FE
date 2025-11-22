import { z } from "zod";

export const teacherSchema = z.object({
  full_name: z.string("اسم المدرس مطلوب").min(1, "الاسم مطلوب"),
  email: z
    .email("البريد الإلكتروني غير صالح")
    .min(1, "البريد الإلكتروني مطلوب"),
  // the phone rejex "^\+?\d{10,15}$"
  phone: z
    .string()
    .min(1, "الهاتف مطلوب")
    .regex(/^\+?\d{10,15}$/, {
      message: "ادخل رقم هاتف صحيح",
    })
    .optional(),
  branch_ids: z
    .array(z.string(), "الفرع مطلوب")
    .min(1, "الفرع مطلوب")
    .default([]),
  class_ids: z.array(z.string()).optional().default([]),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;
