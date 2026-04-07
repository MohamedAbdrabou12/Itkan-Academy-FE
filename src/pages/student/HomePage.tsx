import { Link } from "react-router";
import {
  Users,
  BookOpen,
  MapPin,
  Award,
  TrendingUp,
  Calendar,
} from "lucide-react";

export default function Home() {
  const stats = [
    {
      icon: Users,
      label: "عدد الطلاب",
      value: "2,500+",
      color: "bg-emerald-500",
    },
    {
      icon: Award,
      label: "عدد الحفاظ",
      value: "450+",
      color: "bg-emerald-500",
    },
    {
      icon: BookOpen,
      label: "المعلمين",
      value: "120+",
      color: "bg-purple-500",
    },
    { icon: MapPin, label: "الفروع", value: "15", color: "bg-orange-500" },
  ];

  const news = [
    {
      id: 1,
      title: "حفل تخريج دفعة جديدة من حفظة القرآن الكريم",
      excerpt:
        "تفخر مدرسة الإتقان بتخريج 85 طالباً وطالبة أتموا حفظ القرآن الكريم كاملاً",
      image:
        "https://watanimg.elwatannews.com/image_archive/original_lower_quality/16513474821681747807.jpg",
      date: "2025-10-01",
      category: "achievement",
    },
    {
      id: 2,
      title: "افتتاح فرع جديد في مركز سمسطا",
      excerpt:
        "ضمن خطة التوسع، تم افتتاح فرع جديد مجهز بأحدث الوسائل التعليمية",
      image: "https://www.alwasatnews.com/data/2015/4688/images/pic-1.jpg",
      date: "2025-09-28",
      category: "announcement",
    },
    {
      id: 3,
      title: "بدء التسجيل للفصل الدراسي الجديد",
      excerpt:
        "يسرنا الإعلان عن فتح باب التسجيل للطلاب الجدد للفصل الدراسي القادم",
      image:
        "https://alazharmessage.com/wp-content/uploads/2024/11/%D8%AA%D8%AD%D9%81%D9%8A%D8%B8-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D9%86-%D9%84%D9%84%D8%B5%D8%BA%D8%A7%D8%B1-%D8%B9%D9%86-%D8%A8%D8%B9%D8%AF.jpg",
      date: "2025-09-25",
      category: "event",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative flex h-[600px] items-center justify-center text-white">
        <div className="bg-linear-to-r absolute inset-0 from-emerald-600 to-teal-600"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold md:text-6xl">
            مدرسة الإتقان لتحفيظ القرآن الكريم
          </h1>
          <p className="mb-8 text-xl md:text-2xl">
            منارة علم وهداية لتحفيظ كتاب الله وتعليم أحكام التجويد
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="transform rounded-lg bg-white px-8 py-4 text-lg font-semibold text-emerald-600 transition hover:scale-105 hover:bg-gray-100"
            >
              سجل الآن
            </Link>
            <Link
              to="/about"
              className="transform rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition hover:scale-105 hover:bg-white hover:text-emerald-600"
            >
              اعرف المزيد
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="transform rounded-xl bg-white p-6 shadow-lg transition hover:scale-105"
              >
                <div
                  className={`${stat.color} mb-4 flex h-16 w-16 items-center justify-center rounded-full`}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              رؤيتنا ورسالتنا
            </h2>
            <div className="mx-auto h-1 w-24 bg-emerald-600"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-linear-to-br rounded-xl border border-emerald-100 from-emerald-50 to-teal-50 p-8">
              <div className="mb-4 flex items-center">
                <TrendingUp className="ml-3 h-8 w-8 text-emerald-600" />
                <h3 className="text-2xl font-bold text-gray-900">رؤيتنا</h3>
              </div>
              <p className="leading-relaxed text-gray-700">
                أن نكون المؤسسة الرائدة في تحفيظ القرآن الكريم وتعليم علومه،
                ونموذجاً يحتذى به في التميز التعليمي والتربوي، نسعى لتخريج أجيال
                حافظة لكتاب الله، عاملة بأحكامه، متخلقة بأخلاقه.
              </p>
            </div>

            <div className="bg-linear-to-br rounded-xl border border-emerald-100 from-emerald-50 to-indigo-50 p-8">
              <div className="mb-4 flex items-center">
                <Award className="ml-3 h-8 w-8 text-emerald-600" />
                <h3 className="text-2xl font-bold text-gray-900">رسالتنا</h3>
              </div>
              <p className="leading-relaxed text-gray-700">
                تقديم خدمات تعليمية متميزة في تحفيظ القرآن الكريم وتدريس علومه،
                من خلال بيئة تربوية محفزة، وكوادر مؤهلة، ومناهج علمية معتمدة،
                لإعداد جيل قرآني واعٍ يسهم في بناء المجتمع.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-4xl font-bold text-gray-900">
                آخر الأخبار والإعلانات
              </h2>
              <div className="h-1 w-24 bg-emerald-600"></div>
            </div>
            <Link
              to="/news"
              className="flex items-center space-x-2 space-x-reverse font-semibold text-emerald-600 hover:text-emerald-700"
            >
              <span>عرض الكل</span>
              <span>←</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {news.map((item) => (
              <div
                key={item.id}
                className="transform overflow-hidden rounded-xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.category === "achievement"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.category === "announcement"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {item.category === "achievement"
                        ? "إنجاز"
                        : item.category === "announcement"
                          ? "إعلان"
                          : "فعالية"}
                    </span>
                    <span className="flex items-center text-sm text-gray-500">
                      <Calendar className="ml-1 h-4 w-4" />
                      {new Date(item.date).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mb-4 text-gray-600">{item.excerpt}</p>
                  <Link
                    to={`/news/${item.id}`}
                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    اقرأ المزيد ←
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-linear-to-r from-emerald-600 to-teal-600 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold">انضم إلينا اليوم</h2>
          <p className="mb-8 text-xl">
            ابدأ رحلتك في حفظ القرآن الكريم مع أفضل المعلمين والبرامج المتميزة
          </p>
          <Link
            to="/register"
            className="inline-block transform rounded-lg bg-white px-10 py-4 text-lg font-bold text-emerald-600 transition hover:scale-105 hover:bg-gray-100"
          >
            سجل الآن مجاناً
          </Link>
        </div>
      </section>
    </div>
  );
}
