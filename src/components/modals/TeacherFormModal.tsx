import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FormProvider,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { Modal } from "../shared/Modal";

import { useGetClassesByBranchs } from "@/hooks/classes/useGetClassesByBranchs";
import { teacherSchema, type TeacherFormData } from "@/validation/teacher";
import HookFormInput from "../forms/HookFormInput";
import HookFormMultiSelect from "../forms/HookFormMultiSelect";
import { useEffect } from "react";
import { useCreateTeacher } from "@/hooks/teachers/useCreateTeacher";
import { useUpdateTeacher } from "@/hooks/teachers/useUpdateTeacher";

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: (TeacherFormData & { id: number }) | null;
}

export const TeacherFormModal = ({
  isOpen,
  onClose,
  initialValues,
}: TeacherFormModalProps) => {
  const createMutation = useCreateTeacher();
  const updateMutation = useUpdateTeacher();

  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema) as Resolver<TeacherFormData>,
    mode: "onChange",

    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      branch_ids: [],
      class_ids: [],
    },
  });

  console.log("rerebded");

  const selectedBranchs = useWatch({
    name: "branch_ids",
    control: form.control,
  }) as string[];

  const { branches } = useGetAllBranches();
  const { classes } = useGetClassesByBranchs(selectedBranchs);

  const branchesOptions = branches.map((branch) => ({
    value: `${branch.id}`,
    label: branch.name,
  }));

  const classesOptions =
    classes?.map((cls) => ({
      value: `${cls.id}`,
      label: cls.name,
    })) || [];

  function onCloseHandler() {
    onClose();
    form.reset();
  }

  const onSubmitHandler = async (data: TeacherFormData) => {
    if (initialValues) {
      await updateMutation.mutateAsync({
        id: initialValues.id,
        ...data,
      });
      onCloseHandler();
    } else {
      await createMutation.mutateAsync(data);
      onCloseHandler();
    }
  };

  useEffect(() => {
    if (initialValues) {
      //  set initial values
      form.setValue("full_name", initialValues.full_name);
      form.setValue("email", initialValues.email);
      form.setValue("phone", initialValues.phone);
      form.setValue("branch_ids", initialValues.branch_ids);
      form.setValue("class_ids", initialValues.class_ids);
    } else {
      form.setValue("full_name", "");
      form.setValue("email", "");
      form.setValue("phone", "");
      form.setValue("branch_ids", []);
      form.setValue("class_ids", []);
    }
    console.log("reset");
  }, [form, initialValues]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler}>
      <FormProvider {...form} key={initialValues?.id}>
        <form onSubmit={form.handleSubmit(onSubmitHandler)}>
          <div className="grid grid-cols-1 gap-4">
            <HookFormInput
              label="الاسم"
              name="full_name"
              placeholder="ادخل اسم المعلم"
              required
            />
            <HookFormInput
              label="البريد الالكتروني"
              name="email"
              placeholder="ادخل البريد الالكترونى"
              required
            />
            <HookFormInput
              label="رقم الهاتف"
              name="phone"
              placeholder="رقم الهاتف"
            />

            <HookFormMultiSelect
              label="الفروع"
              name="branch_ids"
              required
              options={branchesOptions}
              placeholder="اختر الفرع"
            />

            <HookFormMultiSelect
              label="الفصول"
              name="class_ids"
              disabled={!selectedBranchs.length}
              options={classesOptions}
              placeholder="اختر الفصل"
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
