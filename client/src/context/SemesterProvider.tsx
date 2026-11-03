import { createContext, useState, type ReactNode } from "react";
import type { Semester } from "@/types";

interface SemesterContextType {
  semester: Semester;
  setSemester: (semester: Semester) => void;
}

const SemesterContext = createContext<SemesterContextType | undefined>(
  undefined
);

// rendered by WorkspaceLayout with key={workspace.id}, so switching workspaces
// remounts it and drops the picked semester
function SemesterProvider({
  defaultSemester,
  children,
}: {
  defaultSemester: Semester;
  children: ReactNode;
}) {
  const [picked, setPicked] = useState<Semester | null>(null);
  const semester = picked ?? defaultSemester;

  return (
    <SemesterContext.Provider value={{ semester, setSemester: setPicked }}>
      {children}
    </SemesterContext.Provider>
  );
}

export { SemesterProvider, SemesterContext };
