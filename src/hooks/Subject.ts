import supabase from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { toCamelCase } from "@/utils/caseConversion";
import { Subject } from "@/types/Subject";

function useGetSubjects(semester: 1 | 2) {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("semester", semester);

      if (error) {
        throw new Error(error.message);
      }

      return data.map<Subject>(toCamelCase);
    },
  });
}

export { useGetSubjects };
