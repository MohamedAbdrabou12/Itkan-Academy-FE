import { useState } from "react";
import { PlusIcon, PencilIcon } from "lucide-react";
import { useGetEvaluationCycles } from "@/hooks/staffEvaluation/useGetEvaluationCycles";
import { useCreateEvaluationCycle } from "@/hooks/staffEvaluation/useCreateEvaluationCycle";
import { useUpdateEvaluationCycle } from "@/hooks/staffEvaluation/useUpdateEvaluationCycle";
import type { EvaluationCycle } from "@/types/staffEvaluation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import HookFormInput from "@/components/forms/HookFormInput";

const cycleSchema = z.object({
  name: z.string().min(1, "اسم الدورة مطلوب"),
  start_date: z.string().min(1, "تاريخ البداية مطلوب"),
  end_date: z.string().min(1, "تاريخ النهاية مطلوب"),
  is_active: z.boolean().optional(),
});

type CycleFormValues = z.infer<typeof cycleSchema>;

export default function EvaluationCyclesPage() {
  const { data: cycles, isLoading } = useGetEvaluationCycles();
  const createMutation = useCreateEvaluationCycle();
  const updateMutation = useUpdateEvaluationCycle();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<EvaluationCycle | null>(
    null,
  );

  const form = useForm<CycleFormValues>({
    resolver: zodResolver(cycleSchema),
    defaultValues: {
      is_active: true,
    },
  });

  const { register, handleSubmit, reset } = form;

  const onSubmit = (data: CycleFormValues) => {
    // Ensure is_active is boolean
    const payload = {
      ...data,
      is_active: data.is_active ?? true,
    };

    if (editingCycle) {
      updateMutation.mutate(
        { id: editingCycle.id, data: payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingCycle(null);
            reset();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        },
      });
    }
  };

  const openEditModal = (cycle: EvaluationCycle) => {
    setEditingCycle(cycle);
    reset({
      name: cycle.name,
      start_date: cycle.start_date,
      end_date: cycle.end_date,
      is_active: cycle.is_active,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingCycle(null);
    reset({
      name: "",
      start_date: "",
      end_date: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">دورات التقييم</h1>
          <p className="mt-1 text-gray-600">إدارة فترات تقييم الأداء</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary gap-2">
          <PlusIcon className="h-5 w-5" />
          إضافة دورة
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cycles?.map((cycle) => (
            <div
              key={cycle.id}
              className={`card bg-base-100 border shadow-sm ${
                cycle.is_active ? "border-green-200" : "border-gray-200"
              }`}
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <h2 className="card-title text-gray-800">{cycle.name}</h2>
                  {cycle.is_active ? (
                    <span className="badge badge-success gap-1">نشط</span>
                  ) : (
                    <span className="badge badge-ghost gap-1">غير نشط</span>
                  )}
                </div>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p>البداية: {cycle.start_date}</p>
                  <p>النهاية: {cycle.end_date}</p>
                </div>
                <div className="card-actions mt-4 justify-end">
                  <button
                    onClick={() => openEditModal(cycle)}
                    className="btn btn-sm btn-ghost gap-1"
                  >
                    <PencilIcon className="h-4 w-4" />
                    تعديل
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="mb-4 text-lg font-bold">
              {editingCycle ? "تعديل دورة تقييم" : "إضافة دورة تقييم"}
            </h3>
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <HookFormInput
                  name="name"
                  label="اسم الدورة"
                  type="text"
                  placeholder="مثال: الربع الأول 2026"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <HookFormInput
                    name="start_date"
                    label="تاريخ البداية"
                    type="date"
                    required
                  />
                  <HookFormInput
                    name="end_date"
                    label="تاريخ النهاية"
                    type="date"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <span className="label-text">نشط</span>
                    <input
                      type="checkbox"
                      {...register("is_active")}
                      className="checkbox checkbox-success"
                    />
                  </label>
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
                    className="btn-primary"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "جاري الحفظ..."
                      : "حفظ"}
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
