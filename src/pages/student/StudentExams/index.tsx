import { useExamStart } from "@/hooks/Exams/useExamStart";
import {
  useGetAvailableExams,
  type AvailableExam,
} from "@/hooks/Exams/useGetAvailableExams";
import { formatArabicDatetime } from "@/utils/formatDate";
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Loader2,
  Users,
} from "lucide-react";

const StudentExamsPage = () => {
  const { data: availableExams, isPending } = useGetAvailableExams();
  const examStart = useExamStart();

  const getTimeRemaining = (endTime: string) => {
    const now: Date = new Date();
    const end: Date = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "انتهى الوقت";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} يوم و ${hours} ساعة`;
    if (hours > 0) return `${hours} ساعة`;

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes} دقيقة`;
  };

  const getExamAvailability = (exam: AvailableExam) => {
    const now = new Date();
    const start = new Date(exam.start_time);
    let attemptEndTime = null;
    const end = new Date(exam.end_time);

    if (exam.user_start_time) {
      const userStartTime = new Date(exam.user_start_time);
      const examDuration = exam.duration_minutes * 60 * 1000;
      attemptEndTime = new Date(userStartTime.getTime() + examDuration);
    }
    if (attemptEndTime && now < attemptEndTime && !exam.attempted) {
      return "continue";
    }

    if ((attemptEndTime && now > attemptEndTime) || exam.attempted) {
      return "completed";
    }

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "active";
    return "end";
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-emerald-600" />
          <p className="text-lg text-emerald-700">جاري تحميل الامتحانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-emerald-50 to-blue-50 p-6  pt-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-emerald-900 md:text-4xl">
            الامتحانات المتاحة
          </h1>
        </header>

        {/* Exams Grid */}
        {availableExams.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-emerald-300" />
            <h3 className="mb-2 text-xl font-semibold text-emerald-800">
              لا توجد امتحانات
            </h3>
            <p className="text-emerald-600">
              لا توجد امتحانات متاحة حالياً. يرجى التحقق لاحقاً.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableExams.map((exam) => {
              const availability = getExamAvailability(exam);
              const isActive = availability === "active";
              const isUpcoming = availability === "upcoming";
              const isEnded = availability === "end";
              const isContinue = availability === "continue";
              const isCompleted = availability === "completed";

              return (
                <div
                  key={exam.id}
                  className={`card bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl ${
                    isActive ? "ring-2 ring-emerald-500" : ""
                  }`}
                >
                  <div className="card-body">
                    {/* Exam Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h2 className="card-title text-lg font-bold text-emerald-900">
                          {exam.title}
                        </h2>
                        <div className="badge badge-accent mt-1">
                          {exam.class_name}
                        </div>
                      </div>
                      {/* {exam.attempted && (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      )} */}
                    </div>

                    {/* Exam Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>المعلم: {exam.creator_name}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          يبدأ:{" "}
                          {formatArabicDatetime(new Date(exam.start_time))}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          ينتهي: {formatArabicDatetime(new Date(exam.end_time))}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>المدة: {exam.duration_minutes} دقيقة</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>عدد الأسئلة: {exam.num_of_questions}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="h-4 w-4" />
                        <span>الدرجة الكلية: {exam.total_marks}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4">
                      {isActive && (
                        <div className="badge badge-success badge-lg gap-2">
                          <Clock className="h-3 w-3" />
                          نشط - متبقي: {getTimeRemaining(exam.end_time)}
                        </div>
                      )}
                      {isUpcoming && (
                        <div className="badge badge-warning badge-lg gap-2">
                          <Calendar className="h-3 w-3" />
                          قادم
                        </div>
                      )}
                      {isEnded && (
                        <div className="badge badge-error badge-lg gap-2">
                          <Calendar className="h-3 w-3" />
                          منتهي
                        </div>
                      )}
                      {isCompleted && (
                        <div className="badge badge-success badge-lg gap-2">
                          <FileText className="h-3 w-3" />
                          تم التسليم
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="card-actions mt-6">
                      {!exam.attempted && isActive && (
                        <button
                          onClick={() => {
                            examStart.mutate(`${exam.id}`);
                          }}
                          className="btn btn-primary btn-block gap-2 bg-emerald-600 text-white"
                        >
                          <BookOpen className="h-5 w-5" />
                          ابدأ الامتحان الآن
                        </button>
                      )}

                      {!exam.attempted && isContinue && (
                        <button
                          onClick={() => {
                            examStart.mutate(`${exam.id}`);
                          }}
                          className="btn btn-primary btn-block gap-2 bg-emerald-600 text-white"
                        >
                          <BookOpen className="h-5 w-5" />
                          اكمل الامتحان
                        </button>
                      )}

                      {!exam.attempted && isUpcoming && (
                        <button
                          className="btn btn-outline btn-primary btn-block"
                          disabled
                        >
                          <Clock className="h-5 w-5" />
                          سيصبح متاحاً قريباً
                        </button>
                      )}

                      {(exam.attempted || isCompleted) && (
                        <button className="btn btn-error btn-block" disabled>
                          تم التسليم
                        </button>
                      )}

                      {isEnded && (
                        <button className="btn btn-success btn-block" disabled>
                          تم اغلاق الامتحان
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentExamsPage;
