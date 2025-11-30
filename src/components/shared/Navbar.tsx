import { useAuthStore } from "@/stores/auth";
import { Bell, BookOpen, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuthStore();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    // logout();
    logout();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 z-50 w-full bg-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">
                مدرسة الإتقان
              </span>
            </Link>
          </div>

          {/* Main Links */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              to="/"
              className={`${isActive("/") ? "border-b-2 border-emerald-600 font-semibold text-emerald-600" : "text-gray-700 hover:text-emerald-600"} pb-1 transition`}
            >
              الرئيسية
            </Link>
            <Link
              to="/about"
              className={`${isActive("/about") ? "border-b-2 border-emerald-600 font-semibold text-emerald-600" : "text-gray-700 hover:text-emerald-600"} pb-1 transition`}
            >
              عن المدرسة
            </Link>
            <Link
              to="/branches"
              className={`${isActive("/branches") ? "border-b-2 border-emerald-600 font-semibold text-emerald-600" : "text-gray-700 hover:text-emerald-600"} pb-1 transition`}
            >
              الفروع
            </Link>
            <Link
              to="/programs"
              className={`${isActive("/programs") ? "border-b-2 border-emerald-600 font-semibold text-emerald-600" : "text-gray-700 hover:text-emerald-600"} pb-1 transition`}
            >
              البرامج
            </Link>
            <Link
              to="/news"
              className={`${isActive("/news") ? "border-b-2 border-emerald-600 font-semibold text-emerald-600" : "text-gray-700 hover:text-emerald-600"} pb-1 transition`}
            >
              الأخبار
            </Link>
            <Link
              to="/contact"
              className={`${isActive("/contact") ? "border-b-2 border-emerald-600 font-semibold text-emerald-600" : "text-gray-700 hover:text-emerald-600"} pb-1 transition`}
            >
              تواصل معنا
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                <button className="relative text-gray-700 hover:text-emerald-600">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    3
                  </span>
                </button>
                <Link
                  to="/dashboard"
                  className={`${isActive("/dashboard") ? "font-semibold text-emerald-600" : "text-gray-700 hover:text-emerald-600"} flex items-center space-x-2 space-x-reverse transition`}
                >
                  <User className="h-5 w-5" />
                  <span>{user.full_name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 transition hover:text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`${isActive("/login") ? "font-semibold text-emerald-600" : "text-gray-700 hover:text-emerald-600"} transition`}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className={`${isActive("/register") ? "bg-emerald-700" : "bg-emerald-600 hover:bg-emerald-700"} rounded-lg px-4 py-2 text-white transition`}
                >
                  التسجيل
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {[
              { to: "/", label: "الرئيسية" },
              { to: "/about", label: "عن المدرسة" },
              { to: "/branches", label: "الفروع" },
              { to: "/programs", label: "البرامج" },
              { to: "/news", label: "الأخبار" },
              { to: "/contact", label: "تواصل معنا" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block rounded-md px-3 py-2 ${
                  isActive(item.to)
                    ? "bg-emerald-600 font-semibold text-white"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`block rounded-md px-3 py-2 ${
                    isActive("/dashboard")
                      ? "bg-emerald-600 font-semibold text-white"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  لوحة التحكم
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full rounded-md px-3 py-2 text-right text-red-600 hover:bg-red-50"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`block rounded-md px-3 py-2 ${
                    isActive("/login")
                      ? "bg-emerald-600 font-semibold text-white"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className={`block rounded-md px-3 py-2 text-center ${
                    isActive("/register")
                      ? "bg-emerald-700 font-semibold text-white"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  التسجيل
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
