import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function BranchesPage() {
  const branches = [
    {
      id: 1,
      name: "فرع بني سويف",
      location: " شارع الأمير سلطان",
      city: "بني سويف",
      phone: "+966 50 111 2222",
      email: "malqa@alitqan.edu.sa",
      supervisor: "أ. محمد بن عبدالله",
      students: 250,
      teachers: 12,
      image: "https://i.ytimg.com/vi/PgyUG9JeHV0/maxresdefault.jpg",
      workingHours: "السبت - الخميس: 8:00 ص - 8:00 م",
    },
    {
      id: 2,
      name: "فرع  مركز سمسطا",
      location: " طريق الملك فهد",
      city: "بني سويف",
      phone: "+201012145125",
      email: "narjis@alitqan.edu.sa",
      supervisor: "أ. خالد العتيبي",
      students: 180,
      teachers: 10,
      image: "https://afeham.com/media/articles/thumb/243128-190822.jpg",
      workingHours: "السبت - الخميس: 8:00 ص - 8:00 م",
    },
    {
      id: 3,
      name: "فرع مركز مازورا",
      location: "حي الياسمين، شارع التخصصي",
      city: "بني سويف",
      phone: "+201012145125",
      email: "yasmin@alitqan.edu.sa",
      supervisor: "أ. عبدالرحمن السالم",
      students: 220,
      teachers: 11,
      image:
        "https://www.quran-balqarn.org.sa/rafed/uploads/website_gallery/4_63b5a0ee1b773.jpeg",
      workingHours: "السبت - الخميس: 8:00 ص - 8:00 م",
    },
    {
      id: 4,
      name: "فرع ابو حسنين",
      location: "حي العليا، طريق العروبة",
      city: "بني سويف",
      phone: "+201012145125",
      email: "olaya@alitqan.edu.sa",
      supervisor: "أ. فهد المطيري",
      students: 200,
      teachers: 10,
      image: "https://www.al-jazirah.com/2014/20141226/is_149_7.jpg",
      workingHours: "السبت - الخميس: 8:00 ص - 8:00 م",
    },
    {
      id: 5,
      name: "فرع الروضة",
      location: "حي الروضة، شارع الستين",
      city: "بني سويف",
      phone: "+201012145125",
      email: "rawda@alitqan.edu.sa",
      supervisor: "أ. سعد القحطاني",
      students: 190,
      teachers: 9,
      image:
        "https://hoorq.com/wp-content/uploads/2024/04/%D9%85%D8%AF%D8%A7%D8%B1%D8%B3-%D8%AA%D8%AD%D9%81%D9%8A%D8%B8-%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86-%D8%A8%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6-%D9%84%D9%84%D8%A8%D9%86%D8%A7%D8%AA.webp",
      workingHours: "السبت - الخميس: 8:00 ص - 8:00 م",
    },
    {
      id: 6,
      name: "فرع ابوحماد",
      location: "حي الغدير، طريق الأمير تركي",
      city: "بني سويف",
      phone: "+201012145125",
      email: "ghadeer@alitqan.edu.sa",
      supervisor: "أ. ماجد الدوسري",
      students: 170,
      teachers: 8,
      image:
        "https://guidetoquran.com/media/mkdm-hfl-thfyth-alkran-alkrym-825x510408_showCenterThumb.jpg",
      workingHours: "السبت - الخميس: 8:00 ص - 8:00 م",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-linear-to-r from-emerald-600 to-teal-600 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold">فروعنا</h1>
          <p className="mx-auto max-w-3xl text-xl">
            نخدمكم من خلال {branches.length} فرعاً منتشرة في مختلف أحياء بني
            سويف
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="transform overflow-hidden rounded-xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  <div className="lg:col-span-1">
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="h-full min-h-[300px] w-full object-cover"
                    />
                  </div>

                  <div className="p-8 lg:col-span-2">
                    <div className="mb-6 flex items-start justify-between">
                      <div>
                        <h2 className="mb-2 text-3xl font-bold text-gray-900">
                          {branch.name}
                        </h2>
                        <p className="font-semibold text-emerald-600">
                          مشرف الفرع: {branch.supervisor}
                        </p>
                      </div>
                      <div className="flex space-x-4 space-x-reverse">
                        <div className="rounded-lg bg-emerald-50 px-4 py-2 text-center">
                          <div className="text-2xl font-bold text-emerald-600">
                            {branch.students}
                          </div>
                          <div className="text-xs text-gray-600">طالب</div>
                        </div>
                        <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {branch.teachers}
                          </div>
                          <div className="text-xs text-gray-600">معلم</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <MapPin className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="font-semibold text-gray-900">العنوان</p>
                          <p className="text-gray-600">{branch.location}</p>
                          <p className="text-sm text-gray-500">{branch.city}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 space-x-reverse">
                        <Phone className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="font-semibold text-gray-900">الهاتف</p>
                          <a
                            href={`tel:${branch.phone}`}
                            className="text-gray-600 hover:text-emerald-600"
                          >
                            {branch.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 space-x-reverse">
                        <Mail className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            البريد الإلكتروني
                          </p>
                          <a
                            href={`mailto:${branch.email}`}
                            className="break-all text-gray-600 hover:text-emerald-600"
                          >
                            {branch.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 space-x-reverse">
                        <Clock className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            ساعات العمل
                          </p>
                          <p className="text-gray-600">{branch.workingHours}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`https://wa.me/${branch.phone.replace(/\s/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 space-x-reverse rounded-lg bg-green-500 px-6 py-2 text-white transition hover:bg-green-600"
                      >
                        <span>تواصل عبر واتساب</span>
                      </a>
                      <a
                        href={`tel:${branch.phone}`}
                        className="rounded-lg bg-emerald-600 px-6 py-2 text-white transition hover:bg-emerald-700"
                      >
                        اتصل الآن
                      </a>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(branch.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-gray-200 px-6 py-2 text-gray-700 transition hover:bg-gray-300"
                      >
                        عرض على الخريطة
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            هل تود الانضمام إلينا؟
          </h2>
          <p className="mb-8 text-gray-600">
            اختر الفرع الأقرب إليك وابدأ رحلتك في حفظ القرآن الكريم
          </p>
          <a
            href="/register"
            className="inline-block transform rounded-lg bg-emerald-600 px-10 py-4 text-lg font-bold text-white transition hover:scale-105 hover:bg-emerald-700"
          >
            سجل الآن
          </a>
        </div>
      </section>
    </div>
  );
}
