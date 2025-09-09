import supabase from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toCamelCase, toSnakeCase } from "@/utils/caseConversion";
import { Subject } from "@/types/Subject";
import { queryKeys } from "@/lib/queryKeys";
import { useGetUserWorkspace } from "@/hooks/Workspace";
import useSemesterContext from "@/hooks/Semester";

function useGetSubjects(semester: 1 | 2) {
  const { data: workspace } = useGetUserWorkspace();

  return useQuery({
    queryKey: queryKeys.subjects.list(workspace?.id || "", semester),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("semester", semester);

      if (error) {
        throw new Error(error.message);
      }

      return data.map<Subject>(toCamelCase);
    },
  });
}

function useAddSubject() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  const mutation = useMutation({
    mutationFn: async (subject: Omit<Subject, "id">) => {
      const snakeCaseData = toSnakeCase(subject) as {
        instructor_name: string;
        name: string;
        semester: 1 | 2;
        subject_code: string;
        workspace_id: string;
      };

      const { error } = await supabase.from("subjects").insert(snakeCaseData);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subjects.list(workspace?.id || "", semester),
      });
    },
  });

  return mutation;
}

function useUpdateSubject() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  const mutation = useMutation({
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

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subjects.list(workspace?.id || "", semester),
      });
    },
  });

  return mutation;
}

function useDeleteSubject() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  const mutation = useMutation({
    mutationFn: async (subjectId: string) => {
      const { error } = await supabase
        .from("subjects")
        .delete()
        .eq("id", subjectId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subjects.list(workspace?.id || "", semester),
      });
    },
  });

  return mutation;
}

export { useGetSubjects, useAddSubject, useUpdateSubject, useDeleteSubject };
