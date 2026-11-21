import { useSemesterContext, useWorkspaceId } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type { ScheduleInput, SemesterSchedule } from "@/types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

function useGetSchedules() {
  const workspaceId = useWorkspaceId();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.schedule.list(workspaceId, semester),
    queryFn: async () =>
      (
        await api.get<SemesterSchedule[]>(
          `/workspaces/${workspaceId}/schedules`,
          { params: { semester } }
        )
      ).data,
    enabled: !!workspaceId,
  });
}

function useAddSchedule() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async (newSchedule: ScheduleInput) => {
      await api.post(`/workspaces/${workspaceId}/schedules`, newSchedule);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.all(workspaceId),
      });
    },
  });
}

function useUpdateSchedule() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async ({ id, ...schedule }: ScheduleInput & { id: string }) => {
      await api.patch(`/workspaces/${workspaceId}/schedules/${id}`, schedule);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.all(workspaceId),
      });
    },
  });
}

function useDeleteSchedule() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async (scheduleId: string) => {
      await api.delete(`/workspaces/${workspaceId}/schedules/${scheduleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.all(workspaceId),
      });
    },
  });
}

export {
  useGetSchedules,
  useAddSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
};
