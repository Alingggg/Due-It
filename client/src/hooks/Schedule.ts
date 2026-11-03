import { useGetUserWorkspace, useSemesterContext } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type { SemesterSchedule } from "@/types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

type ScheduleInput = Pick<
  SemesterSchedule,
  "subjectId" | "dayOfWeek" | "startTime" | "endTime"
>;

function useGetSchedules() {
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.schedule.list(workspace?.id!, semester),
    queryFn: async () =>
      (
        await api.get<SemesterSchedule[]>(
          `/workspaces/${workspace!.id}/schedules`,
          { params: { semester } }
        )
      ).data,
    enabled: !!workspace,
  });
}

function useAddSchedule() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (newSchedule: ScheduleInput) => {
      await api.post(`/workspaces/${workspace!.id}/schedules`, newSchedule);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.all(workspace?.id!),
      });
    },
    onError: (error) => {
      console.log("Error adding schedule:", error);
    },
  });
}

function useUpdateSchedule() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async ({ id, ...schedule }: ScheduleInput & { id: string }) => {
      await api.patch(`/workspaces/${workspace!.id}/schedules/${id}`, schedule);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.all(workspace?.id!),
      });
    },
    onError: (error) => {
      console.log("Error updating schedule:", error);
    },
  });
}

function useDeleteSchedule() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (scheduleId: string) => {
      await api.delete(`/workspaces/${workspace!.id}/schedules/${scheduleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.all(workspace?.id!),
      });
    },
    onError: (error) => {
      console.log("Error deleting schedule:", error);
    },
  });
}

export {
  useGetSchedules,
  useAddSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
};
