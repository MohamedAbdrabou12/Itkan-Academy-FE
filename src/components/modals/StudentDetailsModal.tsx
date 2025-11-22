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
  BarChart,
  Hash
} from "lucide-react";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentDetails;
}

const fieldsWithIcons: Record<
  string,
  { label: string; icon: ReactNode }
> = {
  id: { label: "رقم الطالب", icon: <Hash className="w-5 h-5 text-emerald-600" /> },
  full_name: { label: "الاسم الكامل", icon: <User className="w-5 h-5 text-emerald-600" /> },
  email: { label: "البريد الإلكتروني", icon: <Mail className="w-5 h-5 text-emerald-600" /> },
  phone: { label: "الهاتف", icon: <Phone className="w-5 h-5 text-emerald-600" /> },
  branches: { label: "الفروع", icon: <MapPin className="w-5 h-5 text-emerald-600" /> },
  classes: { label: "الصفوف", icon: <BookOpen className="w-5 h-5 text-emerald-600" /> },
  admission_date: { label: "تاريخ القبول", icon: <CalendarCheck className="w-5 h-5 text-emerald-600" /> },
  curriculum_progress: { label: "تقدم المنهج", icon: <BarChart className="w-5 h-5 text-emerald-600" /> },
  status: { label: "الحالة", icon: <CheckCircle className="w-5 h-5 text-emerald-600" /> },
  created_at: { label: "تاريخ الإنشاء", icon: <Calendar className="w-5 h-5 text-emerald-600" /> },
  updated_at: { label: "آخر تحديث", icon: <Clock className="w-5 h-5 text-emerald-600" /> },
};

export const StudentDetailsModal = ({ isOpen, onClose, student }: StudentDetailsModalProps) => {
  if (!isOpen) return null;

  const renderValue = (key: string, value: unknown): ReactNode => {
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

    if (key === "curriculum_progress" && typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2);
    }

    return String(value ?? "");
  };

  const allowedFields = Object.keys(fieldsWithIcons);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 overflow-y-auto max-h-[85vh]">
        <h2 className="text-3xl font-bold mb-3 text-emerald-700">تفاصيل الطالب</h2>
        <p className="text-gray-600 mb-8">عرض معلومات الطالب الأساسية</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allowedFields.map((key) => {
            const field = fieldsWithIcons[key];
            const value = student[key as keyof StudentDetails];

            return (
              <div
                key={key}
                className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm"
              >
                <div>{field.icon}</div>

                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700 text-sm">{field.label}</span>
                  <span className="text-gray-900 text-sm mt-1">
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