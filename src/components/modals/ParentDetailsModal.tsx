import type { ParentDetails } from "@/types/Parents";
import type { StudentDetails } from "@/types/Students";
import { useState } from "react";
import { User, Mail, Phone, MapPin, Hash, Briefcase, Home, Link2 } from "lucide-react";
import { StudentDetailsModal } from "./StudentDetailsModal";

interface ParentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  parent: ParentDetails | null;
  onUnlink?: (studentId: number) => Promise<void>;
}

export const ParentDetailsModal = ({ isOpen, onClose, parent, onUnlink }: ParentDetailsModalProps) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentDetails | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  if (!isOpen || !parent) return null;

  const openStudentModal = (student: StudentDetails) => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 px-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 overflow-y-auto max-h-[85vh]">
          <h2 className="text-2xl font-bold mb-2 text-emerald-700">تفاصيل ولي الأمر</h2>
          <p className="text-gray-600 mb-6">عرض بيانات ولي الأمر واطفالهم المرتبطين</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-sm font-semibold">الاسم</div>
                  <div className="text-sm">{parent.user.full_name}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-sm font-semibold">البريد</div>
                  <div className="text-sm">{parent.user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-sm font-semibold">الهاتف</div>
                  <div className="text-sm">{parent.user.phone ?? "-"}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-sm font-semibold">الفروع</div>
                  <div className="text-sm">{(parent.user.branches || []).map(b => b.name).join("، ") || "-"}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-sm font-semibold">الوظيفة</div>
                  <div className="text-sm">{parent.occupation ?? "-"}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-sm font-semibold">العنوان</div>
                  <div className="text-sm">{parent.address ?? "-"}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-sm font-semibold">نوع العلاقة</div>
                  <div className="text-sm">{parent.relationship_type}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">الأطفال المرتبطين</h3>
            <div className="grid gap-3">
              {(parent.children || []).length === 0 && <div className="text-sm text-gray-500">لا يوجد أطفال مرتبطين</div>}
              {(parent.children || []).map(child => (
                <div key={child.student_id} className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-medium">{child.full_name}</div>
                      <div className="text-sm text-gray-500">{child.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUnlink?.(child.student_id)}
                      className="px-3 py-1 text-sm rounded-md bg-red-50 text-red-700 border border-red-100 hover:bg-red-100"
                    >
                      إزالة الارتباط
                    </button>
                    <button
                      onClick={() => openStudentModal(child)}
                      className="px-3 py-1 text-sm rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 flex items-center gap-1"
                    >
                      عرض تفاصيل الطالب
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">إغلاق</button>
          </div>
        </div>
      </div>

      {selectedStudent && (
        <StudentDetailsModal
          isOpen={isStudentModalOpen}
          onClose={closeStudentModal}
          student={selectedStudent}
        />
      )}
    </>
  );
};

export default ParentDetailsModal;