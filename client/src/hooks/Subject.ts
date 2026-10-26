import { useGetUserWorkspace, useSemesterContext } from "@/hooks";
import { queryKeys, supabase } from "@/lib";
import type { Subject } from "@/types";
import { toCamelCase, toSnakeCase } from "@/utils";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

function useGetSubjects() {
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.subjects.list(workspace?.id!, semester),
    queryFn: async () => {
      if (!workspace?.id || !semester)
        throw new Error("Workspace or semester is not available");

      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("semester", semester);

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return data.map<Subject>(toCamelCase);
    },
    enabled: !isLoadingWorkspace && !!workspace && !!semester,
  });
}

function useAddSubject() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async (subject: Omit<Subject, "id">) => {
      const snakeCaseData = toSnakeCase(subject) as {
        instructor_name: string;
        name: string;
        semester: 1 | 2;
        subject_code: string;
        workspace_id: string;
      };

      const { error } = await supabase.from("subjects").insert(snakeCaseData);

      if (error) throw new Error(error.message);
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
    mutationFn: async (subject: Subject) => {
      const snakeCaseData = toSnakeCase(subject) as {
        id: string;
        instructor_name: string;
        name: string;
        semester: number;
        subject_code: string;
        workspace_id: string;
      };

      const { error } = await supabase
        .from("subjects")
        .update(snakeCaseData)
        .eq("id", subject.id);

      if (error) throw new Error(error.message);
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
      const { error } = await supabase
        .from("subjects")
        .delete()
        .eq("id", subjectId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subjects.list(workspace?.id!, semester),
      });
    },
    onError: (error) => {
      console.log("Error deleting subject:", error);
    },
  });
}

export { useGetSubjects, useAddSubject, useUpdateSubject, useDeleteSubject };
