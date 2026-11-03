import { useGetUserWorkspace, useSemesterContext } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type { SemesterTask, Task, TaskFilters } from "@/types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

function useGetTasks(filters?: TaskFilters) {
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.tasks.list(workspace?.id!, semester, filters),
    queryFn: async () =>
      (
        await api.get<SemesterTask[]>(`/workspaces/${workspace!.id}/tasks`, {
          params: { semester, ...filters },
        })
      ).data,
    enabled: !!workspace,
  });
}

function useGetTask(taskId: string) {
  const { data: workspace } = useGetUserWorkspace();

  return useQuery({
    queryKey: queryKeys.tasks.detail(workspace?.id!, taskId),
    queryFn: async () =>
      (
        await api.get<SemesterTask>(
          `/workspaces/${workspace!.id}/tasks/${taskId}`
        )
      ).data,
    enabled: !!workspace && !!taskId,
  });
}

function useAddTask() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (newTask: Omit<Task, "id">) => {
      await api.post(`/workspaces/${workspace!.id}/tasks`, newTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(workspace?.id!),
      });
    },
  });
}

function useUpdateTask() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async ({ id, ...task }: Task) => {
      await api.patch(`/workspaces/${workspace!.id}/tasks/${id}`, task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(workspace?.id!),
      });
    },
  });
}

function useDeleteTask() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/workspaces/${workspace!.id}/tasks/${taskId}`);
    },
    onSuccess: (_, taskId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.tasks.detail(workspace?.id!, taskId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(workspace?.id!),
      });
    },
  });
}

function useUpdateCompletionStatus() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async ({
      taskId,
      markAsDone,
    }: {
      taskId: string;
      markAsDone: boolean;
    }) => {
      await api.put(`/workspaces/${workspace!.id}/tasks/${taskId}/completion`, {
        done: markAsDone,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(workspace?.id!),
      });
    },
  });
}

export {
  useGetTasks,
  useGetTask,
  useAddTask,
  useUpdateTask,
  useDeleteTask,
  useUpdateCompletionStatus,
};
