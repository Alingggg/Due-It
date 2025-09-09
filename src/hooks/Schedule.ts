import { useGetUserWorkspace } from "@/hooks/Workspace";
import { queryKeys } from "@/lib/queryKeys";
import supabase from "@/lib/supabase";
import { SemesterSchedule } from "@/types/Schedule";
import { toCamelCase } from "@/utils/caseConversion";
import { useQuery } from "@tanstack/react-query";

function useGetSchedules(semester: 1 | 2) {
  const { data: workspace } = useGetUserWorkspace();

  return useQuery({
    queryKey: queryKeys.schedule.list(workspace?.id || "", semester),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("semester_schedules")
        .select("*")
        .eq("semester", semester);

      if (error) {
        throw new Error(error.message);
      }

      return data.map<SemesterSchedule>(toCamelCase);
    },
  });
}

export { useGetSchedules };
