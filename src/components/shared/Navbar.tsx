import { Link, useLocation } from "react-router";
import { BookOpen, Menu, X, LogOut, User, Bell } from "lucide-react";
import { useState } from "react";
import { useLogout } from "@/hooks/auth/useLogout";
import { useGetMe } from "@/hooks/auth/useGetMe";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { me } = useGetMe();
  const { logout } = useLogout();
  const location = useLocation();

  const handleLogout = () => {
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
          <div className="hidden items-center space-x-8 space-x-reverse md:flex">
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
            {me ? (
              <div className="flex items-center space-x-4 space-x-reverse">
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
                  <span>{me.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 transition hover:text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 space-x-reverse">
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

            {me ? (
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

// import { Link, useNavigate } from 'react-router-dom';
// import { BookOpen, Menu, X, LogOut, User, Bell } from 'lucide-react';
// import { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center space-x-2 space-x-reverse">
//               <BookOpen className="h-8 w-8 text-emerald-600" />
//               <span className="text-xl font-bold text-gray-900">مدرسة الإتقان</span>
//             </Link>
//           </div>

//           <div className="hidden md:flex items-center space-x-8 space-x-reverse">
//             <Link to="/" className="text-gray-700 hover:text-emerald-600 transition">الرئيسية</Link>
//             <Link to="/about" className="text-gray-700 hover:text-emerald-600 transition">عن المدرسة</Link>
//             <Link to="/branches" className="text-gray-700 hover:text-emerald-600 transition">الفروع</Link>
//             <Link to="/programs" className="text-gray-700 hover:text-emerald-600 transition">البرامج</Link>
//             <Link to="/news" className="text-gray-700 hover:text-emerald-600 transition">الأخبار</Link>
//             <Link to="/contact" className="text-gray-700 hover:text-emerald-600 transition">تواصل معنا</Link>

//             {user ? (
//               <div className="flex items-center space-x-4 space-x-reverse">
//                 <button className="relative text-gray-700 hover:text-emerald-600">
//                   <Bell className="h-5 w-5" />
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
//                 </button>
//                 <Link to="/dashboard" className="text-gray-700 hover:text-emerald-600 flex items-center space-x-2 space-x-reverse">
//                   <User className="h-5 w-5" />
//                   <span>{user.name}</span>
//                 </Link>
//                 <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 transition">
//                   <LogOut className="h-5 w-5" />
//                 </button>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-4 space-x-reverse">
//                 <Link to="/login" className="text-gray-700 hover:text-emerald-600 transition">تسجيل الدخول</Link>
//                 <Link to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">التسجيل</Link>
//               </div>
//             )}
//           </div>

//           <div className="md:hidden flex items-center">
//             <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
//               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="md:hidden bg-white border-t">
//           <div className="px-2 pt-2 pb-3 space-y-1">
//             <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md">الرئيسية</Link>
//             <Link to="/about" className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md">عن المدرسة</Link>
//             <Link to="/branches" className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md">الفروع</Link>
//             <Link to="/programs" className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md">البرامج</Link>
//             <Link to="/news" className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md">الأخبار</Link>
//             <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md">تواصل معنا</Link>
//             {user ? (
//               <>
//                 <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md">لوحة التحكم</Link>
//                 <button onClick={handleLogout} className="block w-full text-right px-3 py-2 text-red-600 hover:bg-red-50 rounded-md">تسجيل الخروج</button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md">تسجيل الدخول</Link>
//                 <Link to="/register" className="block px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-md text-center">التسجيل</Link>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }
