import { useSemesterContext, useWorkspaceId } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type { SemesterTask, Task, TaskFilters } from "@/types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

function useGetTasks(filters?: TaskFilters) {
  const workspaceId = useWorkspaceId();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.tasks.list(workspaceId, semester, filters),
    queryFn: async () =>
      (
        await api.get<SemesterTask[]>(`/workspaces/${workspaceId}/tasks`, {
          params: { semester, ...filters },
        })
      ).data,
    enabled: !!workspaceId,
  });
}

function useGetTask(taskId: string) {
  const workspaceId = useWorkspaceId();

  return useQuery({
    queryKey: queryKeys.tasks.detail(workspaceId, taskId),
    queryFn: async () =>
      (
        await api.get<SemesterTask>(
          `/workspaces/${workspaceId}/tasks/${taskId}`
        )
      ).data,
    enabled: !!workspaceId && !!taskId,
  });
}

function useAddTask() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async (newTask: Omit<Task, "id">) => {
      await api.post(`/workspaces/${workspaceId}/tasks`, newTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(workspaceId),
      });
    },
  });
}

function useUpdateTask() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async ({ id, ...task }: Task) => {
      await api.patch(`/workspaces/${workspaceId}/tasks/${id}`, task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(workspaceId),
      });
    },
  });
}

function useDeleteTask() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/workspaces/${workspaceId}/tasks/${taskId}`);
    },
    onSuccess: (_, taskId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.tasks.detail(workspaceId, taskId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(workspaceId),
      });
    },
  });
}

function useUpdateCompletionStatus() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async ({
      taskId,
      markAsDone,
    }: {
      taskId: string;
      markAsDone: boolean;
    }) => {
      await api.put(`/workspaces/${workspaceId}/tasks/${taskId}/completion`, {
        done: markAsDone,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(workspaceId),
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
