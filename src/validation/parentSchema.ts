// src/validation/parentSchema.ts
import { z } from "zod";
import { RelationshipType, ParentStatus } from "@/types/Parents";

export const parentCreateSchema = z.object({
  full_name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        return /^\+?\d{10,15}$/.test(val);
      },
      { message: "رقم الهاتف غير صحيح" }
    ),
  occupation: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  relationship_type: z.nativeEnum(RelationshipType),
  password: z.string().optional().nullable(),
  status: z
    .nativeEnum(ParentStatus)
    .optional()
    .default(ParentStatus.ACTIVE),
});

export const parentUpdateSchema = parentCreateSchema.partial();
export type ParentCreateForm = z.infer<typeof parentCreateSchema>;
export type ParentUpdateForm = z.infer<typeof parentUpdateSchema>;