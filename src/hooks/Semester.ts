import { SemesterContext } from "@/context";
import { useContext } from "react";

function useSemesterContext() {
  const context = useContext(SemesterContext);
  if (!context)
    throw new Error(
      "useSemesterContext must be used within a SemesterProvider"
    );

  return context;
}

export default useSemesterContext;
