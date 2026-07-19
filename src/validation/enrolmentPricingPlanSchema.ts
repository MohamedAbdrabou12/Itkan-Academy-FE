import { z } from "zod";

export const enrolmentPricingPlanSchema = z.object({
  curriculum_id: z.string(),
  branch_id: z.string().optional(),
  name: z.string().min(1, "الاسم مطلوب"),
  monthly_price: z.string().min(1, "المبلغ الشهرى مطلوب"),
  start_month: z.string(),
  end_month: z.string(),
});

export type EnrolmentPricingPlanFormInput = z.input<
  typeof enrolmentPricingPlanSchema
>;
export type EnrolmentPricingPlanFormData = z.output<
  typeof enrolmentPricingPlanSchema
>;
