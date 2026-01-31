import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useScoreEvaluation } from "@/hooks/staffEvaluation/useScoreEvaluation";
import { useSubmitEvaluation } from "@/hooks/staffEvaluation/useSubmitEvaluation";
import { useApproveEvaluation } from "@/hooks/staffEvaluation/useApproveEvaluation";
import { KPIScoreInput } from "@/components/staffEvaluation/KPIScoreInput";
import { WeightedScoreDisplay } from "@/components/staffEvaluation/WeightedScoreDisplay";
import { EvaluationStatusBadge } from "@/components/staffEvaluation/EvaluationStatusBadge";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { EmployeeEvaluationWithDetails } from "@/types/staffEvaluation";

// Helper hook for single evaluation details
const useGetEvaluationDetails = (id: number) => {
  return useQuery<EmployeeEvaluationWithDetails>({
    queryKey: ["staff-evaluations", "evaluation", id],
    queryFn: async () => {
      return await apiReq("GET", `/staff-evaluations/evaluations/${id}`);
    },
    enabled: !!id,
  });
};

type EvaluationFormValues = {
  scores: Record<string, number>;
};

export default function EvaluationFormPage() {
  const { evaluationId } = useParams();
  const navigate = useNavigate();
  const id = Number(evaluationId);

  const { data: evaluation, isLoading, refetch } = useGetEvaluationDetails(id);
  const scoreMutation = useScoreEvaluation(id);
  const submitMutation = useSubmitEvaluation(id);
  const approveMutation = useApproveEvaluation(id);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<EvaluationFormValues>({
    defaultValues: { scores: {} },
  });

  // Load initial scores
  useEffect(() => {
    if (evaluation?.kpi_scores) {
      evaluation.kpi_scores.forEach((s) => {
        setValue(`scores.${s.kpi_id}`, s.score);
      });
    }
  }, [evaluation, setValue]);

  const onSaveScores = (data: EvaluationFormValues) => {
    const scoresList = Object.entries(data.scores).map(([kpiId, score]) => ({
      kpi_id: Number(kpiId),
      score: Number(score),
    }));

    scoreMutation.mutate(
      { scores: scoresList },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
  };

  const onSubmitEvaluation = () => {
    if (
      confirm(
        "هل أنت متأكد من إرسال التقييم؟ لا يمكن تعديل الدرجات بعد الإرسال.",
      )
    ) {
      submitMutation.mutate(undefined, {
        onSuccess: () => refetch(),
      });
    }
  };

  const onApproveEvaluation = () => {
    approveMutation.mutate(undefined, {
      onSuccess: () => refetch(),
    });
  };

  if (isLoading) return <div className="p-12 text-center">جاري التحميل...</div>;
  if (!evaluation)
    return <div className="p-12 text-center">التقييم غير موجود</div>;

  const isReadOnly = evaluation.status !== "draft";
  const scores = watch("scores") || {};

  // Calculate generic weighted score locally for preview
  const currentWeightedScore =
    evaluation.template?.kpis?.reduce((total, kpi) => {
      const score = scores[kpi.id] || 0;
      return total + (score / kpi.max_score) * kpi.weight;
    }, 0) || 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">
              تقييم الموظف: {evaluation.employee?.full_name}
            </h1>
            <EvaluationStatusBadge status={evaluation.status} />
          </div>
          <p className="text-gray-500">
            {evaluation.cycle?.name} - {evaluation.template?.name}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            المقيّم: {evaluation.evaluator?.full_name}
          </p>
        </div>
        <div className="text-left">
          <div className="mb-2">الدرجة النهائية</div>
          <WeightedScoreDisplay
            score={
              evaluation.status === "draft"
                ? Math.round(currentWeightedScore)
                : evaluation.final_score
            }
            className="justify-end"
          />
        </div>
      </div>

      {/* KPI Form */}
      <form onSubmit={handleSubmit(onSaveScores)} className="space-y-6">
        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
          <table className="table w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/3">المؤشر</th>
                <th className="w-24 text-center">الوزن</th>
                <th className="w-48 text-center">التقييم</th>
              </tr>
            </thead>
            <tbody>
              {evaluation.template?.kpis?.map((kpi) => (
                <tr key={kpi.id} className="hover:bg-gray-50">
                  <td>
                    <div className="font-semibold">{kpi.name}</div>
                    {kpi.description && (
                      <div className="mt-1 text-xs text-gray-500">
                        {kpi.description}
                      </div>
                    )}
                  </td>
                  <td className="text-center">
                    <span className="badge badge-ghost">{kpi.weight}%</span>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <KPIScoreInput
                        score={scores[kpi.id] || 0}
                        maxScore={kpi.max_score}
                        readOnly={isReadOnly}
                        onChange={(val) => {
                          setValue(`scores.${kpi.id}`, val, {
                            shouldDirty: true,
                          });
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
          >
            عودة
          </button>

          <div className="flex gap-3">
            {evaluation.status === "draft" && (
              <>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={scoreMutation.isPending || !isDirty}
                >
                  حفظ المسودة
                </button>
                <button
                  type="button"
                  className="btn btn-success text-white"
                  onClick={onSubmitEvaluation}
                  disabled={submitMutation.isPending}
                >
                  إرسال التقييم
                </button>
              </>
            )}

            {evaluation.status === "submitted" && (
              <button
                type="button"
                className="btn btn-success text-white"
                onClick={onApproveEvaluation}
                disabled={approveMutation.isPending}
              >
                اعتماد التقييم
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
