import { useAuthStore } from "@/stores/auth";
import type { JWTBranch } from "@/types/Branches";
import { navLinks } from "@/utils/navItems";
import { BookOpen, User, LayoutGrid, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Outlet, useLocation, useNavigate, Link } from "react-router";
import clsx from "clsx";
import { useState } from "react";

export default function ItkanDashboardLayout() {
  const activeBranch = useAuthStore((state) => state.activeBranch);
  const user = useAuthStore((state) => state.user);
  const branches = useAuthStore((state) => state.branches);
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveBranch, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(true);

  function handleChangeActiveBranch(branchId: JWTBranch) {
    setActiveBranch(branchId);
    (document.activeElement as HTMLElement).blur();
  }

  function handleLogout() {
    (document.activeElement as HTMLElement).blur();
    logout();
    navigate("/login");
  }

  return (
    <div className="flex h-screen">
      <div
        className={clsx(
          "relative bg-base-200 text-gray-900 flex flex-col transition-all duration-300",
          isOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex items-center justify-center px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-emerald-600" />
            {isOpen && <span className="text-xl font-bold text-gray-900 truncate">مدرسة الإتقان</span>}
          </Link>
        </div>

        <div className="flex flex-col items-center gap-2 mt-4">
          {branches?.map((branch) => (
            <button
              key={branch.id}
              onClick={() => handleChangeActiveBranch(branch)}
              className={clsx(
                "flex items-center gap-2 w-full px-4 py-2 rounded hover:bg-emerald-50 transition relative group",
                activeBranch?.id === branch.id ? "bg-emerald-100" : ""
              )}
              title={!isOpen ? branch.name : undefined}
            >
              <LayoutGrid className="text-emerald-600 shrink-0" />
              {isOpen && <span className="truncate">{branch.name}</span>}
            </button>
          ))}
        </div>

        <ul className="flex flex-col mt-6 w-full">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.url}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded hover:bg-emerald-50 transition relative group",
                  isOpen ? "justify-start" : "justify-center",
                  location.pathname.includes(link.id) ? "bg-emerald-100" : ""
                )}
                title={!isOpen ? link.title : undefined}
              >
                <link.icon className="text-emerald-600 shrink-0" />
                {isOpen && <span className="truncate">{link.title}</span>}
              </a>
            </li>
          ))}
        </ul>

        {user && (
          <div className="mt-auto w-full px-4 py-4 flex items-center gap-2 hover:bg-emerald-50 transition rounded group">
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full">
              <User className="text-emerald-600" />
            </div>
            {isOpen && <span className="truncate">{user.full_name}</span>}
            <button
              onClick={handleLogout}
              className="ml-auto flex items-center gap-1 text-emerald-600 hover:text-emerald-800 transition"
              title="تسجيل الخروج"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}

        <button
          className={clsx(
            "absolute top-1/2 -right-4 transform -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-full shadow-lg hover:bg-emerald-700 transition",
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      <div className="flex-1 bg-gray-50 overflow-auto transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
}

