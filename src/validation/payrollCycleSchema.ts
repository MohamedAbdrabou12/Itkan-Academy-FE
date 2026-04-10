import { PayrollCycleStatus } from "@/types/PayrollCycle";
import { z } from "zod";

export const payrollCycleGenerateSchema = z.object({
  month: z.string("الشهر مطلوب").min(1, "الشهر مطلوب"),
  year: z.string("السنة مطلوبة").min(1, "السنة مطلوبة"),
});

export const payrollCycleEditSchema = z.object({
  status: z.enum(PayrollCycleStatus),
});

export type PayrollCycleGenerateFormData = z.infer<
  typeof payrollCycleGenerateSchema
>;

export type PayrollCycleEditFormData = z.infer<typeof payrollCycleEditSchema>;
