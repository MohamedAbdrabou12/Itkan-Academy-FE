import { useSubmitExam } from "@/hooks/Exams/useSubmitExam";
import { useTakeExam, type TakeExamQuestion } from "@/hooks/Exams/useTakeExam";
import { questionDifficulties } from "@/utils/questionBank";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

const TakeExam = () => {
  const { examId } = useParams();
  const { data: exam, isPending, error } = useTakeExam(examId || "");
  const [userAnswers, setUserAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const submitExam = useSubmitExam();

  const timerRef = useRef<number>(null);
  const submissionStarted = useRef(false);

  // Fetch exam data
  useEffect(() => {
    // Calculate remaining time
    const startTime = new Date(exam?.user_start_time || "");
    const endTime = new Date(
      startTime.getTime() + (exam?.duration_minutes || 0) * 60000,
    );
    const now = new Date();
    const timeRemaining = Math.max(
      0,
      Math.floor((endTime.getTime() - now.getTime()) / 1000),
    );
    setRemainingTime(timeRemaining);

    // Initialize empty answers object
    const initialAnswers: Record<string, string> = {};
    exam?.questions.forEach((q) => {
      if (q.type === "mcq" || q.type === "true_false") {
        initialAnswers[q.id] = "";
      } else {
        initialAnswers[q.id] = "";
      }
    });
    setUserAnswers(initialAnswers);
  }, [exam]);

  // Timer countdown
  useEffect(() => {
    // Handle auto-submit when time runs out
    const handleAutoSubmit = async () => {
      submitExamHandler();
    };

    if (remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current || 0);
            if (!submissionStarted.current) {
              submissionStarted.current = true;
              console.log("triggered");
              handleAutoSubmit();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [remainingTime]);

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle answer changes based on question type
  const handleAnswerChange = (questionId: number, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Submit exam
  const submitExamHandler = () => {
    if (submitExam.isPending) return;
    const submissionData = {
      attemptId: `${exam?.attempt_id}` || "",
      exam_id: examId || "",
      answers: Object.keys(userAnswers).map((questionId) => {
        const question = exam?.questions.find(
          (q) => q.id === parseInt(questionId),
        );
        if (question?.type === "mcq" || question?.type === "true_false") {
          return {
            question_id: questionId,
            selected_option:
              userAnswers[questionId as keyof typeof userAnswers],
          };
        } else {
          return {
            question_id: questionId,
            answer_text: userAnswers[questionId as keyof typeof userAnswers],
          };
        }
      }),
    };
    submitExam.mutate(submissionData);
  };

  // Navigate to specific question
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowSidebar(false);
  };

  // Navigate to next/previous question
  const nextQuestion = () => {
    if (currentQuestionIndex < (exam?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Get current question
  const currentQuestion = exam?.questions[currentQuestionIndex];

  // Determine if question is answered
  const isQuestionAnswered = (questionId: number) => {
    const answer = userAnswers[questionId as keyof typeof userAnswers];
    return answer !== undefined && answer !== null && answer !== "";
  };

  // Render question based on type
  const renderQuestion = (question: TakeExamQuestion) => {
    switch (question.type) {
      case "mcq":
        return (
          <div className="space-y-4">
            {question?.options?.map((option) => (
              <div key={option.key} className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    className="radio radio-accent"
                    checked={
                      userAnswers[question.id as keyof typeof userAnswers] ===
                      option.key
                    }
                    onChange={() => handleAnswerChange(question.id, option.key)}
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{option.key}.</span>
                    <span className="label-text text-lg">{option.option}</span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        );

      case "true_false":
        return (
          <div className="space-y-4">
            {question?.options?.map((option) => (
              <div key={option.key} className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    className="radio radio-accent"
                    checked={
                      userAnswers[question.id as keyof typeof userAnswers] ===
                      option.key
                    }
                    onChange={() => handleAnswerChange(question.id, option.key)}
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{option.key}.</span>
                    <span className="label-text text-lg">{option.option}</span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        );

      case "short_answer":
        return (
          <div className="form-control">
            <textarea
              className="textarea textarea-accent w-full"
              placeholder="اكتب إجابتك هنا..."
              value={userAnswers[question.id as keyof typeof userAnswers] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              dir="rtl"
            />
          </div>
        );

      case "essay":
        return (
          <div className="form-control">
            <textarea
              className="textarea textarea-accent min-h-[200px] w-full"
              placeholder="اكتب إجابتك هنا..."
              value={userAnswers[question.id as keyof typeof userAnswers] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              dir="rtl"
            />
          </div>
        );

      default:
        return <div>Unknown question type</div>;
    }
  };

  // Render difficulty badge
  const renderDifficultyBadge = (difficulty: string) => {
    const colors = {
      easy: "badge-success",
      medium: "badge-warning",
      hard: "badge-error",
    };

    return (
      <span
        className={`badge ${colors[difficulty as keyof typeof colors] || "badge-info"}`}
      >
        {questionDifficulties.find((d) => d.value === difficulty)?.label}
      </span>
    );
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg">جاري تحميل الامتحان...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto my-8 flex min-h-[calc(100vh-64px)] max-w-2xl flex-col gap-4">
        <div className="mt-24">
          <p className="w-full text-center text-2xl text-red-500">
            {error.message}
          </p>
        </div>
        <button
          className="btn btn-ghost mx-auto w-fit"
          onClick={() => window.history.back()}
        >
          رجوع
        </button>
      </div>
    );
  }

  return (
    <div className="from-base-100 to-base-200 bg-linear-to-br min-h-screen p-4 pt-24">
      {/* Mobile Header */}
      <div className="mb-4 md:hidden">
        <div className="flex items-center justify-between">
          <button
            className="btn btn-square btn-ghost"
            onClick={() => setShowSidebar(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-xl font-bold">
            {exam?.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Main Layout */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Sidebar - Question Navigation */}
          <div
            className={`lg:w-1/4 ${showSidebar ? "bg-base-100 fixed inset-0 z-50 p-4" : "hidden lg:block"}`}
          >
            {showSidebar && (
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">أسئلة الامتحان</h2>
                <button
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={() => setShowSidebar(false)}
                >
                  ✕
                </button>
              </div>
            )}

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title hidden text-lg lg:block">
                  أسئلة الامتحان
                </h2>

                {/* Exam Info */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-70">المدة:</span>
                    <span className="font-semibold">
                      {exam?.duration_minutes} دقيقة
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-70">الدرجة الكلية:</span>
                    <span className="font-semibold">
                      {exam?.total_marks} درجة
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-70">عدد الأسئلة:</span>
                    <span className="font-semibold">
                      {exam?.questions.length}
                    </span>
                  </div>
                </div>

                {/* Timer */}
                <div className="mb-6">
                  <div className="text-center">
                    <div
                      className={`stat-value ${remainingTime < 300 ? "text-error" : "text-primary"} font-mono`}
                    >
                      {formatTime(remainingTime)}
                    </div>
                    <div className="stat-desc">الوقت المتبقي</div>
                  </div>
                </div>

                {/* Question Grid */}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3">
                  {exam?.questions.map((question, index) => (
                    <button
                      key={question.id}
                      className={`btn btn-sm ${index === currentQuestionIndex ? "btn-primary" : ""} ${
                        isQuestionAnswered(question.id)
                          ? "btn-success"
                          : "btn-outline"
                      }`}
                      onClick={() => goToQuestion(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary h-3 w-3 rounded-full"></div>
                    <span>السؤال الحالي</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-success h-3 w-3 rounded-full"></div>
                    <span>تمت الإجابة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-base-300 h-3 w-3 rounded-full border"></div>
                    <span>لم تتم الإجابة</span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="">
                  <button
                    className="btn btn-success w-full"
                    onClick={submitExamHandler}
                    disabled={submitExam.isPending}
                  >
                    {submitExam.isPending ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        جاري التحميل...
                      </>
                    ) : (
                      "تسليم الامتحان"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Desktop Header */}
            <div className="mb-6 hidden items-center justify-between md:flex">
              <div>
                <h1 className="text-3xl font-bold">{exam?.title}</h1>
                <p className="text-lg opacity-70">اختبار حفظ القرآن الكريم</p>
              </div>
              <div className="text-right">
                <div
                  className={`font-mono text-2xl ${remainingTime < 300 ? "text-error" : ""}`}
                >
                  {formatTime(remainingTime)}
                </div>
                <div className="text-sm opacity-70">الوقت المتبقي</div>
              </div>
            </div>
            {/* Question Card */}
            <div className="card bg-base-100 mb-6 shadow-xl">
              <div className="card-body gap-6">
                {/* Question Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className="badge badge-primary text-lg">
                        سؤال {currentQuestionIndex + 1}
                      </span>
                      {renderDifficultyBadge(currentQuestion?.difficulty || "")}
                      <span className="badge badge-outline">
                        {currentQuestion?.marks} درجة
                      </span>
                      <span className="badge badge-ghost">
                        {currentQuestion?.type === "mcq"
                          ? "اختيار من متعدد"
                          : currentQuestion?.type === "true_false"
                            ? "صح أم خطأ"
                            : currentQuestion?.type === "short_answer"
                              ? "إجابة قصيرة"
                              : "مقال"}
                      </span>
                    </div>
                    <h2 className="mt-2 text-2xl font-bold" dir="auto">
                      {currentQuestion?.title}
                    </h2>
                  </div>
                </div>

                {/* Question Content */}
                <div className="">
                  {currentQuestion && renderQuestion(currentQuestion)}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-2 flex items-center justify-between border-t pt-6">
                  <button
                    className="btn btn-outline"
                    onClick={prevQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    السابق
                  </button>

                  <div className="text-center">
                    <span className="opacity-70">السؤال</span>
                    <span className="mx-2 font-bold">
                      {currentQuestionIndex + 1}
                    </span>
                    <span className="opacity-70">
                      من {exam?.questions.length}
                    </span>
                  </div>

                  <button
                    className="btn btn-outline"
                    onClick={nextQuestion}
                    disabled={
                      currentQuestionIndex === (exam?.questions.length || 0) - 1
                    }
                  >
                    التالي
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm opacity-70">تقدمك في الامتحان</span>
                <span className="text-sm font-semibold">
                  {Object.values(userAnswers).filter((a) => a !== "").length} من{" "}
                  {exam?.questions.length} أسئلة
                </span>
              </div>
              <progress
                className="progress progress-accent h-4 w-full"
                value={
                  Object.values(userAnswers).filter((a) => a !== "").length
                }
                max={exam?.questions.length}
              ></progress>
            </div>
            {/* Mobile Submit Button */}
            <div className="md:hidden">
              <button
                className="btn btn-success btn-block"
                onClick={submitExamHandler}
                disabled={submitExam.isPending}
              >
                {submitExam.isPending ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    جاري التحميل...
                  </>
                ) : (
                  "تسليم الامتحان"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeExam;
