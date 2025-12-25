import type { StudentDetails } from "@/types/Students";
import type { ReactNode } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  CheckCircle,
  Calendar,
  CalendarCheck,
  Clock,
  Hash,
  CreditCard,
} from "lucide-react";
import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { useGetClassesByBranches } from "@/hooks/classes/useGetClassesByBranches";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentDetails;
}

const fieldsWithIcons: Record<string, { label: string; icon: ReactNode }> = {
  id: { label: "رقم المستخدم", icon: <Hash className="w-4 h-4 text-emerald-600" /> },
  student_id: { label: "معرف الطالب", icon: <Hash className="w-4 h-4 text-emerald-600" /> },
  full_name: { label: "الاسم الكامل", icon: <User className="w-4 h-4 text-emerald-600" /> },
  national_id: { label: "الرقم القومي", icon: <CreditCard className="w-4 h-4 text-emerald-600" /> },
  email: { label: "البريد الإلكتروني", icon: <Mail className="w-4 h-4 text-emerald-600" /> },
  phone: { label: "الهاتف", icon: <Phone className="w-4 h-4 text-emerald-600" /> },
  branches: { label: "الفروع", icon: <MapPin className="w-4 h-4 text-emerald-600" /> },
  classes: { label: "الفصول", icon: <BookOpen className="w-4 h-4 text-emerald-600" /> },
  admission_date: { label: "تاريخ القبول", icon: <CalendarCheck className="w-4 h-4 text-emerald-600" /> },
  status: { label: "الحالة", icon: <CheckCircle className="w-4 h-4 text-emerald-600" /> },
  created_at: { label: "تاريخ الإنشاء", icon: <Calendar className="w-4 h-4 text-emerald-600" /> },
  updated_at: { label: "آخر تحديث", icon: <Clock className="w-4 h-4 text-emerald-600" /> },
};

const statusArabic: Record<string, string> = {
  pending: "معلق",
  active: "نشط",
  rejected: "مرفوض",
  deactive: "غير نشط",
};

export const StudentDetailsModal = ({
  isOpen,
  onClose,
  student,
}: StudentDetailsModalProps) => {
  const { branches } = useGetAllBranches();
  const { classes } = useGetClassesByBranches(
    student.branch_ids?.map(String)
  );

  if (!isOpen) return null;

  const renderValue = (key: string, value: unknown): ReactNode => {
    if (key === "branches" && student.branch_ids?.length && branches.length) {
      return branches
        .filter((b) => student.branch_ids!.includes(Number(b.id)))
        .map((b) => b.name)
        .join("، ");
    }

    if (key === "classes" && student.class_ids?.length && classes.length) {
      return classes
        .filter((c) => student.class_ids!.includes(Number(c.id)))
        .map((c) => c.name)
        .join("، ");
    }

    if (key === "status" && typeof value === "string") {
      return statusArabic[value] ?? value;
    }

    if (key === "admission_date" && typeof value === "string") {
      return value.split("T")[0];
    }

    if (Array.isArray(value)) {
      if (
        value.length > 0 &&
        typeof value[0] === "object" &&
        value[0] !== null &&
        "name" in (value[0] as Record<string, unknown>)
      ) {
        return value.map((v) => (v as { name: string }).name).join("، ");
      }
      return value.join("، ");
    }

    return String(value ?? "—");
  };

  const allowedFields = Object.keys(fieldsWithIcons);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 overflow-y-auto max-h-[85vh]">
        <div className="flex items-center mb-6">
          <User className="w-7 h-7 text-emerald-600 mr-3" />
          <h2 className="text-3xl font-bold text-emerald-700">
            تفاصيل الطالب
          </h2>
        </div>

        <p className="text-gray-900 mb-8 text-sm">
          عرض معلومات الطالب الأساسية
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allowedFields.map((key) => {
            if (key === "curriculum_progress") return null;

            const field = fieldsWithIcons[key];
            const value = student[key as keyof StudentDetails];

            return (
              <div
                key={key}
                className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow hover:shadow-lg transition"
              >
                <div className="mt-1">{field.icon}</div>
                <div className="flex flex-col">
                  <span className="font-semibold text-emerald-600 text-sm">
                    {field.label}
                  </span>
                  <span className="text-black text-sm mt-1">
                    {renderValue(key, value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-md"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;