import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FormProvider,
  useFieldArray,
  useForm,
  type Resolver,
} from "react-hook-form";
import { Modal } from "../shared/Modal";

import { useCreateClass } from "@/hooks/classes/useCreateClass";
import type { AddClassRequest, Class } from "@/types/classes";
import { classSchema, type ClassFormData } from "@/validation/classSchema";
import { useEffect } from "react";
import HookFormInput from "../forms/HookFormInput";
import HookFormSelect from "../forms/HookFormSelect";
import { useUpdateClass } from "@/hooks/classes/useUpdateClass";
import HookFormMultiSelect from "../forms/HookFormMultiSelect";
import { arabicDaysOptions } from "@/utils/getArabicDayName";
import { evaluationConfigOptions } from "@/utils/evaluationConfigOptions";

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: (Class & { id: number }) | null;
}

export const ClassFormModal = ({
  isOpen,
  onClose,
  initialValues,
}: ClassFormModalProps) => {
  const createMutation = useCreateClass();
  const updateMutation = useUpdateClass();

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classSchema) as Resolver<ClassFormData>,
    mode: "onChange",

    defaultValues: {
      name: "",
      schedule: [
        {
          day: "",
          time: "",
        },
      ],
      evaluation_config: [],
      branch_id: "",
    },
  });

  const { branches } = useGetAllBranches();

  const branchesOptions = branches.map((branch) => ({
    value: `${branch.id}`,
    label: branch.name,
  }));

  function onCloseHandler() {
    onClose();
    form.reset();
  }

  const onSubmitHandler = async (data: ClassFormData) => {
    const schedule = data.schedule.map((item) => {
      return { [item.day]: [item.time] };
    });
    const scheduleForRequest: Record<string, string[]> = {};
    schedule.forEach((item) => {
      const key = Object.keys(item)[0];
      const value = item[key];
      scheduleForRequest[key] = value;
    });

    const payload: AddClassRequest = {
      ...data,
      schedule: scheduleForRequest,
    };

    if (initialValues) {
      await updateMutation.mutateAsync({
        id: initialValues.id,
        ...payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    onCloseHandler();
  };

  useEffect(() => {
    if (initialValues) {
      //  set initial values
      form.setValue("name", initialValues.name);
      form.setValue("branch_id", String(initialValues.branch_id));
      form.setValue("evaluation_config", initialValues.evaluation_config);
      const schedule = Object.keys(initialValues.schedule).map((key) => ({
        day: key,
        time: initialValues.schedule[
          key as keyof typeof initialValues.schedule
        ][0],
      }));
      form.setValue("schedule", schedule);
    }
  }, [form, initialValues]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    append: appendSchedule,
    remove: removeSchedule,
    fields: scheduleFields,
  } = useFieldArray({
    control: form.control,
    name: "schedule",
  });

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler}>
      <FormProvider {...form} key={initialValues?.id}>
        <form onSubmit={form.handleSubmit(onSubmitHandler)}>
          <div className="grid grid-cols-1 gap-4">
            <HookFormInput
              label="الاسم"
              name="name"
              placeholder="ادخل اسم الفصل"
              required
            />

            {scheduleFields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <HookFormSelect
                  label="اليوم"
                  name={`schedule[${index}].day`}
                  placeholder="ادخل اليوم"
                  options={arabicDaysOptions}
                  required
                />
                <HookFormInput
                  label="الوقت"
                  type="time"
                  name={`schedule[${index}].time`}
                  placeholder="ادخل الوقت"
                  required
                />
                {scheduleFields.length > 1 && (
                  <div className="flex h-full items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeSchedule(index)}
                      className=" text-red-500"
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendSchedule({ day: "", time: "" })}
              className="text-emerald-600"
            >
              + إضافة موعد
            </button>

            <HookFormSelect
              label="الفرع"
              name="branch_id"
              required
              options={branchesOptions}
              placeholder="اختر الفرع"
            />

            <HookFormMultiSelect
              label="التقييمات"
              name="evaluation_config"
              required
              options={evaluationConfigOptions}
              placeholder="اختر الفرع"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCloseHandler}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => {
                console.log(form);
              }}
              className="rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  جاري الحفظ...
                </span>
              ) : initialValues ? (
                "حفظ"
              ) : (
                "اضافة"
              )}
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
