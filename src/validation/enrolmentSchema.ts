import { z } from "zod";

export const enrolmentSchema = z.object({
  pricing_plan_id: z.string().min(1, "خطة الدفع مطلوبة"),
  student_id: z.string().min(1, "الطالب مطلوب"),
  months_paid: z.string(),
});

export type EnrolmentFormInput = z.input<typeof enrolmentSchema>;
export type EnrolmentFormData = z.output<typeof enrolmentSchema>;
