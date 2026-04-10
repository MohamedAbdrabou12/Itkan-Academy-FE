import { z } from "zod";

export const payrollRecordSchema = z.object({
  bonuses: z.string("الزيادات مطلوبة").min(1, "الزيادات مطلوبة"),
  deductions: z.string("الخصومات مطلوبة").min(1, "الخصومات مطلوبة"),
});

export type PayrollRecordFormData = z.infer<typeof payrollRecordSchema>;
