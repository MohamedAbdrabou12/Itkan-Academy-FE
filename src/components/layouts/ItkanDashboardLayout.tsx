import { useAuthStore } from "@/stores/auth";
import type { JWTBranch } from "@/types/Branches";
import { navLinks } from "@/utils/navItems";
import clsx from "clsx";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import PermissionGate from "../auth/PermissionGate";

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
          "bg-base-200 relative flex flex-col text-gray-900 transition-all duration-300",
          isOpen ? "w-64" : "w-20",
        )}
      >
        <div className="flex items-center justify-center px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-emerald-600" />
            {isOpen && (
              <span className="truncate text-xl font-bold text-gray-900">
                مدرسة الإتقان
              </span>
            )}
          </Link>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2">
          {branches?.map((branch) => (
            <button
              key={branch.id}
              onClick={() => handleChangeActiveBranch(branch)}
              className={clsx(
                "group relative flex w-full items-center gap-2 rounded px-4 py-2 transition hover:bg-emerald-50",
                activeBranch?.id === branch.id ? "bg-emerald-100" : "",
              )}
              title={!isOpen ? branch.name : undefined}
            >
              <LayoutGrid className="shrink-0 text-emerald-600" />
              {isOpen && <span className="truncate">{branch.name}</span>}
            </button>
          ))}
        </div>

        <ul className="mt-6 flex w-full flex-col">
          {navLinks.map((link) => (
            <PermissionGate permission={link.permission} key={link.id}>
              <li>
                <a
                  href={link.url}
                  className={clsx(
                    "group relative flex items-center gap-3 rounded px-4 py-2 transition hover:bg-emerald-50",
                    isOpen ? "justify-start" : "justify-center",
                    location.pathname.includes(link.id) ? "bg-emerald-100" : "",
                  )}
                  title={!isOpen ? link.title : undefined}
                >
                  <link.icon className="shrink-0 text-emerald-600" />
                  {isOpen && <span className="truncate">{link.title}</span>}
                </a>
              </li>
            </PermissionGate>
          ))}
        </ul>

        {user && (
          <div className="group mt-auto flex w-full items-center gap-2 rounded px-4 py-4 transition hover:bg-emerald-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <User className="text-emerald-600" />
            </div>
            {isOpen && <span className="truncate">{user.full_name}</span>}
            <button
              onClick={handleLogout}
              className="ml-auto flex items-center gap-1 text-emerald-600 transition hover:text-emerald-800"
              title="تسجيل الخروج"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}

        <button
          className={clsx(
            "absolute -right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-emerald-600 p-2 text-white shadow-lg transition hover:bg-emerald-700",
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
}
