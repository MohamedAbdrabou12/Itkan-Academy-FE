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
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import HookFormSelect from "@/components/forms/HookFormSelect";

const startEvaluationSchema = z.object({
  employee_user_id: z.coerce.number("اختر الموظف").min(1, "اختر الموظف"),
  cycle_id: z.coerce.number("اختر الدورة").min(1, "اختر الدورة"),
  template_id: z.coerce.number("اختر القالب").min(1, "اختر القالب"),
});

type StartFormValues = z.infer<typeof startEvaluationSchema>;

export default function EmployeeEvaluationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: evaluations, isLoading } = useGetEvaluations();
  const { cycles } = useGetEvaluationCycles(true);
  const { templates } = useGetKPITemplates();
  const { staff } = useGetBranchStaff(); // Using existing hook

  const startMutation = useStartEvaluation();

  const form = useForm<StartFormValues>({
    resolver: zodResolver(startEvaluationSchema) as Resolver<StartFormValues>,
  });

  const { handleSubmit, reset } = form;

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
          className="btn-primary gap-2"
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
                      {evaluation.status === "approved" ? (
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
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <HookFormSelect
                  name="employee_user_id"
                  options={staff?.map((s) => ({
                    value: `${s.id}`,
                    label: s.full_name,
                  }))}
                  placeholder="اختر الموظف..."
                  label="الموظف"
                />

                <HookFormSelect
                  name="cycle_id"
                  options={cycles?.map((c) => ({
                    value: `${c.id}`,
                    label: c.name,
                  }))}
                  placeholder="اختر الدورة..."
                  label="دورة التقييم"
                />

                <HookFormSelect
                  name="template_id"
                  options={templates?.map((t) => ({
                    value: `${t.id}`,
                    label: t.name,
                  }))}
                  placeholder="اختر القالب..."
                  label="قالب التقييم"
                />

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setIsModalOpen(false);
                      reset();
                    }}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={startMutation.isPending}
                  >
                    بدء
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}
    </div>
  );
}
