"use client";
import useSemesterContext from "@/hooks/Semester";
import { useGetUserWorkspace } from "@/hooks/Workspace";
import { queryKeys } from "@/lib/queryKeys";
import supabase from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { SemesterTask, Task } from "@/types/Task";
import { toCamelCase, toSnakeCase } from "@/utils/caseConversion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

function useAddTask() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async (newTask: Omit<Task, "id">) => {
      const snakeCaseData = toSnakeCase(newTask) as {
        subject_id: string;
        title: string;
        description: string;
        completion_type: Database["public"]["Enums"]["completion_type"];
        task_type: Database["public"]["Enums"]["task_type"];
        due_date: string;
        due_time: string;
      };

      const { error } = await supabase.from("tasks").insert(snakeCaseData);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.list(workspace?.id!, semester),
      });
    },
    onError: (error) => {
      console.log("Error adding task:", error);
    },
  });
}

function useUpdateTask() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async (newTask: Task) => {
      const snakeCaseData = toSnakeCase(newTask) as {
        id: string;
        subject_id: string;
        title: string;
        description: string;
        completion_type: Database["public"]["Enums"]["completion_type"];
        task_type: Database["public"]["Enums"]["task_type"];
        due_date: string;
        due_time: string;
      };

      const { error } = await supabase
        .from("tasks")
        .update(snakeCaseData)
        .eq("id", newTask.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.list(workspace?.id!, semester),
      });
    },
    onError: (error) => {
      console.log("Error adding task:", error);
    },
  });
}

export { useGetTasks, useAddTask, useUpdateTask };
