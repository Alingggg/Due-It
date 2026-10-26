import { NavLink } from "react-router";
import { useState } from "react";
import {
  CheckSquare,
  Book,
  Users,
  Menu,
  X,
  Settings,
  Calendar,
  User,
} from "lucide-react";

function Sidebar({ workspaceId }: { workspaceId: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: "Tasks",
      href: `/workspace/${workspaceId}/tasks`,
      icon: CheckSquare,
    },
    {
      name: "Materials",
      href: `/workspace/${workspaceId}/materials`,
      icon: Book,
    },
    {
      name: "Subjects",
      href: `/workspace/${workspaceId}/subjects`,
      icon: Calendar,
    },
    {
      name: "Members",
      href: `/workspace/${workspaceId}/members`,
      icon: Users,
    },
    {
      name: "Settings",
      href: `/workspace/${workspaceId}/settings`,
      icon: Settings,
    },
  ];

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
          <h1 className="text-lg font-bold text-blue-600 ml-3">Due It</h1>
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
        <div className="p-4 lg:p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-blue-600 hidden lg:block">
            Due It
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-800 border-l-4 border-blue-600"
                          : "text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile Link */}
        <div className="p-4 border-t border-slate-200 mt-auto">
          <NavLink
            to="/profile"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-800 border-l-4 border-blue-600"
                  : "text-slate-700 hover:bg-slate-200 hover:text-slate-900"
              }`
            }
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
