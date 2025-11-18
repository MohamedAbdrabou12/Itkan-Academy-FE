import { Link, useLocation } from "react-router";
import { Bell, BookOpen, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { useLogout } from "@/hooks/auth/useLogout";
import { useGetMe } from "@/hooks/auth/useGetMe";

export default function GeneralManagerNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { me } = useGetMe();
  const { logout } = useLogout();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">
                مدرسة الإتقان
              </span>
            </Link>
          </div>

          {/* Main Links */}
          <div className="hidden items-center space-x-6 space-x-reverse md:flex">
            <Link
              to="/admin/branches"
              className={`rounded-lg px-3 py-2 transition-all duration-200 ${
                isActive("/admin/branches")
                  ? "border border-emerald-200 bg-emerald-50 font-semibold text-emerald-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-emerald-700"
              }`}
            >
              الفروع
            </Link>
            <Link
              to="/admin/roles"
              className={`rounded-lg px-3 py-2 transition-all duration-200 ${
                isActive("/admin/roles")
                  ? "border border-emerald-200 bg-emerald-50 font-semibold text-emerald-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-emerald-700"
              }`}
            >
              الأدوار
            </Link>
            <Link
              to="/admin/users/roles"
              className={`rounded-lg px-3 py-2 transition-all duration-200 ${
                isActive("/admin/users/roles")
                  ? "border border-emerald-200 bg-emerald-50 font-semibold text-emerald-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-emerald-700"
              }`}
            >
              المستخدمين
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-emerald-600">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                3
              </span>
            </button>

            {/* User Profile (if needed) */}
            {me && (
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                  <User className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {me.full_name}
                </span>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
              title="تسجيل الخروج"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100"
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
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {/* User Info in Mobile */}
            {me && (
              <div className="mb-2 flex items-center gap-3 border-b border-gray-100 px-3 py-2 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <User className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{me.full_name}</p>
                  <p className="text-sm text-gray-500">{me.email}</p>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            {[
              { to: "/admin/branches", label: "الفروع" },
              { to: "/admin/roles", label: "الأدوار" },
              { to: "/admin/users/roles", label: "المستخدمين" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-3 transition-all duration-200 ${
                  isActive(item.to)
                    ? "bg-emerald-600 font-semibold text-white"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Logout Button */}
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-3 text-right text-red-600 transition-colors duration-200 hover:bg-red-50"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
