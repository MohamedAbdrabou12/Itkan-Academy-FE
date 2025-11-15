import { Calendar, User, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const newsItems = [
    {
      id: 1,
      title: "حفل تخريج دفعة جديدة من حفظة القرآن الكريم",
      excerpt:
        "تفخر مدرسة الإتقان بتخريج 85 طالباً وطالبة أتموا حفظ القرآن الكريم كاملاً في حفل بهيج أقيم بمقر المدرسة الرئيسي",
      content:
        "أقامت مدرسة الإتقان لتحفيظ القرآن الكريم حفل تخريج مهيب للدفعة الجديدة من الحفاظ، حيث تم تكريم 85 طالباً وطالبة أتموا حفظ كتاب الله كاملاً بعد سنوات من الجد والاجتهاد. وقد شهد الحفل حضوراً كبيراً من أولياء الأمور والمعلمين والمهتمين بالشأن القرآني.",
      image:
        "https://watanimg.elwatannews.com/image_archive/original_lower_quality/16513474821681747807.jpg",
      date: "2025-10-01",
      category: "achievement",
      author: "إدارة المدرسة",
    },
    {
      id: 2,
      title: "افتتاح فرع جديد في مركز سمسطا",
      excerpt:
        "ضمن خطة التوسع، تم افتتاح فرع جديد مجهز بأحدث الوسائل التعليمية لخدمة أبناء حي النرجس والأحياء المجاورة",
      content:
        "في إطار خطة التوسع والانتشار لخدمة أكبر عدد من طلاب العلم، افتتحت مدرسة الإتقان فرعها الجديد في حي النرجس، والذي يتضمن قاعات دراسية مجهزة بأحدث التقنيات، ومكتبة قرآنية غنية بالمراجع والكتب.",
      image: "https://www.alwasatnews.com/data/2015/4688/images/pic-1.jpg",
      date: "2024-09-28",
      category: "announcement",
      author: "قسم الإعلام",
    },
    {
      id: 3,
      title: "بدء التسجيل للفصل الدراسي الجديد",
      excerpt:
        "يسرنا الإعلان عن فتح باب التسجيل للطلاب الجدد للفصل الدراسي القادم في جميع الفروع",
      content:
        "تعلن مدرسة الإتقان لتحفيظ القرآن الكريم عن بدء استقبال طلبات التسجيل للفصل الدراسي الجديد 1446هـ، ويمكن للراغبين في الالتحاق بالمدرسة التسجيل إلكترونياً عبر الموقع أو زيارة أقرب فرع.",
      image:
        "https://alazharmessage.com/wp-content/uploads/2024/11/%D8%AA%D8%AD%D9%81%D9%8A%D8%B8-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D9%86-%D9%84%D9%84%D8%B5%D8%BA%D8%A7%D8%B1-%D8%B9%D9%86-%D8%A8%D8%B9%D8%AF.jpg",
      date: "2025-09-25",
      category: "event",
      author: "إدارة القبول والتسجيل",
    },
    {
      id: 4,
      title: "مسابقة القرآن الكريم السنوية",
      excerpt:
        "انطلاق مسابقة المدرسة السنوية لحفظ وتلاوة القرآن الكريم بجوائز قيمة",
      content:
        "أعلنت المدرسة عن انطلاق المسابقة السنوية لحفظ وتلاوة القرآن الكريم، والتي تهدف إلى تحفيز الطلاب على الحفظ والإتقان. المسابقة مفتوحة لجميع الطلاب في كافة الفروع.",
      image:
        "https://www.aljazeera.net/wp-content/uploads/2018/05/3a17d329-6a7c-4aa5-998c-e1014151b6a3.jpeg",
      date: "2025-09-20",
      category: "event",
      author: "اللجنة المنظمة",
    },
    {
      id: 5,
      title: "تكريم المعلمين المتميزين",
      excerpt: "حفل تكريم للمعلمين المتميزين تقديراً لجهودهم في خدمة كتاب الله",
      content:
        "نظمت المدرسة حفلاً لتكريم المعلمين الذين أظهروا تميزاً في الأداء والإخلاص في تعليم القرآن الكريم، حيث تم تكريم 20 معلماً ومعلمة من مختلف الفروع.",
      image:
        "https://img.youm7.com/ArticleImgs/2022/9/9/170304-%D8%A7%D8%B7%D9%81%D8%A7%D9%84-%D8%AD%D8%A7%D9%81%D8%B8%D9%88%D9%86-%D9%84%D9%84%D9%82%D8%B1%D8%A7%D9%86-%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85.jpg",
      date: "2025-09-15",
      category: "achievement",
      author: "إدارة الموارد البشرية",
    },
    {
      id: 6,
      title: "ورشة عمل في أحكام التجويد",
      excerpt:
        "إقامة ورشة عمل متخصصة في أحكام التجويد للمعلمين والطلاب المتقدمين",
      content:
        "استضافت المدرسة الشيخ الدكتور عبدالله المحمدي في ورشة عمل مكثفة عن أحكام التجويد والقراءات، استفاد منها أكثر من 50 معلماً وطالباً متقدماً.",
      image:
        "https://www.uaezoom.com/wp-content/uploads/2024/03/%D9%85%D8%B1%D8%A7%D9%83%D8%B2-%D8%AA%D8%AD%D9%81%D9%8A%D8%B8-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D9%86-%D8%A7%D8%A8%D9%88%D8%B8%D8%A8%D9%8A-640x360.jpg",
      date: "2024-09-10",
      category: "event",
      author: "القسم الأكاديمي",
    },
  ];

  const categories = [
    { value: "all", label: "الكل" },
    { value: "achievement", label: "إنجازات" },
    { value: "announcement", label: "إعلانات" },
    { value: "event", label: "فعاليات" },
  ];

  const getCategoryLabel = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat ? cat.label : category;
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      achievement: "bg-emerald-100 text-emerald-800",
      announcement: "bg-emerald-100 text-emerald-800",
      event: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const filteredNews = newsItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <section className="bg-linear-to-r from-emerald-600 to-teal-600 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold">الأخبار والإعلانات</h1>
          <p className="mx-auto max-w-3xl text-xl">
            تابع آخر أخبار وفعاليات مدرسة الإتقان
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`rounded-lg px-6 py-2 font-semibold transition ${
                      selectedCategory === cat.value
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-auto">
                <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث في الأخبار..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-4 pr-10 focus:border-transparent focus:ring-2 focus:ring-emerald-600 md:w-80"
                />
              </div>
            </div>
          </div>

          {filteredNews.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-600">لا توجد نتائج</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredNews.map((item) => (
                <div
                  key={item.id}
                  className="transform overflow-hidden rounded-xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColor(item.category)}`}
                      >
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <Calendar className="ml-1 h-4 w-4" />
                        {new Date(item.date).toLocaleDateString("ar-SA")}
                      </span>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 text-gray-600">
                      {item.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="ml-1 h-4 w-4" />
                        <span>{item.author}</span>
                      </div>
                      <Link
                        to={`/news/${item.id}`}
                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        اقرأ المزيد ←
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
