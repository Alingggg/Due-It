import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { useGetWorkspaceMembers, useSemesterContext } from "@/hooks";
import type { Semester, UserWorkspace } from "@/types";
import { Book, Calendar, CheckSquare, Settings, Users } from "lucide-react";
import { NavLink } from "react-router";

const semesterOptions = [
  { value: 1, label: "1st Semester" },
  { value: 2, label: "2nd Semester" },
];

const roleLabels: Record<UserWorkspace["role"], string> = {
  admin: "Admin",
  "co-admin": "Co-admin",
  member: "Member",
};

const tabs = [
  { name: "Tasks", path: "tasks", icon: CheckSquare },
  { name: "Materials", path: "materials", icon: Book },
  { name: "Subjects", path: "subjects", icon: Calendar },
  { name: "Members", path: "members", icon: Users },
  { name: "Settings", path: "settings", icon: Settings },
];

function WorkspaceHeader({ workspace }: { workspace: UserWorkspace }) {
  const { semester, setSemester } = useSemesterContext();
  const { data: members } = useGetWorkspaceMembers();

  return (
    <div className="mb-6">
      {/* Banner */}
      <div className="rounded-[18px] bg-blue-900 text-white px-5 py-6 sm:px-9 sm:pt-7 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-[13px] font-semibold text-white/80">
            {roleLabels[workspace.role]}
            {members && ` · ${members.length} ${members.length === 1 ? "member" : "members"}`}
          </span>
          <h1 className="text-2xl sm:text-[32px] font-extrabold tracking-tight break-words">
            {workspace.name}
          </h1>
        </div>

        <Select
          value={semester.toString()}
          onValueChange={(val) => setSemester(Number(val) as Semester)}
        >
          <SelectTrigger
            aria-label="Semester"
            className="h-[42px]! rounded-full border-0 bg-white px-4 text-sm font-bold text-blue-900 shadow-none [&_svg]:text-blue-900! [&_svg]:opacity-100"
          >
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {semesterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Section tabs; the bottom rule is an inset shadow (not a border) so the
          active underline can sit on it without overflowing the scroll area */}
      <nav className="flex gap-6 sm:gap-7 px-3 overflow-x-auto overflow-y-hidden shadow-[inset_0_-1px_0_var(--color-line)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <NavLink
              key={tab.path}
              to={`/workspace/${workspace.id}/${tab.path}`}
              className={({ isActive }) =>
                `flex items-center gap-2 min-h-11 mt-1 border-b-[3px] text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-blue-600 text-blue-900 font-bold"
                    : "border-transparent text-slate-500 font-semibold hover:text-slate-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-blue-600" : ""}`}
                  />
                  {tab.name}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default WorkspaceHeader;
