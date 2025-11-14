import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  name_ar: z.string().min(1, "Arabic name is required"),
  description: z.string().optional().or(z.literal("")),
  description_ar: z.string().optional().or(z.literal("")),
});

export type RoleFormData = z.infer<typeof roleSchema>;
