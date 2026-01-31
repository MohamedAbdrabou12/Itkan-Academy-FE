import { useState, useMemo } from "react";
import { PlusIcon, TrashIcon, PencilIcon } from "lucide-react";
import { useGetKPITemplates } from "@/hooks/staffEvaluation/useGetKPITemplates";
import { useCreateKPITemplate } from "@/hooks/staffEvaluation/useCreateKPITemplate";
import { useUpdateKPITemplate } from "@/hooks/staffEvaluation/useUpdateKPITemplate";
import { useGetTemplateKPIs } from "@/hooks/staffEvaluation/useGetTemplateKPIs";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { KPITemplateCreate } from "@/types/staffEvaluation";

// Shared KPI Schema
const kpiSchema = z.object({
  id: z.number().optional(), // Added ID for updates
  name: z.string().min(1, "اسم المؤشر مطلوب"),
  description: z.string().optional(),
  weight: z.number().min(1, "الوزن يجب أن يكون أكبر من 0").max(100),
  max_score: z.number().min(1).max(10).optional(),
});

// Schema for creating template with KPIs
const templateSchema = z
  .object({
    name: z.string().min(1, "اسم القالب مطلوب"),
    kpis: z.array(kpiSchema).min(1, "يجب إضافة مؤشر واحد على الأقل"),
  })
  .refine(
    (data) => {
      const totalWeight = data.kpis.reduce(
        (sum, kpi) => sum + (kpi.weight || 0),
        0,
      );
      return totalWeight === 100;
    },
    {
      message: "مجموع أوزان المؤشرات يجب أن يساوى 100%",
      path: ["kpis"], // Associate error with the kpis field
    },
  );

type TemplateFormValues = z.infer<typeof templateSchema>;

export default function KPITemplatesPage() {
  const { data: templates } = useGetKPITemplates();
  const createTemplateMutation = useCreateKPITemplate();

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const updateTemplateMutation = useUpdateKPITemplate(editingId || 0);

  // Template Form
  const {
    register: registerTemplate,
    control: controlTemplate,
    handleSubmit: handleSubmitTemplate,
    reset: resetTemplate,
    formState: { errors: templateErrors },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      kpis: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: controlTemplate,
    name: "kpis",
  });

  // Watch KPIs to calculate total weight dynamically
  const watchedKPIs = useWatch({
    control: controlTemplate,
    name: "kpis",
  });

  const currentTotalWeight = useMemo(() => {
    return (
      watchedKPIs?.reduce((sum, kpi) => sum + (Number(kpi?.weight) || 0), 0) ||
      0
    );
  }, [watchedKPIs]);

  const onTemplateSubmit = (data: TemplateFormValues) => {
    if (editingId) {
      updateTemplateMutation.mutate(
        {
          ...data,
        },
        {
          onSuccess: () => {
            setIsTemplateModalOpen(false);
            resetTemplate();
            setEditingId(null);
          },
        },
      );
    } else {
      createTemplateMutation.mutate(
        {
          ...data,
        } as KPITemplateCreate,
        {
          onSuccess: () => {
            setIsTemplateModalOpen(false);
            resetTemplate();
          },
        },
      );
    }
  };

  const TemplateDetails = ({
    templateId,
    onEdit,
  }: {
    templateId: number;
    onEdit: (kpis: any[]) => void;
  }) => {
    const { data: kpis, isLoading: isLoadingKPIs } =
      useGetTemplateKPIs(templateId);
    // createKPIMutation removed

    // We keep creation of individual KPIs for now if needed, but UI hides it in favor of edit modal?
    // The requirement implies we should edit via modal.
    // I left the existing "Add KPI" logic via modal below in the code but removed the button from UI in previous steps
    // to encourage using the new Edit flow.
    // However, the `isKPIModalOpen` logic is still there.
    // Let's keep it clean.

    // onKPISubmit removed

    const totalWeight =
      kpis?.reduce((sum, kpi) => sum + Number(kpi.weight), 0) || 0;

    return (
      <div className="mt-4 border-t pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">مؤشرات الأداء</h3>
          <button
            onClick={() => onEdit(kpis || [])}
            className="btn btn-sm btn-outline btn-primary"
            disabled={isLoadingKPIs}
          >
            <PencilIcon className="ml-2 h-4 w-4" />
            تعديل القالب والمؤشرات
          </button>
        </div>

        {totalWeight !== 100 && (
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
                  {/* Removed Actions Column */}
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
                    {/* Removed Delete Button */}
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
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    );
  };

  const openEditModal = (template: any, kpis: any[]) => {
    setEditingId(template.id);
    resetTemplate({
      name: template.name,
      kpis: kpis.map((k) => ({
        id: k.id,
        name: k.name,
        description: k.description,
        weight: Number(k.weight),
        max_score: k.max_score,
      })),
    });
    setIsTemplateModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingId(null);
    resetTemplate({
      name: "",
      kpis: [],
    });
    setIsTemplateModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">قوالب التقييم</h1>
          <p className="mt-1 text-gray-600">إعداد قوالب ومؤشرات الأداء</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
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
                <TemplateDetails
                  templateId={template.id}
                  onEdit={(kpis) => openEditModal(template, kpis)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Template Modal */}
      {isTemplateModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="mb-4 text-lg font-bold">
              {editingId ? "تعديل القالب" : "إضافة قالب جديد"}
            </h3>
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

              {/* Dynamic KPIs Section */}
              <div className="mt-6 border-t pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold">المؤشرات</h4>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs text-primary"
                    onClick={() =>
                      append({
                        name: "",
                        description: "",
                        weight: 0,
                        max_score: 5,
                      })
                    }
                  >
                    <PlusIcon className="h-4 w-4" />
                    إضافة مؤشر
                  </button>
                </div>

                {templateErrors.kpis && (
                  <div className="alert alert-error mb-4 py-2 text-sm">
                    {templateErrors.kpis.message ||
                      templateErrors.kpis.root?.message}
                  </div>
                )}

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="bg-base-200 relative rounded-lg p-4"
                    >
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="btn btn-circle btn-ghost btn-xs text-error absolute left-2 top-2"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="form-control">
                          <label className="label pb-1">
                            <span className="label-text text-xs">
                              اسم المؤشر
                            </span>
                          </label>
                          <input
                            {...registerTemplate(`kpis.${index}.name`)}
                            className="input input-bordered input-sm w-full"
                          />
                          {templateErrors.kpis?.[index]?.name && (
                            <span className="text-error text-xs">
                              {templateErrors.kpis[index]?.name?.message}
                            </span>
                          )}
                        </div>

                        <div className="form-control">
                          <label className="label pb-1">
                            <span className="label-text text-xs">الوصف</span>
                          </label>
                          <input
                            {...registerTemplate(`kpis.${index}.description`)}
                            className="input input-bordered input-sm w-full"
                          />
                        </div>

                        <div className="form-control">
                          <label className="label pb-1">
                            <span className="label-text text-xs">
                              الوزن (%)
                            </span>
                          </label>
                          <input
                            type="number"
                            {...registerTemplate(`kpis.${index}.weight`, {
                              valueAsNumber: true,
                            })}
                            className="input input-bordered input-sm w-full"
                          />
                          {templateErrors.kpis?.[index]?.weight && (
                            <span className="text-error text-xs">
                              {templateErrors.kpis[index]?.weight?.message}
                            </span>
                          )}
                        </div>

                        <div className="form-control">
                          <label className="label pb-1">
                            <span className="label-text text-xs">
                              أقصى درجة
                            </span>
                          </label>
                          <select
                            {...registerTemplate(`kpis.${index}.max_score`, {
                              valueAsNumber: true,
                            })}
                            className="select select-bordered select-sm w-full"
                          >
                            {[1, 2, 3, 4, 5, 10].map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {fields.length > 0 && (
                  <div className="mt-4 flex items-center justify-between border-t border-gray-300 pt-2">
                    <span className="font-bold">المجموع الكلي:</span>
                    <span
                      className={`font-bold ${
                        currentTotalWeight === 100
                          ? "text-success"
                          : "text-error"
                      }`}
                    >
                      {currentTotalWeight}%
                    </span>
                  </div>
                )}
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setIsTemplateModalOpen(false);
                    resetTemplate();
                    setEditingId(null);
                  }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    createTemplateMutation.isPending ||
                    updateTemplateMutation.isPending
                  }
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
