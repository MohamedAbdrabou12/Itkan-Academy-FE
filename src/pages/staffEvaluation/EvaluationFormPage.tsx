import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useScoreEvaluation } from "@/hooks/staffEvaluation/useScoreEvaluation";
import { useApproveEvaluation } from "@/hooks/staffEvaluation/useApproveEvaluation";
import { KPIScoreInput } from "@/components/staffEvaluation/KPIScoreInput";
import { WeightedScoreDisplay } from "@/components/staffEvaluation/WeightedScoreDisplay";
import { EvaluationStatusBadge } from "@/components/staffEvaluation/EvaluationStatusBadge";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type {
  EmployeeEvaluationWithDetails,
  KPI,
} from "@/types/staffEvaluation";

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

// Dynamic schema creator based on KPIs
const createScoreSchema = (kpis: KPI[] | undefined) => {
  if (!kpis || kpis.length === 0) {
    return z.object({ scores: z.record(z.string(), z.number()) });
  }

  const scoreFields: Record<string, z.ZodNumber> = {};
  kpis.forEach((kpi) => {
    scoreFields[kpi.id.toString()] = z
      .number({
        message: `يجب إدخال درجة لـ "${kpi.name}"`,
      })
      .min(0, `الدرجة يجب أن تكون 0 على الأقل`)
      .max(kpi.max_score, `الدرجة يجب ألا تتجاوز ${kpi.max_score}`);
  });

  return z.object({
    scores: z.object(scoreFields),
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
  const approveMutation = useApproveEvaluation(id);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  // Create dynamic schema based on loaded KPIs
  const scoreSchema = useMemo(
    () => createScoreSchema(evaluation?.template?.kpis),
    [evaluation?.template?.kpis],
  );

  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(scoreSchema) as Resolver<EvaluationFormValues>,
    defaultValues: { scores: {} },
    mode: "onChange",
  });
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
    trigger,
  } = form;

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

  const onApproveEvaluation = async () => {
    // Validate all scores first
    const isValid = await trigger("scores");
    if (!isValid) {
      return;
    }
    setIsApproveModalOpen(true);
  };

  const handleConfirmApproval = async () => {
    // Save scores first if dirty
    if (isDirty) {
      const data = watch();
      const scoresList = Object.entries(data.scores).map(([kpiId, score]) => ({
        kpi_id: Number(kpiId),
        score: Number(score),
      }));
      await scoreMutation.mutateAsync({ scores: scoresList });
    }

    approveMutation.mutate(undefined, {
      onSuccess: () => {
        setIsApproveModalOpen(false);
        refetch();
      },
    });
  };

  if (isLoading) return <div className="p-12 text-center">جاري التحميل...</div>;
  if (!evaluation)
    return <div className="p-12 text-center">التقييم غير موجود</div>;

  const isReadOnly = evaluation.status !== "draft";
  const scores = watch("scores") || {};

  // Calculate weighted score locally for preview
  const currentWeightedScore =
    evaluation.template?.kpis?.reduce((total, kpi) => {
      const score = scores[kpi.id] || 0;
      return total + (score / kpi.max_score) * kpi.weight;
    }, 0) || 0;

  // Check if all scores are entered
  const allScoresEntered =
    evaluation.template?.kpis?.every((kpi) => {
      const score = scores[kpi.id];
      return score !== undefined && score !== null && !isNaN(score);
    }) ?? false;

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
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSaveScores)} className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
            <table className="table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/3">المؤشر</th>
                  <th className="w-24 text-center">الوزن</th>
                  <th className="text-center">التقييم</th>
                </tr>
              </thead>
              <tbody>
                {evaluation.template?.kpis?.map((kpi) => {
                  const scoreError = (
                    errors.scores as Record<string, { message?: string }>
                  )?.[kpi.id]?.message;
                  return (
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
                        <span className="badge badge-ghost text-lg font-bold">
                          {kpi.weight}%
                        </span>
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <KPIScoreInput
                            score={scores[kpi.id] || 0}
                            maxScore={kpi.max_score}
                            weight={kpi.weight}
                            readOnly={isReadOnly}
                            error={scoreError}
                            onChange={(val) => {
                              setValue(`scores.${kpi.id}`, val, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary row showing total */}
          {evaluation.status === "draft" && (
            <div className="flex items-center justify-between rounded-lg border border-emerald-600/20 bg-emerald-600/5 p-4">
              <div className="font-semibold text-gray-700">
                الدرجة الموزونة الحالية:
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-emerald-600">
                  {currentWeightedScore.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">من 100%</span>
              </div>
            </div>
          )}

          {/* Validation error summary */}
          {Object.keys(errors.scores || {}).length > 0 && (
            <div className="border-error/30 bg-error/10 text-error rounded-lg border p-4">
              <p className="font-semibold">يرجى تصحيح الأخطاء التالية:</p>
              <ul className="mt-2 list-inside list-disc text-sm">
                {Object.entries(
                  errors.scores as Record<string, { message?: string }>,
                ).map(([kpiId, error]) => (
                  <li key={kpiId}>{error?.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(-1)}
            >
              عودة
            </button>

            <div className="flex gap-3">
              {evaluation.status === "draft" && (
                <>
                  <button
                    type="submit"
                    className="btn btn-outline"
                    disabled={scoreMutation.isPending || !isDirty}
                  >
                    حفظ المسودة
                  </button>
                  <button
                    type="button"
                    className="btn-primary text-white"
                    onClick={onApproveEvaluation}
                    disabled={
                      approveMutation.isPending ||
                      scoreMutation.isPending ||
                      !allScoresEntered
                    }
                  >
                    اعتماد التقييم
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </FormProvider>

      {/* Approval Confirmation Modal */}
      {isApproveModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">تأكيد اعتماد التقييم</h3>
            <p className="py-4">
              هل أنت متأكد من اعتماد التقييم؟ لا يمكن تعديل الدرجات بعد
              الاعتماد.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setIsApproveModalOpen(false)}
                disabled={approveMutation.isPending}
              >
                إلغاء
              </button>
              <button
                className="btn-primary text-white"
                onClick={handleConfirmApproval}
                disabled={approveMutation.isPending}
              >
                {approveMutation.isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "تأكيد الاعتماد"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
