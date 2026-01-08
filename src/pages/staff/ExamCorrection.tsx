import { useGetExamAttempts } from "@/hooks/Exams/useGetExamAttempts";
import { formatArabicDate } from "@/utils/formatDate";
import { useState } from "react";
import { Link, useParams } from "react-router";

const StudentsListPage = () => {
  const [filter, setFilter] = useState("all"); // 'all', 'submitted', 'graded'
  const { examId } = useParams();

  const {
    data: examAttempts,
    isPending,
    error,
  } = useGetExamAttempts(examId || "");

  const filteredStudents = examAttempts.filter((student) => {
    if (filter === "all") return true;
    return student.status === filter;
  });

  const getStatusBadge = (status: "started" | "submitted" | "graded") => {
    const statusConfig = {
      submitted: { label: "تم التقديم", color: "badge-info" },
      graded: { label: "تم التصحيح", color: "badge-success" },
      started: { label: "قيد الإجابة", color: "badge-warning" },
    };

    const config = statusConfig[status] || {
      label: status,
      color: "badge-secondary",
    };
    return <span className={`badge ${config.color}`}>{config.label}</span>;
  };

  if (isPending) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-gray-600">جاري تحميل بيانات الطلاب...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
        <span>خطأ في تحميل البيانات: {error.message}</span>
      </div>
    );
  }

  if (!examAttempts) {
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
        <span>لا توجد بيانات</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">الممتحنين</h1>
        <p className="text-gray-600">قائمة الطلاب الذين أدوا الامتحان</p>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 mb-6 shadow">
        <div className="card-body">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4">
              <label className="label">
                <span className="label-text font-semibold">
                  تصفية حسب الحالة:
                </span>
              </label>
              <div className="join">
                {[
                  { value: "all", label: "الكل" },
                  { value: "submitted", label: "تم التقديم" },
                  { value: "graded", label: "تم التصحيح" },
                  { value: "in_progress", label: "قيد الإجابة" },
                ].map((filterOption) => (
                  <input
                    key={filterOption.value}
                    className="join-item btn checked:btn-success"
                    type="radio"
                    name="statusFilter"
                    aria-label={filterOption.label}
                    checked={filter === filterOption.value}
                    onChange={() => setFilter(filterOption.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-base-200">
                  <th className="text-right">الطالب</th>
                  <th className="text-right">الحالة</th>
                  <th className="text-right">النتيجة</th>
                  <th className="text-right">وقت البدء</th>
                  <th className="text-right">وقت الإنتهاء</th>
                  <th className="text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-base-100">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content w-10 rounded-full">
                            <span>{attempt.student.full_name.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {attempt.student.full_name}
                          </div>
                          <div className="text-sm opacity-50">
                            {attempt.student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{getStatusBadge(attempt.status)}</td>
                    <td>
                      {attempt.score !== null ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{attempt.score}</span>
                          <span className="text-sm opacity-70">
                            /{" "}
                            {attempt.answers.reduce(
                              (sum, ans) => sum + ans.marks,
                              0,
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">لم يتم التصحيح</span>
                      )}
                    </td>
                    <td>{formatArabicDate(new Date(attempt.start_time))}</td>
                    <td>{formatArabicDate(new Date(attempt.end_time))}</td>

                    <td>
                      <Link
                        to={`/itkan-dashboard/exam-correction/${attempt.exam_id}/attempt/${attempt.id}`}
                        className="btn btn-sm btn-success"
                      >
                        تصحيح الإجابات
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="py-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9.804a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                />
              </svg>
              <p className="mt-2 text-gray-500">لا توجد نتائج</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="card bg-info text-info-content shadow">
          <div className="card-body">
            <h2 className="card-title">تم التقديم</h2>
            <p className="text-3xl font-bold">
              {examAttempts.filter((s) => s.status === "submitted").length}
            </p>
          </div>
        </div>

        <div className="card bg-success text-success-content shadow">
          <div className="card-body">
            <h2 className="card-title">تم التصحيح</h2>
            <p className="text-3xl font-bold">
              {examAttempts.filter((s) => s.status === "graded").length}
            </p>
          </div>
        </div>

        <div className="card bg-warning text-warning-content shadow">
          <div className="card-body">
            <h2 className="card-title">قيد الإجابة</h2>
            <p className="text-3xl font-bold">
              {examAttempts.filter((s) => s.status === "started").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsListPage;
