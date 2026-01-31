import { useState } from "react";
import { Link } from "react-router";
import { useGetEvaluations } from "@/hooks/staffEvaluation/useGetEvaluations";
import { useStartEvaluation } from "@/hooks/staffEvaluation/useStartEvaluation";
import { useGetEvaluationCycles } from "@/hooks/staffEvaluation/useGetEvaluationCycles";
import { useGetKPITemplates } from "@/hooks/staffEvaluation/useGetKPITemplates";
import { useGetBranchStaff } from "@/hooks/branches/useGetBranchStaff";
import { EvaluationStatusBadge } from "@/components/staffEvaluation/EvaluationStatusBadge";
import { WeightedScoreDisplay } from "@/components/staffEvaluation/WeightedScoreDisplay";
import { PlusIcon, EyeIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const startEvaluationSchema = z.object({
  employee_user_id: z.coerce.number().min(1, "اختر الموظف"),
  cycle_id: z.coerce.number().min(1, "اختر الدورة"),
  template_id: z.coerce.number().min(1, "اختر القالب"),
});

type StartFormValues = z.infer<typeof startEvaluationSchema>;

export default function EmployeeEvaluationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: evaluations, isLoading } = useGetEvaluations();
  const { data: cycles } = useGetEvaluationCycles(true);
  const { data: templates } = useGetKPITemplates();
  const { staff } = useGetBranchStaff(); // Using existing hook

  const startMutation = useStartEvaluation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StartFormValues>({
    resolver: zodResolver(startEvaluationSchema),
  });

  const onSubmit = (data: StartFormValues) => {
    startMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      },
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">تقييمات الموظفين</h1>
          <p className="mt-1 text-gray-600">سجل التقييمات والأداء</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          بدء تقييم جديد
        </button>
      </div>

      <div className="card border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>الموظف</th>
                <th>الدورة</th>
                <th>القالب</th>
                <th>الحالة</th>
                <th>الدرجة</th>
                <th>التاريخ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    جاري التحميل...
                  </td>
                </tr>
              ) : evaluations?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    لا توجد تقييمات
                  </td>
                </tr>
              ) : (
                evaluations?.map((evaluation) => (
                  <tr key={evaluation.id} className="hover:bg-gray-50">
                    <td>
                      <div className="font-semibold">
                        {evaluation.employee?.full_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        بواسطة: {evaluation.evaluator?.full_name}
                      </div>
                    </td>
                    <td>{evaluation.cycle?.name}</td>
                    <td>{evaluation.template?.name}</td>
                    <td>
                      <EvaluationStatusBadge status={evaluation.status} />
                    </td>
                    <td>
                      {evaluation.final_score ? (
                        <WeightedScoreDisplay
                          score={Number(evaluation.final_score)}
                          className="text-sm"
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="text-sm text-gray-500">
                      {new Date(evaluation.created_at).toLocaleDateString(
                        "ar-EG",
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/itkan-dashboard/staff-evaluations/evaluate/${evaluation.id}`}
                        className="btn btn-ghost btn-xs gap-1"
                      >
                        <EyeIcon className="h-4 w-4" />
                        عرض
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Start Evaluation Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="mb-4 text-lg font-bold">بدء تقييم جديد</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">الموظف</span>
                </label>
                <select
                  {...register("employee_user_id")}
                  className="select select-bordered w-full"
                >
                  <option value="">اختر الموظف...</option>
                  {staff?.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name}
                    </option>
                  ))}
                </select>
                {errors.employee_user_id && (
                  <span className="text-error text-sm">
                    {errors.employee_user_id.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">دورة التقييم</span>
                </label>
                <select
                  {...register("cycle_id")}
                  className="select select-bordered w-full"
                >
                  <option value="">اختر الدورة...</option>
                  {cycles?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.cycle_id && (
                  <span className="text-error text-sm">
                    {errors.cycle_id.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">قالب التقييم</span>
                </label>
                <select
                  {...register("template_id")}
                  className="select select-bordered w-full"
                >
                  <option value="">اختر القالب...</option>
                  {templates?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {errors.template_id && (
                  <span className="text-error text-sm">
                    {errors.template_id.message}
                  </span>
                )}
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={startMutation.isPending}
                >
                  بدء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
