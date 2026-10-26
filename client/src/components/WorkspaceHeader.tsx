import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { useSemesterContext } from "@/hooks";
import type { Semester } from "@/types";
import { Book, Calendar, CheckSquare, Settings, Users } from "lucide-react";
import { NavLink } from "react-router";

const semesterOptions = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
];

const tabs = [
  { name: "Tasks", path: "tasks", icon: CheckSquare },
  { name: "Materials", path: "materials", icon: Book },
  { name: "Subjects", path: "subjects", icon: Calendar },
  { name: "Members", path: "members", icon: Users },
  { name: "Settings", path: "settings", icon: Settings },
];

function WorkspaceHeader({
  workspaceId,
  workspaceName,
}: {
  workspaceId: string;
  workspaceName: string;
}) {
  const { semester, setSemester } = useSemesterContext();

  return (
    <div className="mb-6 border-b border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          {workspaceName}
        </h1>

        <div className="flex items-center space-x-2">
          <Label htmlFor="semester">Semester:</Label>
          <Select
            value={semester.toString()}
            onValueChange={(val) => setSemester(Number(val) as Semester)}
          >
            <SelectTrigger id="semester">
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
      </div>

      <nav className="flex gap-6 mt-3 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <NavLink
              key={tab.path}
              to={`/workspace/${workspaceId}/${tab.path}`}
              className={({ isActive }) =>
                `flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default WorkspaceHeader;
