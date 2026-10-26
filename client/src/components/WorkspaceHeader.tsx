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

const semesterOptions = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
];

function WorkspaceHeader({ workspaceName }: { workspaceName: string }) {
  const { semester, setSemester } = useSemesterContext();

  return (
    <div className="mb-6 pb-3 border-b border-slate-200">
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
    </div>
  );
}

export default WorkspaceHeader;
