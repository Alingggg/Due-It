import { useGetUserWorkspace, useSemesterContext } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type { Semester, Subject } from "@/types";
import {
  useQuery,
  useQueryClient,
  useMutation,
  type QueryClient,
} from "@tanstack/react-query";

type SubjectInput = Pick<
  Subject,
  "name" | "subjectCode" | "instructorName" | "semester"
>;

// tasks, schedules and material groups carry their subject's name and
// semester, and the server deletes them with their subject
function invalidateSubjectData(queryClient: QueryClient, workspaceId: string) {
  queryClient.invalidateQueries({
    queryKey: queryKeys.subjects.all(workspaceId),
  });
  queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all(workspaceId) });
  queryClient.invalidateQueries({
    queryKey: queryKeys.schedule.all(workspaceId),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.materialGroups.all(workspaceId),
  });
}

function useGetSubjects(semesterOverride?: Semester) {
  const { data: workspace } = useGetUserWorkspace();
  const { semester: selectedSemester } = useSemesterContext();
  const semester = semesterOverride ?? selectedSemester;

  return useQuery({
    queryKey: queryKeys.subjects.list(workspace?.id!, semester),
    queryFn: async () =>
      (
        await api.get<Subject[]>(`/workspaces/${workspace!.id}/subjects`, {
          params: { semester },
        })
      ).data,
    enabled: !!workspace,
  });
}

function useAddSubject() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (subject: SubjectInput) => {
      await api.post(`/workspaces/${workspace!.id}/subjects`, subject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subjects.all(workspace?.id!),
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

  return useMutation({
    mutationFn: async ({ id, ...subject }: SubjectInput & { id: string }) => {
      await api.patch(`/workspaces/${workspace!.id}/subjects/${id}`, subject);
    },
    onSuccess: () => {
      invalidateSubjectData(queryClient, workspace!.id);
    },
    onError: (error) => {
      console.log("Error updating subject:", error);
    },
  });
}

function useDeleteSubject() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (subjectId: string) => {
      await api.delete(`/workspaces/${workspace!.id}/subjects/${subjectId}`);
    },
    onSuccess: () => {
      invalidateSubjectData(queryClient, workspace!.id);
    },
    onError: (error) => {
      console.log("Error deleting subject:", error);
    },
  });
}

export { useGetSubjects, useAddSubject, useUpdateSubject, useDeleteSubject };
