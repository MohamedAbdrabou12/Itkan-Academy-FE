import { useGetMe } from "@/hooks/auth/useGetMe";
import {
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function StudentDashboardPage() {
  const { me } = useGetMe();

  const stats = [
    {
      icon: BookOpen,
      label: "السور المحفوظة",
      value: "15",
      total: "30",
      color: "emerald",
      percent: 50,
    },
    {
      icon: Calendar,
      label: "نسبة الحضور",
      value: "92%",
      color: "emerald",
      percent: 92,
    },
    {
      icon: Award,
      label: "التقييم السلوكي",
      value: "4.8/5",
      color: "purple",
      percent: 96,
    },
    {
      icon: TrendingUp,
      label: "معدل التقدم",
      value: "ممتاز",
      color: "orange",
      percent: 85,
    },
  ];

  const upcomingClasses = [
    {
      id: 1,
      subject: "حلقة الحفظ",
      teacher: "الشيخ أحمد",
      time: "09:00 ص",
      date: "اليوم",
      status: "active",
    },
    {
      id: 2,
      subject: "درس التجويد",
      teacher: "الشيخ محمد",
      time: "11:00 ص",
      date: "اليوم",
      status: "upcoming",
    },
    {
      id: 3,
      subject: "حلقة المراجعة",
      teacher: "الشيخ عبدالله",
      time: "04:00 م",
      date: "غداً",
      status: "upcoming",
    },
  ];

  const recentAssessments = [
    {
      id: 1,
      type: "حفظ",
      surah: "سورة البقرة",
      from: "الآية 1",
      to: "الآية 20",
      score: 95,
      date: "2024-10-01",
      teacher: "الشيخ أحمد",
    },
    {
      id: 2,
      type: "مراجعة",
      surah: "سورة آل عمران",
      from: "الآية 1",
      to: "الآية 30",
      score: 90,
      date: "2024-09-30",
      teacher: "الشيخ أحمد",
    },
    {
      id: 3,
      type: "تجويد",
      surah: "أحكام النون الساكنة",
      from: "",
      to: "",
      score: 88,
      date: "2024-09-28",
      teacher: "الشيخ محمد",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            مرحباً، {me?.name}
          </h1>
          <p className="text-gray-600">تابع تقدمك في حفظ القرآن الكريم</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`bg-${stat.color}-100 flex h-12 w-12 items-center justify-center rounded-lg`}
                >
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
              </div>
              <p className="mb-2 text-sm text-gray-600">{stat.label}</p>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`bg-${stat.color}-500 h-2 rounded-full`}
                  style={{ width: `${stat.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  الحصص القادمة
                </h2>
                <Clock className="h-6 w-6 text-gray-400" />
              </div>

              <div className="space-y-4">
                {upcomingClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="rounded-lg border border-gray-200 p-4 transition hover:border-emerald-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-3 space-x-reverse">
                          <h3 className="font-bold text-gray-900">
                            {cls.subject}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              cls.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {cls.status === "active" ? "جارٍ الآن" : "قريباً"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          المعلم: {cls.teacher}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-emerald-600">{cls.time}</p>
                        <p className="text-sm text-gray-500">{cls.date}</p>
                      </div>
                    </div>
                    {cls.status === "active" && (
                      <button className="mt-4 w-full rounded-lg bg-emerald-600 py-2 text-white transition hover:bg-emerald-700">
                        انضم للحصة
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                التقييمات الأخيرة
              </h2>

              <div className="space-y-4">
                {recentAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center space-x-2 space-x-reverse">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              assessment.type === "حفظ"
                                ? "bg-emerald-100 text-emerald-800"
                                : assessment.type === "مراجعة"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {assessment.type}
                          </span>
                          <span
                            className={`flex items-center space-x-1 space-x-reverse ${
                              assessment.score >= 90
                                ? "text-green-600"
                                : assessment.score >= 75
                                  ? "text-emerald-600"
                                  : "text-orange-600"
                            }`}
                          >
                            {assessment.score >= 90 ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                            <span className="font-bold">
                              {assessment.score}%
                            </span>
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900">
                          {assessment.surah}
                        </h3>
                        {assessment.from && (
                          <p className="text-sm text-gray-600">
                            من {assessment.from} إلى {assessment.to}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          المعلم: {assessment.teacher}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(assessment.date).toLocaleDateString("ar-SA")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-linear-to-br rounded-xl from-emerald-500 to-teal-600 p-6 text-white shadow-lg">
              <h3 className="mb-4 text-xl font-bold">تقدمك في الحفظ</h3>
              <div className="mb-6 text-center">
                <div className="relative mb-4 inline-flex h-32 w-32 items-center justify-center">
                  <svg className="h-32 w-32 -rotate-90 transform">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-white/20"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="351.86"
                      strokeDashoffset="175.93"
                      className="text-white"
                    />
                  </svg>
                  <span className="absolute text-3xl font-bold">50%</span>
                </div>
                <p className="text-white/90">15 سورة من أصل 30 جزء</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>الحفظ الجديد</span>
                  <span className="font-bold">5 أجزاء</span>
                </div>
                <div className="flex justify-between">
                  <span>المراجعة</span>
                  <span className="font-bold">10 أجزاء</span>
                </div>
                <div className="flex justify-between">
                  <span>الإتقان</span>
                  <span className="font-bold">15 سورة</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                الاختبارات القادمة
              </h3>
              <div className="space-y-3">
                <div className="rounded-lg border-r-4 border-emerald-500 bg-emerald-50 p-4">
                  <p className="font-bold text-gray-900">اختبار شهري</p>
                  <p className="text-sm text-gray-600">سورة البقرة (1-50)</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-600">
                    بعد 3 أيام
                  </p>
                </div>
                <div className="rounded-lg border-r-4 border-emerald-500 bg-emerald-50 p-4">
                  <p className="font-bold text-gray-900">اختبار التجويد</p>
                  <p className="text-sm text-gray-600">أحكام النون والميم</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-600">
                    بعد أسبوع
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                المدفوعات
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الاشتراك الشهري</span>
                  <span className="font-bold text-green-600">مدفوع</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الشهر القادم</span>
                  <span className="font-bold text-orange-600">قريباً</span>
                </div>
              </div>
              <button className="mt-4 w-full rounded-lg bg-emerald-600 py-2 text-white transition hover:bg-emerald-700">
                عرض سجل المدفوعات
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
