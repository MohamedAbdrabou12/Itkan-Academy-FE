import { useAuthStore } from "@/stores/auth";
import type { JWTBranch } from "@/types/Branches";
import { navLinks } from "@/utils/navItems";
import { LayoutGrid } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router";
import clsx from "clsx";

export default function ItkanDashboardLayout() {
  const activeBranch = useAuthStore((state) => state.activeBranch);
  const user = useAuthStore((state) => state.user);
  const branches = useAuthStore((state) => state.branches);
  const navigate = useNavigate();
  const location = useLocation();

  const { setActiveBranch, logout } = useAuthStore();

  function handleChangeActiveBranch(activeBranchId: JWTBranch) {
    setActiveBranch(activeBranchId);
    (document.activeElement as HTMLElement).blur();
  }

  function handleLogout() {
    (document.activeElement as HTMLElement).blur();
    logout();
    navigate("/login");
  }

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer-4"
        type="checkbox"
        defaultChecked
        className="drawer-toggle"
      />
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar bg-base-300 flex w-full items-center justify-between">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            {/* Sidebar toggle icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>

          {/* user icon */}
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="flex h-full w-10 items-center justify-center rounded-full bg-gray-200">
                  {user.full_name.substring(0, 2)}
                </div>
              </div>
              <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li className="cursor-pointer" onClick={handleLogout}>
                  تسجيل الخروج
                </li>
              </ul>
            </div>
          ) : (
            <div>
              <a href="/login" className="btn btn-ghost">
                تسجيل الدخول
              </a>
            </div>
          )}
        </nav>
        {/* Page content here */}
        <Outlet />
      </div>

      <div className="drawer-side overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="bg-base-200 is-drawer-close:w-20 is-drawer-open:w-64 flex min-h-full flex-col items-start">
          {/* Sidebar content here */}

          <div className="dropdown dropdown-right w-full px-2 py-3">
            <div
              tabIndex={0}
              role="button"
              className="hover:bg-base-300 flex cursor-pointer items-center gap-4 px-3 py-2"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-400">
                <LayoutGrid className="shrink-0 text-white" />
              </div>
              <p className="is-drawer-close:scale-x-0 is-drawer-close:overflow-hidden is-drawer-close:leading-0 origin-right scale-x-100 text-lg font-bold transition-all duration-100">
                {activeBranch?.name}
              </p>
            </div>

            <ul
              tabIndex={1}
              className="dropdown-content menu bg-base-100 rounded-box top-2 w-52 p-2 shadow-sm"
            >
              <p className="font-bold">قم باختيار الفرع</p>

              <div className="divider my-0 mt-0"></div>
              {branches?.map((branch) => (
                <li
                  key={branch.id}
                  className={
                    activeBranch?.id === branch.id ? "bg-base-300" : ""
                  }
                  onClick={() => {
                    handleChangeActiveBranch(branch);
                  }}
                >
                  <a>{branch.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <ul className="menu w-full grow">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  className={clsx(
                    "hover:bg-base-300 is-drawer-close:justify-center flex items-center gap-3 px-3 py-2 text-center",
                    {
                      "bg-base-300": location.pathname.includes(link.id),
                    },
                  )}
                >
                  <link.icon className="size-4.5 shrink-0" />
                  <span className="is-drawer-close:hidden text-start">
                    {link.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
