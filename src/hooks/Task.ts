"use client";
import useSemesterContext from "@/hooks/Semester";
import { useGetUserWorkspace } from "@/hooks/Workspace";
import { queryKeys } from "@/lib/queryKeys";
import supabase from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { SemesterTask, Task } from "@/types/Task";
import { toCamelCase, toSnakeCase } from "@/utils/caseConversion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetTasks(
  filters?: Array<{ column: string; operator: string; value: any }>
) {
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.tasks.list(workspace?.id!, semester, filters),
    queryFn: async () => {
      if (!workspace?.id || !semester)
        throw new Error("Workspace or semester is not available");

      let query = supabase.from("semester_tasks").select("*");

      if (filters) {
        for (const { column, operator, value } of filters) {
          const snakeColumn = column.replace(
            /[A-Z]/g,
            (letter) => `_${letter.toLowerCase()}`
          );

          switch (operator) {
            case "eq":
              query = query.eq(snakeColumn, value);
              break;
            case "gt":
              query = query.gt(snakeColumn, value);
              break;
            case "gte":
              query = query.gte(snakeColumn, value);
              break;
            case "lte":
              query = query.lte(snakeColumn, value);
              break;
            case "lt":
              query = query.lt(snakeColumn, value);
              break;
          }
        }
      }

      const { data, error } = await query.eq("semester", semester);

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return data.map<SemesterTask>(toCamelCase);
    },
    enabled: !isLoadingWorkspace && !!workspace && !!semester,
  });
}

function useGetTask(taskId: string) {
  const queryClient = useQueryClient();
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.tasks.detail(workspace?.id!, semester, taskId),
    queryFn: async () => {
      if (!workspace?.id || !semester)
        throw new Error("Workspace or semester is not available");

      if (!taskId) throw new Error("Task ID is not provided");

      const { data, error } = await supabase
        .from("semester_tasks")
        .select("*")
        .eq("id", taskId)
        .single();

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return toCamelCase<SemesterTask>(data);
    },
    // initialData: queryClient
    //   .getQueryData<SemesterTask[]>(
    //     queryKeys.tasks.list(workspace?.id!, semester)
    //   )
    //   ?.find((task) => task.id === taskId),
    enabled: !isLoadingWorkspace && !!workspace && !!semester && !!taskId,
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
    mutationFn: async (task: Task) => {
      const snakeCaseData = toSnakeCase(task) as {
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
        .eq("id", task.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: (_, task) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.list(workspace?.id!, semester),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.detail(workspace?.id!, semester, task.id),
      });
    },
    onError: (error) => {
      console.log("Error adding task:", error);
    },
  });
}

function useDeleteTask() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) throw new Error(error.message);
    },
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.list(workspace?.id!, semester),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.tasks.detail(workspace?.id!, semester, taskId),
      });
    },
    onError: (error) => {
      console.log("Error deleting task:", error);
    },
  });
}

export { useGetTasks, useGetTask, useAddTask, useUpdateTask, useDeleteTask };
