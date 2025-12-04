import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { useCreateStaff } from "@/hooks/staff/useCreateStaff";
import { useUpdateStaff } from "@/hooks/staff/useUpdateStaff";
import { staffSchema, type StaffFormData } from "@/validation/staffSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import HookFormInput from "../forms/HookFormInput";
import HookFormMultiSelect from "../forms/HookFormMultiSelect";
import { Modal } from "../shared/Modal";
import HookFormSelect from "../forms/HookFormSelect";
import { useGetAllRoles } from "@/hooks/roles/useGetAllRoles";
import { UserRole } from "@/types/Roles";

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: (StaffFormData & { id: number }) | null;
}

export const StaffFormModal = ({
  isOpen,
  onClose,
  initialValues,
}: StaffFormModalProps) => {
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const { allRoles } = useGetAllRoles();

  const roleOptions = useMemo(
    () =>
      allRoles?.items
        ?.filter(
          (role) =>
            role.name !== UserRole.STUDENT && role.name !== UserRole.TEACHER,
        )
        .map((role) => ({
          value: role.id.toString(),
          label: role.name_ar,
        })) || [],
    [allRoles?.items],
  );

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema) as Resolver<StaffFormData>,
    mode: "onChange",

    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      status: "active",
      branch_ids: [],
    },
  });

  console.log("rerebded");

  const { branches } = useGetAllBranches();

  const branchesOptions = branches.map((branch) => ({
    value: `${branch.id}`,
    label: branch.name,
  }));

  function onCloseHandler() {
    onClose();
    form.reset();
  }

  const onSubmitHandler = async (data: StaffFormData) => {
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
      form.setValue("role_id", initialValues.role_id);
      form.setValue("status", initialValues.status);
      form.setValue("branch_ids", initialValues.branch_ids);
    } else {
      form.setValue("full_name", "");
      form.setValue("email", "");
      form.setValue("phone", "");
      form.setValue("role_id", roleOptions[0]?.value ?? undefined);
      form.setValue("status", "active");
      form.setValue("branch_ids", []);
    }
    console.log("reset");
  }, [form, initialValues, roleOptions]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler}>
      <FormProvider {...form} key={initialValues?.id}>
        <form onSubmit={form.handleSubmit(onSubmitHandler)}>
          <div className="grid grid-cols-1 gap-4">
            <HookFormInput
              label="الاسم"
              name="full_name"
              placeholder="ادخل اسم المدير"
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

            <HookFormSelect
              label="الدور"
              name="role_id"
              required
              options={roleOptions}
              placeholder="اختر الدور"
            />

            <HookFormMultiSelect
              label="الفروع"
              name="branch_ids"
              required
              options={branchesOptions}
              placeholder="اختر الفرع"
            />

            <HookFormSelect
              name="status"
              label="الحالة"
              required
              options={[
                { value: "active", label: "نشط" },
                { value: "deactive", label: "غير نشط" },
              ]}
              placeholder="اختر الحالة"
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
