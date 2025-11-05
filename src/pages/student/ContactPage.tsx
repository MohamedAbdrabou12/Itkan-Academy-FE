import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      <section className="bg-linear-to-r from-emerald-600 to-teal-600 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold">تواصل معنا</h1>
          <p className="mx-auto max-w-3xl text-xl">
            نسعد بتواصلكم واستفساراتكم في أي وقت
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="transform rounded-xl bg-white p-8 text-center shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <Phone className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">الهاتف</h3>
              <p className="mb-2 text-gray-600">تواصل معنا هاتفياً</p>
              <a
                href="tel:+966501234567"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                +966 50 123 4567
              </a>
            </div>

            <div className="transform rounded-xl bg-white p-8 text-center shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                البريد الإلكتروني
              </h3>
              <p className="mb-2 text-gray-600">راسلنا عبر البريد</p>
              <a
                href="mailto:info@alitqan.edu.sa"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                info@alitqan.edu.sa
              </a>
            </div>

            <div className="transform rounded-xl bg-white p-8 text-center shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">العنوان</h3>
              <p className="mb-2 text-gray-600">المقر الرئيسي</p>
              <p className="font-semibold text-orange-600">الرياض، حي الملقا</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                أرسل لنا رسالة
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-semibold text-gray-700">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold text-gray-700">
                      رقم الجوال
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                      placeholder="05xxxxxxxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    الموضوع *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="">اختر الموضوع</option>
                    <option value="enrollment">استفسار عن التسجيل</option>
                    <option value="programs">استفسار عن البرامج</option>
                    <option value="branches">استفسار عن الفروع</option>
                    <option value="complaint">شكوى</option>
                    <option value="suggestion">اقتراح</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    الرسالة *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center space-x-2 space-x-reverse rounded-lg bg-emerald-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-emerald-700"
                >
                  <Send className="h-5 w-5" />
                  <span>إرسال الرسالة</span>
                </button>
              </form>
            </div>

            <div>
              <div className="mb-8 rounded-xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-3xl font-bold text-gray-900">
                  ساعات العمل
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <span className="font-semibold text-gray-700">
                      السبت - الأربعاء
                    </span>
                    <span className="font-bold text-emerald-600">
                      8:00 ص - 8:00 م
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <span className="font-semibold text-gray-700">الخميس</span>
                    <span className="font-bold text-emerald-600">
                      8:00 ص - 12:00 م
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">الجمعة</span>
                    <span className="font-bold text-red-600">مغلق</span>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br rounded-xl border border-emerald-200 from-emerald-50 to-teal-50 p-8">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  تابعنا على
                </h3>
                <p className="mb-6 text-gray-600">
                  ابق على اطلاع بآخر الأخبار والفعاليات
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="#"
                    className="flex items-center justify-center space-x-2 space-x-reverse rounded-lg bg-white px-4 py-3 transition hover:bg-gray-50"
                  >
                    <Facebook className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-700">فيسبوك</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center space-x-2 space-x-reverse rounded-lg bg-white px-4 py-3 transition hover:bg-gray-50"
                  >
                    <Twitter className="h-5 w-5 text-sky-500" />
                    <span className="font-semibold text-gray-700">تويتر</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center space-x-2 space-x-reverse rounded-lg bg-white px-4 py-3 transition hover:bg-gray-50"
                  >
                    <Instagram className="h-5 w-5 text-pink-600" />
                    <span className="font-semibold text-gray-700">
                      انستقرام
                    </span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center space-x-2 space-x-reverse rounded-lg bg-white px-4 py-3 transition hover:bg-gray-50"
                  >
                    <Youtube className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-gray-700">يوتيوب</span>
                  </a>
                </div>
              </div>

              <a
                href="https://wa.me/966501234567"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex w-full items-center justify-center space-x-2 space-x-reverse rounded-lg bg-green-500 px-6 py-4 text-lg font-bold text-white transition hover:bg-green-600"
              >
                <MessageCircle className="h-6 w-6" />
                <span>تواصل عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-0">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.2936163395437!2d46.6785995!3d24.7135517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ4LjgiTiA0NsKwNDAnNDMuMCJF!5e0!3m2!1sen!2ssa!4v1234567890"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        ></iframe>
      </section>
    </div>
  );
}
