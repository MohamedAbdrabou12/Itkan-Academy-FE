import { useGetMe } from "@/hooks/auth/useGetMe";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  FileText,
  Settings,
} from "lucide-react";

export default function GeneralManagerDashboardPage() {
  const { me } = useGetMe();

  const getRoleTitle = (role: string) => {
    const titles: Record<string, string> = {
      general_manager: "المدير العام",
      administrative_manager: "المدير الإداري",
      academic_manager: "المدير الأكاديمي",
      student_affairs_manager: "مدير شؤون الطلاب",
      hr_manager: "مدير الموارد البشرية",
      financial_manager: "المدير المالي",
      general_supervisor: "المشرف العام",
      branch_supervisor: "مشرف الفرع",
    };
    return titles[role] || "لوحة التحكم";
  };

  const overallStats = [
    {
      icon: Users,
      label: "إجمالي الطلاب",
      value: "2,547",
      change: "+12%",
      color: "emerald",
    },
    {
      icon: BookOpen,
      label: "عدد المعلمين",
      value: "124",
      change: "+5%",
      color: "emerald",
    },
    {
      icon: DollarSign,
      label: "الإيرادات الشهرية",
      value: "450,000 ر.س",
      change: "+8%",
      color: "purple",
    },
    {
      icon: TrendingUp,
      label: "معدل الحضور",
      value: "92%",
      change: "+3%",
      color: "orange",
    },
  ];

  const branchPerformance = [
    {
      name: "فرع الملقا",
      students: 450,
      teachers: 20,
      revenue: 85000,
      attendance: 94,
    },
    {
      name: "فرع النرجس",
      students: 380,
      teachers: 18,
      revenue: 72000,
      attendance: 91,
    },
    {
      name: "فرع الياسمين",
      students: 420,
      teachers: 19,
      revenue: 79000,
      attendance: 93,
    },
    {
      name: "فرع العليا",
      students: 400,
      teachers: 17,
      revenue: 75000,
      attendance: 90,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "enrollment",
      text: "تسجيل 15 طالب جديد في فرع الملقا",
      time: "منذ ساعة",
      icon: Users,
    },
    {
      id: 2,
      type: "payment",
      text: "استلام 35 دفعة شهرية بمبلغ 70,000 ر.س",
      time: "منذ ساعتين",
      icon: DollarSign,
    },
    {
      id: 3,
      type: "achievement",
      text: "تخريج 12 حافظ من فرع النرجس",
      time: "منذ 3 ساعات",
      icon: BookOpen,
    },
    {
      id: 4,
      type: "report",
      text: "تقرير الأداء الشهري جاهز للمراجعة",
      time: "منذ 5 ساعات",
      icon: FileText,
    },
  ];

  const quickActions = [
    {
      title: "إدارة الفروع",
      icon: Settings,
      color: "emerald",
      path: "/manage/branches",
    },
    { title: "التقارير", icon: BarChart3, color: "emerald", path: "/reports" },
    {
      title: "الموارد البشرية",
      icon: Users,
      color: "purple",
      path: "/manage/hr",
    },
    {
      title: "المالية",
      icon: DollarSign,
      color: "orange",
      path: "/manage/finance",
    },
    {
      title: "الطلاب",
      icon: BookOpen,
      color: "teal",
      path: "/manage/students",
    },
    {
      title: "الامتحانات",
      icon: FileText,
      color: "pink",
      path: "/manage/exams",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            مرحباً، {me?.name}
          </h1>
          <p className="text-gray-600">{getRoleTitle(me?.role || "")}</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {overallStats.map((stat, index) => (
            <div key={index} className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`bg-${stat.color}-100 flex h-12 w-12 items-center justify-center rounded-lg`}
                >
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {stat.change}
                </span>
              </div>
              <h3 className="mb-1 text-2xl font-bold text-gray-900">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  أداء الفروع
                </h2>
                <PieChart className="h-6 w-6 text-gray-400" />
              </div>

              <div className="space-y-4">
                {branchPerformance.map((branch, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <h3 className="mb-3 font-bold text-gray-900">
                      {branch.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <div>
                        <p className="text-gray-600">الطلاب</p>
                        <p className="font-bold text-emerald-600">
                          {branch.students}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">المعلمون</p>
                        <p className="font-bold text-emerald-600">
                          {branch.teachers}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">الإيرادات</p>
                        <p className="font-bold text-purple-600">
                          {branch.revenue.toLocaleString()} ر.س
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">الحضور</p>
                        <p className="font-bold text-orange-600">
                          {branch.attendance}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                إجراءات سريعة
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={`bg-${action.color}-50 border border-${action.color}-200 rounded-lg p-4 hover:bg-${action.color}-100 text-center transition`}
                  >
                    <action.icon
                      className={`h-8 w-8 text-${action.color}-600 mx-auto mb-2`}
                    />
                    <span
                      className={`text-${action.color}-700 text-sm font-semibold`}
                    >
                      {action.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                النشاطات الأخيرة
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 space-x-reverse"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <activity.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.text}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-linear-to-br rounded-xl from-emerald-500 to-teal-600 p-6 text-white shadow-lg">
              <h3 className="mb-4 text-xl font-bold">إحصائيات هذا الشهر</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>طلاب جدد</span>
                  <span className="text-2xl font-bold">156</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/20">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{ width: "78%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span>حفاظ جدد</span>
                  <span className="text-2xl font-bold">24</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/20">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                التنبيهات
              </h3>
              <div className="space-y-3">
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <p className="text-sm font-semibold text-yellow-800">
                    15 دفعة متأخرة
                  </p>
                  <p className="mt-1 text-xs text-yellow-600">
                    يرجى المتابعة مع أولياء الأمور
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-sm font-semibold text-emerald-800">
                    اجتماع الإدارة
                  </p>
                  <p className="mt-1 text-xs text-emerald-600">
                    غداً الساعة 10:00 صباحاً
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
