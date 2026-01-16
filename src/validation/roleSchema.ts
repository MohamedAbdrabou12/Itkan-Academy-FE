import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "اسم الدور مطلوب"),
  name_ar: z.string().min(1, "الاسم العربى للدور مطلوب"),
  description: z.string().optional().or(z.literal("")),
  description_ar: z.string().optional().or(z.literal("")),
});

export type RoleFormData = z.infer<typeof roleSchema>;
