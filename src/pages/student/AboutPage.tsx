import { Target, Eye, Users, Award, BookOpen, Heart } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: BookOpen,
      title: "التميز التعليمي",
      description:
        "نسعى للتميز في تقديم خدمات تعليمية عالية الجودة في تحفيظ القرآن الكريم",
    },
    {
      icon: Heart,
      title: "الإخلاص والتفاني",
      description: "نعمل بإخلاص وتفانٍ لخدمة كتاب الله وطلاب العلم",
    },
    {
      icon: Users,
      title: "العمل الجماعي",
      description: "نؤمن بقوة العمل الجماعي والتعاون بين جميع أعضاء المدرسة",
    },
    {
      icon: Award,
      title: "الإتقان والجودة",
      description: "نحرص على الإتقان في كل ما نقدمه من برامج وخدمات تعليمية",
    },
  ];

  const management = [
    {
      role: "المدير العام",
      description: "الإشراف العام على جميع العمليات والقرارات الاستراتيجية",
    },
    {
      role: "المدير الأكاديمي",
      description: "إدارة المناهج والمحتوى التعليمي ومتابعة الأداء الأكاديمي",
    },
    {
      role: "المدير الإداري",
      description: "الإشراف على الأعمال الإدارية والتنظيمية",
    },
    {
      role: "مدير شؤون الطلاب",
      description: "متابعة شؤون الطلاب والأنشطة والتواصل مع أولياء الأمور",
    },
    {
      role: "المدير المالي",
      description: "إدارة الشؤون المالية والإيرادات والمصروفات",
    },
    {
      role: "مدير الموارد البشرية",
      description: "إدارة شؤون الموظفين والتوظيف والرواتب",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-linear-to-r from-emerald-600 to-teal-600 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold">عن مدرسة الإتقان</h1>
          <p className="mx-auto max-w-3xl text-xl">
            مؤسسة تعليمية رائدة في مجال تحفيظ القرآن الكريم وتعليم علومه
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-gray-900">من نحن؟</h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-700">
                <p>
                  مدرسة الإتقان لتحفيظ القرآن الكريم هي مؤسسة تعليمية متخصصة في
                  تحفيظ القرآن الكريم وتعليم علومه، تأسست بهدف خدمة كتاب الله عز
                  وجل وإعداد جيل قرآني واعٍ ومتميز.
                </p>
                <p>
                  نحن نفخر بتقديم خدمات تعليمية متميزة من خلال كوادر مؤهلة
                  ومناهج علمية معتمدة، في بيئة تربوية محفزة تساعد الطالب على
                  الإبداع والتميز في حفظ كتاب الله وتدبر معانيه.
                </p>
                <p>
                  منذ تأسيسها، خرّجت المدرسة المئات من حفظة القرآن الكريم،
                  وأصبحت مرجعاً موثوقاً في مجال التحفيظ والتجويد، مع وجود 15
                  فرعاً موزعة في مختلف الأحياء لخدمة أكبر عدد من الطلاب.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <img
                src="https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="قراءة القرآن"
                className="h-64 w-full rounded-xl object-cover shadow-lg"
              />
              <img
                src="https://images.pexels.com/photos/7092613/pexels-photo-7092613.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="تعليم القرآن"
                className="mt-8 h-64 w-full rounded-xl object-cover shadow-lg"
              />
              <img
                src="https://images.pexels.com/photos/8500313/pexels-photo-8500313.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="حلقة تحفيظ"
                className="-mt-8 h-64 w-full rounded-xl object-cover shadow-lg"
              />
              <img
                src="https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="طلاب القرآن"
                className="h-64 w-full rounded-xl object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="bg-linear-to-br rounded-2xl border-2 border-emerald-100 from-emerald-50 to-teal-50 p-8">
              <div className="mb-6 flex items-center">
                <Eye className="ml-4 h-12 w-12 text-emerald-600" />
                <h2 className="text-3xl font-bold text-gray-900">رؤيتنا</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                أن نكون المؤسسة الرائدة في تحفيظ القرآن الكريم وتعليم علومه،
                ونموذجاً يحتذى به في التميز التعليمي والتربوي على مستوى المملكة.
                نسعى لتخريج أجيال حافظة لكتاب الله، عاملة بأحكامه، متخلقة
                بأخلاقه، قادرة على المساهمة الفعالة في بناء مجتمع إسلامي متحضر.
              </p>
            </div>

            <div className="bg-linear-to-br rounded-2xl border-2 border-emerald-100 from-emerald-50 to-indigo-50 p-8">
              <div className="mb-6 flex items-center">
                <Target className="ml-4 h-12 w-12 text-emerald-600" />
                <h2 className="text-3xl font-bold text-gray-900">رسالتنا</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                تقديم خدمات تعليمية متميزة في تحفيظ القرآن الكريم وتدريس علومه،
                من خلال بيئة تربوية محفزة، وكوادر تعليمية مؤهلة، ومناهج علمية
                معتمدة، وتقنيات حديثة، لإعداد جيل قرآني واعٍ، متميز في حفظه
                وتلاوته وفهمه، يسهم في بناء المجتمع وخدمة الدين.
              </p>
            </div>
          </div>

          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">قيمنا</h2>
            <div className="mx-auto h-1 w-24 bg-emerald-600"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="transform rounded-xl bg-white p-6 text-center shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <value.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              الهيكل الإداري والأكاديمي
            </h2>
            <div className="mx-auto mb-4 h-1 w-24 bg-emerald-600"></div>
            <p className="mx-auto max-w-2xl text-gray-600">
              نفخر بهيكل إداري وأكاديمي متكامل يضمن سير العمل بكفاءة وجودة عالية
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {management.map((position, index) => (
              <div
                key={index}
                className="bg-linear-to-br rounded-xl border border-gray-200 from-gray-50 to-gray-100 p-6 transition hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {position.role}
                </h3>
                <p className="text-gray-600">{position.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-linear-to-r from-emerald-600 to-teal-600 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold">أهدافنا</h2>
          <div className="grid grid-cols-1 gap-6 text-right md:grid-cols-2">
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
              <h3 className="mb-2 text-xl font-bold">• تحفيظ القرآن الكريم</h3>
              <p className="text-white/90">بأعلى معايير الجودة والإتقان</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
              <h3 className="mb-2 text-xl font-bold">• تعليم أحكام التجويد</h3>
              <p className="text-white/90">وفق المنهج العلمي المعتمد</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
              <h3 className="mb-2 text-xl font-bold">• تدبر معاني القرآن</h3>
              <p className="text-white/90">وفهم مقاصد الآيات الكريمة</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
              <h3 className="mb-2 text-xl font-bold">• التربية الأخلاقية</h3>
              <p className="text-white/90">وغرس القيم الإسلامية النبيلة</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
