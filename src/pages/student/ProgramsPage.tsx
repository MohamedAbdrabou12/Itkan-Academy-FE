import {
  BookOpen,
  Award,
  GraduationCap,
  Clock,
  Users,
  CheckCircle,
} from "lucide-react";

export default function ProgramsPage() {
  const programs = [
    {
      id: 1,
      title: "برنامج الحفظ المتقن",
      description: "برنامج شامل لحفظ القرآن الكريم كاملاً بالتجويد والإتقان",
      icon: BookOpen,
      color: "emerald",
      duration: "3-5 سنوات",
      levels: "مبتدئ، متوسط، متقدم",
      features: [
        "حفظ القرآن الكريم كاملاً 30 جزء",
        "تعليم أحكام التجويد العملية",
        "مراجعة مستمرة للمحفوظ",
        "اختبارات دورية للتقييم",
        "شهادة معتمدة عند الإتمام",
      ],
      image:
        "https://alazharmessage.com/wp-content/uploads/2024/11/%D8%AA%D8%AD%D9%81%D9%8A%D8%B8-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D9%86-%D9%84%D9%84%D8%B5%D8%BA%D8%A7%D8%B1-%D8%B9%D9%86-%D8%A8%D8%B9%D8%AF-1-1.jpg",
      schedule: "يومياً من السبت إلى الخميس",
    },
    {
      id: 2,
      title: "برنامج التجويد المتخصص",
      description: "دراسة متعمقة لأحكام التجويد النظرية والتطبيقية",
      icon: Award,
      color: "emerald",
      duration: "6 أشهر - سنة",
      levels: "مبتدئ، متقدم",
      features: [
        "دراسة مخارج الحروف وصفاتها",
        "أحكام النون الساكنة والتنوين",
        "أحكام الميم الساكنة والمدود",
        "القلقلة والإدغام والإخفاء",
        "تطبيق عملي على التلاوة",
      ],
      image:
        "https://guidetoquran.com/media/mkdm-hfl-thfyth-alkran-alkrym-825x510408_showCenterThumb.jpg",
      schedule: "مرتين أسبوعياً",
    },
    {
      id: 3,
      title: "برنامج التفسير والتدبر",
      description: "فهم معاني القرآن الكريم وتدبر آياته",
      icon: GraduationCap,
      color: "purple",
      duration: "سنة - سنتين",
      levels: "متوسط، متقدم",
      features: [
        "دراسة التفسير الميسر",
        "فهم أسباب النزول",
        "استنباط الأحكام والعبر",
        "تدبر معاني الآيات",
        "ربط القرآن بالواقع المعاصر",
      ],
      image:
        "https://alazharmessage.com/wp-content/uploads/2024/11/%D8%AA%D8%AD%D9%81%D9%8A%D8%B8-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D9%86-%D9%84%D9%84%D8%B5%D8%BA%D8%A7%D8%B1-%D8%B9%D9%86-%D8%A8%D8%B9%D8%AF-4.jpg",
      schedule: "مرة أسبوعياً",
    },
  ];

  const summerPrograms = [
    {
      title: "الدورة الصيفية المكثفة",
      description: "برنامج صيفي مكثف للحفظ والمراجعة",
      duration: "3 أشهر",
      target: "جميع الأعمار",
    },
    {
      title: "دورة تصحيح التلاوة",
      description: "تصحيح الأخطاء الشائعة في التلاوة",
      duration: "شهر",
      target: "المبتدئين",
    },
    {
      title: "برنامج الإجازة في القراءة",
      description: "الحصول على إجازة في رواية حفص",
      duration: "6 أشهر",
      target: "حفاظ القرآن",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: any = {
      emerald: {
        bg: "bg-emerald-500",
        light: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
      },
      blue: {
        bg: "bg-emerald-500",
        light: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
      },
      purple: {
        bg: "bg-purple-500",
        light: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
      },
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen">
      <section className="bg-linear-to-r from-emerald-600 to-teal-600 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold">برامجنا التعليمية</h1>
          <p className="mx-auto max-w-3xl text-xl">
            برامج متنوعة ومتكاملة تلبي احتياجات جميع الفئات والمستويات
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              البرامج الأساسية
            </h2>
            <div className="mx-auto h-1 w-24 bg-emerald-600"></div>
          </div>

          <div className="space-y-12">
            {programs.map((program, index) => {
              const colors = getColorClasses(program.color);
              return (
                <div
                  key={program.id}
                  className={`overflow-hidden rounded-2xl bg-white shadow-xl ${
                    index % 2 === 0 ? "" : ""
                  }`}
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
                  >
                    <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                      <img
                        src={program.image}
                        alt={program.title}
                        className="h-full min-h-[400px] w-full object-cover"
                      />
                    </div>

                    <div className="p-8 lg:p-12">
                      <div
                        className={`${colors.light} mb-6 flex h-16 w-16 items-center justify-center rounded-full`}
                      >
                        <program.icon className={`h-8 w-8 ${colors.text}`} />
                      </div>

                      <h3 className="mb-4 text-3xl font-bold text-gray-900">
                        {program.title}
                      </h3>
                      <p className="mb-6 text-lg text-gray-600">
                        {program.description}
                      </p>

                      <div className="mb-6 grid grid-cols-2 gap-4">
                        <div
                          className={`${colors.light} rounded-lg border p-4 ${colors.border}`}
                        >
                          <Clock className={`h-5 w-5 ${colors.text} mb-2`} />
                          <p className="text-sm text-gray-600">المدة</p>
                          <p className={`font-semibold ${colors.text}`}>
                            {program.duration}
                          </p>
                        </div>
                        <div
                          className={`${colors.light} rounded-lg border p-4 ${colors.border}`}
                        >
                          <Users className={`h-5 w-5 ${colors.text} mb-2`} />
                          <p className="text-sm text-gray-600">المستويات</p>
                          <p className={`font-semibold ${colors.text}`}>
                            {program.levels}
                          </p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="mb-3 font-bold text-gray-900">
                          مميزات البرنامج:
                        </h4>
                        <ul className="space-y-2">
                          {program.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-start space-x-2 space-x-reverse"
                            >
                              <CheckCircle
                                className={`h-5 w-5 ${colors.text} mt-0.5 shrink-0`}
                              />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div
                        className={`${colors.light} rounded-lg border p-4 ${colors.border} mb-6`}
                      >
                        <p className="text-sm text-gray-600">الجدول الزمني</p>
                        <p className={`font-semibold ${colors.text}`}>
                          {program.schedule}
                        </p>
                      </div>

                      <a
                        href="/register"
                        className={`inline-block ${colors.bg} rounded-lg px-8 py-3 font-semibold text-white transition hover:opacity-90`}
                      >
                        سجل في البرنامج
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              الدورات والبرامج الإضافية
            </h2>
            <div className="mx-auto mb-4 h-1 w-24 bg-emerald-600"></div>
            <p className="mx-auto max-w-2xl text-gray-600">
              برامج موسمية ودورات تدريبية متخصصة لتطوير مهاراتك القرآنية
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {summerPrograms.map((program, index) => (
              <div
                key={index}
                className="bg-linear-to-br transform rounded-xl border border-gray-200 from-gray-50 to-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <span className="text-xl font-bold text-emerald-600">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  {program.title}
                </h3>
                <p className="mb-4 text-gray-600">{program.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    <span className="text-gray-700">
                      المدة: {program.duration}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Users className="h-4 w-4 text-emerald-600" />
                    <span className="text-gray-700">
                      الفئة المستهدفة: {program.target}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-linear-to-r from-emerald-600 to-teal-600 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold">جاهز للبدء؟</h2>
          <p className="mb-8 text-xl">
            اختر البرنامج المناسب لك وابدأ رحلتك في حفظ القرآن الكريم
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/register"
              className="transform rounded-lg bg-white px-10 py-4 text-lg font-bold text-emerald-600 transition hover:scale-105 hover:bg-gray-100"
            >
              سجل الآن
            </a>
            <a
              href="/contact"
              className="transform rounded-lg border-2 border-white bg-transparent px-10 py-4 text-lg font-bold text-white transition hover:scale-105 hover:bg-white hover:text-emerald-600"
            >
              استفسر عن البرامج
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
