import { z } from "zod";

export const examQuestionSchema = z.object({
  question_id: z.string("بجب اختيار سؤال").min(1, "بجب اختيار سؤال"),
  marks: z.coerce
    .number("برجاء وضع درجة السؤال")
    .min(1, "برجاء وضع درجة السؤال"),
});

export const examSchema = z.object({
  title: z
    .string("يجب إدخال عنوان الامتحان")
    .min(1, "يجب إدخال عنوان الامتحان"),
  duration_minutes: z.coerce
    .number("وقت الامتحان يجب ان يكون على الاقل دقيقة واحدة")
    .min(1, "وقت الامتحان يجب ان يكون على الاقل دقيقة واحدة"),
  start_time: z
    .string("يجب ادخال وقت  بداية الامتحان")
    .min(1, "يجب ادخال وقت  بداية الامتحان"),
  end_time: z
    .string("يجب ادخال وقت  نهاية الامتحان")
    .min(1, "يجب ادخال وقت  نهاية الامتحان"),
  class_id: z.string("يجب اختيار الفصل").min(1, "يجب اختيار الفصل"),
  questions: z.array(examQuestionSchema),
});
