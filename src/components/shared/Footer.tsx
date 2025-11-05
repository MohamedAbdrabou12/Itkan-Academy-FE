import {
  BookOpen,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-emerald-500" />
              <span className="text-xl font-bold text-white">
                مدرسة الإتقان
              </span>
            </div>
            <p className="mb-4 text-gray-400">
              منارة علم لتحفيظ القرآن الكريم وتعليم أحكام التجويد
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a
                href="#"
                className="text-gray-400 transition hover:text-emerald-500"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition hover:text-emerald-500"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition hover:text-emerald-500"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition hover:text-emerald-500"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="transition hover:text-emerald-500">
                  عن المدرسة
                </Link>
              </li>
              <li>
                <Link
                  to="/programs"
                  className="transition hover:text-emerald-500"
                >
                  البرامج التعليمية
                </Link>
              </li>
              <li>
                <Link
                  to="/branches"
                  className="transition hover:text-emerald-500"
                >
                  الفروع
                </Link>
              </li>
              <li>
                <Link to="/news" className="transition hover:text-emerald-500">
                  الأخبار
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="transition hover:text-emerald-500"
                >
                  التسجيل
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">البرامج</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="transition hover:text-emerald-500">
                  برنامج الحفظ
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-emerald-500">
                  برنامج التجويد
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-emerald-500">
                  برنامج التفسير
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-emerald-500">
                  الدورات الصيفية
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 space-x-reverse">
                <Phone className="h-5 w-5 text-emerald-500" />
                <span>+201006641942</span>
              </li>
              <li className="flex items-center space-x-3 space-x-reverse">
                <Mail className="h-5 w-5 text-emerald-500" />
                <span>info@alitqan.edu.sa</span>
              </li>
              <li className="flex items-start space-x-3 space-x-reverse">
                <MapPin className="mt-1 h-5 w-5 text-emerald-500" />
                <span>مدرسة تحفيظ القرءان ,ببني سويف</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 مدرسة الإتقان لتحفيظ القرآن الكريم. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
