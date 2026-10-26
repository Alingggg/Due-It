import { useGetDefaultSemester } from "@/hooks";
import { createContext, useEffect, useState } from "react";
import type { Semester } from "@/types";

interface SemesterContextType {
  semester: Semester;
  setSemester: (semester: Semester) => void;
}

const SemesterContext = createContext<SemesterContextType | undefined>(
  undefined
);

function SemesterProvider({ children }: { children: any }) {
  const [semester, setSemester] = useState<Semester>(1);
  const defaultSemester = useGetDefaultSemester();

  useEffect(() => {
    if (defaultSemester) {
      setSemester(defaultSemester);
    }
  }, [defaultSemester, setSemester]);

  return (
    <SemesterContext.Provider value={{ semester, setSemester }}>
      {children}
    </SemesterContext.Provider>
  );
}

export { SemesterProvider, SemesterContext };
