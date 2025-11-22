import { BookOpen } from "lucide-react";
import { Link } from "react-router";

export default function RegisterPendingPage() {
  return (
    <div className="bg-linear-to-br min-h-screen from-emerald-50 to-teal-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <div className="rounded-3xl bg-white p-12 shadow-2xl text-center">
          <div className="mb-8">
            <div className="mb-6 flex items-center justify-center space-x-3 space-x-reverse">
              <BookOpen className="h-12 w-12 text-emerald-600" />
              <span className="text-4xl font-extrabold text-gray-900">مدرسة الإتقان</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">تم استلام بياناتك</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              حسابك قيد الانتظار لحين الموافقة من إدارة المدرسة. 
              ستصلك رسالة على بريدك الإلكتروني فور تفعيل الحساب.
            </p>
            <Link
              to="/login"
              className="inline-block rounded-xl bg-emerald-600 py-4 px-8 text-lg font-semibold text-white transition hover:bg-emerald-700"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}