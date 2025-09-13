import useSemesterContext from "@/hooks/Semester";
import { useGetUserWorkspace } from "@/hooks/Workspace";
import { queryKeys } from "@/lib/queryKeys";
import supabase from "@/lib/supabase";
import { Material, SemesterMaterialGroup } from "@/types/Material";
import { toCamelCase, toSnakeCase } from "@/utils/caseConversion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

function useGetMaterialGroups() {
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.materialGroups.list(workspace?.id!, semester),
    queryFn: async () => {
      if (!workspace?.id || !semester) {
        throw new Error("Workspace or semester is not available");
      }

      const { data, error } = await supabase
        .from("semester_materials")
        .select("*")
        .eq("semester", semester);

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return data.map<SemesterMaterialGroup>(toCamelCase);
    },
    enabled: !!workspace && !!semester && !isLoadingWorkspace,
  });
}

function useGetMaterialGroup(materialGroupId: string) {
  const queryClient = useQueryClient();
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.materialGroups.detail(
      workspace?.id!,
      semester,
      materialGroupId
    ),
    queryFn: async () => {
      if (!workspace?.id || !semester) {
        throw new Error("Workspace or semester is not available");
      }

      const { data, error } = await supabase
        .from("semester_materials")
        .select("*")
        .eq("id", materialGroupId)
        .single();

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return toCamelCase(data);
    },
    initialData: queryClient
      .getQueryData<SemesterMaterialGroup[]>(
        queryKeys.materialGroups.list(workspace?.id!, semester)
      )
      ?.find((mg) => mg.id === materialGroupId),
    enabled:
      !!workspace && !!semester && !isLoadingWorkspace && !!materialGroupId,
  });
}

function useGetMaterials(materialGroupId: string) {
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.materials.list(
      workspace?.id!,
      semester,
      materialGroupId
    ),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .eq("material_group_id", materialGroupId);
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return data.map<Material>(toCamelCase);
    },
    enabled: !!workspace && !!semester && !isLoadingWorkspace,
  });
}

function useAddMaterialGroup() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();
  const router = useRouter();

  return useMutation({
    mutationFn: async (newMaterialGroup: {
      subjectId: string;
      title: string;
      description?: string | undefined;
    }) => {
      const snakeCaseData = toSnakeCase(newMaterialGroup) as {
        subject_id: string;
        title: string;
        description?: string | undefined;
      };

      const { data, error } = await supabase
        .from("material_groups")
        .insert(snakeCaseData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return toCamelCase(data);
    },
    onSuccess: (materialGroup) => {
      router.push(`/workspace/${workspace?.id}/materials/${materialGroup.id}`);
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.list(workspace?.id!, semester),
      });
    },
    onError: (error) => {
      console.log("Error adding material group:", error);
    },
  });
}

function useUpdateMaterialGroup() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async (updatedMaterialGroup: {
      id: string;
      subjectId: string;
      title: string;
      description?: string | undefined;
    }) => {
      const snakeCaseData = toSnakeCase(updatedMaterialGroup) as {
        id: string;
        subject_id: string;
        title: string;
        description?: string | undefined;
      };

      const { error } = await supabase
        .from("material_groups")
        .update(snakeCaseData)
        .eq("id", updatedMaterialGroup.id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (_, updatedMaterialGroup) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.list(workspace?.id!, semester),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.detail(
          workspace?.id!,
          semester,
          updatedMaterialGroup.id
        ),
      });
    },
    onError: (error) => {
      console.log("Error updating material group:", error);
    },
  });
}

function useDeleteMaterialGroup() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();
  const router = useRouter();

  return useMutation({
    mutationFn: async (materialGroupId: string) => {
      const { error } = await supabase
        .from("material_groups")
        .delete()
        .eq("id", materialGroupId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      router.push(`/workspace/${workspace?.id}/materials`);
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.list(workspace?.id!, semester),
      });
    },
    onError: (error) => {
      console.log("Error deleting material group:", error);
    },
  });
}

export {
  useGetMaterialGroups,
  useGetMaterialGroup,
  useGetMaterials,
  useAddMaterialGroup,
  useUpdateMaterialGroup,
  useDeleteMaterialGroup,
};
