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
        return /^01[0125][0-9]{8}$/.test(val);
      },
      { message: "رقم الهاتف غير صحيح، يجب أن يكون 11 رقم ويبدأ بـ 01" }
    ),
  occupation: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  relationship_type: z.nativeEnum(RelationshipType),
  status: z
    .nativeEnum(ParentStatus)
    .optional()
    .default(ParentStatus.ACTIVE),
});

export const parentUpdateSchema = parentCreateSchema.partial();
export type ParentCreateForm = z.infer<typeof parentCreateSchema>;
export type ParentUpdateForm = z.infer<typeof parentUpdateSchema>;