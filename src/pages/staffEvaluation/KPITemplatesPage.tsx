import { useState } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useGetKPITemplates } from "@/hooks/staffEvaluation/useGetKPITemplates";
import { useCreateKPITemplate } from "@/hooks/staffEvaluation/useCreateKPITemplate";
import { useGetTemplateKPIs } from "@/hooks/staffEvaluation/useGetTemplateKPIs";
import { useCreateKPI } from "@/hooks/staffEvaluation/useCreateKPI";
import { useDeleteKPI } from "@/hooks/staffEvaluation/useDeleteKPI";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema for creating template
const templateSchema = z.object({
  name: z.string().min(1, "اسم القالب مطلوب"),
  is_global: z.boolean().optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

// Schema for adding KPI
const kpiSchema = z.object({
  name: z.string().min(1, "اسم المؤشر مطلوب"),
  description: z.string().optional(),
  weight: z.number().min(1, "الوزن يجب أن يكون أكبر من 0").max(100),
  max_score: z.number().min(1).max(10).default(5),
});

type KPIFormValues = z.infer<typeof kpiSchema>;

export default function KPITemplatesPage() {
  const { data: templates } = useGetKPITemplates();
  const createTemplateMutation = useCreateKPITemplate();

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isKPIModalOpen, setIsKPIModalOpen] = useState(false);

  // Template Form
  const {
    register: registerTemplate,
    handleSubmit: handleSubmitTemplate,
    reset: resetTemplate,
    formState: { errors: templateErrors },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      is_global: false,
    },
  });

  // KPI Form
  const {
    register: registerKPI,
    handleSubmit: handleSubmitKPI,
    reset: resetKPI,
    formState: { errors: kpiErrors },
  } = useForm<KPIFormValues>({
    resolver: zodResolver(kpiSchema),
    defaultValues: { max_score: 5 },
  });

  const onTemplateSubmit = (data: TemplateFormValues) => {
    createTemplateMutation.mutate(
      {
        ...data,
        is_global: data.is_global ?? false,
      },
      {
        onSuccess: () => {
          setIsTemplateModalOpen(false);
          resetTemplate();
        },
      },
    );
  };

  const TemplateDetails = ({ templateId }: { templateId: number }) => {
    const { data: kpis, isLoading: isLoadingKPIs } =
      useGetTemplateKPIs(templateId);
    const createKPIMutation = useCreateKPI(templateId);
    const deleteKPIMutation = useDeleteKPI(templateId);

    const onKPISubmit = (data: KPIFormValues) => {
      createKPIMutation.mutate(data, {
        onSuccess: () => {
          setIsKPIModalOpen(false);
          resetKPI();
        },
      });
    };

    const totalWeight =
      kpis?.reduce((sum, kpi) => sum + Number(kpi.weight), 0) || 0;

    return (
      <div className="mt-4 border-t pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">مؤشرات الأداء</h3>
          <button
            onClick={() => setIsKPIModalOpen(true)}
            className="btn-primary "
            disabled={totalWeight >= 100}
          >
            <PlusIcon className="h-4 w-4" />
            إضافة مؤشر
          </button>
        </div>

        {totalWeight < 100 && (
          <div className="alert alert-warning mb-4 py-2 text-sm">
            تنبيه: مجموع الأوزان الحالي {totalWeight}% (يجب أن يكون 100%)
          </div>
        )}

        {isLoadingKPIs ? (
          <p className="text-center text-gray-500">جاري التحميل...</p>
        ) : kpis?.length === 0 ? (
          <p className="py-4 text-center text-gray-500">
            لا توجد مؤشرات مضافة بعد
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-zebra table w-full">
              <thead>
                <tr>
                  <th>المؤشر</th>
                  <th>الوزن</th>
                  <th>أقصى درجة</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {kpis?.map((kpi) => (
                  <tr key={kpi.id}>
                    <td>
                      <div className="font-medium">{kpi.name}</div>
                      {kpi.description && (
                        <div className="text-xs text-gray-500">
                          {kpi.description}
                        </div>
                      )}
                    </td>
                    <td>{kpi.weight}%</td>
                    <td>{kpi.max_score}</td>
                    <td>
                      <button
                        onClick={() => deleteKPIMutation.mutate(kpi.id)}
                        className="btn btn-ghost btn-xs text-error"
                        disabled={deleteKPIMutation.isPending}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="font-bold">المجموع</td>
                  <td
                    className={`font-bold ${totalWeight !== 100 ? "text-error" : "text-success"}`}
                  >
                    {totalWeight}%
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* KPI Modal */}
        {isKPIModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="mb-4 text-lg font-bold">إضافة مؤشر أداء</h3>
              <form
                onSubmit={handleSubmitKPI(onKPISubmit)}
                className="space-y-4"
              >
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">اسم المؤشر</span>
                  </label>
                  <input
                    type="text"
                    {...registerKPI("name")}
                    className="input input-bordered w-full"
                  />
                  {kpiErrors.name && (
                    <span className="text-error text-sm">
                      {kpiErrors.name.message}
                    </span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">الوصف (اختياري)</span>
                  </label>
                  <textarea
                    {...registerKPI("description")}
                    className="textarea textarea-bordered w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">الوزن (%)</span>
                    </label>
                    <input
                      type="number"
                      {...registerKPI("weight", { valueAsNumber: true })}
                      className="input input-bordered w-full"
                    />
                    {kpiErrors.weight && (
                      <span className="text-error text-sm">
                        {kpiErrors.weight.message}
                      </span>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">أقصى درجة</span>
                    </label>
                    <select
                      {...registerKPI("max_score", { valueAsNumber: true })}
                      className="select select-bordered w-full"
                    >
                      {[1, 2, 3, 4, 5, 10].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setIsKPIModalOpen(false)}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={createKPIMutation.isPending}
                  >
                    إضافة
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">قوالب التقييم</h1>
          <p className="mt-1 text-gray-600">إعداد قوالب ومؤشرات الأداء</p>
        </div>
        <button
          onClick={() => setIsTemplateModalOpen(true)}
          className="btn-primary"
        >
          <PlusIcon className="h-5 w-5" />
          قالب جديد
        </button>
      </div>

      <div className="grid gap-6">
        {templates?.map((template) => (
          <div
            key={template.id}
            className="card bg-base-100 border border-gray-200 shadow-sm"
          >
            <div className="card-body p-6">
              <div className="flex items-center justify-between">
                <h2 className="card-title text-xl text-gray-800">
                  {template.name}
                </h2>
                <button
                  onClick={() =>
                    setSelectedTemplateId(
                      selectedTemplateId === template.id ? null : template.id,
                    )
                  }
                  className="btn btn-ghost btn-sm"
                >
                  {selectedTemplateId === template.id
                    ? "إخفاء التفاصيل"
                    : "عرض التفاصيل"}
                </button>
              </div>

              {selectedTemplateId === template.id && (
                <TemplateDetails templateId={template.id} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="mb-4 text-lg font-bold">إضافة قالب جديد</h3>
            <form
              onSubmit={handleSubmitTemplate(onTemplateSubmit)}
              className="space-y-4"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text">اسم القالب</span>
                </label>
                <input
                  type="text"
                  {...registerTemplate("name")}
                  className="input input-bordered w-full"
                  placeholder="مثال: تقييم المعلمين الربع سنوي"
                />
                {templateErrors.name && (
                  <span className="text-error text-sm">
                    {templateErrors.name.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <span className="label-text">قالب عام</span>
                  <input
                    type="checkbox"
                    {...registerTemplate("is_global")}
                    className="checkbox checkbox-primary"
                  />
                </label>
                <span className="px-1 text-xs text-gray-500">
                  القوالب العامة يمكن استخدامها من قبل جميع المدراء
                </span>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsTemplateModalOpen(false)}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createTemplateMutation.isPending}
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
