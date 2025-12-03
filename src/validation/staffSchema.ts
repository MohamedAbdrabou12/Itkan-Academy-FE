import { z } from "zod";

// Schema for form validation (uses strings)
export const userRolesFormSchema = z.object({
  role_id: z.string().min(1, "الدور مطلوبة"),
});

export type UserRolesFormData = z.infer<typeof userRolesFormSchema>;

// Schema for API data (uses numbers)
export const userRolesApiSchema = z.object({
  user_id: z.number().min(1, "User ID is required"),
  role_id: z.number().min(1, "Role ID is required"),
});

export type UserRolesApiData = z.infer<typeof userRolesApiSchema>;

export const staffSchema = z.object({
  full_name: z.string("اسم المدرس مطلوب").min(1, "الاسم مطلوب"),
  email: z
    .email("البريد الإلكتروني غير صالح")
    .min(1, "البريد الإلكتروني مطلوب"),
  phone: z
    .string()
    .min(1, "الهاتف مطلوب")
    .regex(/^\+?\d{10,15}$/, {
      message: "ادخل رقم هاتف صحيح",
    })
    .optional(),
  role_id: z.string(),
  branch_ids: z
    .array(z.string(), "الفرع مطلوب")
    .min(1, "الفرع مطلوب")
    .default([])
    .optional(),
  status: z
    .enum(["pending", "active", "rejected", "deactive"])
    .default("active"),
});

export type StaffFormData = z.infer<typeof staffSchema>;
