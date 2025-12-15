import { ExamStatus } from "@/types/exams";

export function getExamStatus(status: ExamStatus) {
  if (status == ExamStatus.DRAFT) {
    return "غير مؤكد";
  } else if (status == ExamStatus.PUBLISHED) {
    return "تم النشر";
  } else if (status == ExamStatus.CLOSED) {
    return "مغلق";
  }
}
