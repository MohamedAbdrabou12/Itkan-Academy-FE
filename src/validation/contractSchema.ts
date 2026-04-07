import { z } from "zod";

export const contractSchema = z.object({
  employee_id: z.string("العميل مطلوب").min(1, "العميل مطلوب"),
  base_salary: z.string("المرتب الأساسى مطلوب").min(1, "المرتب الأساسى مطلوب"),
  allowance: z.string("البدلات مطلوبة").min(1, "البدلات مطلوبة"),

  effective_from: z
    .string("بداية مدة العقد مطلوبة")
    .min(1, "بداية مدة العقد مطلوبة"),

  effective_to: z
    .string("نهاية مدة العقد مطلوبة")
    .min(1, "نهاية مدة العقد مطلوبة"),
});

export type ContractFormData = z.infer<typeof contractSchema>;
