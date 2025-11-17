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
