import { z } from "zod";

export const branchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .nullable()
    .optional()
    .or(z.literal("")),
  phone: z.string().nullable().optional().or(z.literal("")),
  address: z.string().nullable().optional().or(z.literal("")),
  status: z.enum(["active", "deactive"]),
});

export type BranchFormData = z.infer<typeof branchSchema>;
