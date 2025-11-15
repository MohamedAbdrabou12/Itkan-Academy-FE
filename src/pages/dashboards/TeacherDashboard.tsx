import { useState } from "react";
import {
  Users,
  BookOpen,
  CheckSquare,
  Calendar,
  TrendingUp,
  Clock,
  X,
  FileDown,
  FileText,
} from "lucide-react";

export default function TeacherDashboardPage() {
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("اليوم");

  const students = [
    "محمد أحمد",
    "عبدالله سعيد",
    "فاطمة علي",
    "خالد يوسف",
    "سارة محمود",
  ];

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filteredStudents = students.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = [
    { icon: Users, label: "عدد الطلاب", value: "45", color: "emerald" },
    { icon: BookOpen, label: "الحلقات النشطة", value: "3", color: "emerald" },
    {
      icon: CheckSquare,
      label: "التقييمات اليوم",
      value: "12",
      color: "purple",
    },
    { icon: TrendingUp, label: "معدل التقدم", value: "85%", color: "orange" },
  ];

  const todayClasses = [
    {
      id: 1,
      name: "حلقة الفجر",
      time: "06:00 ص",
      students: 15,
      status: "completed",
    },
    {
      id: 2,
      name: "حلقة الظهر",
      time: "01:00 م",
      students: 18,
      status: "active",
    },
    {
      id: 3,
      name: "حلقة المغرب",
      time: "06:00 م",
      students: 12,
      status: "upcoming",
    },
  ];

  const pendingAssessments = [
    {
      id: 1,
      student: "محمد أحمد",
      class: "حلقة الفجر",
      date: "اليوم",
      type: "حفظ",
    },
    {
      id: 2,
      student: "عبدالله سعيد",
      class: "حلقة الظهر",
      date: "اليوم",
      type: "مراجعة",
    },
    {
      id: 3,
      student: "فاطمة علي",
      class: "حلقة الفجر",
      date: "أمس",
      type: "حفظ",
    },
  ];

  const studentsData = [
    { name: "محمد أحمد", evaluation: "ممتاز", absence: "حاضر" },
    { name: "عبدالله سعيد", evaluation: "جيد جدًا", absence: "غائب" },
    { name: "فاطمة علي", evaluation: "جيد", absence: "حاضر" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            لوحة تحكم المعلم
          </h1>
          <p className="text-gray-600">إدارة الحلقات ومتابعة الطلاب</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-xl bg-white p-6 shadow-lg">
              <div
                className={`bg-${stat.color}-100 mb-4 flex h-12 w-12 items-center justify-center rounded-lg`}
              >
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <h3 className="mb-1 text-3xl font-bold text-gray-900">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Today's Classes & Assessments */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Classes */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">حلقات اليوم</h2>
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>

            <div className="space-y-4">
              {todayClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">{cls.name}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        cls.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : cls.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {cls.status === "completed"
                        ? "مكتملة"
                        : cls.status === "active"
                          ? "جارية"
                          : "قادمة"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{cls.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{cls.students} طالب</span>
                    </div>
                  </div>
                  <button className="mt-3 w-full rounded-lg bg-emerald-600 py-2 text-sm text-white transition hover:bg-emerald-700">
                    {cls.status === "active" ? "انضم للحصة" : "عرض التفاصيل"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Assessments */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                التقييمات المطلوبة
              </h2>
              <CheckSquare className="h-6 w-6 text-gray-400" />
            </div>

            <div className="space-y-4">
              {pendingAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="rounded-lg border border-gray-200 p-4 transition hover:border-emerald-300"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">
                      {assessment.student}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        assessment.type === "حفظ"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {assessment.type}
                    </span>
                  </div>
                  <p className="mb-1 text-sm text-gray-600">
                    {assessment.class}
                  </p>
                  <p className="mb-3 text-xs text-gray-500">
                    {assessment.date}
                  </p>
                  <button
                    onClick={() => setShowAssessmentModal(true)}
                    className="w-full rounded-lg bg-emerald-600 py-2 text-sm text-white transition hover:bg-emerald-700"
                  >
                    إدخال التقييم
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            إجراءات سريعة
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <button
              onClick={() => setShowAbsenceModal(true)}
              className="rounded-lg bg-emerald-100 p-4 font-semibold text-emerald-700 transition hover:bg-emerald-200"
            >
              تسجيل الحضور
            </button>
            <button
              onClick={() => setShowAssessmentModal(true)}
              className="rounded-lg bg-emerald-100 p-4 font-semibold text-emerald-700 transition hover:bg-emerald-200"
            >
              إضافة تقييم
            </button>
            <button
              onClick={() => setShowStudentsModal(true)}
              className="rounded-lg bg-purple-100 p-4 font-semibold text-purple-700 transition hover:bg-purple-200"
            >
              عرض طلابي
            </button>
            <button
              onClick={() => setShowReports(true)}
              className="rounded-lg bg-orange-100 p-4 font-semibold text-orange-700 transition hover:bg-orange-200"
            >
              التقارير
            </button>
          </div>
        </div>
      </div>

      {/* === Modals === */}

      {/* Absence Modal */}
      {showAbsenceModal && (
        <Modal
          title="تسجيل غياب الطلاب"
          onClose={() => setShowAbsenceModal(false)}
        >
          <input
            type="text"
            placeholder="اكتب اسم الطالب..."
            className="mb-2 w-full rounded-lg border p-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="mb-4 max-h-40 overflow-y-auto">
            {filteredStudents.map((name) => (
              <label
                key={name}
                className="flex items-center space-x-2 space-x-reverse py-1"
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(name)}
                  onChange={() =>
                    setSelectedStudents((prev) =>
                      prev.includes(name)
                        ? prev.filter((n) => n !== name)
                        : [...prev, name],
                    )
                  }
                />
                <span>{name}</span>
              </label>
            ))}
          </div>
          <button className="w-full rounded-lg bg-emerald-600 py-2 text-white transition hover:bg-emerald-700">
            حفظ الغياب
          </button>
        </Modal>
      )}

      {/* Assessment Modal */}
      {showAssessmentModal && (
        <Modal
          title="إضافة تقييم جديد"
          onClose={() => setShowAssessmentModal(false)}
        >
          <input
            type="text"
            placeholder="اسم الطالب"
            className="mb-2 w-full rounded-lg border p-2"
          />
          <select className="mb-2 w-full rounded-lg border p-2">
            <option>نوع التقييم</option>
            <option>حفظ</option>
            <option>مراجعة</option>
          </select>
          <input type="date" className="mb-4 w-full rounded-lg border p-2" />
          <button className="w-full rounded-lg bg-emerald-600 py-2 text-white transition hover:bg-emerald-700">
            حفظ التقييم
          </button>
        </Modal>
      )}

      {/* Students Modal */}
      {showStudentsModal && (
        <Modal
          title={`طلاب يوم ${selectedDate}`}
          onClose={() => setShowStudentsModal(false)}
        >
          <div className="space-y-3">
            {studentsData.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
              >
                <span>{s.name}</span>
                <div className="text-sm">
                  <span className="mr-2 text-emerald-600">{s.evaluation}</span>
                  <span
                    className={`${
                      s.absence === "غائب" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {s.absence}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Reports Modal */}
      {showReports && (
        <Modal title="التقارير" onClose={() => setShowReports(false)}>
          <select
            className="mb-4 w-full rounded-lg border p-2"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option>اليوم</option>
            <option>أمس</option>
            <option>هذا الأسبوع</option>
            <option>هذا الشهر</option>
          </select>
          <div className="flex justify-between">
            <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
              <FileDown className="h-5 w-5" /> تحميل Excel
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
              <FileText className="h-5 w-5" /> طباعة PDF
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ====== Modal Component ====== */
function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute left-3 top-3 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

// import { Users, BookOpen, CheckSquare, Calendar, TrendingUp, Clock } from 'lucide-react';

// export default function TeacherDashboard() {
//   const stats = [
//     { icon: Users, label: 'عدد الطلاب', value: '45', color: 'emerald' },
//     { icon: BookOpen, label: 'الحلقات النشطة', value: '3', color: 'emerald' },
//     { icon: CheckSquare, label: 'التقييمات اليوم', value: '12', color: 'purple' },
//     { icon: TrendingUp, label: 'معدل التقدم', value: '85%', color: 'orange' }
//   ];

//   const todayClasses = [
//     { id: 1, name: 'حلقة الفجر', time: '06:00 ص', students: 15, status: 'completed' },
//     { id: 2, name: 'حلقة الظهر', time: '01:00 م', students: 18, status: 'active' },
//     { id: 3, name: 'حلقة المغرب', time: '06:00 م', students: 12, status: 'upcoming' }
//   ];

//   const pendingAssessments = [
//     { id: 1, student: 'محمد أحمد', class: 'حلقة الفجر', date: 'اليوم', type: 'حفظ' },
//     { id: 2, student: 'عبدالله سعيد', class: 'حلقة الظهر', date: 'اليوم', type: 'مراجعة' },
//     { id: 3, student: 'فاطمة علي', class: 'حلقة الفجر', date: 'أمس', type: 'حفظ' }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم المعلم</h1>
//           <p className="text-gray-600">إدارة الحلقات ومتابعة الطلاب</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {stats.map((stat, index) => (
//             <div key={index} className="bg-white rounded-xl shadow-lg p-6">
//               <div className={`bg-${stat.color}-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
//                 <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
//               </div>
//               <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
//               <p className="text-gray-600 text-sm">{stat.label}</p>
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">حلقات اليوم</h2>
//               <Calendar className="h-6 w-6 text-gray-400" />
//             </div>

//             <div className="space-y-4">
//               {todayClasses.map((cls) => (
//                 <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-bold text-gray-900">{cls.name}</h3>
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       cls.status === 'completed' ? 'bg-green-100 text-green-800' :
//                       cls.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
//                       'bg-gray-100 text-gray-800'
//                     }`}>
//                       {cls.status === 'completed' ? 'مكتملة' : cls.status === 'active' ? 'جارية' : 'قادمة'}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
//                       <Clock className="h-4 w-4" />
//                       <span>{cls.time}</span>
//                     </div>
//                     <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
//                       <Users className="h-4 w-4" />
//                       <span>{cls.students} طالب</span>
//                     </div>
//                   </div>
//                   <button className="mt-3 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition text-sm">
//                     {cls.status === 'active' ? 'انضم للحصة' : 'عرض التفاصيل'}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">التقييمات المطلوبة</h2>
//               <CheckSquare className="h-6 w-6 text-gray-400" />
//             </div>

//             <div className="space-y-4">
//               {pendingAssessments.map((assessment) => (
//                 <div key={assessment.id} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition">
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="font-bold text-gray-900">{assessment.student}</h3>
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                       assessment.type === 'حفظ' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-100 text-emerald-800'
//                     }`}>
//                       {assessment.type}
//                     </span>
//                   </div>
//                   <p className="text-gray-600 text-sm mb-1">{assessment.class}</p>
//                   <p className="text-gray-500 text-xs mb-3">{assessment.date}</p>
//                   <button className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition text-sm">
//                     إدخال التقييم
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">إجراءات سريعة</h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <button className="bg-emerald-100 text-emerald-700 p-4 rounded-lg hover:bg-emerald-200 transition font-semibold">
//               تسجيل الحضور
//             </button>
//             <button className="bg-emerald-100 text-emerald-700 p-4 rounded-lg hover:bg-emerald-200 transition font-semibold">
//               إضافة تقييم
//             </button>
//             <button className="bg-purple-100 text-purple-700 p-4 rounded-lg hover:bg-purple-200 transition font-semibold">
//               عرض طلابي
//             </button>
//             <button className="bg-orange-100 text-orange-700 p-4 rounded-lg hover:bg-orange-200 transition font-semibold">
//               التقارير
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
