import { Link, NavLink } from "react-router";
import { useState } from "react";
import { Menu, X, User, House } from "lucide-react";
import { useGetUserWorkspace, useGetUserWorkspaces } from "@/hooks";
import { workspaceColor } from "@/utils";

const linkClass = (isActive: boolean) =>
  `flex items-center px-4 py-3 rounded-lg transition-colors ${
    isActive
      ? "bg-blue-100 text-blue-800"
      : "text-slate-700 hover:bg-slate-200 hover:text-slate-900"
  }`;

function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: workspaces } = useGetUserWorkspaces();
  const { data: currentWorkspace } = useGetUserWorkspace();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-slate-700" />
            ) : (
              <Menu className="w-5 h-5 text-slate-700" />
            )}
          </button>
          <Link to="/" className="text-lg font-bold text-blue-600 ml-3">
            Due It
          </Link>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static z-40
          w-64 bg-white border-r border-slate-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:inset-y-0 lg:left-0 lg:h-full
          top-14 bottom-0 left-0 lg:top-0
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-slate-200 hidden lg:block">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Due It
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <NavLink
            to="/"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) => linkClass(isActive)}
          >
            <House className="w-5 h-5 mr-3" />
            <span className="font-medium">Home</span>
          </NavLink>

          {!!workspaces?.length && (
            <>
              <h2 className="px-4 pt-6 pb-2 text-xs font-medium text-slate-500">
                Workspaces
              </h2>
              <ul className="space-y-1">
                {workspaces.map((workspace) => (
                  <li key={workspace.id}>
                    <Link
                      to={`/workspace/${workspace.id}/tasks`}
                      onClick={closeMobileMenu}
                      className={linkClass(
                        workspace.id === currentWorkspace?.id
                      )}
                    >
                      <span
                        className={`${workspaceColor(
                          workspace.id
                        )} w-7 h-7 mr-3 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0`}
                      >
                        {workspace.name[0]?.toUpperCase()}
                      </span>
                      <span className="font-medium truncate">
                        {workspace.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>

        {/* Profile Link */}
        <div className="p-4 border-t border-slate-200 mt-auto">
          <NavLink
            to="/profile"
            onClick={closeMobileMenu}
            className={({ isActive }) => linkClass(isActive)}
          >
            <User className="w-5 h-5 mr-3" />
            <span className="font-medium">Profile</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
