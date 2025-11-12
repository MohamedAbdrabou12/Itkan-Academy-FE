import { z } from "zod";

export const branchSchema = z.object({
  name: z.string().min(1, "اسم الفرع مطلوب"),
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .min(1, "البريد الإلكتروني مطلوب"),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  status: z.enum(["active", "deactive"]).default("active"),
});

export type BranchFormData = z.infer<typeof branchSchema>;
