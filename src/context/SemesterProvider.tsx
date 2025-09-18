import { useGetDefaultSemester } from "@/hooks";
import { createContext, useEffect, useState } from "react";

type Semester = 1 | 2;

interface SemesterContextType {
  semester: Semester;
  setSemester: (semester: Semester) => void;
}

const SemesterContext = createContext<SemesterContextType | undefined>(
  undefined
);

function SemesterProvider({ children }: { children: any }) {
  const [semester, setSemester] = useState<Semester>(1);
  const { data: defaultSemester, isLoading } = useGetDefaultSemester();

  useEffect(() => {
    if (!isLoading && defaultSemester) {
      setSemester(defaultSemester as 1 | 2);
    }
  }, [isLoading, defaultSemester, setSemester]);

  return (
    <SemesterContext.Provider value={{ semester, setSemester }}>
      {children}
    </SemesterContext.Provider>
  );
}

export { SemesterProvider, SemesterContext };
