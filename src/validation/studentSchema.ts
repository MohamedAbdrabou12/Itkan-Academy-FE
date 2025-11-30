import { z } from "zod";
export const studentSchema = z.object({
  full_name: z.string("اسم الطالب مطلوب").min(1, "اسم الطالب مطلوب"),
  email: z.string("البريد الإلكتروني مطلوب").email("البريد الإلكتروني غير صحيح"),
  phone: z.string("رقم الهاتف مطلوب").min(1, "رقم الهاتف مطلوب").regex(/^\+?\d{10,15}$/, "رقم الهاتف غير صحيح"),
  branch_ids: z.array(z.number(), "يجب اختيار الفرع").min(1, "يجب اختيار فرع واحد فقط").max(1, "يجب اختيار فرع واحد فقط"),
  class_ids: z.array(z.number()).optional().nullable(),
  admission_date: z.string("تاريخ القبول مطلوب").min(1, "تاريخ القبول مطلوب"),
  curriculum_progress: z.any().optional(),
  status: z.enum(["pending", "active", "rejected", "deactive"]).default("pending"),
});
export type StudentFormData = z.infer<typeof studentSchema>;