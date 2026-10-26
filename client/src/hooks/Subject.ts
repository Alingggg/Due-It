import { useGetUserWorkspace, useSemesterContext } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type { Subject } from "@/types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

type SubjectInput = Pick<
  Subject,
  "name" | "subjectCode" | "instructorName" | "semester"
>;

function useGetSubjects() {
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.subjects.list(workspace?.id!, semester),
    queryFn: async () =>
      (
        await api.get<Subject[]>(`/workspaces/${workspace!.id}/subjects`, {
          params: { semester },
        })
      ).data,
    enabled: !!workspace && !!semester,
  });
}

function useAddSubject() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async (subject: SubjectInput) => {
      await api.post(`/workspaces/${workspace!.id}/subjects`, subject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subjects.list(workspace?.id!, semester),
      });
    },
    onError: (error) => {
      console.log("Error adding subject:", error);
    },
  });
}

function useUpdateSubject() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async ({ id, ...subject }: SubjectInput & { id: string }) => {
      await api.patch(`/workspaces/${workspace!.id}/subjects/${id}`, subject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subjects.list(workspace?.id!, semester),
      });
    },
    onError: (error) => {
      console.log("Error updating subject:", error);
    },
  });
}

function useDeleteSubject() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async (subjectId: string) => {
      await api.delete(`/workspaces/${workspace!.id}/subjects/${subjectId}`);
    },
    onSuccess: () => {
      // the server also deletes the subject's tasks, schedules and materials
      queryClient.invalidateQueries({
        queryKey: queryKeys.subjects.list(workspace?.id!, semester),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(workspace?.id!, semester),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.all(workspace?.id!, semester),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.all(workspace?.id!, semester),
      });
    },
    onError: (error) => {
      console.log("Error deleting subject:", error);
    },
  });
}

export { useGetSubjects, useAddSubject, useUpdateSubject, useDeleteSubject };
