import { useSemesterContext, useWorkspaceId } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type { Semester, Subject, SubjectInput } from "@/types";
import {
  useQuery,
  useQueryClient,
  useMutation,
  type QueryClient,
} from "@tanstack/react-query";

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
  const workspaceId = useWorkspaceId();
  const { semester: selectedSemester } = useSemesterContext();
  const semester = semesterOverride ?? selectedSemester;

  return useQuery({
    queryKey: queryKeys.subjects.list(workspaceId, semester),
    queryFn: async () =>
      (
        await api.get<Subject[]>(`/workspaces/${workspaceId}/subjects`, {
          params: { semester },
        })
      ).data,
    enabled: !!workspaceId,
  });
}

function useAddSubject() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async (subject: SubjectInput) => {
      await api.post(`/workspaces/${workspaceId}/subjects`, subject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subjects.all(workspaceId),
      });
    },
  });
}

function useUpdateSubject() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async ({ id, ...subject }: SubjectInput & { id: string }) => {
      await api.patch(`/workspaces/${workspaceId}/subjects/${id}`, subject);
    },
    onSuccess: () => {
      invalidateSubjectData(queryClient, workspaceId);
    },
  });
}

function useDeleteSubject() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async (subjectId: string) => {
      await api.delete(`/workspaces/${workspaceId}/subjects/${subjectId}`);
    },
    onSuccess: () => {
      invalidateSubjectData(queryClient, workspaceId);
    },
  });
}

export { useGetSubjects, useAddSubject, useUpdateSubject, useDeleteSubject };
