import useSemesterContext from "@/hooks/Semester";
import { useGetUserWorkspace } from "@/hooks/Workspace";
import { queryKeys } from "@/lib/queryKeys";
import supabase from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { SemesterTask } from "@/types/Task";
import { toCamelCase, toSnakeCase } from "@/utils/caseConversion";
import { useMutation, useQuery } from "@tanstack/react-query";

function useGetTasks() {
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.tasks.list(workspace?.id!, semester),
    queryFn: async () => {
      if (!workspace?.id || !semester) {
        throw new Error("Workspace or semester is not available");
      }

      const { data, error } = await supabase
        .from("semester_tasks")
        .select("*")
        .eq("semester", semester);

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return data.map<SemesterTask>(toCamelCase);
    },
    enabled: !isLoadingWorkspace && !!workspace && !!semester,
  });
}

export { useGetTasks, useAddTask };
