import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { QuestionBankFormModal } from "@/components/modals/QuestionBankFormModal";
import { useDeleteQuestion } from "@/hooks/question_bank/useDeleteQuestion";
import { useGetQuestions } from "@/hooks/question_bank/useGetQuestions";
import type { QuestionBank, QuestionBankResponse } from "@/types/questionBank";
import { formatArabicDate } from "@/utils/formatDate";
import { questionDifficulties, questionTypes } from "@/utils/questionBank";
import { BarChart3, Edit, Filter, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function QuestionBank() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const { data, isPending } = useGetQuestions();
  const [filteredQuestions, setFilteredQuestions] =
    useState<QuestionBankResponse>();
  const [editingQuestion, setEditingQuestion] = useState<
    QuestionBank & { id: number }
  >();
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState("All Difficulties");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteQuestion, setDeleteQuestion] = useState<QuestionBank | null>(
    null,
  );
  const deleteQuestionMutaiton = useDeleteQuestion();

  // Stats
  const totalQuestions = data?.length;
  const easyQuestions = data?.filter((q) => q.difficulty === "easy").length;
  const mediumQuestions = data?.filter((q) => q.difficulty === "medium").length;
  const hardQuestions = data?.filter((q) => q.difficulty === "hard").length;

  // Apply filters
  useEffect(() => {
    let result = data || [];

    // Search filter
    if (searchTerm) {
      result = result.filter((q) =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Type filter
    if (selectedType !== "All Types") {
      result = result.filter((q) => q.type === selectedType);
    }

    // Difficulty filter
    if (selectedDifficulty !== "All Difficulties") {
      result = result.filter((q) => q.difficulty === selectedDifficulty);
    }

    // // Branch filter
    // if (selectedBranch !== "All Branches") {
    //   result = result.filter((q) => q.branch === selectedBranch);
    // }

    setFilteredQuestions(result);
  }, [searchTerm, selectedType, selectedDifficulty, selectedBranch]);

  useEffect(() => {
    setFilteredQuestions(data);
  }, [data]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("All Types");
    setSelectedDifficulty("All Difficulties");
    setSelectedBranch("All Branches");
  };

  // Delete question
  const deleteQuestionHandler = (question: QuestionBank) => {
    // setQuestions(questions.filter((q) => q.id !== id));
    setDeleteQuestion(question);
    setIsDeleteModalOpen(true);
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "badge-success";
      case "medium":
        return "badge-warning";
      case "hard":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  // Get type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "mcq":
        return "badge-info";
      case "essay":
        return "badge-primary";
      case "true_false":
        return "badge-secondary";
      default:
        return "badge-neutral";
    }
  };

  function openFormModal(editingQuestion?: QuestionBank) {
    setEditingQuestion(editingQuestion);
    setIsFormModalOpen(true);
  }

  function closeFormModal() {
    setIsFormModalOpen(false);
    setEditingQuestion(undefined);
  }

  async function handleConfirmDelete() {
    if (deleteQuestion) {
      await deleteQuestionMutaiton.mutate(`${deleteQuestion.id}`);
      setIsDeleteModalOpen(false);
      setDeleteQuestion(null);
    }
  }

  return (
    <div className="bg-base-200 min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div>
            <h1 className="text-base-content text-3xl font-bold">
              بنك الاسئلة
            </h1>
            <p className="text-base-content/70 mt-2">
              إدارة وإنشاء الأسئلة للاختبارات والتقييمات.
            </p>
          </div>
          <button
            onClick={() => {
              openFormModal();
            }}
            className="flex cursor-pointer items-center space-x-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <span>
              <Plus />
            </span>
            <span> اضف سؤال جديد</span>
          </button>
        </div>

        {isPending && !filteredQuestions ? (
          <>
            <div className="flex h-full items-center justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          </>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="stats bg-base-100 shadow">
                <div className="stat justify-center">
                  <div className="stat-value text-center text-emerald-600">
                    {totalQuestions}
                  </div>
                  <div className="stat-title text-center">عدد الاسئلة</div>
                </div>
              </div>

              <div className="stats bg-base-100 shadow">
                <div className="stat justify-center">
                  <div className="stat-value text-center text-emerald-600">
                    {easyQuestions}
                  </div>
                  <div className="stat-title text-center">سهل</div>
                </div>
              </div>

              <div className="stats bg-base-100 shadow">
                <div className="stat justify-center">
                  <div className="stat-value text-center text-emerald-600">
                    {mediumQuestions}
                  </div>
                  <div className="stat-title text-center">متوسط</div>
                </div>
              </div>
              <div className="stats bg-base-100 shadow">
                <div className="stat justify-center">
                  <div className="stat-value text-center text-emerald-600">
                    {hardQuestions}
                  </div>
                  <div className="stat-title text-center">صعب</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <div className="card bg-base-100 sticky top-4 shadow-lg ">
                  <div className="card-body">
                    <div className="mb-4 flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      <h2 className="card-title">الفلاتر</h2>
                    </div>

                    {/* Search */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">ابحث عن سؤال</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="ابحث عن السؤال..."
                          className="input input-bordered w-full pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="text-base-content/50 absolute left-3 top-3 h-5 w-5" />
                      </div>
                    </div>

                    {/* Question Type Filter */}
                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="label-text">نوع السؤال</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        {questionTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Difficulty Filter */}
                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="label-text">مستوى السؤال</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                      >
                        {questionDifficulties.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Branch Filter
                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="label-text">Branch</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                      >
                        {branches.map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </select>
                    </div> */}

                    {/* Reset Filters Button */}
                    <button
                      className="btn btn-outline btn-sm mt-6"
                      onClick={resetFilters}
                    >
                      اعادة الفلتر
                    </button>

                    {/* Results Count */}
                    <div className="bg-base-200 mt-6 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">يتم عرض</span>
                        <span className="font-bold">
                          {filteredQuestions?.length} من {totalQuestions}
                        </span>
                      </div>
                      <div className="text-base-content/70 mt-1 text-xs">
                        {filteredQuestions?.length === totalQuestions
                          ? "كل الاسئلة"
                          : "تمت تصفية الاسئلة"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="lg:col-span-3">
                {filteredQuestions?.length === 0 ? (
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body items-center py-12 text-center">
                      <BarChart3 className="text-base-content/30 mb-4 h-16 w-16" />
                      <h3 className="card-title">لا توجد اسالة</h3>
                      <p className="text-base-content/70">
                        يمكنك البدء بإنشاء سؤال جديد.
                      </p>
                      <button
                        className="btn btn-primary mt-4"
                        onClick={() => {
                          setIsFormModalOpen(true);
                        }}
                      >
                        <Plus className="h-5 w-5" />
                        اضافة سؤال جديد
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredQuestions?.map((question) => (
                      <div
                        key={question.id}
                        className="card bg-base-100 shadow-lg"
                      >
                        <div className="card-body">
                          {/* Question Header */}
                          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`badge ${getTypeColor(question.type)}`}
                              >
                                {
                                  questionTypes.find(
                                    (type) => type.value === question.type,
                                  )?.label
                                }
                              </span>
                              <span
                                className={`badge ${getDifficultyColor(question.difficulty)}`}
                              >
                                {
                                  questionDifficulties.find(
                                    (difficulty) =>
                                      difficulty.value === question.difficulty,
                                  )?.label
                                }
                              </span>
                              {/* <span className="badge badge-outline">
                                {question.branch}
                              </span> */}
                            </div>

                            <div className="flex gap-2">
                              <button
                                className="btn btn-ghost btn-sm btn-square"
                                onClick={() => {
                                  openFormModal(question);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                className="btn btn-ghost btn-sm btn-square text-error"
                                onClick={() => deleteQuestionHandler(question)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Question Text */}
                          <h3 className="mb-4 text-lg font-semibold">
                            {question.title}
                          </h3>

                          {/* Options for Multiple Choice */}
                          {question.type === "mcq" && question.options && (
                            <div className="mb-4">
                              <div className="mb-2 text-sm font-medium">
                                الخيارات:
                              </div>
                              <div className="space-y-2">
                                {question.options.map((option, index) => (
                                  <div
                                    key={index}
                                    className={`flex items-center gap-2 rounded p-2 ${
                                      option.key === question.correct_answer
                                        ? "bg-success/10 border-success/20 border"
                                        : "bg-base-200"
                                    }`}
                                  >
                                    {option.key === question.correct_answer ? (
                                      <div className="bg-success flex h-5 w-5 items-center justify-center rounded-full">
                                        <span className="text-xs text-white">
                                          ✓
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="bg-base-300 h-5 w-5 rounded-full"></div>
                                    )}
                                    <span>{option.option}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Correct Answer for True/False */}
                          {question.type === "true_false" &&
                            question.correct_answer && (
                              <div className="mb-4">
                                <div className="text-sm font-medium">
                                  Correct Answer:
                                </div>
                                <div className="badge badge-lg mt-1">
                                  {
                                    question?.options?.find(
                                      (option) =>
                                        option.key === question.correct_answer,
                                    )?.option
                                  }
                                </div>
                              </div>
                            )}

                          {/* Footer */}
                          <div className="flex items-center justify-between border-t pt-4">
                            <div className="text-base-content/70 text-sm">
                              اضيف فى:{" "}
                              {formatArabicDate(new Date(question.created_at))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <QuestionBankFormModal
        isOpen={isFormModalOpen}
        onClose={() => closeFormModal()}
        initialValues={editingQuestion}
      />

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteQuestion(null);
          }}
          onConfirm={handleConfirmDelete}
          title="ازالة السئال"
          description="هل انت متاكد من ازالة السؤال, لا يمكنك الرجوع عن هذا الاجراء"
          itemName={deleteQuestion?.title}
          isDeleting={deleteQuestionMutaiton.isPending}
        />
      )}
    </div>
  );
}
