import { useEffect, useState } from "react";
import { useGetClassesByBranch } from "@/hooks/classes/useGetClassesByBranch";
import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { studentSchema, type StudentFormData } from "@/validation/studentSchema";
import type { FormComponents, FormField } from "@/types/Forms";
import { FormInput } from "../forms/FormInput";
import { FormSelect } from "../forms/FormSelect";
import { FormTextArea } from "../forms/FormTextArea";
import { GenericFormModal } from "./GenericFormModal";
import {
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  CalendarCheck,
  CheckCircle
} from "lucide-react";

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void>;
  initialData?: StudentFormData;
  isSubmitting?: boolean;
  isEditing?: boolean;
  refetchStudents?: () => void;
}

export const StudentFormModal = (props: StudentFormModalProps) => {
  const { branches } = useGetAllBranches();
  const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(
    props.initialData?.branch_ids?.[0] || branches?.[0]?.id
  );

  const { classes, refetch } = useGetClassesByBranch(selectedBranchId);

  useEffect(() => {
    if (selectedBranchId) refetch();
  }, [selectedBranchId, refetch]);

  const getInitialData = (): StudentFormData =>
    props.initialData || {
      full_name: "",
      email: "",
      phone: "",
      branch_ids: branches?.[0] ? [branches[0].id] : [],
      class_ids: [],
      admission_date: new Date().toISOString().split("T")[0], // default to today
      curriculum_progress: {},
      status: "pending" as const,
    };

  const studentFields: FormField[] = [
    { name: "full_name", label: "الاسم الكامل", type: "text", required: true },
    { name: "email", label: "البريد الإلكتروني", type: "email", required: true },
    { name: "phone", label: "الهاتف", type: "phone", dir: "ltr" },
    {
      name: "branch_ids",
      label: "الفرع",
      type: "select",
      options: branches?.map((b) => ({ value: String(b.id), label: b.name })) || [],
      required: true,
    },
    {
      name: "class_ids",
      label: "الفصول",
      type: "select",
      options: classes?.map((c) => ({ value: String(c.id), label: c.name })) || [],
      required: false,
    },
    { name: "admission_date", label: "تاريخ القبول", type: "date" },
    {
      name: "status",
      label: "الحالة",
      type: "select",
      options: [
        { value: "pending", label: "معلق" },
        { value: "active", label: "نشط" },
        { value: "rejected", label: "مرفوض" },
        { value: "deactive", label: "غير نشط" },
      ],
    },
  ];

  // Map icons directly in formComponents
  const iconsMap: Record<string, JSX.Element> = {
    full_name: <User className="w-5 h-5 text-emerald-600" />,
    email: <Mail className="w-5 h-5 text-emerald-600" />,
    phone: <Phone className="w-5 h-5 text-emerald-600" />,
    branch_ids: <MapPin className="w-5 h-5 text-emerald-600" />,
    class_ids: <BookOpen className="w-5 h-5 text-emerald-600" />,
    admission_date: <CalendarCheck className="w-5 h-5 text-emerald-600" />,
    status: <CheckCircle className="w-5 h-5 text-emerald-600" />,
  };

  const formComponents: FormComponents = {
    Input: (props) => <FormInput {...props} icon={iconsMap[props.name]} />,
    TextArea: (props) => <FormTextArea {...props} icon={iconsMap[props.name]} />,
    Select: (props) => {
      const { value, onChange, options, name, ...rest } = props;
      return (
        <FormSelect
          {...rest}
          name={name}
          value={value}
          options={options}
          onChange={(val: string | string[]) => {
            if (name === "branch_ids" || name === "class_ids") {
              const arrVal: number[] = Array.isArray(val) ? val.map(Number) : [Number(val)];
              onChange(arrVal as unknown as string | string[]);
              if (name === "branch_ids") setSelectedBranchId(arrVal[0]);
            } else {
              const singleVal = Array.isArray(val) ? val[0] : val;
              onChange(singleVal);
            }
          }}
          disabled={name === "status"} // status field disabled
          icon={iconsMap[name]}
        />
      );
    },
  };

  return (
    <GenericFormModal
      {...props}
      schema={studentSchema}
      fields={studentFields}
      title={props.isEditing ? "تعديل الطالب" : "إضافة طالب جديد"}
      description={
        props.isEditing
          ? "قم بتحديث بيانات الطالب أدناه."
          : "املأ البيانات لإنشاء طالب جديد."
      }
      submitButtonText="إنشاء الطالب"
      editingSubmitButtonText="تحديث الطالب"
      formComponents={formComponents}
      initialData={getInitialData()}
      onSubmit={async (data) => {
        await props.onSubmit(data);
        if (props.refetchStudents) props.refetchStudents();
        props.onClose();
      }}
    />
  );
};