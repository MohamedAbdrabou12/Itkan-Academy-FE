import { z } from "zod";
const nationalIdSchema = z
  .string()
  .regex(/^\d{14}$/, "الرقم القومي يجب أن يكون 14 رقم");

const phoneSchema = z
  .string()
  .regex(/^\+?\d{10,15}$/, "رقم الهاتف غير صحيح");

const emailSchema = z
  .string()
  .email("البريد الإلكتروني غير صحيح")
  .nullable()
  .optional()
  .transform((v) => (v === "" ? null : v));
//base schema
export const studentBaseSchema = z.object({
  full_name: z.string().min(1, "اسم الطالب مطلوب"),
  national_id: nationalIdSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  branch_ids: z.array(z.number()).min(1, "يجب اختيار فرع واحد").max(1),
  class_ids: z.array(z.number()).optional().default([]),
  status: z
    .enum(["pending", "active", "rejected", "deactive"])
    .default("active"),
});
// create schema
export const studentCreateSchema = studentBaseSchema.extend({
  admission_date: z.string().min(1, "تاريخ القبول مطلوب"),
  password: z.string().min(6, "كلمة المرور يجب ألا تقل عن 6 أحرف"),
  confirm_password: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.password === data.confirm_password, {
  message: "كلمتا المرور غير متطابقتين",
  path: ["confirm_password"],
});

 // Update schema
export const studentUpdateSchema = z.object({
  student_id: z.number().optional(),
  full_name: z.string().min(1).optional(),
  national_id: nationalIdSchema.optional(),
  email: emailSchema,
  phone: phoneSchema.optional(),
  branch_ids: z.array(z.number()).min(1).max(1).optional(),
  class_ids: z.array(z.number()).optional(),
  admission_date: z.string().optional(),
  curriculum_progress: z.any().optional(),
  status: z.enum(["pending", "active", "rejected", "deactive"]).optional(),
  password: z.string().min(6).optional(),
});

export type StudentCreateFormData = z.infer<typeof studentCreateSchema>;
export type StudentUpdateFormData = z.infer<typeof studentUpdateSchema>;