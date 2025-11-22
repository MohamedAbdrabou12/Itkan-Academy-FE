import { z } from "zod";

export const studentSchema = z.object({
  full_name: z.string().min(1, "اسم الطالب مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "رقم الهاتف غير صحيح")
    .nullable()
    .optional(),
  branch_ids: z.array(z.number()).length(1, "يجب اختيار فرع واحد فقط"),
  class_ids: z.array(z.number()).nullable().optional(),
  admission_date: z.string().nullable().optional(),
  curriculum_progress: z.any().optional(),
  status: z.enum(["pending", "active", "rejected", "deactive"]).default("pending"),
});

export type StudentFormData = z.infer<typeof studentSchema>;
