import { Link, NavLink } from "react-router";
import { useState } from "react";
import { Menu, X, House, Check } from "lucide-react";
import {
  useGetProfile,
  useGetUserWorkspace,
  useGetUserWorkspaces,
} from "@/hooks";
import { workspaceColor } from "@/utils";

const linkClass = (isActive: boolean) =>
  `flex items-center gap-3 min-h-11 px-3 rounded-xl text-sm transition-colors ${
    isActive
      ? "bg-blue-600 text-white font-bold"
      : "text-slate-600 font-semibold hover:bg-white/70 hover:text-slate-900"
  }`;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="w-8 h-8 rounded-[10px] bg-blue-900 flex items-center justify-center">
        <Check className="w-4 h-4 text-blue-400" strokeWidth={3} />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-blue-900">
        Due It
      </span>
    </Link>
  );
}

function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: user } = useGetProfile();
  const { data: workspaces } = useGetUserWorkspaces();
  const { data: currentWorkspace } = useGetUserWorkspace();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-wash px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-white/70"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-slate-700" />
          ) : (
            <Menu className="w-5 h-5 text-slate-700" />
          )}
        </button>
        <Logo />
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar: sits on the app background, no border */}
      <div
        className={`
          fixed lg:static z-40
          w-64 shrink-0 bg-wash flex flex-col px-3 pb-3
          transform transition-transform duration-300 ease-in-out
          lg:inset-y-0 lg:left-0 lg:h-full
          top-16 bottom-0 left-0 lg:top-0
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="px-3 pt-6 pb-6 hidden lg:block">
          <Logo />
        </div>

        <nav className="flex-1 pt-4 lg:pt-0 overflow-y-auto">
          <NavLink
            to="/"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) => linkClass(isActive)}
          >
            <House className="w-5 h-5" />
            <span>Home</span>
          </NavLink>

          {!!workspaces?.length && (
            <>
              <h2 className="px-3 pt-6 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Workspaces
              </h2>
              <ul className="space-y-1">
                {workspaces.map((workspace) => {
                  const isActive = workspace.id === currentWorkspace?.id;

                  return (
                    <li key={workspace.id}>
                      <Link
                        to={`/workspace/${workspace.id}/tasks`}
                        onClick={closeMobileMenu}
                        className={linkClass(isActive)}
                      >
                        <span
                          className={`${
                            isActive
                              ? "bg-white text-blue-600"
                              : `${workspaceColor(workspace.id)} text-white`
                          } w-7 h-7 rounded-[9px] flex items-center justify-center text-xs font-bold shrink-0`}
                        >
                          {workspace.name[0]?.toUpperCase()}
                        </span>
                        <span className="truncate">{workspace.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </nav>

        {/* Profile Link */}
        <NavLink
          to="/profile"
          onClick={closeMobileMenu}
          className={({ isActive }) =>
            `mt-3 flex items-center gap-3 p-2.5 rounded-2xl bg-white shadow-xs transition-shadow hover:shadow-md ${
              isActive ? "ring-2 ring-blue-600" : ""
            }`
          }
        >
          <span className="w-9 h-9 shrink-0 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-[13px] font-bold">
            {user?.firstName[0]?.toUpperCase()}
            {user?.lastName[0]?.toUpperCase()}
          </span>
          <span className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-800 truncate">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-xs text-slate-500 truncate">
              {user?.email}
            </span>
          </span>
        </NavLink>
      </div>
    </>
  );
}

export default Sidebar;
