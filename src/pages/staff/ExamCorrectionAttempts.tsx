import { useExamGrade } from "@/hooks/Exams/useExamGrade";
import { useGetExamAttempt } from "@/hooks/Exams/useGetExamAttempt";
import { QuestionTypes } from "@/types/questionBank";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRound } from "lucide-react";
import { useEffect, type DetailedHTMLProps, type HTMLAttributes } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import * as z from "zod";

const StudentAnswersPage = () => {
  const { examId, attemptId } = useParams();
  const { data: attempt, isPending } = useGetExamAttempt(attemptId || "");

  const examGrade = useExamGrade(attemptId || "");

  const navigate = useNavigate();

  // Define validation schema
  const answerSchema = z.object({
    marks_obtained: z.number().min(0, "الدرجة لا يمكن أن تكون أقل من 0"),
    question_id: z.number(),
  });

  const formSchema = z.object({
    answers: z.array(answerSchema),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  // Calculate total score from form values
  const answers = useWatch({
    control,
    name: "answers",
    defaultValue: [],
  });

  const totalObtained = answers?.reduce(
    (sum, ans) => sum + ans.marks_obtained,
    0,
  );

  // Helper functions

  const getAnswerForQuestion = (questionId: string) => {
    const answer = attempt?.answers?.find(
      (ans) => ans.question_id == questionId,
    );
    return answer;
  };

  const getQuestionTypeLabel = (
    type: "mcq" | "short_answer" | "essay" | "true_false",
  ) => {
    const labels = {
      mcq: "اختيار متعدد",
      true_false: "صح أم خطأ",
      essay: "مقالي",
      short_answer: "إجابة قصيرة",
    };
    return labels[type] || type;
  };

  const getQuestionTypeColor = (type: QuestionTypes) => {
    const colors = {
      mcq: "badge-primary",
      true_false: "badge-secondary",
      essay: "badge-accent",
      short_answer: "badge-info",
    };
    return colors[type] || "badge-neutral";
  };

  useEffect(() => {
    if (attempt) {
      const examQuestions = attempt.exam.questions;
      const examAnswers = attempt.answers;
      const formAnswers = examQuestions.map((question) => {
        const question_id = question.id;
        const answer = examAnswers.find(
          (answer) => answer.question_id == `${question_id}`,
        );
        return {
          question_id,
          marks_obtained: answer?.marks_obtained || 0,
        };
      });

      setValue("answers", formAnswers);
    }
  }, [attempt]);

  const onSubmit = async (data: FormValues) => {
    const answers = data.answers;
    examGrade.mutate(answers);
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-gray-600">جاري تحميل إجابات الطالب...</p>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>لم يتم العثور على محاولة الإمتحان</span>
      </div>
    );
  }

  const totalPossible = attempt.exam.questions.reduce(
    (sum, q) => sum + q.marks,
    0,
  );
  const percentage =
    totalPossible > 0 ? ((totalObtained / totalPossible) * 100).toFixed(1) : 0;

  return (
    <div className="bg-base-100 min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-gray-800 md:text-3xl">
              تصحيح إجابات الطالب
            </h1>
            <p className="text-gray-600">
              الإمتحان: {attempt.exam.title} - رقم المحاولة: {attempt.id}
            </p>
          </div>
          <Link
            to={`/itkan-dashboard/exam-correction/${examId}`}
            className="btn btn-ghost"
          >
            ← العودة للقائمة
          </Link>
        </div>

        <div className="card bg-base-100 mb-6 border shadow">
          <div className="card-body p-4 md:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-success text-neutral-content flex h-12  w-12 items-center justify-center rounded-full">
                    <UserRound color="black" size={24} />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {attempt.student.full_name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {attempt.student.email}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">الحالة:</span>
                  <span
                    className={`badge ${attempt.status === "submitted" ? "badge-info" : "badge-success"}`}
                  >
                    {attempt.status === "submitted"
                      ? "تم التقديم"
                      : "تم التصحيح"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">وقت البدء:</span>
                  <span>
                    {new Date(attempt.start_time).toLocaleString("ar-EG")}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">وقت الإنتهاء:</span>
                  <span>
                    {new Date(attempt.end_time).toLocaleString("ar-EG")}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">عدد الأسئلة:</span>
                  <span>{attempt.exam.questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الدرجة الكلية:</span>
                  <span className="font-bold">
                    {totalObtained} / {totalPossible}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Questions List */}
        <div className="mb-8 space-y-6">
          {attempt.exam.questions.map((question, index) => {
            const answer = getAnswerForQuestion(`${question.id}`);
            const isCorrect =
              question.type === QuestionTypes.MCQ ||
              question.type === QuestionTypes.TRUE_FALSE
                ? answer?.selected_option === question.correct_answer
                : null;

            return (
              <div
                key={question.id}
                className="card bg-base-100 border-2 shadow-lg"
              >
                <div className="card-body">
                  {/* Question Header */}
                  <div className="mb-4 flex flex-col items-start justify-between gap-4 border-b pb-4 lg:flex-row lg:items-center">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          السؤال {index + 1}: {question.title}
                        </h3>
                        <span
                          className={`badge ${getQuestionTypeColor(question.type)}`}
                        >
                          {getQuestionTypeLabel(question.type)}
                        </span>
                        <span className="badge badge-outline">
                          الدرجة: {question.marks}
                        </span>
                        {(question.type === QuestionTypes.MCQ ||
                          question.type === QuestionTypes.TRUE_FALSE) && (
                          <span
                            className={`badge ${isCorrect ? "badge-success" : "badge-error"}`}
                          >
                            {isCorrect ? "صحيح" : "خطأ"}
                          </span>
                        )}
                      </div>

                      {/* Correct Answer Display */}
                      {(question.type === QuestionTypes.MCQ ||
                        question.type === QuestionTypes.TRUE_FALSE) &&
                        question.correct_answer && (
                          <div className="bg-base-200 mt-2 rounded p-2">
                            <span className="text-sm font-medium">
                              الإجابة الصحيحة:{" "}
                            </span>
                            <span className="text-success font-semibold">
                              {question.options?.find(
                                (opt) => opt.key === question.correct_answer,
                              )?.option || question.correct_answer}
                            </span>
                          </div>
                        )}

                      {/* Model Answer Display for Short Answer */}
                      {question.type === "short_answer" &&
                        question.correct_answer && (
                          <div className="bg-base-200 mt-2 rounded p-2">
                            <span className="text-sm font-medium">
                              الإجابة النموذجية:{" "}
                            </span>
                            <span className="text-success font-semibold">
                              {question.correct_answer}
                            </span>
                          </div>
                        )}
                    </div>

                    {/* Grading Input */}
                    <div className="w-full lg:w-auto">
                      <div className="flex flex-col gap-2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">
                              الدرجة المستحقة
                            </span>
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="join">
                              <Controller
                                name={`answers.${index}.marks_obtained`}
                                control={control}
                                rules={{
                                  required: "مطلوب",
                                  min: {
                                    value: 0,
                                    message: "الدرجة لا يمكن أن تكون أقل من 0",
                                  },
                                  max: {
                                    value: question.marks,
                                    message: `الدرجة لا يمكن أن تتجاوز ${question.marks}`,
                                  },
                                }}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="number"
                                    min="0"
                                    max={question.marks}
                                    className="input input-bordered join-item w-28 text-center"
                                    // disabled={submitting}
                                    value={field.value || 0}
                                    onChange={(e) =>
                                      field.onChange(
                                        Math.min(
                                          question.marks,
                                          parseInt(e.target.value),
                                        ),
                                      )
                                    }
                                  />
                                )}
                              />
                              <span className="join-item bg-base-200 flex items-center px-3">
                                / {question.marks}
                              </span>
                            </div>
                          </div>
                          {errors.answers?.[question.id]?.marks_obtained && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {
                                  errors.answers[question.id]?.marks_obtained
                                    ?.message
                                }
                              </span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question Content Based on Type */}
                  <div className="space-y-4">
                    {/* MCQ & True/False Options */}
                    {(question.type === QuestionTypes.MCQ ||
                      question.type === QuestionTypes.TRUE_FALSE) &&
                      question.options && (
                        <div>
                          <h4 className="mb-3 font-medium">الخيارات:</h4>
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {question.options.map((option) => {
                              const isSelected =
                                answer?.selected_option === option.key;
                              const isCorrectOption =
                                question.correct_answer === option.key;

                              return (
                                <div
                                  key={option.key}
                                  className={`rounded-lg border-2 p-3 transition-colors ${
                                    isCorrectOption
                                      ? "border-success bg-success/10"
                                      : isSelected
                                        ? "border-error bg-error/10"
                                        : "border-base-300"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={`badge ${
                                        isCorrectOption
                                          ? "badge-success"
                                          : isSelected
                                            ? "badge-error"
                                            : "badge-outline"
                                      }`}
                                    >
                                      {option.key}
                                    </span>
                                    <span
                                      className={`flex-1 ${
                                        isCorrectOption
                                          ? "text-success font-bold"
                                          : isSelected
                                            ? "text-error font-bold"
                                            : ""
                                      }`}
                                    >
                                      {option.option}
                                    </span>
                                    {isCorrectOption && (
                                      <span className="badge badge-success">
                                        الإجابة الصحيحة
                                      </span>
                                    )}
                                    {isSelected && !isCorrectOption && (
                                      <span className="badge badge-error">
                                        إجابة الطالب
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    {/* Student's Answer for Essay & Short Answer */}
                    {(question.type === "essay" ||
                      question.type === "short_answer") && (
                      <div>
                        <h4 className="mb-3 font-medium">إجابة الطالب:</h4>
                        <div className="bg-base-100 border-base-300 min-h-[100px] whitespace-pre-wrap rounded-lg border p-4">
                          {answer?.answer_text || "لم يقم الطالب بالإجابة"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Card */}
        <div className="card bg-base-100 border-primary mb-6 border-2 shadow-lg">
          <div className="card-body">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="text-center">
                <div className="mb-1 text-sm text-gray-600">
                  الدرجة الإجمالية
                </div>
                <div className="text-primary text-4xl font-bold">
                  {totalObtained?.toFixed(1)}
                  <span className="text-2xl text-gray-500">
                    {" "}
                    / {totalPossible}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className="mb-1 text-sm text-gray-600">النسبة المئوية</div>
                <div className="text-secondary text-3xl font-bold">
                  {percentage}%
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {+percentage >= 80
                    ? "ممتاز"
                    : +percentage >= 70
                      ? "جيد جداً"
                      : +percentage >= 60
                        ? "جيد"
                        : +percentage >= 50
                          ? "مقبول"
                          : "راسب"}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className="radial-progress text-primary"
                  style={
                    {
                      "--value": percentage,
                      "--size": "5rem",
                    } as DetailedHTMLProps<
                      HTMLAttributes<HTMLDivElement>,
                      HTMLDivElement
                    >
                  }
                  role="progressbar"
                >
                  {percentage}%
                </div>
                <div className="mt-2 text-sm text-gray-600">مستوى الإنجاز</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-4 flex flex-col justify-end gap-3 sm:flex-row">
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                navigate(`/itkan-dashboard/exam-correction/${examId}`)
              }
              //   disabled={submitting}
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="btn btn-success"
              onClick={() => {
                console.log(errors);
              }}

              //   disabled={submitting || !isValid}
            >
              {examGrade.isPending ? (
                <>
                  <span className="loading loading-spinner"></span>
                  جاري الحفظ...
                </>
              ) : (
                "حفظ الدرجات"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentAnswersPage;
